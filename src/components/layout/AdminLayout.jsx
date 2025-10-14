import { NavLink, Outlet } from "react-router-dom";
import { useState } from "react";

/**
 * AdminLayout
 * Estructura base para todas las pantallas del panel de administración.
 *
 * Props:
 * - title?: string (título en la topbar)
 * - user?: { name: string, role?: string }
 *
 * Uso:
 * <Route element={<AdminLayout title="VillaMarkets Admin" user={{name:'Raúl'}} />}>
 *   <Route path="/admin" element={<Dashboard/>} />
 *   <Route path="/admin/productos" element={<AdminProductos/>} />
 *   ...
 * </Route>
 */
export default function AdminLayout({
  title = "VillaMarkets · Admin",
  user = { name: "Administrador", role: "Admin" },
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <nav
        className={`bg-dark text-white position-fixed top-0 start-0 h-100 px-3 pt-4 pb-3 border-end 
        ${open ? "d-block" : "d-none d-md-block"}`}
        style={{ width: 260, zIndex: 1030 }}
        aria-label="Barra lateral de administración"
      >
        <div className="d-flex align-items-center justify-content-between mb-3">
          <span className="fw-bold">Panel Admin</span>
          <button
            className="btn btn-sm btn-outline-light d-md-none"
            onClick={() => setOpen(false)}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <ul className="nav nav-pills flex-column gap-1">
          <li className="nav-item">
            <NavLink to="/admin" end className={({ isActive }) =>
              "nav-link text-start " + (isActive ? "active" : "text-white-50")
            }>
              <i className="fas fa-gauge me-2" /> Dashboard
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/admin/productos" className={({ isActive }) =>
              "nav-link text-start " + (isActive ? "active" : "text-white-50")
            }>
              <i className="fas fa-boxes-stacked me-2" /> Productos
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/admin/pedidos" className={({ isActive }) =>
              "nav-link text-start " + (isActive ? "active" : "text-white-50")
            }>
              <i className="fas fa-receipt me-2" /> Pedidos
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/admin/minimarkets" className={({ isActive }) =>
              "nav-link text-start " + (isActive ? "active" : "text-white-50")
            }>
              <i className="fas fa-store me-2" /> MiniMarkets
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/admin/usuarios" className={({ isActive }) =>
              "nav-link text-start " + (isActive ? "active" : "text-white-50")
            }>
              <i className="fas fa-users me-2" /> Usuarios
            </NavLink>
          </li>

          <li className="nav-item mt-2">
            <NavLink to="/" className="nav-link text-white-50">
              <i className="fas fa-arrow-left me-2" /> Volver a tienda
            </NavLink>
          </li>
        </ul>

        <hr className="border-secondary" />
        <div className="small">
          <div className="text-white fw-semibold">{user.name}</div>
          <div className="text-white-50">{user.role || "Admin"}</div>
        </div>
      </nav>

      {/* Contenedor principal */}
      <div className="flex-grow-1" style={{ marginLeft: 0 }}>
        {/* Empuje para sidebar en >= md */}
        <div className="d-none d-md-block" style={{ width: 260 }} />

        {/* Topbar */}
        <header className="border-bottom bg-white sticky-top">
          <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between py-2">
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-outline-secondary d-md-none"
                  onClick={() => setOpen(true)}
                  aria-label="Abrir menú"
                >
                  ☰
                </button>
                <h1 className="h5 mb-0">{title}</h1>
              </div>

              <div className="d-flex align-items-center gap-2">
                <form className="d-none d-md-flex" role="search" onSubmit={(e) => e.preventDefault()}>
                  <input className="form-control form-control-sm" placeholder="Buscar en admin..." />
                </form>
                <div className="dropdown">
                  <button
                    className="btn btn-light dropdown-toggle"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <i className="fas fa-user-circle me-1" />
                    {user.name}
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li><span className="dropdown-item-text small text-muted">{user.role}</span></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item">Perfil</button></li>
                    <li><button className="dropdown-item">Configuración</button></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><button className="dropdown-item text-danger">Cerrar sesión</button></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenido */}
        <main className="container-fluid py-3">
          {/* Aquí React Router inyecta la vista: Dashboard, Productos, etc. */}
          <Outlet />
        </main>

        {/* Footer simple del admin */}
        <footer className="border-top small text-muted py-2 bg-white">
          <div className="container-fluid d-flex justify-content-between">
            <span>© {new Date().getFullYear()} VillaMarkets · Admin</span>
            <span>v1.0</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
