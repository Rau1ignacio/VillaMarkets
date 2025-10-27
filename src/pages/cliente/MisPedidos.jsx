import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const pedidosGuardados = JSON.parse(localStorage.getItem('misPedidos')) || [];
    setPedidos(pedidosGuardados.reverse()); // Mostrar el más reciente primero
  }, []);

  // HTML ---------------------------------------------------------------------------------------
  return (
    <div className="container py-4">
      <h2>Historial de Compras</h2>
      {pedidos.length === 0 ? (
        <p>No tienes compras registradas.</p>
      ) : (
        <>
          <table className="table table-bordered table-striped mt-3">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Hora</th>
                <th>Cliente</th>
                <th>Total</th>
                <th>Estado</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.map((pedido, idx) => (
                <tr key={idx}>
                  <td>{pedido.fecha}</td>
                  <td>{pedido.hora}</td>
                  <td>{pedido.nombreCliente || (pedido.datosPago && pedido.datosPago.nombre) || '-'}</td>
                  <td>S/ {pedido.total.toLocaleString('es-CL')}</td>
                  <td>{pedido.estado}</td>
                  <td>
                    <ul style={{margin:0, padding:0, listStyle:'none'}}>
                      {pedido.productos.map((prod, i) => (
                        <li key={i} style={{display:'flex',alignItems:'center',marginBottom:4}}>
                          <img
                            src={prod.imagen ? (prod.imagen.startsWith('http') ? prod.imagen : `/images/productos/${prod.imagen}`) : '/images/default.jpg'}
                            alt={prod.nombre}
                            style={{width:32, height:32, objectFit:'contain', borderRadius:4, marginRight:8}}
                            onError={e => { e.target.src = '/images/default.jpg'; }}
                          />
                          <span>{prod.nombre} x{prod.cantidad}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default MisPedidos;
