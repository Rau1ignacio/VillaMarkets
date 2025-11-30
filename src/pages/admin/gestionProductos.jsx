import React, { useState, useEffect } from 'react';
import productoService from '../../services/productoService';
import tiendaService from '../../services/tiendaService';

const GestionProductos = () => {
  const [productos, setProductos] = useState([]);
  const [tiendas, setTiendas] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    nombre: '',
    precio: 0,
    imagen: '',
    descripcion: '',
    categoria: '',
    stock: 0,
    tiendaId: null,
    activo: true
  });
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadProductos();
    loadTiendas();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await productoService.listar();
      setProductos(data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al cargar productos';
      setError(errorMsg);
      console.error('Error al cargar productos:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTiendas = async () => {
    try {
      const data = await tiendaService.listar();
      setTiendas(data || []);
    } catch (err) {
      console.error('Error al cargar tiendas:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]: name === 'precio' || name === 'stock' || name === 'tiendaId'
        ? (value === '' ? null : Number(value))
        : value
    }));
  };

  const resetForm = () => {
    setForm({
      nombre: '',
      precio: 0,
      imagen: '',
      descripcion: '',
      categoria: '',
      stock: 0,
      tiendaId: null,
      activo: true
    });
    setEditingId(null);
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    if (!form.nombre || !form.nombre.trim()) {
      alert('Debes ingresar el nombre del producto.');
      return;
    }

    if (!form.tiendaId) {
      alert('Debes seleccionar un minimarket para el producto.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await productoService.crear(form);
      await loadProductos();
      resetForm();
      setShowModal(false);

      if (window.Swal) {
        window.Swal.fire({
          icon: 'success',
          title: '¡Producto creado!',
          text: `El producto "${form.nombre}" ha sido agregado exitosamente.`,
          confirmButtonColor: '#2d8f3c',
          timer: 3000
        });
      } else {
        alert('Producto creado exitosamente');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al crear producto';
      setError(errorMsg);
      console.error('Error al crear producto:', err);

      if (window.Swal) {
        window.Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg,
          confirmButtonColor: '#dc3545'
        });
      } else {
        alert('Error: ' + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError('');
      await productoService.actualizar(editingId, form);
      await loadProductos();
      resetForm();
      setShowModal(false);

      if (window.Swal) {
        window.Swal.fire({
          icon: 'success',
          title: 'Actualizado',
          text: 'El producto ha sido actualizado exitosamente.',
          confirmButtonColor: '#2d8f3c',
          timer: 2000
        });
      } else {
        alert('Producto actualizado exitosamente');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al actualizar producto';
      setError(errorMsg);
      console.error('Error al actualizar producto:', err);

      if (window.Swal) {
        window.Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg,
          confirmButtonColor: '#dc3545'
        });
      } else {
        alert('Error: ' + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Eliminar producto?')) return;

    try {
      setLoading(true);
      setError('');
      await productoService.eliminar(id);
      await loadProductos();

      if (window.Swal) {
        window.Swal.fire({
          icon: 'success',
          title: 'Eliminado',
          text: 'El producto ha sido eliminado exitosamente.',
          confirmButtonColor: '#2d8f3c',
          timer: 2000
        });
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al eliminar producto';
      setError(errorMsg);
      console.error('Error al eliminar producto:', err);

      if (window.Swal) {
        window.Swal.fire({
          icon: 'error',
          title: 'Error',
          text: errorMsg,
          confirmButtonColor: '#dc3545'
        });
      } else {
        alert('Error: ' + errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (p) => {
    setEditingId(p.id);
    setForm({
      nombre: p.nombre || '',
      precio: p.precio || 0,
      imagen: p.imagen || '',
      descripcion: p.descripcion || '',
      categoria: p.categoria || '',
      stock: p.stock || 0,
      tiendaId: p.tiendaId || null,
      activo: p.activo !== undefined ? p.activo : true
    });
    setShowModal(true);
  };

  const startCreate = () => {
    resetForm();
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    if (editingId) {
      handleUpdate(e);
    } else {
      handleCreate(e);
    }
  };

  const editing = editingId !== null;

  // Función para obtener el nombre de la tienda por ID
  const getTiendaNombre = (tiendaId) => {
    const tienda = tiendas.find(t => t.id === tiendaId);
    return tienda ? tienda.nombre : 'Sin tienda';
  };

  return (
    <div className="container py-4">
      {/* Mensaje de error global */}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Encabezado mejorado */}
      <div className="bg-white rounded-3 shadow-sm p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-1">
              <i className="fas fa-box-open me-2 text-primary"></i>
              Gestión de Productos
            </h2>
            <p className="text-muted mb-0">Administra el catálogo de productos de todos los minimarkets</p>
          </div>
          <div className="d-flex gap-2">
            <button className="btn btn-primary" onClick={startCreate} disabled={loading}>
              <i className="fas fa-plus me-2"></i>Nuevo Producto
            </button>
            <button className="btn btn-outline-primary" onClick={loadProductos} disabled={loading}>
              <i className="fas fa-sync-alt me-2"></i>Actualizar
            </button>
          </div>
        </div>
      </div>

      {loading && productos.length === 0 ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="text-muted">Cargando productos...</p>
        </div>
      ) : (
        <div className="row">
          <div className="col-md-12">
            <div className="list-group shadow-sm">
              {productos.map(p => (
                <div key={p.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 border-start border-5 border-primary border-opacity-25">
                  <div className="d-flex align-items-center gap-3">
                    <div className="bg-light rounded p-2">
                      {p.imagen ? (
                        <img
                          src={p.imagen.startsWith('http') ? p.imagen : `/images/${p.imagen}`}
                          alt={p.nombre}
                          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <i className="fas fa-box text-primary fs-4"></i>
                      )}
                    </div>
                    <div>
                      <h6 className="mb-0 fw-bold">{p.nombre}</h6>
                      <div className="text-muted small">
                        <span className="badge bg-success bg-opacity-10 text-success me-2">CLP ${p.precio?.toLocaleString() || 0}</span>
                        <span className="badge bg-primary bg-opacity-10 text-primary me-2">Stock: {p.stock || 0}</span>
                        {p.categoria && <span className="badge bg-info bg-opacity-10 text-info me-2">{p.categoria}</span>}
                        <span className="badge bg-secondary bg-opacity-10 text-secondary">{getTiendaNombre(p.tiendaId)}</span>
                      </div>
                      {p.descripcion && <div className="text-muted small mt-1">{p.descripcion}</div>}
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-light" onClick={() => startEdit(p)} title="Editar" disabled={loading}>
                      <i className="fas fa-edit text-primary"></i>
                    </button>
                    <button className="btn btn-sm btn-light" onClick={() => handleDelete(p.id)} title="Eliminar" disabled={loading}>
                      <i className="fas fa-trash text-danger"></i>
                    </button>
                  </div>
                </div>
              ))}
              {productos.length === 0 && !loading && (
                <div className="text-center py-5">
                  <i className="fas fa-box-open text-muted fs-1 mb-3"></i>
                  <p className="text-muted mb-0">No hay productos registrados</p>
                  <button className="btn btn-primary mt-3" onClick={startCreate}>
                    <i className="fas fa-plus me-2"></i>Crear primer producto
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal: menú detallado para agregar/editar */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog" onClick={() => setShowModal(false)} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg" role="document" onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0 bg-primary bg-opacity-10">
                <h5 className="modal-title">
                  <i className={`fas fa-${editing ? 'edit' : 'plus'} me-2 text-primary`}></i>
                  {editing ? 'Editar producto' : 'Nuevo producto'}
                </h5>
                <button type="button" className="btn-close" aria-label="Close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Nombre *</label>
                      <input name="nombre" className="form-control" placeholder="Nombre del producto" value={form.nombre} onChange={handleChange} required disabled={loading} />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Precio *</label>
                      <input name="precio" className="form-control" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} min="0" required disabled={loading} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Imagen (URL o nombre de archivo)</label>
                    <input name="imagen" className="form-control" placeholder="Ej: arroz.jpg o https://..." value={form.imagen} onChange={handleChange} disabled={loading} />
                    {form.imagen && (
                      <div className="mt-2">
                        <img
                          src={form.imagen.startsWith('http') ? form.imagen : `/images/${form.imagen}`}
                          alt="Vista previa"
                          style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, border: '1px solid #ccc' }}
                          onError={e => { e.target.style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea name="descripcion" className="form-control" placeholder="Descripción del producto" value={form.descripcion} onChange={handleChange} rows={2} disabled={loading} />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Categoría *</label>
                      <select name="categoria" className="form-select" value={form.categoria} onChange={handleChange} required disabled={loading}>
                        <option value="">Selecciona una categoría</option>
                        <option value="abarrotes">Abarrotes</option>
                        <option value="lacteos">Lácteos</option>
                        <option value="frutas">Frutas y Verduras</option>
                        <option value="limpieza">Limpieza</option>
                        <option value="bebidas">Bebidas</option>
                        <option value="panaderia">Panadería</option>
                        <option value="congelados">Congelados</option>
                        <option value="snacks">Snacks</option>
                        <option value="otros">Otros</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Stock *</label>
                      <input name="stock" className="form-control" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} min="0" required disabled={loading} />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Minimarket *</label>
                    <select name="tiendaId" className="form-select" value={form.tiendaId || ''} onChange={handleChange} required disabled={loading}>
                      <option value="">Selecciona un minimarket</option>
                      {tiendas.map(t => (
                        <option key={t.id} value={t.id}>{t.nombre}</option>
                      ))}
                    </select>
                    {tiendas.length === 0 && (
                      <small className="text-danger">
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        No hay tiendas disponibles. Crea una tienda primero.
                      </small>
                    )}
                  </div>

                  <div className="d-flex gap-2 justify-content-end">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={loading}>
                      Cancelar
                    </button>
                    <button className="btn btn-primary" type="submit" disabled={loading}>
                      <i className={`fas fa-${editing ? 'save' : 'plus'} me-2`}></i>
                      {loading ? 'Guardando...' : (editing ? 'Guardar cambios' : 'Agregar producto')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestionProductos;