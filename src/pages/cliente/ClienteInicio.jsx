import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/ClienteInicio.css';

// --- Datos Constantes ---
const OFERTAS_DESTACADAS = [
// De momento no hemos puesto ofertas verdaderas
  {
    titulo: "2x1 en Frutas y Verduras",
    tienda: "Minimarket El Barrio",
    etiqueta: "HOY",
    color: "danger"
  },
  {
    titulo: "25% off en Lacteos",
    tienda: "Minimarket Las Condes",
    etiqueta: "DESTACADO",
    color: "success"
  },
  {
    titulo: "3x2 en Abarrotes",
    tienda: "Minimarket Centro",
    etiqueta: "NUEVO",
    color: "primary"
  }
];

const ESTADISTICAS_USUARIO = [
// De momento no hemos puesto estadisticas verdaderas
  {
    titulo: "Compras Realizadas",
    valor: "12",
    icono: "fas fa-shopping-cart",
    color: "success"
  },
  {
    titulo: "Tiendas Favoritas",
    valor: "3",
    icono: "fas fa-store",
    color: "info"
  },
  {
    titulo: "Puntos VillaMarkets",
    valor: "150",
    icono: "fas fa-star",
    color: "warning"
  }
];

const ACCESOS_RAPIDOS = [
// De momento no hemos puesto estadisticas verdaderas
  {
    titulo: "Productos",
    descripcion: "Explora nuestro cat├ílogo completo",
    icono: "fas fa-shopping-bag",
    handlerName: "productos"
  },
  {
    titulo: "Minimarkets",
    descripcion: "Encuentra tiendas cercanas",
    icono: "fas fa-store",
    handlerName: "minimarket"
  },
  {
    titulo: "Mi Carrito",
    descripcion: "Revisa tus productos seleccionados",
    icono: "fas fa-shopping-cart",
    handlerName: "carrito"
  },
  {
    titulo: "Mi Perfil",
    descripcion: "Administra tu cuenta",
    icono: "fas fa-user",
    handlerName: "perfil"
  }
];


/* Componente de Hoja de Estilos */
const CustomStyles = () => (
  <Fragment>
    
    <link 
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
      rel="stylesheet" 
      xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" 
      crossOrigin="anonymous" 
    />
    
    <link 
      rel="stylesheet" 
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
      xintegrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" 
      crossOrigin="anonymous" 
      referrerPolicy="no-referrer" 
    />
    {/* Añadimos los estilos personalizados aqui */}
  </Fragment>
);

// --- Componente Principal ---
const ClienteInicio = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  
  // Usar useState para el usuario.
  const [usuario, setUsuario] = useState(null);

  // --- L├│gica del Usuario (de tu c├│digo original) ---
  useEffect(() => {
        if (location?.state?.openNearest) {
            // esperar que mapa estainicializado
             const t = setTimeout(() => {
              console.log("Buscando minimarket cercano (simulado)...");
              encontrarCercano(); 
            }, 500);
            return () => clearTimeout(t);
    }
  }, [location?.state?.openNearest]); // Dependencia original

  // Cargar el usuario desde localStorage al montar el componente
  useEffect(() => {
    try {
      // Sincronizado con tu handleLogout (usa 'usuario')
      const usuarioGuardado = localStorage.getItem('usuario'); 
      setUsuario(usuarioGuardado ? JSON.parse(usuarioGuardado) : {});
    } catch (error) {
      console.error("Error al parsear datos del usuario:", error);
      setUsuario({}); // Establecer un objeto vacio en caso de error
    }
  }, []); 

  // --- Manejadores de Navegacion (con tus rutas) ---
  
  const handleLogout = useCallback(() => {
     localStorage.removeItem('usuario'); // Tu l├│gica
     navigate('/login'); 
  }, [navigate]);

  const handleMinimarket = useCallback(() => {
        navigate('./Minimarket', { state: { openNearest: true } }); 
  }, [navigate]);

  const handlePerfil = useCallback(() => {
        navigate('./Perfil'); 
  }, [navigate]);

  const handleMiCarrito = useCallback(() => {
        navigate('./micarrito'); 
  }, [navigate]);

  const handleProductos = useCallback(() => {
        navigate('./producto'); 
  }, [navigate]);

  // Mapear los handlers a un objeto para un acceso m├ís limpio
  const navigationHandlers = {
    productos: handleProductos,
    minimarket: handleMinimarket,
    carrito: handleMiCarrito,
    perfil: handlePerfil,
  };

  // Mostrar un indicador de carga mientras se obtiene el usuario
  if (usuario === null) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Html ---------------------------------------------------------------------------------------------------------------------------
  return (
    <Fragment>
      {/* Inserta los estilos y CDNs */}
      <CustomStyles />
      
      <div className="cliente-inicio">
        {/* Banner de Bienvenida */}
        <section className="welcome-banner">
          <div className="container py-4 py-md-5">
            <div className="row align-items-center">
              <div className="col-lg-7">
                <h1 className="display-4 fw-bold mb-3">
                  Hola, {usuario?.nombre || 'Cliente'}!
                </h1>
                <p className="lead mb-4">
                  Descubre las mejores ofertas y productos locales
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <button className="btn btn-success btn-lg shadow-sm" onClick={handleProductos}>
                    <i className="fas fa-shopping-bag me-2"></i>
                    Explorar Productos
                  </button>
                  <button className="btn btn-outline-success btn-lg shadow-sm" onClick={handleMinimarket}>
                    <i className="fas fa-store me-2"></i>
                    Ver Tiendas Cercanas
                  </button>
                </div>
              </div>
              <div className="col-lg-5 mt-4 mt-lg-0">
                <div className="text-center">
                  <img 
                    src="https://placehold.co/600x400/28a745/white?text=VillaMarkets&font=inter" 
                    alt="Compras"
                    className="welcome-illustration img-fluid"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-5">
          {/* Accesos Rapidos */}
          <div className="row g-4 mb-5">
            {ACCESOS_RAPIDOS.map((item) => (
              <div key={item.handlerName} className="col-6 col-md-3">
                <div 
                  className="quick-access-card" 
                  onClick={navigationHandlers[item.handlerName]}
                  role="button" 
                  tabIndex={0}  
                  onKeyPress={(e) => e.key === 'Enter' && navigationHandlers[item.handlerName]()}
                >
                  <i className={item.icono}></i>
                  <h3>{item.titulo}</h3>
                  <p>{item.descripcion}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Estadisticas del Usuario */}
          <section>
            <h2 className="section-title mb-4">Tu Actividad</h2>
            <div className="row g-4">
              {ESTADISTICAS_USUARIO.map((stat) => (
                <div key={stat.titulo} className="col-md-4">
                  <div className="stat-card">
                    <div className={`stat-icon bg-${stat.color}-subtle`}>
                      <i className={stat.icono}></i>
                    </div>
                    <div className="stat-info">
                      <h4>{stat.titulo}</h4>
                      <p className="stat-value">{stat.valor}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Ofertas del Dia */}
          <section className="mt-5 pt-4 border-top">
            <h2 className="section-title">Ofertas Destacadas</h2>
            <div className="row g-4">
              {OFERTAS_DESTACADAS.map((oferta, index) => (
                <div key={index} className="col-md-4">
                  <div className="offer-card">
                    <div className="stat-icon bg-danger-subtle">
                      <i className="fas fa-percent"></i>
                    </div>
                    <div className="stat-info">
                      <span className={`badge bg-${oferta.color} mb-2`}>{oferta.etiqueta}</span>
                      <h4 className="mb-2">{oferta.titulo}</h4>
                      <p className="text-muted mb-3">{oferta.tienda}</p>

<button className="btn btn-sm btn-outline-success" onClick={handleProductos}>
                        Ver detalles
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
      
      {/* CDN de Bootstrap JS (opcional, pero necesario para componentes interactivos) */}
      <script 
        src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" 
        xintegrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" 
        crossOrigin="anonymous">
      </script>
    </Fragment>
  );
};

export default ClienteInicio;



