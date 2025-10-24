import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ClienteInicio.css';



// Componente de inicio para clientes
const ClienteInicio = () => {
    const navigate = useNavigate();
    const location = useLocation();
    // si navegamos con { state: { openNearest: true } } ejecutar buscar cercano al montar
    useEffect(() => {
        if (location?.state?.openNearest) {
            // esperar que mapa esté inicializado
            const t = setTimeout(() => {
                // encontrarCercano(); // Asegúrate de definir esta función si la necesitas
            }, 500);
            return () => clearTimeout(t);
        }
        // limpiar el state para que no se vuelva a ejecutar al navegar de nuevo
    }, [location?.state?.openNearest]);





//manejar cierre de sesión
    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    // abrir la pantalla de minimarkets y pedir que se ejecute la búsqueda automática
    const handleMinimarket = () => {
        // pasar state para que Minimarket ejecute encontrarCercano al montar
        navigate('./Minimarket', { state: { openNearest: true } });
    };

    const handlePerfil = () => {
        navigate('./Perfil');
    };

    
    
    

    const handleMiCarrito = () => {
        navigate('./micarrito');
    };
    const handleProductos = () => {
        navigate('./producto');
    }

    return (
        <div className="cliente-inicio">
            <header className="cliente-header">
                <div className="cliente-nav">
                    <img src="./src/images/Logos/Logotipo Transparente.png" alt="Villa Market" className="logo" />
                    <h1>Villa Market cliente </h1>
                    <div className="nav-actions">
                        <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
                    </div>
                </div>
            </header>

            <div className="cliente-content">
                <div className="cliente-grid">
                    <div className="cliente-card">
                        <h3>🛍️ Productos</h3>
                        <p>Explora nuestro catálogo</p>
                        <button className="cliente-btn" onClick={handleProductos}>Ver Productos</button>
                    </div>

                    <div className="cliente-card">
                        <h3>🏪 Minimarkets</h3>
                        <p>Encuentra tiendas cerca</p>
                        <button className="cliente-btn" onClick={handleMinimarket}>Ver Tiendas</button>
                    </div>

                    <div className="cliente-card">
                        <h3>🛒 Mi Carrito</h3>
                        <p>Revisa tus productos</p>
                        <button className="cliente-btn" onClick={handleMiCarrito}>Ver Carrito</button>
                    </div>

                    

                    <div className="cliente-card">
                        <h3>👤 Mi Perfil</h3>
                        <p>Datos personales</p>
                        <button className="cliente-btn" onClick={handlePerfil}>Ver Perfil</button>
                    </div>

                    
                </div>
            </div>
        </div>
    );
};

export default ClienteInicio;