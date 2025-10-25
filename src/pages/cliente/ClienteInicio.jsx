import React, { useState, useEffect, useCallback, Fragment } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// import '../../styles/ClienteInicio.css'; // Se elimina la importación del archivo local

/*
 * --- NOTA ---
 * Este componente AHORA SÍ usa 'react-router-dom'
 * y también carga las CDNs de Bootstrap y Font Awesome
 * para que el diseño que te gustó funcione correctamente.
 *
 * Los estilos personalizados se añaden en una etiqueta <style>
 * para que el componente sea autocontenido.
 */


// --- Datos Constantes ---
// Mover datos estáticos fuera del componente evita que se redeclaren en cada render.
const OFERTAS_DESTACADAS = [
// ... (código de ofertas sin cambios) ...
  {
    titulo: "2x1 en Frutas y Verduras",
    tienda: "Minimarket El Barrio",
    etiqueta: "HOY",
    color: "danger"
  },
  {
    titulo: "25% off en Lácteos",
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
// ... (código de estadísticas sin cambios) ...
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
// ... (código de accesos rápidos sin cambios) ...
  {
    titulo: "Productos",
    descripcion: "Explora nuestro catálogo completo",
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


/**
 * Componente de Hoja de Estilos
 * Inserta las CDNs de Bootstrap y Font Awesome.
 * Los estilos personalizados ahora se cargarán desde ClienteInicio.css
 */
const CustomStyles = () => (
  <Fragment>
    {/* CDN de Bootstrap (CORREGIDO) */}
    <link 
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" 
      rel="stylesheet" 
      xintegrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" 
      crossOrigin="anonymous" 
    />
    {/* CDN de Font Awesome (CORREGIDO - necesario para los íconos) */}
    <link 
      rel="stylesheet" 
      href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" 
      xintegrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" 
      crossOrigin="anonymous" 
      referrerPolicy="no-referrer" 
    />
    
    {/* Añadimos los estilos personalizados aquí */}
    <style>{`
      /* --- Estilos Globales (de global.css) --- */
      body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
        background-color: #f8f9fa; /* Un fondo gris muy claro */
        color: #333;
      }
      
      .section-title {
        font-weight: 700;
        color: #212529;
        margin-bottom: 1.5rem;
        text-align: center;
      }

      /* --- Estilos del Componente (de ClienteInicio.css) --- */
      .cliente-inicio {
        padding-bottom: 3rem;
      }

      .welcome-banner {
        background: linear-gradient(135deg, var(--bs-success-bg-subtle), var(--bs-light));
        border-bottom: 1px solid var(--bs-border-color);
      }
      
      .welcome-illustration {
        max-width: 350px;
        height: auto;
        border-radius: 1rem;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        object-fit: cover;
      }

      .quick-access-card {
        background-color: #ffffff;
        border-radius: 1rem;
        padding: 1.5rem;
        text-align: center;
        border: 1px solid var(--bs-border-color-translucent);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        cursor: pointer;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }

      .quick-access-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
      }

      .quick-access-card i {
        font-size: 2.5rem;
        margin-bottom: 1rem;
        color: var(--bs-success);
      }

      .quick-access-card h3 {
        font-weight: 600;
        font-size: 1.25rem;
        margin-bottom: 0.25rem;
        color: #343a40;
      }

      .quick-access-card p {
        font-size: 0.9rem;
        color: #6c757d;
        margin-bottom: 0;
      }

      .stat-card, .offer-card {
        background-color: #ffffff;
        border-radius: 1rem;
        padding: 1.5rem;
        border: 1px solid var(--bs-border-color-translucent);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
        display: flex;
        align-items: center;
        gap: 1.5rem;
        height: 100%;
      }
      
      .stat-icon {
        font-size: 1.75rem;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
      }

      /* Colores de íconos de estadísticas */
      .stat-icon.bg-success-subtle { color: var(--bs-success); }
      .stat-icon.bg-info-subtle { color: var(--bs-info); }
      .stat-icon.bg-warning-subtle { color: var(--bs-warning); }
      .stat-icon.bg-danger-subtle { color: var(--bs-danger); }

      .stat-info h4, .offer-card h4 {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
      }
      
      .stat-info .stat-value {
        font-size: 1.75rem;
        font-weight: 700;
        color: #212529;
        margin-bottom: 0;
      }
    `}</style>
  </Fragment>
);

// --- Componente Principal ---
const ClienteInicio = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Añadido para tu lógica de useEffect
  
  // Usar useState para el usuario.
  const [usuario, setUsuario] = useState(null);

  // --- Lógica del Usuario (de tu código original) ---
  useEffect(() => {
        if (location?.state?.openNearest) {
            // esperar que mapa esté inicializado
             const t = setTimeout(() => {
              console.log("Buscando minimarket cercano (simulado)...");
             // encontrarCercano(); // Asegúrate de definir esta función si la necesitas
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
      setUsuario({}); // Establecer un objeto vacío en caso de error
    }
  }, []); // El array vacío [] asegura que esto se ejecute solo una vez

  // --- Manejadores de Navegación (con tus rutas) ---
  
  const handleLogout = useCallback(() => {
     localStorage.removeItem('usuario'); // Tu lógica
     navigate('/login'); // Tu ruta
  }, [navigate]);

  const handleMinimarket = useCallback(() => {
      // Tu lógica y ruta
        navigate('./Minimarket', { state: { openNearest: true } }); 
  }, [navigate]);

  const handlePerfil = useCallback(() => {
        navigate('./Perfil'); // Tu ruta
  }, [navigate]);

  const handleMiCarrito = useCallback(() => {
        navigate('./micarrito'); // Tu ruta
  }, [navigate]);

  const handleProductos = useCallback(() => {
        navigate('./producto'); // Tu ruta
  }, [navigate]);

  // Mapear los handlers a un objeto para un acceso más limpio
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

  // --- Renderizado del Componente (El diseño que te gustó) ---
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
                  ¡Hola, {usuario?.nombre || 'Cliente'}! 👋
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
          {/* Accesos Rápidos */}
          <div className="row g-4 mb-5">
            {ACCESOS_RAPIDOS.map((item) => (
              <div key={item.handlerName} className="col-6 col-md-3">
                <div 
                  className="quick-access-card" 
                  onClick={navigationHandlers[item.handlerName]}
                  role="button" // Añadido por accesibilidad
                  tabIndex={0}  // Añadido por accesibilidad
                  onKeyPress={(e) => e.key === 'Enter' && navigationHandlers[item.handlerName]()}
                >
                  <i className={item.icono}></i>
                  <h3>{item.titulo}</h3>
                  <p>{item.descripcion}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Estadísticas del Usuario */}
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

          {/* Ofertas del Día */}
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


