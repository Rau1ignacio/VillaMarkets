import React from 'react';
import './ClienteInicio.css';


const ClienteInicio = () => {
    const handleLogout = () => {
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    return (
        <div className="cliente-inicio">
            <header className="cliente-header">
                <div className="cliente-nav">
                    <img src="/images/logovilla.jpg" alt="Villa Market" className="logo" />
                    <h1>Villa Markets  cliente1 </h1>
                    <div className="nav-actions">
                        <button className="cart-btn">🛒 Carrito (0)</button>
                        <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
                    </div>
                </div>
            </header>

            <div className="cliente-content">
                <div className="cliente-grid">
                    <div className="cliente-card">
                        <h3>🛍️ Productos</h3>
                        <p>Explora nuestro catálogo</p>
                        <button className="cliente-btn">Ver Productos</button>
                    </div>

                    <div className="cliente-card">
                        <h3>🏪 Minimarkets</h3>
                        <p>Encuentra tiendas cerca</p>
                        <button className="cliente-btn">Ver Tiendas</button>
                    </div>

                    <div className="cliente-card">
                        <h3>🛒 Mi Carrito</h3>
                        <p>Revisa tus productos</p>
                        <button className="cliente-btn">Ver Carrito</button>
                    </div>

                    <div className="cliente-card">
                        <h3>📋 Mis Pedidos</h3>
                        <p>Historial de compras</p>
                        <button className="cliente-btn">Ver Pedidos</button>
                    </div>

                    <div className="cliente-card">
                        <h3>👤 Mi Perfil</h3>
                        <p>Datos personales</p>
                        <button className="cliente-btn">Ver Perfil</button>
                    </div>

                    <div className="cliente-card">
                        <h3>🎯 Ofertas</h3>
                        <p>Descuentos especiales</p>
                        <button className="cliente-btn">Ver Ofertas</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClienteInicio;