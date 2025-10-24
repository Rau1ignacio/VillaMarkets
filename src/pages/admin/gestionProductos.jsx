import React, { useState, useEffect } from 'react';
import Tiendas from './Tiendas';



// componente de gestión de productos
const GestionProductos = () => {
    const [productos, setProductos] = useState([]); // Lista de productos
    const [editingIdx, setEditingIdx] = useState(-1); // Índice del producto en edición
  const [form, setForm] = useState({
    nombre: '',
    precio: 0,
    imagen: '',
    descripcion: '',
    categoria: '',
    stock: 0,
    minimarket: ''
  });
    const [showModal, setShowModal] = useState(false);
/// Cargar productos desde localStorage al montar el componente
  useEffect(() => {
    const productosGuardados = JSON.parse(localStorage.getItem('productos'));
    if (productosGuardados && productosGuardados.length > 0) {
      setProductos(productosGuardados);
    } else {
      setProductos([
        { id:1,nombre:'Producto a', precio:100,stock:10},
        { id:2,nombre:'Producto b',precio:200, stock:20},
      ]);
      localStorage.setItem('productos', JSON.stringify([
        { id:1,nombre:'Producto a', precio:100,stock:10},
        { id:2,nombre:'Producto b',precio:200, stock:20},
      ]));
    }
  },[]);

    // Función para manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({
      ...s,
      [name]: name === 'precio' || name === 'stock' ? Number(value) : value
    }));
  };
    // Función para agregar un nuevo producto

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.imagen || form.imagen.trim() === '') {
      alert('Debes ingresar el nombre de la imagen o URL para el producto.');
      return;
    }
    const nuevo = { id: Date.now(), ...form };
    const nuevosProductos = [nuevo, ...productos];
    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    setForm({
      nombre: '',
      precio: 0,
      imagen: '',
      descripcion: '',
      categoria: '',
      stock: 0,
      minimarket: ''
    });
  };

    // función para actualizar un producto existente
  const handleUpdate = (e) => {
    e.preventDefault();
    const nuevosProductos = productos.map((item, i) => (i === editingIdx ? { ...item, ...form } : item));
    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
    setEditingIdx(-1);
    setForm({
      nombre: '',
      precio: 0,
      imagen: '',
      descripcion: '',
      categoria: '',
      stock: 0,
      minimarket: ''
    });
  };

    // función para eliminar un producto
  const handleDelete = (id) => {
    if (!window.confirm('Eliminar producto?')) return;
    const nuevosProductos = productos.filter((prod) => prod.id !== id);
    setProductos(nuevosProductos);
    localStorage.setItem('productos', JSON.stringify(nuevosProductos));
  };
    // función para iniciar la edición de un producto
    const handleEdit = (idx) => {
        setEditingIdx(idx);
    setForm({
      nombre: productos[idx].nombre || '',
      precio: productos[idx].precio || 0,
      imagen: productos[idx].imagen || '',
      descripcion: productos[idx].descripcion || '',
      categoria: productos[idx].categoria || '',
      stock: productos[idx].stock || 0,
      minimarket: productos[idx].minimarket || ''
    });
    };

    const [tiendas, setTiendas] = useState([]);
      useEffect(() => {
  // ...tu código de productos...
  // Cargar tiendas desde localStorage
        const tiendasGuardadas = JSON.parse(localStorage.getItem('vm_stores')) || [];
        setTiendas(tiendasGuardadas);
    }, []);
// ...resto del código...

