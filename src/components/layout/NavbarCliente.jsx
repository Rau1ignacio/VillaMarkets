import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../../images/Logos/Logotipo Transparente.png";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function NavbarCliente({
  brandName = "Villa Markets",
  brandLogo = "./src/images/Logos/Logotipo Transparente.png",
  cartCount = 0,
}) {
  // Obtener información del usuario actual
  const usuarioActual = JSON.parse(localStorage.getItem("usuarioActual") || "{}");
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

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
      <div className="container">
        <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/clienteinicio">
          <img
            src={logo}
            alt={brandName}
            width="40"
            height="40"
            className="rounded"
          />
          {brandName}
        </NavLink>

        <button
          className="navbar-toggler"
          type="button"
          onClick={handleNavCollapse}
          aria-controls="navCliente"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navCliente">
          <ul className="navbar-nav ms-auto align-items-center">

            <li className="nav-item">
              <NavLink className="nav-link" to="/clienteinicio">
                <i className="fas fa-home me-1"></i>
                Inicio
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/clienteinicio/minimarket">
                <i className="fas fa-store me-1"></i>
                Minimarket
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/clienteinicio/producto">
                <i className="fas fa-store me-1"></i>
                Producto
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/clienteinicio/ofertas">
                <i className="fas fa-tag me-1"></i>
                Ofertas
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/clienteinicio/mis-pedidos">
                <i className="fas fa-box me-1"></i>
                Mis Pedidos
              </NavLink>
            </li>

            <li className="nav-item">
              <NavLink
                className="nav-link position-relative"
                to="/clienteinicio/micarrito"
                aria-label="Mi Carrito"
              >
                <i className="fas fa-shopping-cart" />
                {cartCount > 0 && (
                  <span
                    className="badge rounded-pill bg-danger cart-badge"
                    style={{ 
                      position: 'absolute',
                      top: '-5px',
                      right: '-10px',
                      fontSize: '0.7em'
                    }}
                  >
                    {cartCount}
                  </span>
                )}
              </NavLink>
            </li>

            {/* Menú de usuario */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle d-flex align-items-center gap-2"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-user-circle fa-lg"></i>
                <span>{usuarioActual.nombre || 'Mi Cuenta'}</span>
              </a>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <NavLink className="dropdown-item" to="/clienteinicio/perfil">
                    <i className="fas fa-user me-2"></i>
                    Mi Perfil
                  </NavLink>
                </li>
                <li>
                  <NavLink className="dropdown-item" to="/clienteinicio/mis-pedidos">
                    <i className="fas fa-shopping-bag me-2"></i>
                    Mis Compras
                  </NavLink>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <a
                    className="dropdown-item text-danger"
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      localStorage.removeItem("usuarioActual");
                      window.location.href = "/login";
                    }}
                  >
                    <i className="fas fa-sign-out-alt me-2"></i>
                    Cerrar Sesión
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
