import api from './api';

const productoService = {
  listarPorTienda: (tiendaId) => api.get(`/v1/productos/tienda/${tiendaId}`).then(r => r.data),
  buscar: (q) => api.get(`/v1/productos/search`, { params: { q } }).then(r => r.data),
  obtenerPorId: (id) => api.get(`/v1/productos/${id}`).then(r => r.data),
  destacados: () => api.get('/v1/productos/destacados').then(r => r.data),
};

export default productoService;
