import React, { useEffect, useRef, useState } from 'react';
import productoService from '../../services/productoService';
import carritoService from '../../services/carritoService';

const categorias = [
  { value: 'todos', label: 'Todas las categorías' },
  { value: 'abarrotes', label: 'Abarrotes' },
  { value: 'lacteos', label: 'Lácteos' },
  { value: 'frutas', label: 'Frutas y Verduras' },
  { value: 'limpieza', label: 'Limpieza' },
  { value: 'bebidas', label: 'Bebidas' },
  { value: 'panaderia', label: 'Panadería' },
  { value: 'otros', label: 'Otros' },
  { value: 'salud', label: 'Salud y Cuidado Personal' },
  { value: 'snacks', label: 'Snacks y Dulces' },
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
  const [productoAnimado, setProductoAnimado] = useState(null);
  const animacionTimeoutRef = useRef(null);

  // 🔹 Cargar productos del backend al montar
  useEffect(() => {
    const cargarProductos = async () => {
      try {
        const productosBackend = await productoService.listar(); // GET /v1/productos

        // Normalizar al formato que usa el catálogo
        const normalizados = productosBackend.map(p => ({
          id: p.id,
          nombre: p.nombre,
          precio: Number(p.precio),        // BigDecimal -> number
          imagen: p.imagen || '',          // en tu DTO se llama "imagen"
          descripcion: p.descripcion || '',
          categoria: p.categoria || 'otros',
          stock: p.stock ?? 0,
          minimarket: p.tiendaId ? `Tienda #${p.tiendaId}` : 'Sin tienda'
        }));

        setProductos(normalizados);
        localStorage.setItem('productos', JSON.stringify(normalizados));
      } catch (err) {
        console.warn('Error al obtener productos del backend, usando fallback local:', err?.message || err);

        const productosGuardados = JSON.parse(localStorage.getItem('productos') || '[]');
        setProductos(productosGuardados);
      }
    };

    cargarProductos();
  }, []);

  // 🔹 Agregar al carrito (backend + fallback localStorage)
  const agregarAlCarrito = async (producto) => {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual') || 'null');
    const carritoKey = usuarioActual?.id ? `carrito_${usuarioActual.id}` : 'carrito_guest';

    // Si hay usuario logueado, usamos el carrito real del backend
    if (usuarioActual && localStorage.getItem('authToken')) {
      try {
        await carritoService.agregarItem(usuarioActual.id, {
          productoId: producto.id,
          cantidad: 1,
          precioUnitario: producto.precio   // el backend espera "precioUnitario"
        });
        console.log('Producto agregado al carrito del servidor');
      } catch (err) {
        console.warn('Error al agregar al carrito del servidor, usando fallback local:', err?.message || err);
      }
    }

    // Fallback/local: mantener también en localStorage
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
      localStorage.setItem(carritoKey, JSON.stringify(nuevoCarrito));
      return nuevoCarrito;
    });

    setProductoAnimado(producto.id);
    if (animacionTimeoutRef.current) clearTimeout(animacionTimeoutRef.current);
    animacionTimeoutRef.current = setTimeout(() => {
      setProductoAnimado(null);
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (animacionTimeoutRef.current) {
        clearTimeout(animacionTimeoutRef.current);
      }
    };
  }, []);

  // 🔹 Filtros y orden
  const filtrarProductos = () => {
    let filtrados = [...productos];

    if (categoria !== 'todos') {
      filtrados = filtrados.filter(p => (p.categoria || '').toLowerCase() === categoria.toLowerCase());
    }
    if (stockFiltro === 'disponible') {
      filtrados = filtrados.filter(p => p.stock > 0);
    }
    if (busqueda.trim()) {
      const b = busqueda.toLowerCase();
      filtrados = filtrados.filter(p =>
        p.nombre.toLowerCase().includes(b) ||
        (p.descripcion || '').toLowerCase().includes(b) ||
        (p.categoria || '').toLowerCase().includes(b) ||
        (p.minimarket || '').toLowerCase().includes(b)
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
            <input
              type="text"
              className="form-control"
              placeholder="Buscar productos..."
              value={busqueda}
              onChange={e => setBusqueda(e.target.value)}
            />
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
              <div
                className="card product-card h-100 position-relative"
                style={{
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  transform: productoAnimado === prod.id ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: productoAnimado === prod.id ? '0 12px 30px rgba(0, 0, 0, 0.15)' : undefined
                }}
              >
                {prod.stock === 0 && <span className="badge bg-danger badge-stock position-absolute top-0 end-0 m-2">Agotado</span>}
                {prod.stock <= 5 && prod.stock > 0 && <span className="badge bg-warning text-dark badge-stock position-absolute top-0 end-0 m-2">Últimas unidades</span>}
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backgroundColor: '#fff' }}>
                  <img
                    src={prod.imagen ? (prod.imagen.startsWith('http') ? prod.imagen : `/images/productos/${prod.imagen}`) : '/images/default.jpg'}
                    alt={prod.nombre}
                    style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
                    onError={e => { e.target.src = '/images/default.jpg'; }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title">{prod.nombre}</h5>
                  <p className="card-text text-muted small">{prod.descripcion}</p>
                  <p className="card-text text-muted small mb-3">
                    <i className="fas fa-store-alt me-1"></i> {prod.minimarket || 'Tienda no especificada'}
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-green">CLP ${prod.precio.toLocaleString('es-CL')}</span>
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
