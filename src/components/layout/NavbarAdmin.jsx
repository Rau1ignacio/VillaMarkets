import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../../images/Logos/Logotipo Transparente.png";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function NavbarAdmin({
  brandName = "Villa Markets Admin",
}) {
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  // Cerrar el menú cuando se hace clic en un enlace
  useEffect(() => {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        setIsNavCollapsed(true);
      });
    });
  }, []);

  // Obtener información del admin desde localStorage
  const adminInfo = JSON.parse(localStorage.getItem("usuarioActual") || "{}");

  const handleLogout = () => {
    localStorage.removeItem("usuarioActual");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/admin">
          <img
            src={logo}
            alt={brandName}
            width="40"
            height="40"
            className="rounded"
          />
          <span className="text-success">{brandName}</span>
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavCollapse}
          aria-controls="navAdmin"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navAdmin">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink 
                className={({isActive}) => `nav-link ${isActive ? 'active fw-bold' : ''}`} 
                to="/admin"
              >
                <i className="fas fa-home me-2"></i>Dashboard
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink 
                className={({isActive}) => `nav-link ${isActive ? 'active fw-bold' : ''}`}
                to="/admin/reportes"
              >
                <i className="fas fa-chart-line me-2"></i>Reportes
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink 
                className={({isActive}) => `nav-link ${isActive ? 'active fw-bold' : ''}`}
                to="/admin/gestion-productos"
              >
                <i className="fas fa-shopping-bag me-2"></i>Productos
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink 
                className={({isActive}) => `nav-link ${isActive ? 'active fw-bold' : ''}`}
                to="/admin/gestion-usuarios"
              >
                <i className="fas fa-users me-2"></i>Usuarios
              </NavLink>
            </li>
            
            <li className="nav-item">
              <NavLink 
                className={({isActive}) => `nav-link ${isActive ? 'active fw-bold' : ''}`}
                to="/admin/tiendas"
              >
                <i className="fas fa-store me-2"></i>Minimarkets
              </NavLink>
            </li>
          </ul>

          {/* Admin info & logout */}
          <ul className="navbar-nav ms-auto">
            <li className="nav-item dropdown">
              <a 
                className="nav-link dropdown-toggle d-flex align-items-center gap-2" 
                href="#" 
                role="button" 
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center" style={{width: 35, height: 35}}>
                  <i className="fas fa-user-shield"></i>
                </span>
                <span className="d-none d-sm-inline">{adminInfo.usuario || "Administrador"}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <h6 className="dropdown-header">
                    <i className="fas fa-id-badge me-2"></i>
                    {adminInfo.usuario || "Administrador"}
                  </h6>
                </li>
                <li><hr className="dropdown-divider"/></li>
                <li>
                  <NavLink className="dropdown-item" to="/admin/configuracion">
                    <i className="fas fa-cog me-2"></i>
                    Configuración
                  </NavLink>
                </li>
                <li>
                  <button 
                    className="dropdown-item text-danger" 
                    onClick={handleLogout}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Cerrar Sesión
                  </button>
                </li>
              </ul>
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
