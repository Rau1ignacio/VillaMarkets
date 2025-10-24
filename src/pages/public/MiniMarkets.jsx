// src/pages/Minimarkets.jsx
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

/* =========================
   Datos base
========================= */
const comunasPorRegion = {
  metropolitana: ["santiago", "maipu", "las condes", "providencia"],
  valparaiso: ["valparaiso", "viña del mar", "quilpue", "villa alemana"],
  biobio: ["concepcion", "chiguayante", "coronel", "hualpen"],
};

const nombresComuna = {
  santiago: "Santiago",
  maipu: "Maipú",
  las_condes: "Las Condes",
  providencia: "Providencia",
  valparaiso: "Valparaíso",
  viña_del_mar: "Viña del Mar",
  quilpue: "Quilpué",
  villa_alemana: "Villa Alemana",
  concepcion: "Concepción",
  chiguayante: "Chiguayante",
  coronel: "Coronel",
  hualpen: "Hualpén",
};

// Dataset de ejemplo de minimarkets (puedes cambiarlo por tu fuente real)
const MARKETS = [
  { id: "M001", nombre: "Villa Central", region: "metropolitana", comuna: "santiago", direccion: "Av. Central 123", abierto: true,  horario: "8:00–21:00" },
  { id: "M002", nombre: "Villa Norte",   region: "metropolitana", comuna: "providencia", direccion: "Av. Norte 456", abierto: true,  horario: "8:00–21:00" },
  { id: "M003", nombre: "Villa Sur",     region: "metropolitana", comuna: "maipu", direccion: "Av. Sur 789", abierto: false, horario: "9:00–20:00" },
  { id: "VPA1", nombre: "Costa Valpo",   region: "valparaiso",    comuna: "valparaiso", direccion: "Cerro Alegre 12", abierto: true, horario: "9:00–20:00" },
  { id: "VPA2", nombre: "Viña Centro",   region: "valparaiso",    comuna: "viña del mar", direccion: "Av. Perú 100", abierto: true, horario: "8:30–21:00" },
  { id: "BIO1", nombre: "BioBío Mall",   region: "biobio",        comuna: "concepcion", direccion: "O'Higgins 500", abierto: false, horario: "10:00–20:00" },
];

/* =========================
   Helpers
========================= */
const titleCase = (s) =>
  s.replace(/\S+/g, (w) => w[0].toUpperCase() + w.slice(1));

const prettyComuna = (raw) =>
  nombresComuna[raw.replace(/ /g, "_")] || titleCase(raw);

const updateCartBadge = () => {
  const el = document.getElementById("cart-count");
  if (!el) return;
  try {
    const cart = JSON.parse(localStorage.getItem("carritoVillaMarket") || "[]");
    el.textContent = cart.reduce((t, i) => t + (i.cantidad || 0), 0);
  } catch {
    el.textContent = "0";
  }
};

/* =========================
   Componente
========================= */
export default function Minimarkets() {
  const [region, setRegion] = useState("todas");
  const [comuna, setComuna] = useState("todas");

  // comunas disponibles en el selector según la región
  const comunasOpciones = useMemo(() => {
    if (region === "todas") return [];
    return comunasPorRegion[region] || [];
  }, [region]);

  // lista filtrada
  const list = useMemo(() => {
    return MARKETS.filter((m) => {
      if (region !== "todas" && m.region !== region) return false;
      if (comuna !== "todas" && m.comuna !== comuna) return false;
      return true;
    });
  }, [region, comuna]);

  useEffect(() => {
    updateCartBadge();
  }, []);

  // Cuando cambia la región, resetea comuna a "todas"
  useEffect(() => {
    setComuna("todas");
  }, [region]);

  //---------------------------------------------------------------------------------------------------------
  // Encontrar cercano (demo):
  // - Si hay geolocalización, intentamos una heurística simple:
  //   si el usuario está en Santiago (aprox), escogemos uno de esa comuna.
  // - Si no hay permisos, tomamos el primero del filtro o cualquiera.
  const encontrarCercano = () => {
    const pick = (arr) => (arr.length ? arr[0] : MARKETS[0]);
    if (!navigator.geolocation) {
      const sel = pick(list);
      window.alert(`Mini market cercano (aprox.): ${sel.nombre} – ${prettyComuna(sel.comuna)}`);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lon } = pos.coords;
        // Heurística MUY simple: radios aproximados (solo demo)
        const isStgo = lat < -33 && lat > -34 && lon < -70 && lon > -71;
        let candidatos = MARKETS;
        if (isStgo) candidatos = MARKETS.filter((m) => m.comuna === "santiago");
        const sel = pick(candidatos);
        window.alert(`Mini market cercano (aprox.): ${sel.nombre} – ${prettyComuna(sel.comuna)}\n(${sel.direccion})`);
      },
      () => {
        const sel = list.length ? list[0] : MARKETS[0];
        window.alert(`Mini market cercano (aprox.): ${sel.nombre} – ${prettyComuna(sel.comuna)}`);
      },
      { enableHighAccuracy: false, maximumAge: 60_000, timeout: 5_000 }
    );
  };
  //---------------------------------------------------------------------------------------------------------
  // HTML ---------------------------------------------------------------------------------------------------------------------------s
  return (
    <div className="container py-4">
      <h1 className="text-green mb-4">Encuentra tu Mini Market más cercano</h1>

      {/* Buscador */}
      <div className="search-container">
        <div className="row">
          <div className="col-md-5 mb-3">
            <label htmlFor="region" className="form-label">Región</label>
            <select
              id="region"
              className="form-select"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
            >
              <option value="todas">Todas las regiones</option>
              <option value="metropolitana">Metropolitana</option>
              <option value="valparaiso">Valparaíso</option>
              <option value="biobio">Biobío</option>
            </select>
          </div>

          <div className="col-md-4 mb-3">
            <label htmlFor="comuna" className="form-label">Comuna</label>
            <select
              id="comuna"
              className="form-select"
              value={comuna}
              onChange={(e) => setComuna(e.target.value)}
              disabled={region === "todas"}
            >
              <option value="todas">Todas las comunas</option>
              {comunasOpciones.map((c) => (
                <option key={c} value={c}>
                  {prettyComuna(c)}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3 d-flex align-items-end">
            <button className="btn btn-green w-100" onClick={encontrarCercano}>
              <i className="fas fa-location-arrow me-1" /> Encontrar cercano
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div className="row">
        {/* Lista */}
        <div className="col-md-4 mb-4">
          <h3 className="mb-3">Mini Markets Disponibles</h3>
          <div className="market-list" id="lista-minimarkets">
            {list.length === 0 && (
              <div className="text-muted small">No hay resultados para el filtro seleccionado.</div>
            )}
            {list.map((m) => (
              <div className="market-card" key={m.id}>
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <div className="market-title">{m.nombre}</div>
                    <div className="market-meta">
                      <i className="fas fa-location-dot me-1" />
                      {prettyComuna(m.comuna)} — {m.direccion}
                      <br />
                      <i className="fas fa-clock me-1" />
                      {m.horario}
                    </div>
                  </div>
                  <span className={`badge ${m.abierto ? "badge-open" : "badge-closed"}`}>
                    {m.abierto ? "Abierto" : "Cerrado"}
                  </span>
                </div>

                <div className="market-actions">
                  <NavLink to={`/productos?minimarket=${encodeURIComponent(m.nombre)}`} className="btn btn-sm btn-green">
                    Ver catálogo
                  </NavLink>
                  <button
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => window.alert(`${m.nombre}\n${m.direccion}\n${prettyComuna(m.comuna)}`)}
                  >
                    Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mapa (imagen de fallback) */}
        <div className="col-md-8 mb-4">
          <div className="map-container shadow-sm rounded">
            {/* Si luego integras Leaflet, reemplaza por <div id="mapa" /> */}
            <img
              src="/img/MapaDuoc.png"
              alt="Mapa de minimarkets"
              className="w-100 mb-6 rounded"
              style={{ maxHeight: 300, objectFit: "cover" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
