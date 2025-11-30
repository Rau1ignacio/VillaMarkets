import api from './api';

const registroService = {
  /**
   * Registra un usuario en el backend
   * @param {Object} userData - Datos del usuario
   * @returns {Promise}
   */
  registrar: (userData) => 
    api.post('/v1/usuarios/register', userData)
      .then(r => r.data)
      .catch(error => {
        console.error('Error en registro:', error.response?.data || error.message);
        throw error;
      })
};

export default registroService;
