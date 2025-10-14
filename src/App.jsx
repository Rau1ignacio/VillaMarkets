import { Routes, Route } from "react-router-dom";
import Navbar from "./components/layout/Navbar.jsx";
import Footer from "./components/layout/Footer.jsx";

import Home from "./pages/public/Home.jsx";
// import Carrito from "./pages/public/Carrito.jsx";
import Login from "./pages/public/Login.jsx";
import Registro from "./pages/public/Registro.jsx";
// import MiniMarkets from "./pages/public/MiniMarkets.jsx";
// import PerfilUsuario from "./pages/public/PerfilUsuario.jsx";
// import ProductosGlobal from "./pages/public/ProductosGlobal.jsx";
// import Soporte from "./pages/public/Soporte.jsx";
// import Pedidos from "./pages/public/Pedidos.jsx";

export default function App() {
  return (
    <div className="min-vh-100 d-flex flex-column bg-light">
      <Navbar />
      <main className="flex-grow-1">
        <Routes>
          <Route path="/" element={<Home />} />

          {/* <Route path="/carrito" element={<Carrito />} /> */}
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
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
