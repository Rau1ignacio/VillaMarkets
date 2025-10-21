import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";


import Home from "./pages/public/Home.jsx";
// import Carrito from "./pages/public/Carrito.jsx";
import Login from "./pages/public/Login.jsx";
import Registro from "./pages/public/Registro.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import GestionPedidos from "./pages/admin/GestionPedidos.jsx";
import GestionProductos from "./pages/admin/gestionProductos.jsx";
import GestionUsuarios from "./pages/admin/Gestionusuarios.jsx";
import Reportes from "./pages/admin/reportes.jsx";
import Configuracion from "./pages/admin/Configuracion.jsx";
import Tiendas from "./pages/admin/Tiendas.jsx";


import Clienteinicio from "./pages/cliente/Clienteinicio.jsx";


// import MiniMarkets from "./pages/public/MiniMarkets.jsx";
// import PerfilUsuario from "./pages/public/PerfilUsuario.jsx";
// import ProductosGlobal from "./pages/public/ProductosGlobal.jsx";
// import Soporte from "./pages/public/Soporte.jsx";
// import Pedidos from "./pages/public/Pedidos.jsx";

function App() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* <Route path="/carrito" element={<Carrito />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/gestionpedidos" element={<GestionPedidos />} />
          <Route path="/admin/gestion-pedidos" element={<GestionPedidos />} />
          <Route path="/admin/gestion-productos" element={<GestionProductos />} />
          <Route path="/admin/gestion-usuarios" element={<GestionUsuarios />} />
          <Route path="/admin/reportes" element={<Reportes />} />
          <Route path="/admin/configuracion" element={<Configuracion />} />
          <Route path="/admin/tiendas" element={<Tiendas />} />
          
          <Route path="/clienteinicio" element={<Clienteinicio />} />
          {/* <Route path="/minimarkets" element={<MiniMarkets />} /> */}
          {/* <Route path="/perfil" element={<PerfilUsuario />} /> */}
          {/* <Route path="/productos" element={<ProductosGlobal />} /> */}
          {/* <Route path="/soporte" element={<Soporte />} /> */}
          {/* <Route path="/pedidos" element={<Pedidos />} /> */}

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );

}
export default App;