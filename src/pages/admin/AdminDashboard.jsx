import React from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const handleLogout = () => {
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    return (
        <div className="admin-dashboard">
            <header className="admin-header">
                <div className="admin-nav">
                    <img src="/images/logovilla.jpg" alt="Villa Market" className="logo" />
                    <h1>Panel Administrativo</h1>
                    <button onClick={handleLogout} className="logout-btn">Cerrar Sesión</button>
                </div>
            </header>

            <div className="admin-content">
                <div className="admin-grid">
                    <div className="admin-card">
                        <h3>👥 Gestión de Usuarios</h3>
                        <p>Administrar clientes y vendedores</p>
                        <button className="admin-btn">Ver Usuarios</button>
                    </div>

                    <div className="admin-card">
                        <h3>📦 Gestión de Productos</h3>
                        <p>Agregar, editar y eliminar productos</p>
                        <button className="admin-btn">Ver Productos</button>
                    </div>

                    <div className="admin-card">
                        <h3>🛒 Gestión de Pedidos</h3>
                        <p>Ver y procesar pedidos</p>
                        <button className="admin-btn">Ver Pedidos</button>
                    </div>

                    <div className="admin-card">
                        <h3>📊 Reportes</h3>
                        <p>Análisis y estadísticas</p>
                        <button className="admin-btn">Ver Reportes</button>
                    </div>

                    <div className="admin-card">
                        <h3>🏪 Tiendas</h3>
                        <p>Gestionar minimarkets</p>
                        <button className="admin-btn">Ver Tiendas</button>
                    </div>

                    <div className="admin-card">
                        <h3>⚙️ Configuración</h3>
                        <p>Ajustes del sistema</p>
                        <button className="admin-btn">Configurar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;