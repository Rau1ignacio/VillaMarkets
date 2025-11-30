import React, { useState } from 'react';
import '../../styles/MetodoPago.css';

const MetodoPago = ({ total, onConfirmar }) => {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    metodoPago: 'transferencia',
    tipoEntrega: 'domicilio',
    direccion: '',
    comentarios: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onConfirmar) {
      onConfirmar(form);
    }
  };

  return (
    <form className="metodo-pago-form" onSubmit={handleSubmit}>
      <h3>Confirmar Pago</h3>
      <p className="text-muted mb-3">Completa tus datos para finalizar el pedido.</p>

      <div className="mb-3">
        <label className="form-label">Nombre completo</label>
        <input
          type="text"
          className="form-control"
          name="nombre"
          value={form.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Correo electrónico</label>
        <input
          type="email"
          className="form-control"
          name="correo"
          value={form.correo}
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Método de pago</label>
        <select
          className="form-select"
          name="metodoPago"
          value={form.metodoPago}
          onChange={handleChange}
        >
          <option value="transferencia">Transferencia</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="efectivo">Efectivo</option>
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Tipo de entrega</label>
        <select
          className="form-select"
          name="tipoEntrega"
          value={form.tipoEntrega}
          onChange={handleChange}
        >
          <option value="domicilio">Entrega a domicilio</option>
          <option value="retiro">Retiro en tienda</option>
        </select>
      </div>

      {form.tipoEntrega === 'domicilio' && (
        <div className="mb-3">
          <label className="form-label">Dirección de entrega</label>
          <textarea
            className="form-control"
            name="direccion"
            value={form.direccion}
            onChange={handleChange}
            rows={2}
            required
          />
        </div>
      )}

      <div className="mb-3">
        <label className="form-label">Comentarios</label>
        <textarea
          className="form-control"
          name="comentarios"
          value={form.comentarios}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <div className="mb-3 fw-bold">
        Total a pagar: <span className="text-success">{total}</span>
      </div>

      <button type="submit" className="btn btn-success w-100">
        Confirmar pedido
      </button>
    </form>
  );
};

export default MetodoPago;
