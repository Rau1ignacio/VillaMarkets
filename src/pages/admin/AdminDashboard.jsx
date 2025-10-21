import React from 'react';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();
    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('usuario');
        window.location.href = '/login';
    };

    // Función para navegar a Gestión de Pedidos
    const handleGestionPedidos = () => {
    navigate('/admin/gestion-pedidos');
    };
    // Función para navegar a Gestión de Productos
    const handleGestionProductos = () => {
        navigate('/admin/gestion-productos');
    };

    // Función para navegar a Gestión de Usuarios
    const handleGestionUsuarios = () => {
        navigate('/admin/gestion-usuarios');
    };
    // Función para navegar a Tiendas
    const handleGestionTiendas = () => {
        navigate('/admin/tiendas');
    };
    // Función para navegar a Configuración
    const handleConfiguracion = () => {
        navigate('/admin/configuracion');
    };
    // función para navegar a Reportes
    const handleReportes = () => {
        navigate('/admin/reportes');
    }


// Estructura del componente
    return (
        <div className="admin-dashboard">
            {/* Header responsivo con Bootstrap */}
            <header className="admin-header">
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
                        <div className="container-xxl">
                            {/* Logo */}
                            <a className="navbar-brand d-flex align-items-center" href="">
                                <img 
                                    src="./src/images/Logos/Logotipo Transparente.png" 
                                    alt="Villa Market" 
                                    className="logo me-3"
                                    width="50" 
                                    height="50"
                                />
                                <span className="fw-bold text-primary d-none d-md-inline">Panel Administrativo</span>
                                <span className="fw-bold text-primary d-md-none">Admin</span>
                            </a>

                            {/* Botón hamburguesa para móviles */}
                            <button 
                                className="navbar-toggler" 
                                type="button" 
                                data-bs-toggle="collapse" 
                                data-bs-target="#navbarNav"
                                aria-controls="navbarNav" 
                                aria-expanded="false" 
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>

                            {/* Menú colapsable */}
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <div className="navbar-nav ms-auto">
                                    
                                    <span className="navbar-text me-3 d-none d-lg-inline">
                                        <i className="fas fa-user-shield me-2"></i>
                                        Administrador
                                    </span>
                                    <button 
                                        onClick={handleLogout} 
                                        className="btn btn-outline-danger btn-sm"
                                    >
                                        <i className="fas fa-sign-out-alt me-2 d-none d-sm-inline"></i>
                                        Cerrar Sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </header>

            {/* Contenido principal responsivo */}
            <main className="admin-content">
                <div className="container-xxl py-4">
                    {/* Título de bienvenida */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="welcome-card p-4 bg-gradient-primary text-white rounded-3 shadow">
                                <h2 className="h3 mb-2">
                                    <i className="fas fa-tachometer-alt me-2"></i>
                                    Administrativo
                                </h2>
                                <p className="mb-0 opacity-75">
                                    Gestiona tu plataforma desde un solo lugar
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Grid de tarjetas responsivo */}
                    <div className="row g-4">
                        {/* Gestión de Usuarios */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <div className="admin-card card h-100 shadow-sm border-0">
                                <div className="card-body text-center p-4">
                                    <div className="icon-circle bg-info bg-opacity-10 mb-3 mx-auto">
                                        <i className="fas fa-users text-info fs-2"></i>
                                    </div>
                                    <h5 className="card-title fw-bold">Gestión de Usuarios</h5>
                                    <p className="card-text text-muted">
                                        Administrar clientes y vendedores
                                    </p>
                                    <button 
                                        onClick={handleGestionUsuarios}
                                        className="btn btn-info btn-sm w-100"
                                    >
                                        <i className="fas fa-eye me-2"></i>
                                        Ver Usuarios
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Gestión de Productos */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <div className="admin-card card h-100 shadow-sm border-0">
                                <div className="card-body text-center p-4">
                                    <div className="icon-circle bg-success bg-opacity-10 mb-3 mx-auto">
                                        <i className="fas fa-box text-success fs-2"></i>
                                    </div>
                                    <h5 className="card-title fw-bold">Gestión de Productos</h5>
                                    <p className="card-text text-muted">
                                        Agregar, editar y eliminar productos
                                    </p>
                                    <button 
                                        onClick={handleGestionProductos}
                                        className="btn btn-success btn-sm w-100"
                                    >
                                        <i className="fas fa-eye me-2"></i>
                                        Ver Productos
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Gestión de Pedidos */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <div className="admin-card card h-100 shadow-sm border-0">
                                <div className="card-body text-center p-4">
                                    <div className="icon-circle bg-warning bg-opacity-10 mb-3 mx-auto">
                                        <i className="fas fa-shopping-cart text-warning fs-2"></i>
                                    </div>
                                    <h5 className="card-title fw-bold">Gestión de Pedidos</h5>
                                    <p className="card-text text-muted">
                                        Ver y procesar pedidos
                                    </p>
                                    <button 
                                        onClick={handleGestionPedidos}
                                        className="btn btn-warning btn-sm w-100"
                                    >
                                        <i className="fas fa-eye me-2"></i>
                                        Ver Pedidos
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Reportes */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <div className="admin-card card h-100 shadow-sm border-0">
                                <div className="card-body text-center p-4">
                                    <div className="icon-circle bg-primary bg-opacity-10 mb-3 mx-auto">
                                        <i className="fas fa-chart-bar text-primary fs-2"></i>
                                    </div>
                                    <h5 className="card-title fw-bold">Reportes</h5>
                                    <p className="card-text text-muted">
                                        Análisis y estadísticas
                                    </p>
                                    <button 
                                        onClick={handleReportes}
                                        className="btn btn-primary btn-sm w-100"
                                    >
                                        <i className="fas fa-eye me-2"></i>
                                        Ver Reportes
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Tiendas */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <div className="admin-card card h-100 shadow-sm border-0">
                                <div className="card-body text-center p-4">
                                    <div className="icon-circle bg-secondary bg-opacity-10 mb-3 mx-auto">
                                        <i className="fas fa-store text-secondary fs-2"></i>
                                    </div>
                                    <h5 className="card-title fw-bold">Tiendas</h5>
                                    <p className="card-text text-muted">
                                        Gestionar minimarkets
                                    </p>
                                    <button 
                                        onClick={handleGestionTiendas}
                                        className="btn btn-secondary btn-sm w-100"
                                    >
                                        <i className="fas fa-eye me-2"></i>
                                        Ver Tiendas
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Configuración */}
                        <div className="col-12 col-sm-6 col-lg-4">
                            <div className="admin-card card h-100 shadow-sm border-0">
                                <div className="card-body text-center p-4">
                                    <div className="icon-circle bg-dark bg-opacity-10 mb-3 mx-auto">
                                        <i className="fas fa-cogs text-dark fs-2"></i>
                                    </div>
                                    <h5 className="card-title fw-bold">Configuración</h5>
                                    <p className="card-text text-muted">
                                        Ajustes del sistema
                                    </p>
                                    <button 
                                        onClick={handleConfiguracion}
                                        className="btn btn-dark btn-sm w-100"
                                    >
                                        <i className="fas fa-cog me-2"></i>
                                        Configurar
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminDashboard;