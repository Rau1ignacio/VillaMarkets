import { NavLink } from "react-router-dom";

export default function Footer({

  brandName = "Villa Markets",
  tagline = "Tu plataforma para mini markets locales en todo Chile.",
  email = "contacto@villamarkets.cl",
  phone = "+56 9 1234 5678",
  year = new Date().getFullYear(),

}) {

  return (
    
    <footer className="bg-dark text-white py-4 mt-auto" role="contentinfo">
      <div className="container">
        <div className="row">
          {/* Branding */}
          <div className="col-md-4 mb-4 mb-md-0 text-center text-md-start">
            <h5 className="fw-bold">{brandName}</h5>
            <p className="mb-0">{tagline}</p>
          </div>

          {/* Enlaces rápidos */}
          <div className="col-md-4 mb-4 mb-md-0 text-center">
            <h5 className="fw-bold">Enlaces rápidos</h5>
            <ul className="list-unstyled mb-0">
              <li>
                <NavLink className="text-white text-decoration-none" to="/miniMarkets">
                  <i className="fas fa-store me-2" />
                  Minimarkets
                </NavLink>
              </li>
              <li>
                <NavLink className="text-white text-decoration-none" to="/productos">
                  <i className="fas fa-shopping-basket me-2" />
                  Catálogo
                </NavLink>
              </li>
              <li>
                <NavLink className="text-white text-decoration-none" to="/soporte">
                  <i className="fas fa-headset me-2" />
                  Soporte
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contacto */}
          <div className="col-md-4 text-center text-md-end">
            <h5 className="fw-bold">Contáctanos</h5>
            <p className="mb-1">
              <i className="fas fa-envelope me-2" />
              {email}
            </p>
            <p className="mb-0">
              <i className="fas fa-phone me-2" />
              {phone}
            </p>
          </div>
        </div>

        <hr className="my-3" />
        <p className="text-center small mb-0">
          © {year} {brandName}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
