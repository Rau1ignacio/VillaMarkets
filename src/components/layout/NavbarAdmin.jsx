import { NavLink, useNavigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../../images/Logos/Logotipo Transparente.png";

export default function NavbarAdmin() {
  const navigate = useNavigate();

  // Obtener información del admin desde localStorage
  const getAdminInfo = () => {
    try {
      const user = JSON.parse(localStorage.getItem("usuarioActual"));
      return user?.rol === "admin" ? user : null;
    } catch {
      return null;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("usuarioActual");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-success shadow-sm sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/admin">
          <img
            src={logo}
            alt="Panel Administrativo"
            width="40"
            height="40"
            className="rounded bg-white p-1"
            onError={(e) => { e.currentTarget.src = "/img/logo-fallback.svg" }}
          />
          Panel Admin
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuAdmin"
          aria-controls="menuAdmin"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuAdmin">
          {/* Links principales */}
          <ul className="navbar-nav me-auto">

            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/reportes">
                <i className="fas fa-chart-line me-2"></i>Reportes
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/gestion-Productos">
                <i className="fas fa-shopping-bag me-2"></i>Gestion Productos
              </NavLink>
            </li>


            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/gestion-usuarios">
                <i className="fas fa-users me-2"></i>Gestion Usuarios
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/admin/Tiendas">
                <i className="fas fa-store me-2"></i>Minimarkets
              </NavLink>
            </li>
          </ul>

          {/* Admin info & logout */}
          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle d-flex align-items-center gap-2" href="#" role="button" data-bs-toggle="dropdown">
                <span className="bg-white text-success rounded-circle d-flex align-items-center justify-content-center" style={{width: 32, height: 32}}>
                  <i className="fas fa-user-shield"></i>
                </span>
                <span>Administrador</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li><NavLink className="dropdown-item" to="/admin/perfil">Mi Perfil</NavLink></li>
                <li><NavLink className="dropdown-item" to="/admin/configuracion">Configuración</NavLink></li>
                <li><hr className="dropdown-divider"/></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
