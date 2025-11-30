import api from './api';

const productoService = {
  listar: () => api.get('/v1/productos').then(r => r.data),
  listarPorTienda: (tiendaId) => api.get(`/v1/productos/tienda/${tiendaId}`).then(r => r.data),
  listarPorAdmin: (adminId) => api.get(`/v1/productos/admin/${adminId}`).then(r => r.data),
  obtenerPorId: (id) => api.get(`/v1/productos/${id}`).then(r => r.data),
  buscar: (q) => api.get(`/v1/productos/search?q=${q}`).then(r => r.data),
  crear: (producto) => api.post('/v1/productos', producto).then(r => r.data),
  actualizar: (id, producto) => api.put(`/v1/productos/${id}`, producto).then(r => r.data),
  eliminar: (id) => api.delete(`/v1/productos/${id}`).then(r => r.data),
};

export default productoService;
