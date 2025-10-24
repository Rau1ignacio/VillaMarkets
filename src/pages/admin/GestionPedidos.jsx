import React, { useState, useEffect } from 'react';
import '../../styles/GestionPedidos.css';
import Logo from "../../images/Logos/Logotipo Transparente.png"


const GestionPedidos = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState(''); // 'create', 'edit', 'view', 'delete'
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [filtroEstado, setFiltroEstado] = useState('todos');
    const [busqueda, setBusqueda] = useState('');
    
    // Estado para el formulario
    const [formData, setFormData] = useState({
        id: '',
        cliente: '',
        email: '',
        telefono: '',
        fecha: '',
        hora: '',
        estado: 'pendiente',
        total: 0,
        tienda: '',
        direccion: '',
        productos: []
    });

    const [newProducto, setNewProducto] = useState({
        nombre: '',
        cantidad: 1,
        precio: 0
    });
//// Carga inicial de datos (simulada)
    useEffect(() => {
        // Datos de ejemplo
        const pedidosEjemplo = [
            {
                id: 'PED001',
                cliente: 'Juan Pérez',
                email: 'juan@email.com',
                telefono: '123-456-789',
                fecha: '2025-10-15',
                hora: '14:30',
                estado: 'pendiente',
                totalVentas: "CLP 15,420",
                tienda: 'Minimarket Central',
                direccion: 'Av. Principal 123',
                productos: [
                    { nombre: 'Coca Cola 2L', cantidad: 2, precio: 1600 },
                    { nombre: 'Pan Integral', cantidad: 1, precio: 350 },
                    { nombre: 'Leche Entera 1L', cantidad: 3, precio: 2600 }
                ]
            },
            {
                id: 'PED002',
                cliente: 'María García',
                email: 'maria@email.com',
                telefono: '987-654-321',
                fecha: '2025-10-15',
                hora: '16:15',
                estado: 'preparando',
                total:  9825,
                tienda: 'Minimarket Norte',
                direccion: 'Calle Los Olivos 456',
                productos: [
                    { nombre: 'Arroz 1kg', cantidad: 2, precio: 1200 },
                    { nombre: 'Aceite Vegetal', cantidad: 1, precio: 2500 },
                    { nombre: 'Detergente', cantidad: 1, precio: 4125 }
                ]
            }
        ];

        // Simular carga de datos
        setTimeout(() => {
            setPedidos(pedidosEjemplo);
            setLoading(false);
        }, 1000);
    }, []);

    // Funciones CRUD crear pedidos 
    const crearPedido = () => {
        const nuevoPedido = {
            ...formData,
            id: `PED${String(pedidos.length + 1).padStart(3, '0')}`,
            total: formData.productos.reduce((sum, prod) => sum + prod.precio, 0)
        };
        
        setPedidos([...pedidos, nuevoPedido]);
        cerrarModal();
        alert('Pedido creado exitosamente');
    };
    //// Función para actualizar pedidos
    const actualizarPedido = () => {
        const pedidosActualizados = pedidos.map(pedido =>
            pedido.id === formData.id 
                ? { 
                    ...formData, 
                    total: formData.productos.reduce((sum, prod) => sum + prod.precio, 0)
                  }
                : pedido
        );
        
        setPedidos(pedidosActualizados);
        cerrarModal();
        alert('Pedido actualizado exitosamente');
    };
    // Función para eliminar pedidos
    const eliminarPedido = (id) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
            setPedidos(pedidos.filter(pedido => pedido.id !== id));
            alert('Pedido eliminado exitosamente');
        }
    };

    // Funciones de modal
    const abrirModal = (type, pedido = null) => {
        setModalType(type);
        setSelectedPedido(pedido);
        
        if (type === 'create') {
            setFormData({
                id: '',
                cliente: '',
                email: '',
                telefono: '',
                fecha: new Date().toISOString().split('T')[0],
                hora: new Date().toTimeString().slice(0, 5),
                estado: 'pendiente',
                total: 0,
                tienda: '',
                direccion: '',
                productos: []
            });
        } else if (type === 'edit' && pedido) {
            setFormData(pedido);
        }
        
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setModalType('');
        setSelectedPedido(null);
        setNewProducto({ nombre: '', cantidad: 1, precio: 0 });
    };

    // Funciones de productos
    const agregarProducto = () => {
        if (newProducto.nombre && newProducto.cantidad > 0 && newProducto.precio > 0) {
            setFormData({
                ...formData,
                productos: [...formData.productos, { ...newProducto }]
            });
            setNewProducto({ nombre: '', cantidad: 1, precio: 0 });
        }
    };
        /// Función para eliminar un producto del pedido
    const eliminarProducto = (index) => {
        const productosActualizados = formData.productos.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            productos: productosActualizados
        });
    };

    // Filtrado de pedidos
    const filtrarPedidos = () => {
        return pedidos.filter(pedido => {
            const matchEstado = filtroEstado === 'todos' || pedido.estado === filtroEstado;
            const matchBusqueda = pedido.cliente.toLowerCase().includes(busqueda.toLowerCase()) ||
                                 pedido.id.toLowerCase().includes(busqueda.toLowerCase());
            return matchEstado && matchBusqueda;
        });
    };
    // 
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const pedidosFiltrados = filtrarPedidos();

    if (loading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-12">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h2 className="h4 mb-0">
                                <i className="fas fa-shopping-cart me-2 text-primary"></i>
                                Gestión de Pedidos
                            </h2>
                            <p className="text-muted mb-0">Administra todos los pedidos de la plataforma</p>
                        </div>
                        <div className="d-flex gap-2">
                            <button 
                                onClick={() => abrirModal('create')}
                                className="btn btn-success"
                            >
                                <i className="fas fa-plus me-2"></i>
                                Nuevo Pedido
                            </button>
                            <button 
                                onClick={() => window.history.back()} 
                                className="btn btn-outline-secondary"
                            >
                                <i className="fas fa-arrow-left me-2"></i>
                                Volver
                            </button>
                        </div>
                    </div>

                    {/* Filtros */}
                    <div className="row mb-4">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Filtrar por estado:</label>
                            <select 
                                className="form-select"
                                value={filtroEstado}
                                onChange={(e) => setFiltroEstado(e.target.value)}
                            >
                                <option value="todos">Todos</option>
                                <option value="pendiente">Pendiente</option>
                                <option value="preparando">Preparando</option>
                                <option value="entregado">Entregado</option>
                            </select>
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Buscar:</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Cliente o ID..."
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 mb-3 d-flex align-items-end">
                            <div className="alert alert-info w-100 mb-0">
                                <strong>Total: {pedidosFiltrados.length} pedidos</strong>
                            </div>
                        </div>
                    </div>

                    {/* Tabla */}
                    <div className="card">
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-striped table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>ID</th>
                                            <th>Cliente</th>
                                            <th>Fecha</th>
                                            <th>Estado</th>
                                            <th>Total</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {pedidosFiltrados.length > 0 ? (
                                            pedidosFiltrados.map((pedido) => (
                                                <tr key={pedido.id}>
                                                    <td className="fw-bold">{pedido.id}</td>
                                                    <td>
                                                        <div>
                                                            <div>{pedido.cliente}</div>
                                                            <small className="text-muted">{pedido.email}</small>
                                                        </div>
                                                    </td>
                                                    <td>{pedido.fecha} {pedido.hora}</td>
                                                    <td>
                                                        <span className={`badge ${
                                                            pedido.estado === 'pendiente' ? 'bg-warning' :
                                                            pedido.estado === 'preparando' ? 'bg-info' :
                                                            pedido.estado === 'entregado' ? 'bg-success' : 'bg-secondary'
                                                        }`}>
                                                            {pedido.estado}
                                                        </span>
                                                    </td>
                                                    <td className="fw-bold text-success">CLP {pedido.total.toFixed(0)}</td>
                                                    <td>
                                                        <div className="btn-group" role="group">
                                                            <button
                                                                onClick={() => abrirModal('view', pedido)}
                                                                className="btn btn-sm btn-outline-primary"
                                                                title="Ver detalles"
                                                            >
                                                                <i className="fas fa-eye"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => abrirModal('edit', pedido)}
                                                                className="btn btn-sm btn-outline-warning"
                                                                title="Editar"
                                                            >
                                                                <i className="fas fa-edit"></i>
                                                            </button>
                                                            <button
                                                                onClick={() => eliminarPedido(pedido.id)}
                                                                className="btn btn-sm btn-outline-danger"
                                                                title="Eliminar"
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center py-4">
                                                    <i className="fas fa-inbox text-muted fs-1"></i>
                                                    <p className="text-muted mt-2">No se encontraron pedidos</p>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal CRUD */}
            {showModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {modalType === 'create' && <><i className="fas fa-plus me-2"></i>Nuevo Pedido</>}
                                    {modalType === 'edit' && <><i className="fas fa-edit me-2"></i>Editar Pedido</>}
                                    {modalType === 'view' && <><i className="fas fa-eye me-2"></i>Ver Pedido {selectedPedido?.id}</>}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={cerrarModal}
                                ></button>
                            </div>
                            
                            <div className="modal-body">
                                {modalType === 'view' ? (
                                    // Vista de solo lectura
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h6 className="fw-bold">Información del Cliente</h6>
                                            <p><strong>Nombre:</strong> {selectedPedido?.cliente}</p>
                                            <p><strong>Email:</strong> {selectedPedido?.email}</p>
                                            <p><strong>Teléfono:</strong> {selectedPedido?.telefono}</p>
                                            <p><strong>Dirección:</strong> {selectedPedido?.direccion}</p>
                                        </div>
                                        <div className="col-md-6">
                                            <h6 className="fw-bold">Información del Pedido</h6>
                                            <p><strong>Fecha:</strong> {selectedPedido?.fecha}</p>
                                            <p><strong>Hora:</strong> {selectedPedido?.hora}</p>
                                            <p><strong>Tienda:</strong> {selectedPedido?.tienda}</p>
                                            <p><strong>Total:</strong> CLP ${selectedPedido?.total.toFixed(0)}</p>
                                        </div>
                                        <div className="col-12">
                                            <h6 className="fw-bold">Productos</h6>
                                            <div className="table-responsive">
                                                <table className="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Producto</th>
                                                            <th>Cantidad</th>
                                                            <th>Precio</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedPedido?.productos.map((producto, index) => (
                                                            <tr key={index}>
                                                                <td>{producto.nombre}</td>
                                                                <td>{producto.cantidad}</td>
                                                                <td>CLP ${producto.precio.toFixed(2)}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    // Formulario para crear/editar
                                    <form>
                                        <div className="row">
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Cliente</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="cliente"
                                                    value={formData.cliente}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Email</label>
                                                <input
                                                    type="email"
                                                    className="form-control"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    className="form-control"
                                                    name="telefono"
                                                    value={formData.telefono}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Estado</label>
                                                <select
                                                    className="form-select"
                                                    name="estado"
                                                    value={formData.estado}
                                                    onChange={handleInputChange}
                                                >
                                                    <option value="pendiente">Pendiente</option>
                                                    <option value="preparando">Preparando</option>
                                                    <option value="entregado">Entregado</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Fecha</label>
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    name="fecha"
                                                    value={formData.fecha}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-md-6 mb-3">
                                                <label className="form-label">Hora</label>
                                                <input
                                                    type="time"
                                                    className="form-control"
                                                    name="hora"
                                                    value={formData.hora}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label className="form-label">Tienda</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="tienda"
                                                    value={formData.tienda}
                                                    onChange={handleInputChange}
                                                    required
                                                />
                                            </div>
                                            <div className="col-12 mb-3">
                                                <label className="form-label">Dirección</label>
                                                <textarea
                                                    className="form-control"
                                                    name="direccion"
                                                    value={formData.direccion}
                                                    onChange={handleInputChange}
                                                    rows="2"
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>

                                        {/* Sección de productos */}
                                        <hr />
                                        <h6 className="fw-bold">Productos del Pedido</h6>
                                        
                                        {/* Agregar nuevo producto */}
                                        <div className="row align-items-end mb-3">
                                            <div className="col-md-5">
                                                <label className="form-label">Producto</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    placeholder="Nombre del producto"
                                                    value={newProducto.nombre}
                                                    onChange={(e) => setNewProducto({
                                                        ...newProducto,
                                                        nombre: e.target.value
                                                    })}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <label className="form-label">Cantidad</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    min="1"
                                                    value={newProducto.cantidad}
                                                    onChange={(e) => setNewProducto({
                                                        ...newProducto,
                                                        cantidad: parseInt(e.target.value) || 1
                                                    })}
                                                />
                                            </div>
                                            <div className="col-md-3">
                                                <label className="form-label">Precio</label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    step="0.01"
                                                    min="0"
                                                    value={newProducto.precio}
                                                    onChange={(e) => setNewProducto({
                                                        ...newProducto,
                                                        precio: parseFloat(e.target.value) || 0
                                                    })}
                                                />
                                            </div>
                                            <div className="col-md-2">
                                                <button
                                                    type="button"
                                                    onClick={agregarProducto}
                                                    className="btn btn-primary w-100"
                                                >
                                                    <i className="fas fa-plus"></i>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Lista de productos */}
                                        {formData.productos.length > 0 && (
                                            <div className="table-responsive">
                                                <table className="table table-sm">
                                                    <thead>
                                                        <tr>
                                                            <th>Producto</th>
                                                            <th>Cantidad</th>
                                                            <th>Precio</th>
                                                            <th>Acciones</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {formData.productos.map((producto, index) => (
                                                            <tr key={index}>
                                                                <td>{producto.nombre}</td>
                                                                <td>{producto.cantidad}</td>
                                                                <td>CLP {producto.precio.toFixed(0)}</td>
                                                                <td>
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => eliminarProducto(index)}
                                                                        className="btn btn-sm btn-outline-danger"
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                            <tfoot>
                                                        <tr className="table-light">
                                                            <th colSpan="2">Total</th>
                                                            <th colSpan="2">
                                                                CLP {formData.productos.reduce((sum, prod) => sum + prod.precio, 0).toFixed(0)}
                                                            </th>
                                                        </tr>
                                                    </tfoot>
                                                </table>
                                            </div>
                                        )}
                                    </form>
                                )}
                            </div>

                            <div className="modal-footer">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={cerrarModal}
                                >
                                    {modalType === 'view' ? 'Cerrar' : 'Cancelar'}
                                </button>
                                {modalType !== 'view' && (
                                    <button 
                                        type="button" 
                                        className="btn btn-primary"
                                        onClick={modalType === 'create' ? crearPedido : actualizarPedido}
                                    >
                                        <i className={`fas ${modalType === 'create' ? 'fa-plus' : 'fa-save'} me-2`}></i>
                                        {modalType === 'create' ? 'Crear Pedido' : 'Guardar Cambios'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

           
        </div>
    );
};

export default GestionPedidos;
