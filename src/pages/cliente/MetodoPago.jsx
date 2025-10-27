import React, { useState } from 'react';
/// Componente para manejar el método de pago
const MetodoPago = ({ total, onConfirmar }) => {
  const [nombre, setNombre] = useState('');
  const [numero, setNumero] = useState('');
  const [correo, setCorreo] = useState('');
  const [comprobante, setComprobante] = useState(null);
  const [confirmado, setConfirmado] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setConfirmado(true);
    if (onConfirmar) onConfirmar({ nombre, numero, correo, comprobante });
  };
  

  if (confirmado) {
    return (
      <div style={{ background: '#d4edda', padding: 20, borderRadius: 10 }}>
        <h4>¡Pago confirmado!</h4>
        <p>El comprobante será enviado a: <b>{correo}</b></p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto', background: '#f8f9fa', padding: 20, borderRadius: 10 }}>
      <h3>Datos de Pago</h3>
      <div className="mb-3">
        <label>Nombre en la tarjeta o cuenta</label>
        <input type="text" className="form-control" value={nombre} onChange={e => setNombre(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label>Número de tarjeta o cuenta</label>
        <input type="text" className="form-control" value={numero} onChange={e => setNumero(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label>Correo electrónico</label>
        <input type="email" className="form-control" value={correo} onChange={e => setCorreo(e.target.value)} required />
      </div>
      <div className="mb-3">
        <label>Subir comprobante (opcional)</label>
        <input type="file" className="form-control" onChange={e => setComprobante(e.target.files[0])} />
      </div>
      <div className="mb-3">
        <b>Total a pagar: CLP ${total}</b>
      </div>
      <button type="submit" className="btn btn-success">Confirmar Pago</button>
    </form>
  );
};

export default MetodoPago;
