import api from './api';

const pedidoService = {
  crear: (pedido) => api.post('/v1/pedidos', pedido).then(r => r.data),
  obtenerPorUsuario: (userId) => api.get('/v1/pedidos', { params: { userId } }).then(r => r.data),
  obtenerPorId: (id) => api.get(`/v1/pedidos/${id}`).then(r => r.data),
  actualizarEstado: (id, estado) => api.patch(`/v1/pedidos/${id}/estado`, { estado }).then(r => r.data),
};

export default pedidoService;
