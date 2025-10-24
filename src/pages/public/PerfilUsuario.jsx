// src/pages/PerfilUsuario.jsx
import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

/* =========================
   Utils
========================= */
const formatoCLP = (n) => Number(n || 0).toLocaleString("es-CL");

const getUsuarioActual = () => {
  try { return JSON.parse(localStorage.getItem("usuarioActual") || "null"); }
  catch { return null; }
};

const getPedidos = () => {
  try { return JSON.parse(localStorage.getItem("pedidosVillaMarkets") || "[]"); }
  catch { return []; }
};

const updateCartBadge = () => {
  const el = document.getElementById("cart-count");
  if (!el) return;
  try {
    const cart = JSON.parse(localStorage.getItem("carritoVillaMarket") || "[]");
    el.textContent = cart.reduce((t, i) => t + (i.cantidad || 0), 0);
  } catch { el.textContent = "0"; }
};

/* =========================
   Componentes auxiliares
========================= */
function PedidoCard({ p }) {
  const total = p?.totales?.total ?? 0;
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body d-flex flex-wrap gap-3 align-items-center">
        <div className="me-auto">
          <h6 className="mb-1">Pedido #{p.id}</h6>
          <small className="text-muted">
            {p.fecha} · {p.hora} · {p.estado || "Pendiente"}
          </small>
          <div className="small text-muted">
            {p.tipoEntrega === "recoger"
              ? `Retiro en: ${p.minimarket || "—"}`
              : `Delivery a ${p?.direccionEntrega?.comuna || "—"}`}
          </div>
        </div>
        <div className="text-end">
          <div className="fw-bold text-green">${formatoCLP(total)}</div>
          <div className="small text-muted">
            {Array.isArray(p.items) ? p.items.reduce((t, i) => t + (i.cantidad || 0), 0) : 0} productos
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================
   Página
========================= */
export default function PerfilUsuario() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(getUsuarioActual());
  const [active, setActive] = useState("panel"); // 'panel' | 'pedidos' | 'admin'
  const [pedidos, setPedidos] = useState(getPedidos());

  const esAdmin = usuario?.rol === "admin";

  // Título dinámico del panel
  const panelTitle = esAdmin ? "Panel de Administrador" : "Panel de Control";

  // Actividad reciente demo
  const actividad = useMemo(() => {
    if (esAdmin) {
      return [
        { t: "Nueva venta registrada", s: "hace 5 minutos", d: "Venta #1458 por $24.500 en Minimarket Villa Central" },
        { t: "Usuario nuevo registrado", s: "hace 1 hora", d: "Ana Muñoz se ha registrado como cliente" },
      ];
    }
    return [
      { t: "Pedido entregado", s: "hace 2 días", d: "Tu pedido #125 ha sido entregado correctamente" },
      { t: "Nuevo descuento disponible", s: "hace 3 días", d: "15% de descuento en lácteos este fin de semana" },
    ];
  }, [esAdmin]);

  // Totales demo de tarjetas del panel (puedes conectarlo a tu data real)
  const cardsPanel = useMemo(() => {
    return {
      pedidosActivos: pedidos.filter(p => p.estado === "Pendiente" || p.estado === "Procesando").length,
      entregas: pedidos.filter(p => p.estado === "En camino").length,
      ventasMes: pedidos.reduce((t, p) => t + (p?.totales?.total || 0), 0),
    };
  }, [pedidos]);

  // Al montar: badge carrito + “autologin” si falta usuario
  useEffect(() => {
    updateCartBadge();
    setUsuario(getUsuarioActual());
    setPedidos(getPedidos());
  }, []);

  // Logout
  const cerrarSesion = () => {
    localStorage.removeItem("usuarioActual");
    setUsuario(null);
    navigate("/login");
  };

  // Header de bienvenida
  const nombreBienvenida = usuario?.nombre ? `, ${usuario.nombre}` : " a Villa Markets";

  // HTML ---------------------------------------------------------------------------------------------------------------------------
  return (
    <div className="container py-4">
      {/* Bienvenida */}
      <div className="row mb-4">
        <div className="col">
          <div id="bienvenida" className="p-4 bg-light rounded shadow-sm">
            <h2>Bienvenido{nombreBienvenida}</h2>
            <p>Accede a todas tus opciones desde este panel</p>
          </div>
        </div>
      </div>

      {/* Layout principal */}
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-4">
          <div className="card shadow-sm">
            <div className="card-header bg-green text-white">
              <h5 className="card-title mb-0">Menú principal</h5>
            </div>
            <div className="card-body">
              <div className="d-flex flex-column gap-2">
                <NavLink to="/productos" className="btn mb-2 text-start menu-btn-light">
                  <i className="fas fa-tags me-2" /> Catálogo
                </NavLink>
                <button className="btn mb-2 text-start menu-btn-light" onClick={() => setActive("pedidos")}>
                  <i className="fas fa-shopping-bag me-2" /> Compras
                </button>
                <NavLink to="/inventario" className="btn mb-2 text-start menu-btn-light">
                  <i className="fas fa-boxes me-2" /> Inventario
                </NavLink>
                <NavLink to="/soporte" className="btn mb-2 text-start menu-btn-light">
                  <i className="fas fa-headset me-2" /> Soporte
                </NavLink>
              </div>
            </div>
          </div>

          {/* Perfil lateral */}
          <div className="card shadow-sm mt-4">
            <div className="card-header bg-green text-white">
              <h5 className="card-title mb-0">Perfil</h5>
            </div>
            <div className="card-body" id="perfilUsuario">
              <img
                src="/img/Duco.png"
                alt="Foto de perfil del usuario"
                className="rounded-circle mb-3"
                width="80"
                height="80"
              />
              <h5 id="perfil-nombre">{usuario?.nombre ?? "Invitado"}</h5>
              <p className="text-muted mb-3" id="perfil-rol">
                {esAdmin ? "Administrador" : "Cliente"}
              </p>
              <hr />
              <div className="text-start">
                <p>
                  <i className="fas fa-envelope me-2" />
                  <span id="perfil-email">{usuario?.email ?? "—"}</span>
                </p>
                <p>
                  <i className="fas fa-calendar-alt me-2" />
                  <span id="perfil-fecha">
                    Miembro desde: {usuario?.miembroDesde ?? "—"}
                  </span>
                </p>
              </div>
              <button onClick={cerrarSesion} className="btn btn-outline-danger mt-2 w-100">
                <i className="fas fa-sign-out-alt me-2" /> Cerrar sesión
              </button>
            </div>
          </div>
        </div>

        {/* Contenido principal (tabs controladas por estado) */}
        <div className="col-md-9">
          {/* Tabs header */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button
                className={`nav-link ${active === "panel" ? "active" : ""}`}
                onClick={() => setActive("panel")}
              >
                <i className="fas fa-tachometer-alt me-2" /> Panel de Control
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${active === "pedidos" ? "active" : ""}`}
                onClick={() => setActive("pedidos")}
              >
                <i className="fas fa-shopping-bag me-2" /> Mis Pedidos
              </button>
            </li>
            {esAdmin && (
              <li className="nav-item">
                <button
                  className={`nav-link ${active === "admin" ? "active" : ""}`}
                  onClick={() => setActive("admin")}
                >
                  <i className="fas fa-cogs me-2" /> Administración
                </button>
              </li>
            )}
          </ul>

          {/* Panel de Control */}
          {active === "panel" && (
            <div>
              <h3 className="mb-4" id="panel-control-title">{panelTitle}</h3>

              {/* Tarjetas resumen */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <div className="card bg-primary text-white shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Pedidos</h5>
                      <p className="fs-4 mb-1">{cardsPanel.pedidosActivos}</p>
                      <p className="mb-0">Pedidos activos</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="card bg-success text-white shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Entregas</h5>
                      <p className="fs-4 mb-1">{cardsPanel.entregas}</p>
                      <p className="mb-0">En camino</p>
                    </div>
                  </div>
                </div>
                {esAdmin && (
                  <div className="col-md-4" id="admin-stats">
                    <div className="card bg-warning text-white shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Ventas</h5>
                        <p className="fs-4 mb-1">${formatoCLP(cardsPanel.ventasMes)}</p>
                        <p className="mb-0">Este mes</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Actividad + Información personal */}
              <div className="row">
                <div className="col-md-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Actividad Reciente</h5>
                    </div>
                    <div className="card-body" id="actividad-reciente">
                      {actividad.map((a, idx) => (
                        <a key={idx} href="#!" className="list-group-item list-group-item-action">
                          <div className="d-flex w-100 justify-content-between">
                            <h6 className="mb-1">{a.t}</h6>
                            <small className="text-muted">{a.s}</small>
                          </div>
                          <p className="mb-1">{a.d}</p>
                        </a>
                      ))}
                      {actividad.length === 0 && (
                        <p className="text-center text-muted">Sin actividad reciente.</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card shadow-sm h-100">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Información Personal</h5>
                    </div>
                    <div className="card-body" id="perfil-container">
                      {!usuario ? (
                        <div className="text-center text-muted">
                          <p>No has iniciado sesión.</p>
                          <NavLink to="/login" className="btn btn-sm btn-green">Ir a Login</NavLink>
                        </div>
                      ) : (
                        <>
                          <div className="d-flex align-items-center gap-3 mb-3">
                            <img src="https://via.placeholder.com/80" className="rounded-circle" alt="Foto de perfil" />
                            <div>
                              <h5 className="mb-0">
                                {usuario?.nombre || "Usuario"} {usuario?.apellidos || ""}
                              </h5>
                              <small className="text-muted">
                                {esAdmin ? "Administrador" : "Cliente"}
                              </small>
                            </div>
                          </div>
                          <div className="row g-3">
                            <div className="col-sm-6">
                              <label className="form-label">Correo</label>
                              <div className="form-control bg-light">{usuario?.email ?? "—"}</div>
                            </div>
                            <div className="col-sm-6">
                              <label className="form-label">Teléfono</label>
                              <div className="form-control bg-light">{usuario?.telefono ?? "—"}</div>
                            </div>
                            <div className="col-12">
                              <label className="form-label">Dirección</label>
                              <div className="form-control bg-light">{usuario?.direccion ?? "—"}</div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mis Pedidos */}
          {active === "pedidos" && (
            <div id="pedidos">
              <h3 className="mb-4">Mis Pedidos</h3>
              <div id="pedidos-container">
                {pedidos.length === 0 ? (
                  <p className="text-center text-muted">Aún no tienes pedidos.</p>
                ) : (
                  pedidos
                    .slice()
                    .reverse()
                    .map((p) => <PedidoCard key={p.id} p={p} />)
                )}
              </div>
            </div>
          )}

          {/* Administración */}
          {active === "admin" && esAdmin && (
            <div id="admin">
              <h3 className="mb-4">Panel de Administración</h3>
              <div className="alert alert-info">
                <i className="fas fa-info-circle me-2" />
                Esta sección es solo para administradores.
              </div>

              <div className="row">
                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Gestión de Productos</h5>
                    </div>
                    <div className="card-body">
                      <p>Administra el catálogo de productos.</p>
                      <NavLink to="/admin/productos" className="btn btn-primary">
                        <i className="fas fa-box me-2" /> Gestionar Productos
                      </NavLink>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 mb-4">
                  <div className="card shadow-sm">
                    <div className="card-header">
                      <h5 className="card-title mb-0">Gestión de Usuarios</h5>
                    </div>
                    <div className="card-body">
                      <p>Administra los usuarios del sistema.</p>
                      <NavLink to="/admin/usuarios" className="btn btn-primary">
                        <i className="fas fa-users me-2" /> Gestionar Usuarios
                      </NavLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
