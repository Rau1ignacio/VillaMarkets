import React, { useEffect, useState } from 'react';

// Datos de ejemplo para usuarios de prueba
const initialUsuarios = [
    { id: 1, nombre: 'Juan Perez', email: 'juan@mail.com', telefono: '555-1111', tipo_usuario: 'vendedor', estado: 'activo', fecha_registro: new Date().toISOString(), local_nombre: 'Tienda Centro' },
    { id: 2, nombre: 'María Gómez', email: 'maria@mail.com', telefono: '555-2222', tipo_usuario: 'cliente', estado: 'activo', fecha_registro: new Date().toISOString(), local_nombre: null },
];

// Componente principal de gestión de usuarios
const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [tiendas, setTiendas] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
    const [filtroTipo, setFiltroTipo] = useState('todos');
    const [busqueda, setBusqueda] = useState('');

    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        password: '',
        tipo_usuario: 'cliente',
        tienda_id: '',
        estado: 'activo'
    });

    // Horarios por defecto (solo referencia local para vendedores)
    const [horarios] = useState({
        lunes: { abierto: '09:00', cerrado: '19:00', activo: true },
        martes: { abierto: '09:00', cerrado: '19:00', activo: true },
        miercoles: { abierto: '09:00', cerrado: '19:00', activo: true },
        jueves: { abierto: '09:00', cerrado: '19:00', activo: true },
        viernes: { abierto: '09:00', cerrado: '19:00', activo: true },
        sabado: { abierto: '09:00', cerrado: '19:00', activo: true },
        domingo: { abierto: '07:00', cerrado: '19:00', activo: true }
    });

    useEffect(() => {
        setUsuarios(initialUsuarios);
        setTiendas([{ id: 1, nombre: 'Tienda Centro' }, { id: 2, nombre: 'Tienda Norte' }]);
    }, []);

    const usuariosFiltrados = usuarios.filter(u => {
        const cumpleTipo = filtroTipo === 'todos' || u.tipo_usuario === filtroTipo;
        const texto = (u.nombre + ' ' + u.email).toLowerCase();
        const cumpleBusqueda = texto.includes(busqueda.toLowerCase());
        return cumpleTipo && cumpleBusqueda;
    });

    const abrirNuevo = () => {
        setUsuarioSeleccionado(null);
        setFormData({ nombre: '', email: '', password: '', tipo_usuario: 'cliente', tienda_id: '', estado: 'activo' });
        setMostrarModal(true);
    };

    const editarUsuario = (usuario) => {
        setUsuarioSeleccionado(usuario);
        setFormData({
            nombre: usuario.nombre || '',
            email: usuario.email || '',
            password: '',
            tipo_usuario: usuario.tipo_usuario || 'cliente',
            tienda_id: tiendas.find(t => t.nombre === usuario.local_nombre)?.id || '',
            estado: usuario.estado || 'activo'
        });
        setMostrarModal(true);
    };

    const guardarUsuarioLocal = (e) => {
        e.preventDefault();
        if (!formData.nombre || !formData.email) {
            alert('Nombre y email son obligatorios');
            return;
        }
        if (usuarioSeleccionado) {
            // actualizar
            setUsuarios(prev => prev.map(u => u.id === usuarioSeleccionado.id ? { ...u, ...formData, local_nombre: tiendas.find(t => t.id == formData.tienda_id)?.nombre || u.local_nombre } : u));
        } else {
            // crear (id simple incremental)
            const nuevoId = usuarios.length ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
            const nuevo = {
                id: nuevoId,
                nombre: formData.nombre,
                email: formData.email,
                telefono: formData.telefono || '',
                tipo_usuario: formData.tipo_usuario,
                estado: formData.estado,
                fecha_registro: new Date().toISOString(),
                local_nombre: tiendas.find(t => t.id == formData.tienda_id)?.nombre || null
            };
            setUsuarios(prev => [...prev, nuevo]);
        }
        setMostrarModal(false);
    };

    const eliminarUsuario = (id) => {
        if (window.confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) {
            setUsuarios(prev => prev.filter(u => u.id !== id));
        }
    };

    const abrirModalHorarios = (usuario) => {
        if (usuario.tipo_usuario !== 'vendedor') {
            alert('Solo los vendedores tienen horarios');
            return;
        }
        // implementación simple: mostrar horarios actuales (sin persistencia)
        alert(`Horarios de ${usuario.nombre} (${usuario.local_nombre || 'sin local'}):\n` +
            Object.entries(horarios).map(([dia, h]) => `${dia}: ${h.abierto} - ${h.cerrado} ${h.activo ? '' : '(cerrado)'}`).join('\n')
        );
    };

    return (
        <div className="container py-4">
            {/* Encabezado */}
            <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h2 className="mb-1">
                            <i className="fas fa-users me-2 text-primary"></i>
                            Gestión de Usuarios
                        </h2>
                        <p className="text-muted mb-0">Administra los usuarios registrados en la plataforma</p>
                    </div>
                    <button className="btn btn-primary" onClick={abrirNuevo}>
                        <i className="fas fa-user-plus me-2"></i>
                        Nuevo Usuario
                    </button>
                </div>
            </div>

            {/* Filtros y búsqueda */}
            <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
                <div className="row g-3 align-items-center">
                    <div className="col-md-8">
                        <div className="btn-group" role="group">
                            <button 
                                onClick={() => setFiltroTipo('todos')} 
                                className={`btn ${filtroTipo === 'todos' ? 'btn-primary' : 'btn-outline-primary'}`}
                            >
                                <i className="fas fa-users me-2"></i>
                                Todos ({usuarios.length})
                            </button>
                            <button 
                                onClick={() => setFiltroTipo('cliente')} 
                                className={`btn ${filtroTipo === 'cliente' ? 'btn-primary' : 'btn-outline-primary'}`}
                            >
                                <i className="fas fa-user me-2"></i>
                                Clientes ({usuarios.filter(u => u.tipo_usuario === 'cliente').length})
                            </button>
                            <button 
                                onClick={() => setFiltroTipo('vendedor')} 
                                className={`btn ${filtroTipo === 'vendedor' ? 'btn-primary' : 'btn-outline-primary'}`}
                            >
                                <i className="fas fa-store me-2"></i>
                                Vendedores ({usuarios.filter(u => u.tipo_usuario === 'vendedor').length})
                            </button>
                            <button 
                                onClick={() => setFiltroTipo('admin')} 
                                className={`btn ${filtroTipo === 'admin' ? 'btn-primary' : 'btn-outline-primary'}`}
                            >
                                <i className="fas fa-user-shield me-2"></i>
                                Admins ({usuarios.filter(u => u.tipo_usuario === 'admin').length})
                            </button>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="fas fa-search text-muted"></i>
                            </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por nombre o email..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white rounded-3 shadow-sm p-4">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="table-light">
                            <tr>
                                <th>Usuario</th>
                                <th>Contacto</th>
                                <th>Tipo</th>
                                <th>Local</th>
                                <th>Estado</th>
                                <th>Registro</th>
                                <th className="text-end">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuariosFiltrados.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="text-center py-5">
                                        <i className="fas fa-users-slash text-muted fs-1 mb-3 d-block"></i>
                                        <p className="text-muted mb-0">No se encontraron usuarios</p>
                                    </td>
                                </tr>
                            ) : usuariosFiltrados.map(usuario => (
                                <tr key={usuario.id}>
                                    <td>
                                        <div className="d-flex align-items-center">
                                            <div className={`bg-light rounded-circle p-2 me-3 ${usuario.tipo_usuario === 'admin' ? 'bg-warning bg-opacity-25' : ''}`}>
                                                <i className={`fas fa-${usuario.tipo_usuario === 'admin' ? 'user-shield text-warning' : usuario.tipo_usuario === 'vendedor' ? 'store text-primary' : 'user text-secondary'}`}></i>
                                            </div>
                                            <div>
                                                <div className="fw-bold">{usuario.nombre}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="small">
                                            <div><i className="fas fa-envelope me-1 text-muted"></i> {usuario.email}</div>
                                            {usuario.telefono && <div><i className="fas fa-phone me-1 text-muted"></i> {usuario.telefono}</div>}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${
                                            usuario.tipo_usuario === 'admin' ? 'bg-warning text-dark' : 
                                            usuario.tipo_usuario === 'vendedor' ? 'bg-primary' : 
                                            'bg-secondary'
                                        }`}>
                                            {usuario.tipo_usuario}
                                        </span>
                                    </td>
                                    <td>
                                        {usuario.local_nombre ? (
                                            <div className="small">
                                                <i className="fas fa-store me-1 text-primary"></i>
                                                {usuario.local_nombre}
                                            </div>
                                        ) : (
                                            <span className="text-muted">-</span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`badge ${usuario.estado === 'activo' ? 'bg-success' : 'bg-danger'}`}>
                                            {usuario.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="small text-muted">
                                            <i className="fas fa-calendar-alt me-1"></i>
                                            {new Date(usuario.fecha_registro).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="d-flex justify-content-end gap-2">
                                            {usuario.tipo_usuario === 'vendedor' && (
                                                <button 
                                                    className="btn btn-sm btn-light" 
                                                    onClick={() => abrirModalHorarios(usuario)}
                                                    title="Ver horarios"
                                                >
                                                    <i className="fas fa-clock text-primary"></i>
                                                </button>
                                            )}
                                            <button 
                                                className="btn btn-sm btn-light"
                                                onClick={() => editarUsuario(usuario)}
                                                title="Editar usuario"
                                            >
                                                <i className="fas fa-edit text-primary"></i>
                                            </button>
                                            <button 
                                                className="btn btn-sm btn-light"
                                                onClick={() => eliminarUsuario(usuario.id)}
                                                title="Eliminar usuario"
                                            >
                                                <i className="fas fa-trash text-danger"></i>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de usuario */}
            {mostrarModal && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className={`fas fa-${usuarioSeleccionado ? 'edit' : 'user-plus'} me-2 ${usuarioSeleccionado ? 'text-primary' : 'text-success'}`}></i>
                                    {usuarioSeleccionado ? 'Editar' : 'Nuevo'} Usuario
                                </h5>
                                <button type="button" className="btn-close" onClick={() => setMostrarModal(false)}></button>
                            </div>
                            <form onSubmit={guardarUsuarioLocal}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label">Nombre completo</label>
                                        <input 
                                            type="text"
                                            className="form-control"
                                            placeholder="Ej: Juan Pérez"
                                            required 
                                            value={formData.nombre} 
                                            onChange={e => setFormData({ ...formData, nombre: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input 
                                            type="email"
                                            className="form-control"
                                            placeholder="Ej: juan@mail.com"
                                            required 
                                            value={formData.email} 
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Teléfono</label>
                                        <input 
                                            type="tel"
                                            className="form-control"
                                            placeholder="Ej: +56 9 1234 5678"
                                            value={formData.telefono} 
                                            onChange={e => setFormData({ ...formData, telefono: e.target.value })}
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Tipo de usuario</label>
                                        <select 
                                            className="form-select"
                                            value={formData.tipo_usuario} 
                                            onChange={e => setFormData({ ...formData, tipo_usuario: e.target.value })}
                                        >
                                            <option value="cliente">Cliente</option>
                                            <option value="vendedor">Vendedor</option>
                                            <option value="admin">Administrador</option>
                                        </select>
                                    </div>
                                    {formData.tipo_usuario === 'vendedor' && (
                                        <div className="mb-3">
                                            <label className="form-label">Local asignado</label>
                                            <select 
                                                className="form-select"
                                                value={formData.tienda_id} 
                                                onChange={e => setFormData({ ...formData, tienda_id: e.target.value })}
                                            >
                                                <option value="">Sin local asignado</option>
                                                {tiendas.map(t => (
                                                    <option key={t.id} value={t.id}>{t.nombre}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-light" onClick={() => setMostrarModal(false)}>
                                        <i className="fas fa-times me-2"></i>
                                        Cancelar
                                    </button>
                                    <button type="submit" className={`btn btn-${usuarioSeleccionado ? 'primary' : 'success'}`}>
                                        <i className={`fas fa-${usuarioSeleccionado ? 'save' : 'plus'} me-2`}></i>
                                        {usuarioSeleccionado ? 'Guardar cambios' : 'Crear usuario'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionUsuarios;