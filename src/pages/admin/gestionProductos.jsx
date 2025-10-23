import React, { useState, useEffect } from 'react';



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
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Gestión de Productos</h2>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={startCreate}>Nuevo</button>
          <button className="btn btn-outline-info" onClick={async () => { await syncWithServer(); alert('Sync ejecutado'); }}>Sincronizar</button>
        </div>
      </div>

      <div className="row">

        <div className="col-md-8">
          <div className="list-group">
            {productos.map(p => (
              <div key={p.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{p.nombre}</strong><div className="text-muted">S/ {p.precio} • Stock: {p.stock}</div>
                </div>
                <div>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => startEdit(p)}>Editar</button>
                  <button className="btn btn-sm btn-danger" onClick={() => { if (window.confirm('Eliminar producto?')) deleteProduct(p.id); }}>Eliminar</button>
                </div>
              </div>
            ))}
            {productos.length === 0 && <div className="text-muted p-3">No hay productos.</div>}
          </div>
  {/* Modal: menú detallado para agregar/editar/eliminar */}
  {showModal && (
    <div className="modal show d-block" tabIndex="-1" role="dialog" onClick={() => setShowModal(false)}>
      <div className="modal-dialog modal-lg" role="document" onClick={e => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{editing ? 'Editar producto' : 'Nuevo producto'}</h5>
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
                    <label className="form-label">Imagen (nombre de archivo)</label>
                    <input name="imagen" className="form-control" placeholder="Ej: arroz.jpg" value={form.imagen} onChange={handleChange} />
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
                        <strong>{pp.nombre}</strong><div className="text-muted small">S/ {pp.precio} • {pp.stock}</div>
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