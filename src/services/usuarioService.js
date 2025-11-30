import api from './api';

const usuarioService = {
  registro: (data) => api.post('/v1/usuarios/register', data).then(r => r.data),
  login: (credentials) => api.post('/v1/usuarios/login', credentials).then(r => r.data),
  obtenerPorId: (id) => api.get(`/v1/usuarios/${id}`).then(r => r.data),
  actualizar: (id, data) => api.put(`/v1/usuarios/${id}`, data).then(r => r.data),
  listar: () => api.get('/v1/usuarios').then(r => r.data),
};

export default usuarioService;
