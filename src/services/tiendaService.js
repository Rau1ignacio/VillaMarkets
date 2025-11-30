import api from './api';

const tiendaService = {
  listar: (vendedorId) =>
    api
      .get('/minimarkets', vendedorId ? { params: { vendedorId } } : undefined)
      .then((r) => r.data),
  obtenerPorId: (id) => api.get(`/minimarkets/${id}`).then((r) => r.data),
  crear: (tienda) => api.post('/minimarkets', tienda).then((r) => r.data),
  actualizar: (id, tienda) => api.put(`/minimarkets/${id}`, tienda).then((r) => r.data),
  eliminar: (id) => api.delete(`/minimarkets/${id}`).then((r) => r.data),
};

export default tiendaService;
