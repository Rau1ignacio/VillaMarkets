import api from './api';

const carritoService = {
  obtener: () => api.get('/v1/carritos').then(r => r.data),
  agregarItem: (item) => api.post('/v1/carritos/items', item).then(r => r.data),
  eliminarItem: (productId) => api.delete(`/v1/carritos/items/${productId}`).then(r => r.data),
  limpiar: () => api.post('/v1/carritos/clear').then(r => r.data),
};

export default carritoService;