// En el formulario:
  <select name="minimarket" className="form-select" value={form.minimarket} onChange={handleChange} required>
      <option value="">Selecciona un minimarket</option>
      {tiendas.map(t => (
      <option key={t.id} value={t.name}>{t.name}</option>
        ))}
    </select>
      


        


    
    // ¿Estamos editando un producto?
    const editing = editingIdx !== -1;
    const startCreate = () => {
        setEditingIdx(-1);
        setForm({ nombre: '', precio: 0, stock: 0 });
        setShowModal(true);
    };

    // función para iniciar la edición desde la lista
    const startEdit = (p) => {
        const idx = productos.findIndex(x => x.id === p.id);
        if (idx !== -1) {
            handleEdit(idx);
            setShowModal(true);
        }
    };
    
    // 
    const handleSubmit = (e) => {
        if (editing) {
            handleUpdate(e);
        } else {
            handleCreate(e);
        }
    };

    const deleteProduct = (id) => {
        handleDelete(id);
    };

    const syncWithServer = async () => {
        // placeholder for real sync logic
        return Promise.resolve();
    };

    return ( 
         <div className="container py-4">
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
            <button className="btn btn-primary" onClick={startCreate}>
              <i className="fas fa-plus me-2"></i>Nuevo Producto
            </button>
            <button className="btn btn-outline-primary" onClick={async () => { await syncWithServer(); alert('Sync ejecutado'); }}>
              <i className="fas fa-sync-alt me-2"></i>Sincronizar
            </button>
          </div>
        </div>
      </div>

      <div className="row">

        <div className="col-md-8">
          <div className="list-group shadow-sm">
            {productos.map(p => (
              <div key={p.id} className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 border-start border-5 border-primary border-opacity-25">
                <div className="d-flex align-items-center gap-3">
                  <div className="bg-light rounded p-2">
                    <i className="fas fa-box text-primary fs-4"></i>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bold">{p.nombre}</h6>
                    <div className="text-muted small">
                      <span className="badge bg-success bg-opacity-10 text-success me-2">CLP ${p.precio.toLocaleString()}</span>
                      <span className="badge bg-primary bg-opacity-10 text-primary">Stock: {p.stock}</span>
                      {p.categoria && <span className="badge bg-info bg-opacity-10 text-info ms-2">{p.categoria}</span>}
                    </div>
                  </div>
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-sm btn-light" onClick={() => startEdit(p)} title="Editar">
                    <i className="fas fa-edit text-primary"></i>
                  </button>
                  <button className="btn btn-sm btn-light" onClick={() => { if (window.confirm('¿Estás seguro de eliminar este producto?')) deleteProduct(p.id); }} title="Eliminar">
                    <i className="fas fa-trash text-danger"></i>
                  </button>
                </div>
              </div>
            ))}
            {productos.length === 0 && (
              <div className="text-center py-5">
                <i className="fas fa-box-open text-muted fs-1 mb-3"></i>
                <p className="text-muted mb-0">No hay productos registrados</p>
              </div>
            )}
          </div>
  {/* Modal: menú detallado para agregar/editar/eliminar */}
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
            <div className="row">
              <div className="col-md-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-2">
                    <label className="form-label">Nombre</label>
                    <input name="nombre" className="form-control" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Precio</label>
                    <input name="precio" className="form-control" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} min="0" required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Imagen (nombre de archivo o URL)</label>
                    <input name="imagen" className="form-control" placeholder="Ej: arroz.jpg o https://..." value={form.imagen} onChange={handleChange} />
                    {form.imagen && (
                      <div className="mt-2">
                        <img
                          src={form.imagen.startsWith('http') ? form.imagen : `/images/${form.imagen}`}
                          alt="Vista previa"
                          style={{ maxWidth: '100%', maxHeight: 120, borderRadius: 8, border: '1px solid #ccc' }}
                          onError={e => { e.target.src = '/images/default.jpg'; }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Descripción</label>
                    <textarea name="descripcion" className="form-control" placeholder="Descripción" value={form.descripcion} onChange={handleChange} rows={2} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Categoría</label>
                    <select name="categoria" className="form-select" value={form.categoria} onChange={handleChange} required>
                      <option value="">Selecciona una categoría</option>
                      <option value="abarrotes">Abarrotes</option>
                      <option value="lacteos">Lácteos</option>
                      <option value="frutas">Frutas y Verduras</option>
                      <option value="limpieza">Limpieza</option>
                      <option value="bebidas">Bebidas</option>
                      <option value="panaderia">Panadería</option>
                      <option value="congelados">Congelados</option>
                      <option value="otros">Otros</option>
                      <option value="snacks">Snacks</option>


                      
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Stock</label>
                    <input name="stock" className="form-control" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} min="0" required />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">Minimarket</label>
                    <select name="minimarket" className="form-select" value={form.minimarket} onChange={handleChange} required>
                      <option value="">Selecciona un minimarket</option>
                      <option value="Villa Central">Villa Central</option>
                      <option value="Villa Norte">Villa Norte</option>
                      <option value="Villa Este">Villa Este</option>
                      <option value="Villa Sur">Villa Sur</option>
                      <option value="Villa Oeste">Villa Oeste</option>
                      
                    </select>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-primary" type="submit">{editing ? 'Guardar' : 'Agregar'}</button>
                    <button type="button" className="btn btn-secondary" onClick={() => { setForm({ nombre: '', precio: 0, stock: 0 }); setEditingIdx(-1); }}>Limpiar</button>
                  </div>
                </form>
              </div>
              <div className="col-md-6">
                <h6>Lista (editar rápido)</h6>
                <div style={{ maxHeight: 300, overflowY: 'auto' }}>
                  {productos.map((pp, i) => (
                    <div key={pp.id} className="d-flex justify-content-between align-items-center mb-2">
                      <div>
                        <strong>{pp.nombre}</strong><div className="text-muted small">CLP ${pp.precio} • {pp.stock}</div>
                      </div>
                      <div>
                        <button className="btn btn-sm btn-outline-secondary me-1" onClick={() => { handleEdit(i); }}>Editar</button>
                        <button className="btn btn-sm btn-danger" onClick={() => { if (window.confirm('Eliminar producto?')) handleDelete(pp.id); }}>Eliminar</button>
                      </div>
                    </div>
                  ))}
                  {productos.length === 0 && <div className="text-muted">No hay productos.</div>}
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  )}
    </div>
      </div>
    </div>
  );  
};
export default GestionProductos;