import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

export default function Home() {
  // Inicializa tooltips si los usas en la página
  useEffect(() => {
    if (window.bootstrap) {
      document
        .querySelectorAll('[data-bs-toggle="tooltip"]')
        .forEach((el) => new window.bootstrap.Tooltip(el));
    }
  }, []);

  const destacados = [
    { name: "Mini Market Centro", loc: "Santiago Centro, RM" },
    { name: "Mini Market El Bosque", loc: "El Bosque, RM" },
    { name: "Mini Market Las Condes", loc: "Las Condes, RM" },
  ];

  const ofertas = [
    { t: "2x1 en Arroz", tag: "Hoy", price: "—", color: "danger" },
    { t: "Leche a $1.000", tag: "Top", price: "$1.000", color: "success" },
    { t: "20% off en Frutas", tag: "-20%", price: "—", color: "warning" },
    { t: "Pan Integral 2x1", tag: "Nuevo", price: "—", color: "info" },
  ];

  return (
    <div className="home-bg">
      {/* H E R O */}
      <section className="home-hero container-xxl py-5">
        <div className="row align-items-center g-5">
          {/* Texto principal */}
          <div className="col-12 col-lg-6">
            <span className="badge bg-gradient text-white fw-semibold mb-3 px-3 py-2 fs-6 shadow-sm" style={{background: "linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)"}}>
              <i className="fas fa-leaf me-2" /> Compra local, apoya tu barrio
            </span>
            <h1 className="display-4 fw-bold mb-3 text-green">
              <span className="text-gradient">VillaMarkets</span>: Tu mercado <span className="d-inline d-lg-block">a la vuelta de la esquina</span>
            </h1>
            <p className="lead text-secondary mb-4">
              Descubre los mejores minimarkets cerca de ti, compara productos y recibe en minutos. ¡Fácil, rápido y seguro!
            </p>
            <div className="d-flex flex-wrap gap-3 mb-4">
              <NavLink to="/minimarkets" className="btn btn-green btn-lg px-4 shadow-sm">
                <i className="fas fa-store me-2" />
                Explorar Mini Markets
              </NavLink>
              <NavLink to="/productos" className="btn btn-outline-secondary btn-lg px-4">
                <i className="fas fa-basket-shopping me-2" />
                Ver Catálogo
              </NavLink>
            </div>
            {/* Stats */}
            <div className="d-flex flex-wrap gap-4 mt-3">
              <div className="stat d-flex align-items-center gap-2">
                <span className="stat-icon bg-success-subtle text-success-emphasis rounded-circle d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
                  <i className="fas fa-clock fs-5" />
                </span>
                <div>
                  <strong>Rápido</strong>
                  <div className="small text-muted">Entrega desde 30 min</div>
                </div>
              </div>
              <div className="stat d-flex align-items-center gap-2">
                <span className="stat-icon bg-info-subtle text-info-emphasis rounded-circle d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
                  <i className="fas fa-shield-check fs-5" />
                </span>
                <div>
                  <strong>Seguro</strong>
                  <div className="small text-muted">Pago al recibir o anticipado</div>
                </div>
              </div>
              <div className="stat d-flex align-items-center gap-2">
                <span className="stat-icon bg-warning-subtle text-warning-emphasis rounded-circle d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
                  <i className="fas fa-seedling fs-5" />
                </span>
                <div>
                  <strong>Fresco</strong>
                  <div className="small text-muted">Productos locales</div>
                </div>
              </div>
            </div>
          </div>
          {/* Imagen lateral */}
          <div className="col-12 col-lg-6 text-center">
            <div className="position-relative d-inline-block">
              <img
                src="./src/images/Logos/Logotipo Transparente.png"
                onError={(e)=>{e.currentTarget.style.display='none';}}
                alt="Compra en tu barrio"
                className="hero-illustration rounded-4 shadow-lg"
                width="480"
                height="380"
                style={{background: "linear-gradient(135deg, #e0ffe9 0%, #f0faff 100%)", padding: "1.5rem"}}
              />
              {/* Círculo decorativo */}
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-success-subtle shadow" style={{width: 48, height: 48, zIndex: 1, left: "90%", top: "-24px"}}>
                <i className="fas fa-bolt text-success fs-4" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* F E A T U R E S */}
      <section className="container-xxl py-5">
        <div className="row g-4">
          {[
            {
              icon: "fa-location-dot",
              title: "Cercanía",
              text: "Encuentra los mejores mini markets cerca de ti.",
            },
            {
              icon: "fa-basket-shopping",
              title: "Calidad",
              text: "Productos frescos y de confianza.",
            },
            {
              icon: "fa-truck-fast",
              title: "Entrega express",
              text: "Recibe en la puerta de tu casa.",
            },
          ].map((f, i) => (
            <div className="col-12 col-md-4" key={i}>
              <div className="card feature shadow-sm h-100 border-0">
                <div className="card-body d-flex align-items-start gap-3">
                  <div className="feature-icon bg-success-subtle text-success-emphasis rounded-circle d-flex align-items-center justify-content-center" style={{width: 48, height: 48}}>
                    <i className={`fas ${f.icon} fs-4`} />
                  </div>
                  <div>
                    <h3 className="h5 mb-1">{f.title}</h3>
                    <p className="mb-0 text-secondary">{f.text}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* M I N I M A R K E T S  D E S T A C A D O S */}
      <section className="container-xxl py-5">
        <div className="d-flex align-items-center justify-content-between mb-3">
          <h2 className="h3 fw-bold mb-0">Mini Markets destacados</h2>
          <NavLink to="/minimarkets" className="btn btn-outline-success btn-sm">
            Ver todos
          </NavLink>
        </div>

        <div className="row g-4">
          {destacados.map((m, i) => (
            <div className="col-12 col-md-6 col-lg-4" key={i}>
              <div className="market-card card h-100 shadow-sm border-0">
                <div className="card-body">
                  <div className="d-flex align-items-start justify-content-between">
                    <h3 className="h5 mb-1">{m.name}</h3>
                    <span className="badge rounded-pill bg-success-subtle text-success-emphasis">
                      <i className="fas fa-star me-1" /> Top
                    </span>
                  </div>
                  <p className="text-muted small mb-3">
                    <i className="fas fa-location-dot me-1" />
                    {m.loc}
                  </p>
                  <NavLink to="/minimarkets" className="btn btn-green btn-sm">
                    Ver ubicación
                  </NavLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* O F E R T A S */}
      <section className="container-xxl py-5">
        <h2 className="h3 fw-bold mb-3">Ofertas destacadas</h2>
        <div className="row g-4">
          {ofertas.map((o, i) => (
            <div className="col-12 col-sm-6 col-lg-3" key={i}>
              <div className="offer card h-100 shadow-sm border-0">
                <div className="card-body text-center">
                  <span className={`badge bg-${o.color} mb-2`}>{o.tag}</span>
                  <h5 className="mb-1">{o.t}</h5>
                  {o.price !== "—" && (
                    <p className="text-danger fw-bold mb-0">{o.price}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
