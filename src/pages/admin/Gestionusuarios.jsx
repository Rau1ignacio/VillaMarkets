// ...existing code...
import React, { useEffect, useState } from 'react';


// Datos de ejemplo para usuarios de prueba
const initialUsuarios = [
    { id: 1, nombre: 'Juan Perez', email: 'juan@mail.com', telefono: '555-1111', tipo_usuario: 'vendedor', estado: 'activo', fecha_registro: new Date().toISOString(), local_nombre: 'Tienda Centro' },
    { id: 2, nombre: 'María Gómez', email: 'maria@mail.com', telefono: '555-2222', tipo_usuario: 'cliente', estado: 'activo', fecha_registro: new Date().toISOString(), local_nombre: null },
];
// Componente principal de gestión de usuarios
const GestionUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]); // Estado para almacenar la lista de usuarios
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
        <div style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <h2>Gestión de Usuarios</h2>
                <button onClick={abrirNuevo}>+ Nuevo Usuario</button>
            </div>

            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <div>
                    <button onClick={() => setFiltroTipo('todos')} className={filtroTipo === 'todos' ? 'active' : ''}>Todos ({usuarios.length})</button>
                    <button onClick={() => setFiltroTipo('cliente')} className={filtroTipo === 'cliente' ? 'active' : ''}>Clientes ({usuarios.filter(u => u.tipo_usuario === 'cliente').length})</button>
                    <button onClick={() => setFiltroTipo('vendedor')} className={filtroTipo === 'vendedor' ? 'active' : ''}>Vendedores ({usuarios.filter(u => u.tipo_usuario === 'vendedor').length})</button>
                    <button onClick={() => setFiltroTipo('admin')} className={filtroTipo === 'admin' ? 'active' : ''}>Admins ({usuarios.filter(u => u.tipo_usuario === 'admin').length})</button>
                </div>
                <input
                    type="text"
                    placeholder="buscar por nombre o email"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    style={{ flex: 1 }}
                />
            </div>

            <div className="tabla-usuarios" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Teléfono</th>
                            <th>Tipo</th>
                            <th>Local</th>
                            <th>Estado</th>
                            <th>Registro</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="8" style={{ textAlign: 'center' }}>No se encontraron resultados</td>
                            </tr>
                        ) : usuariosFiltrados.map(usuario => (
                            <tr key={usuario.id}>
                                <td>{usuario.nombre}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.telefono}</td>
                                <td>{usuario.tipo_usuario}</td>
                                <td>{usuario.local_nombre || '-'}</td>
                                <td>{usuario.estado}</td>
                                <td>{new Date(usuario.fecha_registro).toLocaleDateString()}</td>
                                <td>
                                    {usuario.tipo_usuario === 'vendedor' && (
                                        <button onClick={() => abrirModalHorarios(usuario)} title="Horarios">📅</button>
                                    )}
                                    <button onClick={() => editarUsuario(usuario)} title="Editar">✏️</button>
                                    <button onClick={() => eliminarUsuario(usuario.id)} title="Eliminar">🗑️</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {mostrarModal && (
                <div className="modal-overlay" style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={() => setMostrarModal(false)}>
                    <div className="modal-content" style={{ background: 'white', padding: 20, borderRadius: 8, minWidth: 320 }} onClick={e => e.stopPropagation()}>
                        <h3>{usuarioSeleccionado ? 'Editar' : 'Nuevo'} Usuario</h3>
                        <form onSubmit={guardarUsuarioLocal}>
                            <div>
                                <label>Nombre</label>
                                <input required value={formData.nombre} onChange={e => setFormData({ ...formData, nombre: e.target.value })} />
                            </div>
                            <div>
                                <label>Email</label>
                                <input required value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label>Teléfono</label>
                                <input value={formData.telefono} onChange={e => setFormData({ ...formData, telefono: e.target.value })} />
                            </div>
                            <div>
                                <label>Tipo</label>
                                <select value={formData.tipo_usuario} onChange={e => setFormData({ ...formData, tipo_usuario: e.target.value })}>
                                    <option value="cliente">Cliente</option>
                                    <option value="vendedor">Vendedor</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            {formData.tipo_usuario === 'vendedor' && (
                                <div>
                                    <label>Local</label>
                                    <select value={formData.tienda_id} onChange={e => setFormData({ ...formData, tienda_id: e.target.value })}>
                                        <option value="">-- ninguno --</option>
                                        {tiendas.map(t => <option key={t.id} value={t.id}>{t.nombre}</option>)}
                                    </select>
                                </div>
                            )}
                            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                                <button type="submit">{usuarioSeleccionado ? 'Actualizar' : 'Crear'}</button>
                                <button type="button" onClick={() => setMostrarModal(false)}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GestionUsuarios;
// ...existing code...
