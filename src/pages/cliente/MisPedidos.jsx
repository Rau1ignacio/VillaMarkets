import React, { useEffect, useState } from 'react';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    // Simulación: cargar pedidos desde localStorage o backend
    const pedidosGuardados = JSON.parse(localStorage.getItem('misPedidos')) || [];
    setPedidos(pedidosGuardados);
  }, []);

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  return (
    <div>
      <h2>Historial de Compras</h2>
      {pedidos.length === 0 ? (
        <p>No tienes pedidos aún.</p>
      ) : (
        pedidos.map((pedido, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', margin: 10, padding: 10 }}>
            <p><b>Fecha:</b> {pedido.fecha}</p>
            <p><b>Total:</b> S/ {pedido.total}</p>
            <p><b>Estado:</b> {pedido.estado || 'Procesando'}</p>
            <p><b>Método de pago:</b> {pedido.metodoPago || 'No especificado'}</p>
            <p><b>Dirección de entrega:</b> {pedido.direccion || 'No especificada'}</p>
            <ul>
              {pedido.productos.map((prod, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  <img
                    src={prod.imagen ? `/images/${prod.imagen}` : '/images/default.jpg'}
                    alt={prod.nombre}
                    style={{ width: 40, height: 40, objectFit: 'contain', marginRight: 10, borderRadius: 6 }}
                    onError={e => { e.target.src = '/images/default.jpg'; }}
                  />
                  <span>
                    {prod.nombre} - {prod.cantidad} x S/ {prod.precio} <br />
                    <small>Minimarket: {prod.minimarket}</small>
                  </span>
                </li>
              ))}
            </ul>
            <button onClick={() => setPedidoSeleccionado(pedido)}>
              Ver detalles
            </button>
          </div>
        ))
      )}
      {/* Mostrar detalles del pedido seleccionado */}
      {pedidoSeleccionado && (
        <div style={{ background: '#d88f8fff', padding: 20, marginTop: 20 }}>
          <h3>Detalles del Pedido</h3>
          <p><b>Fecha:</b> {pedidoSeleccionado.fecha}</p>
          <p><b>Total:</b> S/ {pedidoSeleccionado.total}</p>
          <p><b>Estado:</b> {pedidoSeleccionado.estado || 'Procesando'}</p>
          <p><b>Método de pago:</b> {pedidoSeleccionado.metodoPago || 'No especificado'}</p>
          <p><b>Dirección de entrega:</b> {pedidoSeleccionado.direccion || 'No especificada'}</p>
          <ul>
            {pedidoSeleccionado.productos.map((prod, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <img
                  src={prod.imagen ? `/images/${prod.imagen}` : '/images/default.jpg'}
                  alt={prod.nombre}
                  style={{ width: 40, height: 40, objectFit: 'contain', marginRight: 10, borderRadius: 6 }}
                  onError={e => { e.target.src = '/images/default.jpg'; }}
                />
                <span>
                  {prod.nombre} - {prod.cantidad} x S/ {prod.precio} <br />
                  <small>Minimarket: {prod.minimarket}</small>
                </span>
              </li>
            ))}
          </ul>
          <button onClick={() => setPedidoSeleccionado(null)}>Cerrar</button>
        </div>
      )}
    </div>
  );
};

export default MisPedidos;
