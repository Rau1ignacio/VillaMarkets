import React, { useEffect, useMemo, useState } from 'react';
import pedidoService from '../../services/pedidoService';

const formatearCLP = (valor) =>
  'CLP ' +
  new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(Number(valor || 0)));

const formatearFecha = (fecha) => {
  if (!fecha) return '-';
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) return fecha;
  return date.toLocaleString('es-CL', {
    dateStyle: 'short',
    timeStyle: 'short'
  });
};

const obtenerUsuarioActual = () => {
  try {
    return JSON.parse(localStorage.getItem('usuarioActual') || 'null');
  } catch {
    return null;
  }
};

const getPedidosKey = (usuarioId) =>
  usuarioId ? `misPedidos_${usuarioId}` : 'misPedidos_guest';

const leerPedidosLocales = (usuarioId) => {
  try {
    return JSON.parse(localStorage.getItem(getPedidosKey(usuarioId)) || '[]');
  } catch {
    localStorage.removeItem(getPedidosKey(usuarioId));
    return [];
  }
};

const guardarPedidosLocales = (usuarioId, pedidos) => {
  if (!usuarioId) return;
  localStorage.setItem(getPedidosKey(usuarioId), JSON.stringify(pedidos));
};

const MisPedidos = () => {
  const usuarioActual = useMemo(() => obtenerUsuarioActual(), []);
  const [pedidos, setPedidos] = useState([]);
  const [estadoCarga, setEstadoCarga] = useState('loading');

  useEffect(() => {
    localStorage.removeItem('misPedidos');
  }, []);

  useEffect(() => {
    const cargarPedidos = async () => {
      if (!usuarioActual?.id) {
        setEstadoCarga('sinUsuario');
        setPedidos([]);
        return;
      }

      setEstadoCarga('loading');
      try {
        const pedidosBackend = await pedidoService.listarPorUsuario(usuarioActual.id);
        const ordenados = [...(pedidosBackend || [])].sort((a, b) => {
          const fechaA = a?.fechaPedido ? new Date(a.fechaPedido).getTime() : 0;
          const fechaB = b?.fechaPedido ? new Date(b.fechaPedido).getTime() : 0;
          return fechaB - fechaA;
        });
        setPedidos(ordenados);
        guardarPedidosLocales(usuarioActual.id, ordenados);
        setEstadoCarga('listo');
      } catch (error) {
        console.warn('Fallo al cargar pedidos desde backend, usando respaldo local:', error);
        const locales = leerPedidosLocales(usuarioActual.id);
        setPedidos(locales);
        setEstadoCarga(locales.length > 0 ? 'offline' : 'error');
      }
    };

    cargarPedidos();
  }, [usuarioActual?.id]);

  const renderMensajeEstado = () => {
    if (estadoCarga === 'loading') {
      return (
        <div className="alert alert-info mt-3">
          Cargando tus pedidos...
        </div>
      );
    }
    if (estadoCarga === 'sinUsuario') {
      return (
        <div className="alert alert-warning mt-3">
          Debes iniciar sesion para revisar tu historial de compras.
        </div>
      );
    }
    if (estadoCarga === 'error') {
      return (
        <div className="alert alert-danger mt-3">
          No pudimos cargar tus pedidos y no encontramos datos locales.
        </div>
      );
    }
    if (estadoCarga === 'offline') {
      return (
        <div className="alert alert-secondary mt-3">
          Mostrando pedidos almacenados localmente. Cuando recuperemos la conexion, sincronizaremos tus compras.
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Historial de compras</h2>
      </div>

      {renderMensajeEstado()}

      {estadoCarga !== 'loading' && pedidos.length === 0 && estadoCarga !== 'sinUsuario' && (
        <div className="alert alert-info mt-3">
          <i className="fas fa-info-circle me-2" />
          Todavia no registramos compras para tu cuenta.
        </div>
      )}

      {pedidos.length > 0 && (
        <div className="card shadow-sm mt-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-muted small">
                Mostrando {pedidos.length} pedido{pedidos.length !== 1 && 's'}
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Total</th>
                    <th style={{ minWidth: 220 }}>Productos</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidos.map((pedido) => (
                    <tr key={pedido.id || pedido.fechaPedido}>
                      <td>{pedido.id || 'N/D'}</td>
                      <td>{formatearFecha(pedido.fechaPedido)}</td>
                      <td>{pedido.estado || 'PENDIENTE'}</td>
                      <td className="fw-semibold text-success">
                        {formatearCLP(pedido.total)}
                      </td>
                      <td>
                        {pedido.items && pedido.items.length > 0 ? (
                          <ul
                            style={{
                              margin: 0,
                              padding: 0,
                              listStyle: 'none',
                              maxHeight: 140,
                              overflowY: 'auto'
                            }}
                          >
                            {pedido.items.map((item, idx) => {
                              const imagenSrc =
                                typeof item.imagenProducto === 'string' && item.imagenProducto.length > 0
                                  ? item.imagenProducto.startsWith('http')
                                    ? item.imagenProducto
                                    : `/images/productos/${item.imagenProducto}`
                                  : '/images/default.jpg';

                              return (
                                <li
                                  key={`${pedido.id || 'local'}-${idx}`}
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: 4
                                  }}
                                >
                                  <img
                                    src={imagenSrc}
                                    alt={item.productoNombre || item.productoId}
                                    style={{
                                      width: 32,
                                      height: 32,
                                      objectFit: 'contain',
                                      borderRadius: 4,
                                      marginRight: 8
                                    }}
                                    onError={(e) => {
                                      e.currentTarget.src = '/images/default.jpg';
                                    }}
                                  />
                                  <div className="d-flex flex-column">
                                    <span className="small">
                                      {item.productoNombre || `Producto ${item.productoId}`} x{item.cantidad}
                                    </span>
                                    <span className="small text-muted">
                                      {formatearCLP((item.precioUnitario || 0) * (item.cantidad || 0))}
                                    </span>
                                  </div>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <span className="text-muted small">Sin detalle de productos</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
