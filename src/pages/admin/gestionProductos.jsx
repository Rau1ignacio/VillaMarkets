import React, { useState, useEffect } from 'react';



// componente de gestión de productos
const GestionProductos = () => {
    const [productos, setProductos] = useState([]); // Lista de productos
    const [editingIdx, setEditingIdx] = useState(-1); // Índice del producto en edición
    const [form, setForm] = useState({ nombre: '', precio: 0, stock: 0 });

    useEffect(() => {

        setProductos([
            { id:1,nombre:'Producto a', precio:100,stock:10},
            { id:2,nombre:'Producto b',precio:200, stock:20},
        ]);
    },[]);

    // Función para manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((s) => ({ ...s, [name]: name === 'nombre' ? value : Number(value) }));
    };
    // Función para agregar un nuevo producto

    const handleCreate = (e) => {
        e.preventDefault();
        const nuevo = { id: Date.now(), ...form };
        setProductos((p) => [nuevo, ...p]);
        setForm({ nombre: '', precio: 0, stock: 0 });
    };

    // función para actualizar un producto existente
    const handleUpdate = (e) => {
        e.preventDefault();
        setProductos((p) => p.map((item, i) => (i === editingIdx ? { ...item, ...form } : item)));
        setEditingIdx(-1);
        setForm({ nombre: '', precio: 0, stock: 0 });
    };

    // función para eliminar un producto
    const handleDelete = (id) => {
        if (!window.confirm('Eliminar producto?')) return;
        setProductos((p) => p.filter((prod) => prod.id !== id));
    };

    const handleEdit = (idx) => {
        setEditingIdx(idx);
        setForm(productos[idx]);
    };


        


    
    // ¿Estamos editando un producto?
    const editing = editingIdx !== -1;

    const startCreate = () => {
        setEditingIdx(-1);
        setForm({ nombre: '', precio: 0, stock: 0 });
    };

    const startEdit = (p) => {
        const idx = productos.findIndex(x => x.id === p.id);
        if (idx !== -1) {
            handleEdit(idx);
        }
    };

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
            {/* formulario de agregar/editar producto */}
      <div className="row">
        <div className="col-md-4">
          <div className="card p-3 mb-3">
            <h5>{editing ? 'Editar producto' : 'Agregar producto'}</h5>
            <form onSubmit={handleSubmit}>
              <input name="nombre" className="form-control mb-2" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
              <input name="precio" className="form-control mb-2" type="number" placeholder="Precio" value={form.precio} onChange={handleChange} min="0" required />
              <input name="stock" className="form-control mb-2" type="number" placeholder="Stock" value={form.stock} onChange={handleChange} min="0" required />
              <button className="btn btn-primary w-100" type="submit">{editing ? 'Guardar' : 'Agregar'}</button>
            </form>
          </div>
        </div>

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
        </div>
      </div>
    </div>
  );
};

export default GestionProductos;