
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";



 const minimarketsData = [
  {
    id: 1,
    nombre: "Villa Market Centro",
    direccion: "Av. Libertador Bernardo O'Higgins 1234, Santiago",
    region: "metropolitana",
    comuna: "santiago",
    coordenadas: [-33.4489, -70.6693],
    horario: "08:00 - 22:00",
    abierto: true,
    telefono: "+56 2 2123 4567",
    imagen:
      "https://images.unsplash.com/photo-1604719312566-8912e9227c6a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productos: []
  },
  {
    id: 2,
    nombre: "Villa Market Providencia",
    direccion: "Av. Providencia 1760, Providencia",
    region: "metropolitana",
    comuna: "providencia",
    coordenadas: [-33.4288, -70.6264],
    horario: "07:30 - 23:00",
    abierto: true,
    telefono: "+56 2 2234 5678",
    imagen:
      "https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productos: []
  },
  {
    id: 3,
    nombre: "Villa Market Las Condes",
    direccion: "Av. Apoquindo 3990, Las Condes",
    region: "metropolitana",
    comuna: "las_condes",
    coordenadas: [-33.4146, -70.5838],
    horario: "08:00 - 21:00",
    abierto: true,
    telefono: "+56 2 2345 6789",
    imagen:
      "https://images.unsplash.com/photo-1528698827591-e19ccd7bc23d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productos: []
  },
  {
    id: 4,
    nombre: "Villa Market El Bosque",
    direccion: "Gran Avenida 5462, El Bosque",
    region: "metropolitana",
    comuna: "el_bosque",
    coordenadas: [-33.5667, -70.6747],
    horario: "08:30 - 20:00",
    abierto: false,
    telefono: "+56 2 2456 7890",
    imagen:
      "https://images.unsplash.com/photo-1601600576337-c1d8a0d0c2c9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productos: []
  },
  {
    id: 5,
    nombre: "Villa Market Viña del Mar",
    direccion: "Av. Valparaíso 218, Viña del Mar",
    region: "valparaiso",
    comuna: "viña_del_mar",
    coordenadas: [-33.0246, -71.5518],
    horario: "09:00 - 22:00",
    abierto: true,
    telefono: "+56 32 234 5678",
    imagen:
      "https://images.unsplash.com/photo-1568254183919-78a4f43a2877?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productos: [{ id: 201, nombre: "Pan de la casa", imagen: "https://via.placeholder.com/50.png?text=Pan", precio: 1500 }]
  },
  {
    id: 6,
    nombre: "Villa Market Concepción",
    direccion: "O'Higgins 567, Concepción",
    region: "biobio",
    comuna: "concepcion",
    coordenadas: [-36.8261, -73.0498],
    horario: "08:00 - 21:00",
    abierto: true,
    telefono: "+56 41 234 5678",
    imagen:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    productos: []
  }
];

const comunasPorRegion = {
  metropolitana: ["santiago", "providencia", "las_condes", "el_bosque"],
  valparaiso: ["viña_del_mar", "valparaiso", "quilpue"],
  biobio: ["concepcion", "talcahuano", "chiguayante"]
};

const nombresComuna = {
  santiago: "Santiago Centro",
  providencia: "Providencia",
  las_condes: "Las Condes",
  el_bosque: "El Bosque",
  viña_del_mar: "Viña del Mar",
  valparaiso: "Valparaíso",
  quilpue: "Quilpué",
  concepcion: "Concepción",
  talcahuano: "Talcahuano",
  chiguayante: "Chiguayante"
};

function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const toRad = (v) => (v * Math.PI) / 180;
  const R = 6371; // km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}
