import { Routes, Route, useLocation } from "react-router-dom";
import './utils/fontawesome';

//  COMPONENTES DE LAYOUT
import Navbar from "./components/layout/Navbar.jsx";
import NavbarAdmin from "./components/layout/NavbarAdmin.jsx";
import NavbarCliente from "./components/layout/NavbarCliente.jsx";
import Footer from "./components/layout/Footer.jsx";

// PÁGINAS PÚBLICAS
import Home from "./pages/public/Home.jsx";
import Login from "./pages/public/Login.jsx";
import Registro from "./pages/public/Registro.jsx";
import Minimarket from "./pages/public/Minimarket.jsx";
import ProductosGlobal from "./pages/public/ProductosGlobal.jsx";
import Soporte from "./pages/public/Soporte.jsx";
import Pedidos from "./pages/public/Pedidos.jsx";

// PÁGINAS ADMINISTRADOR
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import GestionPedidos from "./pages/admin/GestionPedidos.jsx";
import GestionProductos from "./pages/admin/GestionProductos.jsx";
import GestionUsuarios from "./pages/admin/GestionUsuarios.jsx";
import Reportes from "./pages/admin/Reportes.jsx";
import Configuracion from "./pages/admin/Configuracion.jsx";
import Tiendas from "./pages/admin/Tiendas.jsx";

// PÁGINAS CLIENTE
import ClienteInicio from "./pages/cliente/ClienteInicio.jsx";
import Perfil from "./pages/cliente/Perfil.jsx";
import Ofertas from "./pages/cliente/Ofertas.jsx";
import MisPedidos from "./pages/cliente/MisPedidos.jsx";
import Carrito from "./pages/cliente/MiCarrito.jsx";
import Producto from "./pages/cliente/Producto.jsx";

// COMPONENTE PRINCIPAL
function App() {
  const location = useLocation();

  // Determinar qué Navbar mostrar según la ruta
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isClientRoute = location.pathname.startsWith("/clienteinicio");

  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      {/* Navbar dinámica */}
      {isAdminRoute ? (
        <NavbarAdmin />
      ) : isClientRoute ? (
        <NavbarCliente />
      ) : (
        <Navbar />
      )}

      <main className="flex-grow-1">
        <Routes>

          {/* Rutas públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/minimarket" element={<Minimarket />} />
          <Route path="/productos" element={<ProductosGlobal />} />
          <Route path="/soporte" element={<Soporte />} />
          <Route path="/pedidos" element={<Pedidos />} />

          {/* Rutas Admin */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/gestion-pedidos" element={<GestionPedidos />} />
          <Route path="/admin/gestion-productos" element={<GestionProductos />} />
          <Route path="/admin/gestion-usuarios" element={<GestionUsuarios />} />
          <Route path="/admin/reportes" element={<Reportes />} />
          <Route path="/admin/configuracion" element={<Configuracion />} />
          <Route path="/admin/tiendas" element={<Tiendas />} />

          {/* Rutas Cliente */}
          <Route path="/clienteinicio" element={<ClienteInicio />} />
          <Route path="/clienteinicio/perfil" element={<Perfil />} />
          <Route path="/clienteinicio/ofertas" element={<Ofertas />} />
          <Route path="/clienteinicio/mis-pedidos" element={<MisPedidos />} />
          <Route path="/clienteinicio/micarrito" element={<Carrito />} />
          <Route path="/clienteinicio/producto" element={<Producto />} />
          <Route path="/clienteinicio/minimarket" element={<Minimarket />} />

          {/* Rutas adicionales */}
          <Route path="/carrito" element={<Carrito />} />

          {/* Ruta por defecto */}
          <Route path="*" element={<Home />} />

        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
