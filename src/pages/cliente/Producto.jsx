import React, { useEffect, useState } from 'react';

const categorias = [
  { value: 'todos', label: 'Todas las categorías' },
  { value: 'abarrotes', label: 'Abarrotes' },
  { value: 'lacteos', label: 'Lácteos' },
  { value: 'frutas', label: 'Frutas y Verduras' },
  { value: 'limpieza', label: 'Limpieza' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'panaderia', label: 'Panadería' },
];

const ordenes = [
  { value: 'nombre', label: 'Nombre A-Z' },
  { value: 'precio-asc', label: 'Precio: Menor a mayor' },
  { value: 'precio-desc', label: 'Precio: Mayor a menor' },
  { value: 'stock-desc', label: 'Mayor disponibilidad' },
];

const Producto = () => {
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [categoria, setCategoria] = useState('todos');
  const [orden, setOrden] = useState('nombre');
  const [stockFiltro, setStockFiltro] = useState('todos');
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    // Leer productos desde localStorage, si no existen usar los hardcodeados
    const productosGuardados = JSON.parse(localStorage.getItem('productos'));
    if (productosGuardados && productosGuardados.length > 0) {
      // Si no existe el producto arroz integral, lo agregamos
      const existeArroz = productosGuardados.some(p => p.id === 1);
      if (!existeArroz) {
        productosGuardados.unshift({
          id: 1,
          nombre: 'Arroz Integral',
          precio: 1290,
          imagen: 'arroz.jpg',
          descripcion: 'Arroz integral 1kg, marca Villa Markets',
          categoria: 'abarrotes',
          stock: 15,
          minimarket: 'Villa Central'
        });
        localStorage.setItem('productos', JSON.stringify(productosGuardados));
      }
      setProductos(productosGuardados);
    } else {
      setProductos([
        {
          id: 1,
          nombre: 'Arroz Integral',
          precio: 1290,
          imagen: 'arroz.jpg',
          descripcion: 'Arroz integral 1kg, marca Villa Markets',
          categoria: 'abarrotes',
          stock: 15,
          minimarket: 'Villa Central'
        },
        {
          id: 2,
          nombre: 'Leche Descremada',
          precio: 990,
          imagen: 'leche.jpg',
          descripcion: 'Leche descremada 1L, marca Villa Markets',
          categoria: 'lacteos',
          stock: 25,
          minimarket: 'Villa Norte'
        },
        {
          id: 3,
          nombre: 'Pan Integral',
          precio: 1590,
          imagen: 'pan.jpg',
          descripcion: 'Pan integral 500g, marca Villa Markets',
          categoria: 'panaderia',
          stock: 8,
          minimarket: 'Villa Central'
        },
        {
          id: 4,
          nombre: 'Huevos Orgánicos',
          precio: 2990,
          imagen: 'huevos.jpg',
          descripcion: 'Huevos orgánicos x6, marca Villa Markets',
          categoria: 'lacteos',
          stock: 12,
          minimarket: 'Villa Este'
        },
        {
          id: 5,
          nombre: 'Aceite de Oliva',
          precio: 5990,
          imagen: 'aceite.jpg',
          descripcion: 'Aceite de oliva extra virgen 500ml, marca Villa Markets',
          categoria: 'abarrotes',
          stock: 5,
          minimarket: 'Villa Sur'
        },
        {
          id: 6,
          nombre: 'Manzanas',
          precio: 1990,
          imagen: 'manzanas.jpg',
          descripcion: 'Manzanas rojas 1kg, producción local',
          categoria: 'frutas',
          stock: 30,
          minimarket: 'Villa Norte'
        },
        {
          id: 7,
          nombre: 'Detergente',
          precio: 3490,
          imagen: 'detergente.jpg',
          descripcion: 'Detergente líquido 1L, marca Villa Clean',
          categoria: 'limpieza',
          stock: 18,
          minimarket: 'Villa Este'
        },
        {
          id: 8,
          nombre: 'Jugo Natural',
          precio: 1990,
          imagen: 'jugo.jpg',
          descripcion: 'Jugo natural de naranja 1L, sin azúcar añadida',
          categoria: 'bebidas',
          stock: 0,
          minimarket: 'Villa Sur'
        },
        {
          id: 9,
          nombre: 'Café Orgánico',
          precio: 4590,
          imagen: 'cafe.jpg',
          descripcion: 'Café orgánico tostado 250g, comercio justo',
          categoria: 'abarrotes',
          stock: 7,
          minimarket: 'Villa Norte'
        },
        {
          id: 10,
          nombre: 'Avena',
          precio: 1790,
          imagen: 'avena.jpg',
          descripcion: 'Avena tradicional 500g, rica en fibra',
          categoria: 'abarrotes',
          stock: 20,
          minimarket: 'Villa Central'
        },
        {
          id: 11,
          nombre: 'Agua Mineral',
          precio: 890,
          imagen: 'agua.jpg',
          descripcion: 'Agua mineral sin gas 1.5L',
          categoria: 'bebidas',
          stock: 48,
          minimarket: 'Villa Este'
        },
        {
          id: 12,
          nombre: 'Yogurt Griego',
          precio: 1290,
          imagen: 'yogurt.jpg',
          descripcion: 'Yogurt griego natural 200g, alto en proteínas',
          categoria: 'lacteos',
          stock: 15,
          minimarket: 'Villa Central'
        }
      ]);
    }
  }, []);

  const agregarAlCarrito = (producto) => {
    setCarrito(prev => {
      const existe = prev.find(p => p.id === producto.id);
      let nuevoCarrito;
      if (existe) {
        nuevoCarrito = prev.map(p =>
          p.id === producto.id
            ? { ...p, cantidad: p.cantidad + 1 }
            : p
        );
      } else {
        // Aseguramos que el producto tenga todos los campos necesarios
        nuevoCarrito = [...prev, {
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          descripcion: producto.descripcion,
          categoria: producto.categoria,
          stock: producto.stock,
          minimarket: producto.minimarket,
          cantidad: 1
        }];
      }
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
      return nuevoCarrito;
    });
  };

  useEffect(() => {
    // El almacenamiento en localStorage ahora se realiza directamente en agregarAlCarrito
  }, [carrito]);

  // Filtros y orden
  const filtrarProductos = () => {
    let filtrados = [...productos];
    if (categoria !== 'todos') {
      filtrados = filtrados.filter(p => p.categoria === categoria);
    }
    if (stockFiltro === 'disponible') {
      filtrados = filtrados.filter(p => p.stock > 0);
    }
    if (busqueda.trim()) {
      const b = busqueda.toLowerCase();
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(b) ||
        p.descripcion.toLowerCase().includes(b) ||
        p.categoria.toLowerCase().includes(b) ||
        (p.minimarket && p.minimarket.toLowerCase().includes(b))
      );
    }
    switch (orden) {
      case 'nombre':
        filtrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case 'precio-asc':
        filtrados.sort((a, b) => a.precio - b.precio);
        break;
      case 'precio-desc':
        filtrados.sort((a, b) => b.precio - a.precio);
        break;
      case 'stock-desc':
        filtrados.sort((a, b) => b.stock - a.stock);
        break;
      default:
        break;
    }
    return filtrados;
  };

  const productosAMostrar = filtrarProductos();

  return (
    <div className="container py-4">
      <h1 className="text-green mb-4">Catálogo de Productos</h1>
      {/* Filtros */}
      <div className="filter-section mb-4 p-3 rounded bg-light">
        <div className="row">
          <div className="col-md-3 mb-3">
            <label className="form-label">Categoría</label>
            <select className="form-select" value={categoria} onChange={e => setCategoria(e.target.value)}>
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Ordenar por</label>
            <select className="form-select" value={orden} onChange={e => setOrden(e.target.value)}>
              {ordenes.map(ord => (
                <option key={ord.value} value={ord.value}>{ord.label}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Disponibilidad</label>
            <select className="form-select" value={stockFiltro} onChange={e => setStockFiltro(e.target.value)}>
              <option value="todos">Todos los productos</option>
              <option value="disponible">Solo disponibles</option>
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <label className="form-label">Buscar</label>
            <input type="text" className="form-control" placeholder="Buscar productos..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
          </div>
        </div>
      </div>
      {/* Catálogo */}
      <div className="row" id="productos-container">
        {productosAMostrar.length === 0 ? (
          <div className="col-12 text-center">
            <div className="alert alert-info">
              <i className="fas fa-info-circle me-2"></i>
              No se encontraron productos que coincidan con los criterios de búsqueda.
            </div>
          </div>
        ) : (
          productosAMostrar.map(prod => (
            <div className="col-md-4 col-lg-3 mb-4" key={prod.id}>
              <div className="card product-card h-100 position-relative">
                {prod.stock === 0 && <span className="badge bg-danger badge-stock position-absolute top-0 end-0 m-2">Agotado</span>}
                {prod.stock <= 5 && prod.stock > 0 && <span className="badge bg-warning text-dark badge-stock position-absolute top-0 end-0 m-2">Últimas unidades</span>}
                <img
                  src={prod.imagen ? `/images/${prod.imagen}` : '/images/default.jpg'}
                  className="card-img-top"
                  alt={prod.nombre}
                  style={{ height: 180, objectFit: 'contain', padding: '1rem' }}
                  onError={e => { e.target.src = '/images/default.jpg'; }}
                />
                <div className="card-body">
                  <h5 className="card-title">{prod.nombre}</h5>
                  <p className="card-text text-muted small">{prod.descripcion}</p>
                  <p className="card-text text-muted small mb-3">
                    <i className="fas fa-store-alt me-1"></i> {prod.minimarket || 'Todos los minimarkets'}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-green">S/ {prod.precio.toLocaleString('es-CL')}</span>
                    <button
                      className="btn btn-green btn-sm"
                      disabled={prod.stock === 0}
                      onClick={() => agregarAlCarrito(prod)}
                    >
                      <i className="fas fa-cart-plus me-1"></i>Agregar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Producto;