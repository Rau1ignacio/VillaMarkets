import { NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../../images/Logos/Logotipo Transparente.png"; // dinamioca importacion de imagenes
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Navbar({
  brandName = "Villa Markets",
  brandLogo = "./src/images/Logos/Logotipo Transparente.png",
  cartCount = 0,
}) {
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
        <NavLink className="navbar-brand fw-bold d-flex align-items-center gap-2" to="/">
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

          <ul id="menu-opciones" className="navbar-nav ms-auto">

            <li className="nav-item">
              <NavLink className="nav-link" to="/">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/minimarket">Minimarkets</NavLink>
            </li>

            {/* Este catalogo no esta conectado con el /productos de cliente. || solo es de
            muestra. porque debe haber un cliente conectado para hacer pedido y ver el catalogo real*/}
            <li className="nav-item">
              <NavLink className="nav-link" to="/productos">Catálogo</NavLink>
            </li>
    
            <li className="nav-item">
              <NavLink className="nav-link" to="/login">Iniciar sesión</NavLink>
            </li>

            <li className="nav-item">
              <NavLink className="nav-link" to="/registro">Registrarse</NavLink>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
  
}
