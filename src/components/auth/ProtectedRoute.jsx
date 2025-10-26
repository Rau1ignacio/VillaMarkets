import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = ['cliente'] }) => {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || '{}');
  
  // Si no hay usuario o no tiene rol, redirigir al login
  if (!usuarioActual || !usuarioActual.rol) {
    return <Navigate to="/login" replace />;
  }

  // Si el rol del usuario no está en los roles permitidos, redirigir a la página principal
  if (!allowedRoles.includes(usuarioActual.rol)) {
    return <Navigate to="/" replace />;
  }

  // Si todo está bien, mostrar el contenido protegido
  return children;
};

export default ProtectedRoute;