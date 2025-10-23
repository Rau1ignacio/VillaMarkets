import { NavLink } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import logo from "../../images/Logos/Logotipo Transparente.png"; // dinamioca importacion de imagenes

export default function Navbar({
  brandName = "Villa Markets",
  cartCount = 0,
}) {
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
          data-bs-toggle="collapse"
          data-bs-target="#nav"
          aria-controls="nav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div id="nav" className="collapse navbar-collapse">
          <ul id="menu-opciones" className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/">Inicio</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/minimarkets">Minimarkets</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/productos">Catálogo</NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className="nav-link position-relative"
                to="/carrito"
                aria-label="Carrito"
              >
                <i className="fas fa-shopping-cart" />
                <span
                  id="cart-count"
                  className="badge rounded-pill bg-danger cart-badge"
                  style={{ marginLeft: 6 }}
                >
                  {cartCount}
                </span>
              </NavLink>
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
