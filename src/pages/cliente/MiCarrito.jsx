import React, { useState, useEffect } from 'react';
import MetodoPago from './MetodoPago';
import Producto from './Producto';

import { Link, useNavigate } from 'react-router-dom';

const ENVIO_COSTO = 2990;
const IVA_PORCENTAJE = 0.19;
const formatearCLP = (valor) => 'CLP ' + new Intl.NumberFormat('es-CL', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(Math.round(valor));


// Componente principal del carrito de compras
const MiCarrito = () => {

  const [carrito, setCarrito] = useState([]);
  // const [direccion, setDireccion] = useState('');
  // const [metodoPago, setMetodoPago] = useState('');
  // const [codigoDescuento, setCodigoDescuento] = useState('');
  const [mostrarMetodoPago, setMostrarMetodoPago] = useState(false);
  const [pagoDatos, setPagoDatos] = useState(null);
  const [descuento, setDescuento] = useState(0);
  const [envioGratis, setEnvioGratis] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [confirmado, setConfirmado] = useState(false);
  const navigate = useNavigate();
  /// useEffect para cargar el carrito desde localStorage
  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  const calcularSubtotal = () => carrito.reduce((acc, prod) => acc + prod.precio * prod.cantidad, 0);
  const calcularIVA = (subtotal) => subtotal * IVA_PORCENTAJE;
  const calcularEnvio = () => envioGratis ? 0 : ENVIO_COSTO;
  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const iva = calcularIVA(subtotal);
    const envio = calcularEnvio();
    return subtotal + iva + envio - descuento;
  };

  // const aplicarDescuento = () => {};

  const descontarStock = async () => {
    for (const prod of carrito) {
      await fetch(`https://api.tuapp.com/productos/${prod.id}/descontar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cantidad: prod.cantidad })
      });
    }
  };

  const finalizarCompra = () => {
    if (carrito.length === 0) {
      setMensaje('El carrito está vacío.');
      return;
    }
    setMostrarMetodoPago(true);
  };

  const handleConfirmarPago = async (datosPago) => {
    const productosComprados = carrito.map(prod => ({ ...prod }));
    const subtotal = calcularSubtotal();
    const ivaCalculado = calcularIVA(subtotal);
    const envioCalculado = calcularEnvio();
    const totalCalculado = subtotal + ivaCalculado + envioCalculado - descuento;

    let estadoPedido = 'Procesando';
    let mensajeUsuario = '¡Compra realizada y stock actualizado!';

    try {
      await descontarStock();
    } catch (error) {
      console.error('Error al descontar stock remoto:', error);
      estadoPedido = 'Pendiente de confirmación';
      mensajeUsuario = 'No se pudo actualizar el stock remoto, pero tu pedido quedó guardado en el historial.';
    }

    const pedidosGuardados = JSON.parse(localStorage.getItem('misPedidos')) || [];
    const ahora = new Date();
    const nuevoPedido = {
      fecha: ahora.toLocaleDateString(),
      hora: ahora.toLocaleTimeString(),
      total: totalCalculado,
      estado: estadoPedido,
      metodoPago: 'Pago en línea',
      direccion: '',
      descuento,
      envio: envioCalculado,
      iva: ivaCalculado,
      productos: productosComprados,
      nombreCliente: datosPago.nombre || '',
      datosPago
    };
    pedidosGuardados.push(nuevoPedido);
    localStorage.setItem('misPedidos', JSON.stringify(pedidosGuardados));
    setCarrito([]);
    localStorage.removeItem('carrito');
    setMensaje(mensajeUsuario);
    setDescuento(0);
    setEnvioGratis(false);
    setConfirmado(true);
    setPagoDatos(datosPago);
    setMostrarMetodoPago(false);
    // Redirigir automáticamente al historial después de 2 segundos
    setTimeout(() => {
      navigate('/cliente/mispedidos');
    }, 2000);
  };

  // CRUD: Eliminar producto del carrito
  const eliminarProducto = (id) => {
    // Confirmación visual antes de eliminar
    if (window.confirm('¿Seguro que deseas eliminar este producto del carrito?')) {
      const nuevoCarrito = carrito.filter(p => p.id !== id);
      setCarrito(nuevoCarrito);
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
      setMensaje('Producto eliminado correctamente.');
    }
  };

  // CRUD: Modificar cantidad de producto
  const modificarCantidad = (id, cantidad) => {
    if (cantidad < 1) return;
    const nuevoCarrito = carrito.map(p =>
      p.id === id ? { ...p, cantidad } : p
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    setMensaje('Cantidad modificada correctamente.');
  };

  return (
    <div className='m-5'>

  <h2>Mi Carrito</h2>
      {carrito.length === 0 ? (
        <p>Tu carrito está vacío.</p>
      ) : (
        <div>
          {/* Botón para volver al catálogo */}
          <div style={{ marginBottom: 20 }}>
            <Link to="./cliente/producto" className="btn btn-green">
              <i className="fas fa-arrow-left me-1"></i> Seguir comprando
              
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
                      alt={`${prod.nombre} thumbnail sold by ${prod.minimarket}, price S/ ${prod.precio}, quantity ${prod.cantidad}. Neutral product photo on light background, factual informative tone`}
                      style={{ width: 40, height: 40, objectFit: 'contain', marginRight: 10, borderRadius: 6 }}
                      onError={e => { e.target.src = '/images/default.jpg'; }}
                    />
                    {prod.nombre}
                  </td>
                  <td>{prod.minimarket}</td>
                  <td>
                    <input
                      type="number"
                      min={1}
                      value={prod.cantidad}
                      style={{ width: 60 }}
                      onChange={e => modificarCantidad(prod.id, parseInt(e.target.value))}
                    />
                  </td>
                  <td>{formatearCLP(prod.precio)}</td>
                  <td>{formatearCLP(prod.precio * prod.cantidad)}</td>
                  <td>
                    <button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(prod.id)}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ marginTop: 20, background: '#f8f9fa', borderRadius: 10, padding: 20 }}>
            <h4>Resumen</h4>
            <div className="d-flex justify-content-between">
              <span>Subtotal:</span>
              <span>{formatearCLP(calcularSubtotal())}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>IVA (19%):</span>
              <span>{formatearCLP(calcularIVA(calcularSubtotal()))}</span>
            </div>
            <div className="d-flex justify-content-between">
              <span>Envío:</span>
              <span>{envioGratis ? 'Gratis' : formatearCLP(ENVIO_COSTO)}</span>
            </div>
            <div className="d-flex justify-content-between text-danger">
              <span>Descuentos:</span>
              <span>-{formatearCLP(descuento)}</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fw-bold">
              <span>Total:</span>
              <span className="text-green">{formatearCLP(calcularTotal())}</span>
            </div>
            {/* Campo de descuento eliminado */}
          </div>
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        {!mostrarMetodoPago && !confirmado && (
          <button onClick={finalizarCompra}>Confirmar Pago</button>
        )}
        {mostrarMetodoPago && (
          <MetodoPago total={calcularTotal().toFixed(2)} onConfirmar={handleConfirmarPago} />
        )}
      </div>
      {mensaje && <p style={{ marginTop: 10 }}>{mensaje}</p>}
      {confirmado && pagoDatos && (
        <div style={{ marginTop: 20, background: '#d4edda', padding: 20, borderRadius: 10 }}>
          <h4>¡Pedido realizado con éxito!</h4>
          <p>Recibirás un email de confirmación en breve a <b>{pagoDatos.correo}</b>.</p>
          {pagoDatos.comprobante && (
            <div>
              <p>Comprobante subido: <b>{pagoDatos.comprobante.name}</b></p>
            </div>
          )}
          <div style={{marginTop:16}}>
            <span>Redirigiendo al historial de compras...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiCarrito;
