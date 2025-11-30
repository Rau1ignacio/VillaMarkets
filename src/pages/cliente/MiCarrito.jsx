import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MetodoPago from './MetodoPago';
import pedidoService from '../../services/pedidoService';

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

const leerPedidosLocales = (usuario) => {
  try {
    return JSON.parse(localStorage.getItem(getPedidosKey(usuario)) || '[]');
  } catch {
    localStorage.removeItem(getPedidosKey(usuario));
    return [];
  }
};

const guardarPedidoLocal = (usuario, pedido) => {
  const existentes = leerPedidosLocales(usuario);
  existentes.push(pedido);
  localStorage.setItem(getPedidosKey(usuario), JSON.stringify(existentes));
  localStorage.removeItem('misPedidos');
};

const construirItemsDesdeCarrito = (carrito) =>
  carrito.map((prod) => ({
    productoId: prod.id ?? prod.productoId ?? null,
    productoNombre: prod.nombre || prod.titulo || `Producto ${prod.id || ''}`.trim(),
    imagenProducto: prod.imagen || prod.image || null,
    cantidad: Number(prod.cantidad) || 1,
    precioUnitario: Number(prod.precio) || 0
  }));

const MiCarrito = () => {
  const [carrito, setCarrito] = useState([]);
  const [mostrarMetodoPago, setMostrarMetodoPago] = useState(false);
  const [pagoDatos, setPagoDatos] = useState(null);
  const [descuento, setDescuento] = useState(0);
  const [envioGratis, setEnvioGratis] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  const navigate = useNavigate();
  const [usuarioActual] = useState(() => obtenerUsuarioActual());

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito') || '[]');
    setCarrito(Array.isArray(carritoGuardado) ? carritoGuardado : []);
  }, []);

  const subtotal = useMemo(
    () =>
      carrito.reduce(
        (acc, prod) => acc + Number(prod.precio || 0) * Number(prod.cantidad || 0),
        0
      ),
    [carrito]
  );

  const iva = useMemo(() => subtotal * IVA_PORCENTAJE, [subtotal]);
  const costoEnvio = useMemo(() => (envioGratis ? 0 : ENVIO_COSTO), [envioGratis]);
  const total = useMemo(() => subtotal + iva + costoEnvio - descuento, [subtotal, iva, costoEnvio, descuento]);

  const finalizarCompra = () => {
    if (carrito.length === 0) {
      setMensaje('Tu carrito esta vacio.');
      return;
    }
    setMostrarMetodoPago(true);
    setMensaje('');
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem('carrito');
    setDescuento(0);
    setEnvioGratis(false);
  };

  const handleConfirmarPago = async (datosPago) => {
    const respaldoItems = construirItemsDesdeCarrito(carrito);
    const direccionEntrega = datosPago?.direccion || usuarioActual?.direccion || '';

    const tiendaIdDesdeCarrito =
      carrito
        .map((prod) => prod.tiendaId ?? prod.tienda?.id ?? prod.minimarketId ?? null)
        .find((id) => id != null) || null;

    const pedidoDTO = {
      usuarioId: usuarioActual?.id || null,
      tiendaId: tiendaIdDesdeCarrito,
      tipoEntrega: datosPago?.tipoEntrega || 'domicilio',
      metodoPago: datosPago?.metodoPago || 'transferencia',
      direccionEntrega,
      items: carrito.map((prod) => ({
        productoId: prod.id ?? prod.productoId,
        cantidad: Number(prod.cantidad) || 1,
        precioUnitario: Number(prod.precio) || 0
      }))
    };

    let mensajeUsuario = 'Compra realizada.';

    try {
      if (!pedidoDTO.usuarioId) {
        throw new Error('Debe iniciar sesion para registrar el pedido.');
      }
      const respuesta = await pedidoService.crear(pedidoDTO);
      const pedidoGuardado = {
        ...respuesta,
        usuarioId: respuesta?.usuarioId ?? usuarioActual?.id ?? null,
        items:
          respuesta?.items && respuesta.items.length > 0
            ? respuesta.items
            : respaldoItems
      };
      guardarPedidoLocal(usuarioActual, pedidoGuardado);
      mensajeUsuario = 'Compra registrada con exito.';
    } catch (error) {
      console.warn('Fallo al crear pedido en backend, usando respaldo local:', error);
      mensajeUsuario =
        usuarioActual?.id
          ? 'No pudimos contactar al servidor. Guardamos el pedido localmente.'
          : 'Debes iniciar sesion para enviar el pedido. Guardamos el pedido localmente.';

      const pedidoLocal = {
        id: `local-${Date.now()}`,
        usuarioId: usuarioActual?.id || null,
        tiendaId: pedidoDTO.tiendaId,
        fechaPedido: new Date().toISOString(),
        estado: 'GUARDADO_LOCALMENTE',
        tipoEntrega: pedidoDTO.tipoEntrega,
        metodoPago: pedidoDTO.metodoPago,
        direccionEntrega: pedidoDTO.direccionEntrega,
        total: Math.round(total),
        items: respaldoItems
      };
      guardarPedidoLocal(usuarioActual, pedidoLocal);
    }

    limpiarCarrito();
    setMensaje(mensajeUsuario);
    setConfirmado(true);
    setPagoDatos(datosPago);
    setMostrarMetodoPago(false);

    setTimeout(() => {
      navigate('/cliente/mispedidos');
    }, 2000);
  };

  const eliminarProducto = (id) => {
    if (window.confirm('Seguro que deseas eliminar este producto del carrito?')) {
      const nuevoCarrito = carrito.filter((p) => (p.id ?? p.productoId) !== id);
      setCarrito(nuevoCarrito);
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
      setMensaje('Producto eliminado correctamente.');
    }
  };

  const modificarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;
    const nuevoCarrito = carrito.map((p) =>
      (p.id ?? p.productoId) === id ? { ...p, cantidad } : p
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    setMensaje('Cantidad modificada correctamente.');
  };

  return (
    <div className="m-5">
      <h2>Mi Carrito</h2>

      {carrito.length === 0 ? (
        <p>Tu carrito esta vacio.</p>
      ) : (
        <div>
          <div style={{ marginBottom: 20 }}>
            <Link to="/cliente/producto" className="btn btn-green">
              <i className="fas fa-arrow-left me-1" /> Seguir comprando
            </Link>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Minimarket</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((prod, idx) => (
                <tr key={idx}>
                  <td style={{ display: 'flex', alignItems: 'center' }}>
                    <img
                      src={
                        prod.imagen
                          ? prod.imagen.startsWith('http')
                            ? prod.imagen
                            : `/images/productos/${prod.imagen}`
                          : '/images/default.jpg'
                      }
                      alt={prod.nombre}
                      style={{
                        width: 40,
                        height: 40,
                        objectFit: 'contain',
                        marginRight: 10,
                        borderRadius: 6
                      }}
                      onError={(e) => {
                        e.currentTarget.src = '/images/default.jpg';
                      }}
                    />
                    {prod.nombre}
                  </td>
                  <td>{prod.minimarket || prod.tiendaNombre || '-'}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={prod.cantidad}
                      style={{ width: 60 }}
                      onChange={(e) =>
                        modificarCantidad(
                          prod.id ?? prod.productoId,
                          parseInt(e.target.value, 10) || 1
                        )
                      }
                    />
                  </td>
                  <td>{formatearCLP(prod.precio)}</td>
                  <td>{formatearCLP((prod.precio || 0) * (prod.cantidad || 0))}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => eliminarProducto(prod.id ?? prod.productoId)}
                    >
                      <i className="fas fa-trash" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div
            style={{
              marginTop: 20,
              background: '#f8f9fa',
              borderRadius: 10,
              padding: 20
            }}
          >
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
              <span>Envio:</span>
              <span>{envioGratis ? 'Gratis' : formatearCLP(ENVIO_COSTO)}</span>
            </div>
            <div className="d-flex justify-content-between text-danger">
              <span>Descuentos:</span>
              <span>-{formatearCLP(descuento)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total:</span>
              <span className="text-green">{formatearCLP(total)}</span>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        {!mostrarMetodoPago && !confirmado && carrito.length > 0 && (
          <button className="btn btn-primary" onClick={finalizarCompra}>
            Confirmar Pago
          </button>
        )}
        {mostrarMetodoPago && (
          <MetodoPago total={total.toFixed(2)} onConfirmar={handleConfirmarPago} />
        )}
      </div>

      {mensaje && <p style={{ marginTop: 10 }}>{mensaje}</p>}

      {confirmado && pagoDatos && (
        <div
          style={{
            marginTop: 20,
            background: '#d4edda',
            padding: 20,
            borderRadius: 10
          }}
        >
          <h4>Pedido realizado con exito!</h4>
          {pagoDatos.correo && (
            <p>
              Recibiras un email de confirmacion en <b>{pagoDatos.correo}</b>.
            </p>
          )}
          {pagoDatos.comprobante && (
            <p>
              Comprobante subido: <b>{pagoDatos.comprobante.name}</b>
            </p>
          )}
          <div style={{ marginTop: 16 }}>
            <span>Redirigiendo al historial de compras...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiCarrito;
