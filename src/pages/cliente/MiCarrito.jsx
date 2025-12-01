import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MetodoPago from './MetodoPago';
import pedidoService from '../../services/pedidoService';
import carritoService from '../../services/carritoService';
import '../../styles/MiCarrito.css';

const ENVIO_COSTO = 2990;
const IVA_PORCENTAJE = 0.19;

const formatearCLP = (valor) =>
  'CLP ' +
  new Intl.NumberFormat('es-CL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(Math.round(Number(valor || 0)));

const obtenerUsuarioActual = () => {
  try {
    return JSON.parse(localStorage.getItem('usuarioActual') || 'null');
  } catch {
    return null;
  }
};

const getPedidosKey = (usuario) =>
  usuario?.id ? `misPedidos_${usuario.id}` : 'misPedidos_guest';

const getCarritoKey = (usuario) =>
  usuario?.id ? `carrito_${usuario.id}` : 'carrito_guest';

const leerLocal = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    localStorage.removeItem(key);
    return [];
  }
};

const guardarLocal = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const MiCarrito = () => {
  const [usuarioActual] = useState(() => obtenerUsuarioActual());
  const [carrito, setCarrito] = useState([]);
  const [carritoId, setCarritoId] = useState(null);
  const [cargandoCarrito, setCargandoCarrito] = useState(false);
  const [mostrarMetodoPago, setMostrarMetodoPago] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  const [pagoDatos, setPagoDatos] = useState(null);
  const navigate = useNavigate();

  const tieneSesion = Boolean(usuarioActual?.id);

  useEffect(() => {
    console.log('[MiCarrito] tieneSesion?', tieneSesion);
    const cargar = async () => {
      if (tieneSesion) {
        setCargandoCarrito(true);
        try {
          const resp = await carritoService.obtenerPorUsuario(usuarioActual.id);
          setCarritoId(resp?.id || null);
          const items = (resp?.items || []).map((item) => ({
            itemId: item.id,
            productoId: item.productoId,
            nombre: item.productoNombre,
            imagen: item.productoImagen,
            tiendaId: item.tiendaId,
            tiendaNombre: item.tiendaNombre,
            cantidad: item.cantidad || 1,
            precio: Number(item.precioUnitario) || 0
          }));
          setCarrito(items);
          guardarLocal(getCarritoKey(usuarioActual), items);
          setError('');
        } catch (err) {
          console.warn('No se pudo sincronizar carrito remoto, usando respaldo local:', err);
          setError('No pudimos sincronizar el carrito con el servidor. Estás viendo el respaldo local.');
          setCarrito(leerLocal(getCarritoKey(usuarioActual)));
        } finally {
          setCargandoCarrito(false);
        }
      } else {
        console.warn('[MiCarrito] sin sesión, usando carrito local');
        setCarrito(leerLocal(getCarritoKey(null)));
      }
    };

    cargar();
  }, [tieneSesion, usuarioActual]);

  const subtotal = useMemo(
    () => carrito.reduce((acc, prod) => acc + Number(prod.precio || 0) * Number(prod.cantidad || 0), 0),
    [carrito]
  );

  const iva = useMemo(() => subtotal * IVA_PORCENTAJE, [subtotal]);
  const costoEnvio = carrito.length === 0 ? 0 : ENVIO_COSTO;
  const total = useMemo(() => subtotal + iva + costoEnvio, [subtotal, iva, costoEnvio]);

  const actualizarCarritoState = (items) => {
    setCarrito(items);
    guardarLocal(getCarritoKey(usuarioActual), items);
  };

  const finalizarCompra = () => {
    if (!tieneSesion) {
      alert('Debes iniciar sesión para confirmar tu compra.');
      navigate('/login');
      return;
    }
    if (carrito.length === 0) {
      setMensaje('Tu carrito está vacío.');
      return;
    }
    setMostrarMetodoPago(true);
    setMensaje('');
    setConfirmado(false);
  };

  const limpiarCarrito = async () => {
    actualizarCarritoState([]);
    if (tieneSesion && carritoId) {
      try {
        await carritoService.limpiar(carritoId);
      } catch (err) {
        console.warn('No se pudo limpiar carrito en servidor:', err);
      }
    }
  };

  const guardarPedidoLocal = (pedido) => {
    const key = getPedidosKey(usuarioActual);
    const actuales = leerLocal(key);
    actuales.push(pedido);
    guardarLocal(key, actuales);
  };

  const handleConfirmarPago = async (datosPago) => {
    const respaldoItems = carrito.map((item) => ({ ...item }));
    const direccionEntrega =
      datosPago.tipoEntrega === 'domicilio'
        ? datosPago.direccion || usuarioActual?.direccion || ''
        : `Retiro en tienda ${respaldoItems[0]?.tiendaNombre || ''}`;

    const tiendaId =
      respaldoItems.find((item) => item.tiendaId)?.tiendaId || null;

    const pedidoDTO = {
      usuarioId: usuarioActual?.id || null,
      tiendaId,
      tipoEntrega: datosPago.tipoEntrega,
      metodoPago: datosPago.metodoPago,
      direccionEntrega,
      items: respaldoItems.map((item) => ({
        productoId: item.productoId,
        cantidad: Number(item.cantidad) || 1,
        precioUnitario: Number(item.precio) || 0
      }))
    };

    try {
      if (!pedidoDTO.usuarioId) {
        throw new Error('Debes iniciar sesión para registrar el pedido.');
      }
      const respuesta = await pedidoService.crear(pedidoDTO);
      guardarPedidoLocal({
        ...respuesta,
        items: respuesta.items && respuesta.items.length ? respuesta.items : respaldoItems
      });
      setMensaje('Compra registrada con éxito.');
      setConfirmado(true);
      setPagoDatos(datosPago);
      await limpiarCarrito();
      setMostrarMetodoPago(false);
      setTimeout(() => navigate('/cliente/mispedidos', { replace: true }), 1500);
    } catch (error) {
      console.warn('Fallo al crear pedido en backend, guardando local:', error);
      const pedidoLocal = {
        id: `local-${Date.now()}`,
        usuarioId: usuarioActual?.id || null,
        tiendaId,
        fechaPedido: new Date().toISOString(),
        estado: 'GUARDADO_LOCALMENTE',
        tipoEntrega: pedidoDTO.tipoEntrega,
        metodoPago: pedidoDTO.metodoPago,
        direccionEntrega: pedidoDTO.direccionEntrega,
        total: Math.round(total),
        items: respaldoItems
      };
      guardarPedidoLocal(pedidoLocal);
      setMensaje('El servidor no respondió. Guardamos tu compra localmente.');
      setConfirmado(true);
      setPagoDatos(datosPago);
      actualizarCarritoState([]);
      setTimeout(() => navigate('/cliente/mispedidos'), 1500);
    }
  };

  const eliminarProducto = async (item) => {
    if (!window.confirm('¿Seguro que deseas eliminar este producto del carrito?')) return;
    const actualizado = carrito.filter((p) => p.productoId !== item.productoId);
    actualizarCarritoState(actualizado);
    if (tieneSesion && carritoId && item.itemId) {
      try {
        await carritoService.eliminarItem(carritoId, item.itemId);
      } catch (err) {
        console.warn('No se pudo eliminar item en servidor:', err);
      }
    }
  };

  const modificarCantidad = async (item, cantidad) => {
    if (cantidad < 1) return;
    const actualizado = carrito.map((p) =>
      p.productoId === item.productoId ? { ...p, cantidad } : p
    );
    actualizarCarritoState(actualizado);
    if (tieneSesion && carritoId && item.itemId) {
      try {
        await carritoService.actualizarCantidad(carritoId, item.itemId, cantidad);
      } catch (err) {
        console.warn('No se pudo actualizar cantidad en servidor:', err);
      }
    }
  };

  return (
    <div className="m-5">
      <h2>Mi Carrito</h2>

      {error && <div className="alert alert-warning">{error}</div>}

      {cargandoCarrito ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Cargando carrito...</span>
          </div>
        </div>
      ) : carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          <div className="mb-3">
            <Link to="/cliente/producto" className="btn btn-green">
              <i className="fas fa-arrow-left me-1"></i> Seguir comprando
            </Link>
          </div>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Minimarket</th>
                  <th>Cantidad</th>
                  <th>Precio</th>
                  <th>Subtotal</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {carrito.map((prod, idx) => (
                  <tr key={`${prod.productoId}-${idx}`}>
                    <td>
                      <div className="d-flex align-items-center">
                        <img
                          src={
                            prod.imagen
                              ? prod.imagen.startsWith('http')
                                ? prod.imagen
                                : `/images/productos/${prod.imagen}`
                              : '/images/default.jpg'
                          }
                          alt={prod.nombre}
                          className="mi-carrito-product-img"
                          onError={(e) => {
                            e.currentTarget.src = '/images/default.jpg';
                          }}
                        />
                        <div>
                          <div className="fw-semibold">{prod.nombre}</div>
                          <small className="text-muted">ID #{prod.productoId}</small>
                        </div>
                      </div>
                    </td>
                    <td>{prod.tiendaNombre || '-'}</td>
                    <td className="mi-carrito-qty-col">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        min={1}
                        value={prod.cantidad}
                        onChange={(e) =>
                          modificarCantidad(prod, parseInt(e.target.value, 10) || 1)
                        }
                      />
                    </td>
                    <td>{formatearCLP(prod.precio)}</td>
                    <td>{formatearCLP((prod.precio || 0) * (prod.cantidad || 0))}</td>
                    <td>
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => eliminarProducto(prod)}
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mi-carrito-resumen">
            <h4>Resumen</h4>
            <div className="d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>{formatearCLP(subtotal)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>IVA (19%):</span>
              <span>{formatearCLP(iva)}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Envío:</span>
              <span>{carrito.length === 0 ? 'CLP 0' : formatearCLP(ENVIO_COSTO)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total:</span>
              <span className="text-success">{formatearCLP(total)}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        {!mostrarMetodoPago && carrito.length > 0 && (
          <button className="btn btn-primary" onClick={finalizarCompra}>
            Confirmar Pago
          </button>
        )}
        {mostrarMetodoPago && (
          <MetodoPago total={formatearCLP(total)} onConfirmar={handleConfirmarPago} />
        )}
      </div>

      {mensaje && <p className="mt-3">{mensaje}</p>}

      {confirmado && pagoDatos && (
        <div className="alert alert-success mt-3">
          <h4 className="alert-heading">¡Pedido confirmado!</h4>
          <p>
            Enviaremos la confirmación a <strong>{pagoDatos.correo}</strong>. Revisa tu historial
            para seguir el estado del pedido.
          </p>
        </div>
      )}
    </div>
  );
};

export default MiCarrito;
