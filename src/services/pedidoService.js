import api from './api';

const pedidoService = {
  crear: (pedido) => api.post('/v1/pedidos', pedido).then((r) => r.data),
  listar: () => api.get('/v1/pedidos').then((r) => r.data),
  listarPorUsuario: (usuarioId) =>
    api.get(`/v1/pedidos/usuario/${usuarioId}`).then((r) => r.data),
  listarPorTienda: (tiendaId) =>
    api.get(`/v1/pedidos/tienda/${tiendaId}`).then((r) => r.data),
  listarPorAdministrador: (adminId) =>
    api.get(`/v1/pedidos/admin/${adminId}`).then((r) => r.data),
  obtenerPorId: (id) => api.get(`/v1/pedidos/${id}`).then((r) => r.data),
  actualizarEstado: (id, estado) =>
    api.put(`/v1/pedidos/${id}/estado`, null, { params: { estado } }),
};

export default pedidoService;
