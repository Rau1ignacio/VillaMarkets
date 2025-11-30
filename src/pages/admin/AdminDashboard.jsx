import React, { useEffect, useMemo, useState } from 'react';
import tiendaService from '../../services/tiendaService';
import productoService from '../../services/productoService';
import pedidoService from '../../services/pedidoService';
import '../../styles/AdminDashboard.css';

const formatearCLP = (valor) =>
  'CLP ' +
  new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(Number(valor || 0)));

const formatearFecha = (fecha) => {
  if (!fecha) return '-';
  const date = new Date(fecha);
  if (Number.isNaN(date.getTime())) {
    return fecha;
  }
  return date.toLocaleString('es-CL', { dateStyle: 'short', timeStyle: 'short' });
};

const obtenerAdminActual = () => {
  try {
    const stored = localStorage.getItem('usuarioActual');
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const AdminDashboard = () => {
  const [admin] = useState(() => obtenerAdminActual());
  const [loading, setLoading] = useState(true);
  const [tiendas, setTiendas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!admin?.id) {
      setError('Debes iniciar sesion como administrador para ver tu panel.');
      setLoading(false);
      return;
    }

    const cargarDatos = async () => {
      try {
        setLoading(true);
        setError('');

        const [tiendasResp, productosResp, pedidosResp] = await Promise.all([
          tiendaService.listar(admin.id),
          productoService.listarPorAdmin(admin.id),
          pedidoService.listarPorAdministrador(admin.id)
        ]);

        setTiendas(Array.isArray(tiendasResp) ? tiendasResp : []);
        setProductos(Array.isArray(productosResp) ? productosResp : []);
        setPedidos(Array.isArray(pedidosResp) ? pedidosResp : []);
      } catch (err) {
        console.error('Error cargando dashboard admin:', err);
        const mensaje =
          err.response?.data?.message ||
          err.message ||
          'No se pudieron cargar los datos del dashboard.';
        setError(mensaje);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [admin?.id]);

  const tiendaMap = useMemo(() => {
    const map = new Map();
    tiendas.forEach((t) => map.set(t.id, t.nombre));
    return map;
  }, [tiendas]);

  const pedidosPorTienda = useMemo(() => {
    const agrupados = new Map();
    tiendas.forEach((t) => agrupados.set(t.id, []));
    pedidos.forEach((pedido) => {
      if (pedido.tiendaId && agrupados.has(pedido.tiendaId)) {
        agrupados.get(pedido.tiendaId).push(pedido);
      }
    });
    return agrupados;
  }, [pedidos, tiendas]);

  const pedidosSinTienda = useMemo(
    () => pedidos.filter((p) => !p.tiendaId),
    [pedidos]
  );

  const totalTiendas = tiendas.length;
  const totalProductos = productos.length;
  const totalPedidos = pedidos.length;
  const totalVentas = pedidos.reduce((acc, p) => acc + Number(p.total || 0), 0);

  const renderProductosPedido = (items = []) => {
    if (items.length === 0) {
      return <span className="text-muted small">Sin detalle</span>;
    }
    return (
      <ul className="mb-0 ps-3 small admin-dashboard-product-list">
        {items.map((item, idx) => (
          <li key={`${item.productoId || 'item'}-${idx}`} className="mb-1">
            <strong>{item.productoNombre || `Producto ${item.productoId}`}</strong>
            <span className="admin-dashboard-product-meta">
              {item.cantidad || 0} unid.
              <span>·</span>
              {formatearCLP((item.precioUnitario || 0) * (item.cantidad || 0))}
            </span>
          </li>
        ))}
      </ul>
    );
  };

  if (!admin?.id) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning">
          <i className="fas fa-user-shield me-2" />
          Debes iniciar sesion como administrador para acceder al panel.
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center admin-dashboard-loading">
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4 admin-dashboard">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-3 mb-4">
        <div>
          <h1 className="mb-1">Panel de Administracion</h1>
          <p className="text-muted mb-0">Hola {admin.nombres || admin.username}, este es el estado de tus tiendas</p>
        </div>
        <div className="badge text-bg-light text-success border border-success px-3 py-2">
          <i className="fas fa-user-shield me-2" />
          Administrador #{admin.id}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Tus minimarkets</span>
                <i className="fas fa-store text-primary fs-4" />
              </div>
              <h2 className="fw-bold mb-0">{totalTiendas}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Productos activos</span>
                <i className="fas fa-box-open text-success fs-4" />
              </div>
              <h2 className="fw-bold mb-0">{totalProductos}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Pedidos totales</span>
                <i className="fas fa-receipt text-warning fs-4" />
              </div>
              <h2 className="fw-bold mb-0">{totalPedidos}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="text-muted">Ventas totales</span>
                <i className="fas fa-dollar-sign text-danger fs-4" />
              </div>
              <h2 className="fw-bold mb-0">{formatearCLP(totalVentas)}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-white">
          <h5 className="mb-0">Resumen rapido</h5>
        </div>
        <div className="card-body">
          {pedidos.length === 0 ? (
            <p className="text-muted mb-0">Aún no se registran compras en tus tiendas.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped mb-0">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tienda</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {[...pedidos]
                    .sort((a, b) => new Date(b.fechaPedido || 0) - new Date(a.fechaPedido || 0))
                    .slice(0, 10)
                    .map((p) => (
                      <tr key={p.id}>
                        <td>{p.id}</td>
                        <td>{tiendaMap.get(p.tiendaId) || 'Sin tienda'}</td>
                        <td>{p.usuarioNombre || p.usuarioId || '-'}</td>
                        <td>{formatearFecha(p.fechaPedido)}</td>
                        <td>{p.estado || 'PENDIENTE'}</td>
                        <td>{formatearCLP(p.total)}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-white d-flex justify-content-between flex-wrap align-items-center gap-3">
          <div>
            <h5 className="mb-0">Pedidos por minimarket</h5>
            <small className="text-muted">Detalle de productos comprados por tus clientes</small>
          </div>
        </div>
        <div className="card-body">
          {tiendas.length === 0 ? (
            <p className="text-muted mb-0">Aún no registras minimarkets.</p>
          ) : (
            tiendas.map((tienda) => {
              const pedidosTienda = pedidosPorTienda.get(tienda.id) || [];
              return (
                <div key={tienda.id} className="mb-5">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="mb-0">
                      <i className="fas fa-store me-2 text-primary" />
                      {tienda.nombre}
                    </h6>
                    <span className="badge text-bg-light">
                      {pedidosTienda.length} pedido{pedidosTienda.length !== 1 && 's'}
                    </span>
                  </div>

                  {pedidosTienda.length === 0 ? (
                    <p className="text-muted mb-0">Sin pedidos registrados.</p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table align-middle">
                        <thead className="table-light">
                          <tr>
                            <th># Pedido</th>
                            <th>Cliente</th>
                            <th>Fecha</th>
                            <th>Estado</th>
                            <th>Productos</th>
                            <th>Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pedidosTienda.map((pedido) => (
                            <tr key={pedido.id}>
                              <td>{pedido.id}</td>
                              <td>{pedido.usuarioNombre || pedido.usuarioId || 'Cliente'}</td>
                              <td>{formatearFecha(pedido.fechaPedido)}</td>
                              <td>
                                <span className="badge text-bg-success-subtle text-success">
                                  {pedido.estado || 'PENDIENTE'}
                                </span>
                              </td>
                              <td className="admin-dashboard-orders-products">
                                {renderProductosPedido(pedido.items)}
                              </td>
                              <td>{formatearCLP(pedido.total)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })
          )}

          {pedidosSinTienda.length > 0 && (
            <div className="mt-4">
              <h6>
                <i className="fas fa-question-circle me-2 text-secondary" />
                Pedidos sin tienda asociada
              </h6>
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead className="table-light">
                    <tr>
                      <th># Pedido</th>
                      <th>Cliente</th>
                      <th>Fecha</th>
                      <th>Estado</th>
                      <th>Productos</th>
                      <th>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedidosSinTienda.map((pedido) => (
                      <tr key={pedido.id}>
                        <td>{pedido.id}</td>
                        <td>{pedido.usuarioNombre || pedido.usuarioId || 'Cliente'}</td>
                        <td>{formatearFecha(pedido.fechaPedido)}</td>
                        <td>{pedido.estado || 'PENDIENTE'}</td>
                        <td>{renderProductosPedido(pedido.items)}</td>
                        <td>{formatearCLP(pedido.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
