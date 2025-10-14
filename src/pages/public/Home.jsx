// src/pages/Home.jsx
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

// Si usas tooltips de Bootstrap:
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // asegura tooltips/popovers

export default function Home() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [order, setOrder] = useState("");
  const [invalidMsg, setInvalidMsg] = useState("");

  // Inicializar tooltips al montar
  useEffect(() => {
    if (window.bootstrap) {
      const tooltipTriggerList = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      tooltipTriggerList.forEach(
        (el) => new window.bootstrap.Tooltip(el)
      );
    }
  }, []);

  const pattern = /^([A-Z]+-\d+-\d+)|(P-\d+)$/; // VM-XXXXXX-XXX o P-XXXXX

  const handleSearch = () => {
    if (!pattern.test(order.trim())) {
      setInvalidMsg(
        "Formato inválido. Usa VM-123456-789 o P-12345."
      );
      // activar estilo de invalid nativo
      inputRef.current?.classList.add("is-invalid");
      return;
    }
    // limpiar error y navegar a tu ruta de tracking (ajusta a tu app)
    inputRef.current?.classList.remove("is-invalid");
    setInvalidMsg("");
    navigate(`/pedidos/track/${order.trim()}`);
  };

  return (
    
    <div className="d-flex flex-column min-vh-100">
      {/* H E R O */}
      <section className="hero-section">
        <div className="container text-center">
          <h1 className="display-4 fw-bold mb-3 text-green">
            Bienvenido a Villa Markets
          </h1>
          <p className="lead mb-4">
            Tu plataforma para descubrir y comprar en Mini Markets locales.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <NavLink to="/minimarkets" className="btn btn-green btn-lg">
              Explorar Mini Markets
            </NavLink>
            <NavLink to="/catalogo" className="btn btn-outline-secondary btn-lg">
              Ver Productos
            </NavLink>
          </div>
        </div>
      </section>

      {/* F E A T U R E S */}
      <section className="container mb-5">
        <h2 className="text-center mb-4">¿Qué ofrecemos?</h2>
        <div className="row">
          <div className="col-md-4">
            <div className="card feature-card">
              <div className="card-body text-center">
                <h3 className="card-title h5 text-green">Variedad de Minimarkets</h3>
                <p className="card-text">
                  Encuentra los mejores mini markets cerca de ti en Chile.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card feature-card">
              <div className="card-body text-center">
                <h3 className="card-title h5 text-green">Productos Frescos</h3>
                <p className="card-text">
                  Accede a productos frescos y de calidad desde donde estés.
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card feature-card">
              <div className="card-body text-center">
                <h3 className="card-title h5 text-green">Entrega Rápida</h3>
                <p className="card-text">
                  Recibe tus productos en la puerta de tu casa en tiempo récord.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* M I N I M A R K E T S  D E S T A C A D O S */}
      <section className="minimarkets-section mb-5">
        <div className="container">
          <h2 className="text-center mb-4">Mini Markets Destacados</h2>
          <div className="row">
            {[
              { name: "Mini Market Centro", loc: "Santiago Centro, Santiago" },
              { name: "Mini Market El Bosque", loc: "El Bosque, Santiago" },
              { name: "Mini Market Las Condes", loc: "Las Condes, Santiago" },
            ].map((mkt, i) => (
              <div className="col-md-4 mb-3" key={i}>
                <div className="market-item">
                  <h3 className="h5">{mkt.name}</h3>
                  <p className="text-muted small">{mkt.loc}</p>
                  <NavLink to="/minimarkets" className="btn btn-sm btn-green">
                    Ver ubicación
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* O F E R T A S */}
      <section className="container mb-5">
        <h2 className="text-center mb-4">Ofertas Destacadas</h2>
        <div className="row">
          {[
            { t: "2x1 en Arroz" },
            { t: "Leche a $1.000" },
            { t: "20% off en Frutas" },
            { t: "Pan Integral 2x1" },
          ].map((o, i) => (
            <div className="col-md-3 mb-3" key={i}>
              <div className="card feature-card">
                <div className="card-body text-center">
                  <h5>{o.t}</h5>
                  <p className="text-danger fw-bold">¡Oferta por tiempo limitado!</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* S E G U I M I E N T O  D E  P E D I D O S */}
      <section className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm tracking-section">
              <div className="card-body">
                <h3 className="text-center mb-4">Seguimiento de pedidos</h3>

                <div className="row">
                  <div className="col-md-8">
                    <div className="tracking-form mb-3">
                      <label htmlFor="pedido-numero" className="form-label" id="pedido-label">
                        Número de pedido
                      </label>

                      <div className="input-group has-validation">
                        <span className="input-group-text" id="basic-addon1" aria-hidden="true">
                          <i className="fas fa-search" />
                        </span>

                        <input
                          ref={inputRef}
                          type="text"
                          id="pedido-numero"
                          className="form-control"
                          placeholder="Ej: VM-123456-789 o P-12345"
                          aria-describedby="pedidoHelp pedido-feedback"
                          aria-labelledby="pedido-label"
                          aria-required="true"
                          value={order}
                          onChange={(e) => setOrder(e.target.value)}
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Ingresa el número de pedido en formato VM-XXXXXX-XXX o P-XXXXX"
                        />

                        <button
                          id="buscar-pedido-btn"
                          className="btn btn-green"
                          type="button"
                          aria-label="Buscar pedido"
                          onClick={handleSearch}
                        >
                          Buscar
                        </button>

                        <div id="pedido-feedback" className="invalid-feedback" aria-live="polite">
                          {invalidMsg}
                        </div>
                      </div>

                      <div id="pedidoHelp" className="form-text">
                        Ingresa el número de pedido que recibiste en tu confirmación
                      </div>
                    </div>
                  </div>

                  <div className="col-md-4 text-end">
                    <NavLink to="/pedidos" className="btn btn-outline-secondary">
                      <i className="fas fa-list me-1" /> Ver todos mis pedidos
                    </NavLink>
                  </div>
                </div>
                {/* /row */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* El footer lo aporta tu Layout principal */}
    </div>
  );
}
