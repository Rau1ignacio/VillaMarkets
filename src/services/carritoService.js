import api from './api';

const carritoService = {
  obtenerPorUsuario: (usuarioId) => api.get(`/v1/carritos/usuario/${usuarioId}`).then(r => r.data),
  agregarItem: (usuarioId, item) => api.post(`/v1/carritos/usuario/${usuarioId}/add`, item).then(r => r.data),
  eliminarItem: (carritoId, itemId) => api.delete(`/v1/carritos/${carritoId}/item/${itemId}`).then(r => r.data),
  actualizarCantidad: (carritoId, itemId, cantidad) =>
    api.put(`/v1/carritos/${carritoId}/item/${itemId}`, { cantidad }).then(r => r.data),
  limpiar: (carritoId) => api.delete(`/v1/carritos/${carritoId}/clear`).then(r => r.data),
};

export default carritoService;
