import React, { useState, useEffect } from 'react';
import '../../styles/AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import Logo from "../../images/Logos/Logotipo Transparente.png"


// Simuladores de datos para el dashboard
const AdminDashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        totalVentas: "CLP $15.420",
        pedidosPendientes: 8,
        clientesNuevos: 24,
        productosActivos: 156
    });

    const [actividadReciente] = useState([
        { tipo: 'venta', mensaje: 'Nuevo pedido rgba(0, 0, 0, 0.27) - CLP $85.50', tiempo: '5 min', icono: 'shopping-bag', color: 'success' },
        { tipo: 'usuario', mensaje: 'Cliente nuevo registrado: María L.', tiempo: '15 min', icono: 'user-plus', color: 'info' },
        { tipo: 'producto', mensaje: 'Producto actualizado: Leche Gloria', tiempo: '1 hora', icono: 'edit', color: 'warning' },
        { tipo: 'sistema', mensaje: 'Backup del sistema completado', tiempo: '2 horas', icono: 'server', color: 'primary' }
    ]);

    // Simular carga de datos
    useEffect(() => {
        // Aquí irían las llamadas a la API para obtener datos reales
    }, []);

    // Navegación
    const handleGestionProductos = () => navigate('/admin/gestion-productos');
    const handleGestionUsuarios = () => navigate('/admin/gestion-usuarios');
    const handleGestionTiendas = () => navigate('/admin/tiendas');
    const handleReportes = () => navigate('/admin/reportes');
    const handleLogout = () => {
        localStorage.removeItem('usuario');
        navigate('/login');
    };

    // HTML ---------------------------------------------------------------------------------------------------------------------------
    return (
        <div className="admin-dashboard bg-light">
            <main className="admin-content">
                <div className="container-xxl py-4">
                    {/* Cabecera con stats */}
                    <div className="row mb-4">
                        <div className="col-12">
                            <div className="welcome-card p-4 bg-gradient-success text-white rounded-3 shadow-sm">
                                <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                        <h2 className="h3 mb-2">
                                            <i className="fas fa-tachometer-alt me-2"></i>
                                            Panel de Control
                                        </h2>
                                        <p className="mb-0 opacity-75">
                                            Bienvenido al centro de gestión de Villa Markets
                                        </p>
                                    </div>
                                    <div className="text-end">
                                        <p className="mb-0 opacity-75">
                                            <i className="far fa-clock me-1"></i>
                                            {new Date().toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Estadísticas rápidas */}
                    <div className="row g-3 mb-4">
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0">
                                            <div className="stats-icon bg-success bg-opacity-10 text-success p-3 rounded">
                                                <i className="fas fa-cash-register"></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h6 className="mb-0">Ventas del Día</h6>
                                            <h3 className="mb-0">{stats.totalVentas}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0">
                                            <div className="stats-icon bg-warning bg-opacity-10 text-warning p-3 rounded">
                                                <i className="fas fa-shopping-bag"></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h6 className="mb-0">Pedidos Pendientes</h6>
                                            <h3 className="mb-0">{stats.pedidosPendientes}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0">
                                            <div className="stats-icon bg-info bg-opacity-10 text-info p-3 rounded">
                                                <i className="fas fa-users"></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h6 className="mb-0">Nuevos Clientes</h6>
                                            <h3 className="mb-0">{stats.clientesNuevos}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-12 col-sm-6 col-lg-3">
                            <div className="card border-0 shadow-sm h-100">
                                <div className="card-body">
                                    <div className="d-flex align-items-center">
                                        <div className="flex-shrink-0">
                                            <div className="stats-icon bg-primary bg-opacity-10 text-primary p-3 rounded">
                                                <i className="fas fa-box"></i>
                                            </div>
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h6 className="mb-0">Productos Activos</h6>
                                            <h3 className="mb-0">{stats.productosActivos}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Grid principal y actividad reciente */}
                    <div className="row g-4">
                        {/* Columna principal */}
                        <div className="col-12 col-lg-8">
                            <div className="row g-4">
                                {/* Gestión de Usuarios */}
                                <div className="col-12 col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-4">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0">
                                                    <div className="feature-icon bg-info bg-opacity-10 text-info p-3 rounded">
                                                        <i className="fas fa-users fs-4"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h5 className="card-title fw-bold mb-0">Gestión de Usuarios</h5>
                                                </div>
                                            </div>
                                            <p className="card-text text-muted mb-3">
                                                Administra usuarios, roles y permisos del sistema.
                                            </p>
                                            <div className="d-flex gap-2">
                                                <button onClick={handleGestionUsuarios} className="btn btn-info flex-grow-1">
                                                    <i className="fas fa-users me-2"></i>Ver Usuarios
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Gestión de Productos */}
                                <div className="col-12 col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-4">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0">
                                                    <div className="feature-icon bg-success bg-opacity-10 text-success p-3 rounded">
                                                        <i className="fas fa-box fs-4"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h5 className="card-title fw-bold mb-0">Gestión de Productos</h5>
                                                </div>
                                            </div>
                                            <p className="card-text text-muted mb-3">
                                                Administra el catálogo de productos y precios.
                                            </p>
                                            <div className="d-flex gap-2">
                                                <button onClick={handleGestionProductos} className="btn btn-success flex-grow-1">
                                                    <i className="fas fa-box me-2"></i>Ver Productos
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reportes */}
                                <div className="col-12 col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-4">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0">
                                                    <div className="feature-icon bg-primary bg-opacity-10 text-primary p-3 rounded">
                                                        <i className="fas fa-chart-line fs-4"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h5 className="card-title fw-bold mb-0">Reportes y Análisis</h5>
                                                </div>
                                            </div>
                                            <p className="card-text text-muted mb-3">
                                                Visualiza estadísticas y reportes detallados.
                                            </p>
                                            <div className="d-flex gap-2">
                                                <button onClick={handleReportes} className="btn btn-primary flex-grow-1">
                                                    <i className="fas fa-chart-bar me-2"></i>Ver Reportes
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Tiendas */}
                                <div className="col-12 col-md-6">
                                    <div className="card border-0 shadow-sm h-100">
                                        <div className="card-body p-4">
                                            <div className="d-flex align-items-center mb-3">
                                                <div className="flex-shrink-0">
                                                    <div className="feature-icon bg-secondary bg-opacity-10 text-secondary p-3 rounded">
                                                        <i className="fas fa-store fs-4"></i>
                                                    </div>
                                                </div>
                                                <div className="flex-grow-1 ms-3">
                                                    <h5 className="card-title fw-bold mb-0">Gestión de Tiendas</h5>
                                                </div>
                                            </div>
                                            <p className="card-text text-muted mb-3">
                                                Administra los minimarkets asociados.
                                            </p>
                                            <div className="d-flex gap-2">
                                                <button onClick={handleGestionTiendas} className="btn btn-secondary flex-grow-1">
                                                    <i className="fas fa-store me-2"></i>Ver Tiendas
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Columna de actividad reciente */}
                        <div className="col-12 col-lg-4">
                            <div className="card border-0 shadow-sm">
                                <div className="card-header bg-white border-0 py-3">
                                    <h5 className="card-title mb-0">
                                        <i className="fas fa-history me-2"></i>
                                        Actividad Reciente
                                    </h5>
                                </div>
                                <div className="card-body p-0">
                                    <div className="list-group list-group-flush">
                                        {actividadReciente.map((actividad, index) => (
                                            <div key={index} className="list-group-item px-4 py-3">
                                                <div className="d-flex align-items-center">
                                                    <div className="flex-shrink-0">
                                                        <div className={`activity-icon bg-${actividad.color} bg-opacity-10 text-${actividad.color} p-2 rounded`}>
                                                            <i className={`fas fa-${actividad.icono}`}></i>
                                                        </div>
                                                    </div>
                                                    <div className="flex-grow-1 ms-3">
                                                        <p className="mb-0">{actividad.mensaje}</p>
                                                        <small className="text-muted">
                                                            <i className="far fa-clock me-1"></i>
                                                            Hace {actividad.tiempo}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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