// funcion principal del componente Minimarket
export default function Minimarket() {
  const mapaRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [markets, setMarkets] = useState(minimarketsData);
  const [selected, setSelected] = useState(null);
  const [region, setRegion] = useState("todas");
  const [comuna, setComuna] = useState("todas");
  // const [userPos, setUserPos] = useState(null);
  const [nearest, setNearest] = useState(null);

  useEffect(() => {
    // inicializar mapa solo una vez
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapaRef.current).setView([-33.45, -70.65], 11);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
      showMarketsOnMap(markets);
    }
    // limpiar marcadores y volver a dibujar si markets cambia
    showMarketsOnMap(markets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markets]);
  // funcion para mostrar los minimarkets en el mapa
  function showMarketsOnMap(list) {
    const map = mapInstanceRef.current;
    if (!map) return;
    // remover marcadores previos
    markersRef.current.forEach((m) => map.removeLayer(m));
    markersRef.current = [];
/// agregar nuevos marcadores
    list.forEach((mkt) => {
      const marker = L.marker(mkt.coordenadas);
      marker.addTo(map);
      marker.on("click", () => selectMarket(mkt.id));
      marker.bindPopup(`<strong>${mkt.nombre}</strong><br/>${mkt.direccion}`);
      markersRef.current.push(marker);
    });

    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }
  }
  /// seleccionar un minimarket y centrar el mapa en el
  function selectMarket(id) {
    const m = minimarketsData.find((x) => x.id === id) || markets.find((x) => x.id === id);
    if (!m) return;
    setSelected(m);
    const map = mapInstanceRef.current;
    if (map) {
      map.setView(m.coordenadas, 15);
      const marker = markersRef.current.find((mk) => {
        const latlng = mk.getLatLng();
        return latlng.lat === m.coordenadas[0] && latlng.lng === m.coordenadas[1];
      });
      if (marker) marker.openPopup();
    }
  }
/// manejar cambio de region en el selector
  function handleRegionChange(e) {
    const r = e.target.value;
    setRegion(r);
    setComuna("todas");
    // actualizar comunas se hace en el render del selector
    filterMarkets(r, "todas");
  }

  function handleComunaChange(e) {
    const c = e.target.value;
    setComuna(c);
    filterMarkets(region, c);
  }

// filtrar minimarkets segun region y comuna
  function filterMarkets(r, c) {
    let result = [...minimarketsData];
    if (r && r !== "todas") result = result.filter((m) => m.region === r);
    if (c && c !== "todas") result = result.filter((m) => m.comuna === c);
    setMarkets(result);
    if (result.length === 0) {
      setSelected(null);
    } else if (selected && !result.some((x) => x.id === selected.id)) {
      setSelected(null);
    }
  }

// encontrar minimarket mas cercano a la ubicacion del usuario
  function encontrarCercano() {
    if (!navigator.geolocation) {
      alert("Geolocalización no disponible en este navegador.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const user = [pos.coords.latitude, pos.coords.longitude];
        // setUserPos(user);
        let best = null;
        minimarketsData.forEach((m) => {
          const dist = haversineDistance(user, m.coordenadas);
          if (!best || dist < best.distance) best = { ...m, distance: dist };
        });
        setNearest(best);
        if (best) selectMarket(best.id);
      },
      (err) => {
        console.warn("Error geolocalización:", err);
        alert("No se pudo obtener la ubicación.");
      }
    );
  }
  /// compartir ubicación del minimarket seleccionado
  function compartirUbicacion(mkt) {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${mkt.coordenadas[0]},${mkt.coordenadas[1]}`;
    if (navigator.share) {
      navigator.share({
        title: `Ruta a ${mkt.nombre}`,
        text: `Ir a ${mkt.nombre} - ${mkt.direccion}`,
        url
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(url).then(
        () => alert("Enlace copiado al portapapeles"),
        () => alert("No se pudo copiar el enlace")
      );
    }
  }

  return (
    <div className="container py-4">
      <h1 className="text-green mb-4">Encuentra tu Mini Market más cercano</h1>

      <div className="search-container mb-3 p-3">
        <div className="row g-2">
          <div className="col-md-4">
            <label className="form-label">Región</label>
            <select className="form-select" id="region" value={region} onChange={handleRegionChange}>
              <option value="todas">Todas las regiones</option>
              <option value="metropolitana">Metropolitana</option>
              <option value="valparaiso">Valparaíso</option>
              <option value="biobio">Biobío</option>
            </select>
          </div>
          <div className="col-md-4">
            <label className="form-label">Comuna</label>
            <select className="form-select" id="comuna" value={comuna} onChange={handleComunaChange}>
              <option value="todas">Todas las comunas</option>
              {region === "todas" &&
                Object.values(comunasPorRegion)
                  .flat()
                  .map((c) => (
                    <option key={c} value={c}>
                      {nombresComuna[c] || c}
                    </option>
                  ))}
              {region !== "todas" &&
                (comunasPorRegion[region] || []).map((c) => (
                  <option key={c} value={c}>
                    {nombresComuna[c] || c}
                  </option>
                ))}
            </select>
          </div>
          <div className="col-md-4 d-flex align-items-end">
            <button className="btn btn-green w-100" onClick={encontrarCercano}>
              Encontrar cercano
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <h3 className="mb-3">Mini Markets Disponibles</h3>
          <div style={{ maxHeight: 500, overflowY: "auto" }}>
            {markets.length === 0 && <div className="text-muted">No hay minimarkets</div>}
            {markets.map((m) => (
              <div
                key={m.id}
                onClick={() => selectMarket(m.id)}
                className={`market-item p-2 mb-2 ${selected?.id === m.id ? "active" : ""}`}
                style={{
                  borderRadius: 8,
                  cursor: "pointer",
                  background: selected?.id === m.id ? "#f0f9f1" : "transparent",
                  border: selected?.id === m.id ? "2px solid #2d8f3c" : "1px solid rgba(0,0,0,0.04)"
                }}
              >
                <div className="d-flex gap-2 align-items-center">
                  <img src={m.imagen} alt={m.nombre} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8 }} />
                  <div>
                    <strong>{m.nombre}</strong>
                    <div className="small text-muted">{nombresComuna[m.comuna] || m.comuna}</div>
                    <div className="small">{m.horario} • {m.abierto ? <span className="badge bg-success">Abierto</span> : <span className="badge bg-danger">Cerrado</span>}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/*  Mapa de localizacion  */}
        <div className="col-md-8 mb-4">
          <div className="map-container mb-3" style={{ height: 500, borderRadius: 10, overflow: "hidden" }}>
            <div id="mapa" ref={mapaRef} style={{ height: "100%", width: "100%" }} />
          </div>

          <div id="detalles-minimarket">
            {selected ? (
              <div className="market-card p-3 d-flex gap-3" style={{ borderRadius: 10, boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}>
                <img src={selected.imagen} alt={selected.nombre} style={{ width: 160, height: 120, objectFit: "cover", borderRadius: 8 }} />
                <div className="flex-grow-1">
                  <h4>{selected.nombre} {selected.abierto ? <span className="badge badge-open">Abierto</span> : <span className="badge badge-closed">Cerrado</span>}</h4>
                  <p className="mb-1">{selected.direccion}</p>
                  <p className="mb-1 small text-muted">Horario: {selected.horario} • Tel: {selected.telefono}</p>
                  <div className="d-flex gap-2 mt-2">
                    <a className="btn btn-outline-secondary" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/dir/?api=1&destination=${selected.coordenadas[0]},${selected.coordenadas[1]}`}>
                      Ir
                    </a>
                    <button className="btn btn-secondary" onClick={() => compartirUbicacion(selected)}>
                      Compartir
                    </button>
                  </div>
                </div>
                <div style={{ minWidth: 120 }}>
                  {nearest && nearest.id === selected.id && <div className="text-success">Más cercano • {nearest.distance.toFixed(2)} km</div>}
                  <div className="mt-2 small text-muted">Productos destacados</div>
                  <div className="product-scroll mt-2" style={{ display: "flex", gap: 12, overflowX: "auto" }}>
                    {(selected.productos.length === 0 ? [{ id: "p-empty", nombre: "Sin productos" }] : selected.productos).map((p) => (
                      <div key={p.id} className="product-card p-2" style={{ minWidth: 120 }}>
                        <img src={p.imagen || "https://via.placeholder.com/50"} alt={p.nombre || "Producto"} />
                        <div className="small">{p.nombre || "Sin nombre"}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-3 text-muted">Selecciona un minimarket para ver detalles</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}