// src/pages/ProductosGlobal.jsx
import { useEffect, useMemo, useState } from "react";
import { NavLink } from "react-router-dom";

/* =========================
   Utils / Storage helpers
========================= */
const STORAGE_KEY = "carritoVillaMarket";
const PLACEHOLDER = "https://via.placeholder.com/300x220?text=Villa+Markets";

function safeParse(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}
function saveCart(cart) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
}
function formatoCLP(n) {
  return Number(n || 0).toLocaleString("es-CL");
}
function updateCartBadge() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  const cart = safeParse(STORAGE_KEY);
  el.textContent = cart.reduce((t, i) => t + (i.cantidad || 0), 0);
}

/* =========================
   Data sets (tus datos)
========================= */
// Comidas
const comidas = [
  { id:1,  tipo:"comida", nombre:"Lasaña de Carne",        precio:6990, imagen:"/img/Lasaña de carne.jpg",        descripcion:"Deliciosa lasaña casera con carne molida y salsa bechamel.", categoria:"plato-principal", minimarket:"Villa Central",  calorias:450, popular:true,  stock:999 },
  { id:2,  tipo:"comida", nombre:"Ensalada César",         precio:4990, imagen:"/img/ensalada cesar.jpg",         descripcion:"Clásica ensalada césar con pollo grillado y aderezo casero.",  categoria:"entrada",          minimarket:"Villa Norte",    calorias:320, popular:true,  stock:999 },
  { id:3,  tipo:"comida", nombre:"Risotto de Champiñones", precio:5990, imagen:"/img/risotto de champiñones.jpg", descripcion:"Cremoso risotto con hongos silvestres y queso parmesano.",     categoria:"plato-principal", minimarket:"Villa Este",     calorias:380, vegetariano:true, stock:999 },
  { id:4,  tipo:"comida", nombre:"Tiramisú",               precio:3990, imagen:"/img/Tiramisú.jpg",               descripcion:"Postre italiano con bizcocho, café y crema de mascarpone.",  categoria:"postre",           minimarket:"Villa Sur",      calorias:320, popular:true,  stock:999 },
  { id:5,  tipo:"comida", nombre:"Curry de Garbanzos",     precio:4590, imagen:"/img/Curry de Garbanzos.jpg",     descripcion:"Curry vegano con leche de coco y especias hindúes.",         categoria:"plato-principal", minimarket:"Villa Norte",    calorias:350, vegano:true,   stock:999 },
  { id:6,  tipo:"comida", nombre:"Sopa de Tomate",         precio:3290, imagen:"/img/Sopa de Tomate.jpg",         descripcion:"Sopa casera de tomate con albahaca fresca.",                categoria:"entrada",          minimarket:"Villa Central",  calorias:220, vegetariano:true, stock:999 },
];

// Productos
const productos = [
  { id:101, tipo:"producto", nombre:"Arroz Integral 1kg",         precio:1290, imagen:"/img/catalogos/arroz integrall.webp",   descripcion:"Arroz integral grano largo, 1kg.",          categoria:"abarrotes", minimarket:"Villa Central", popular:true,  dietas:["vegano","vegetariano","sin-gluten"], stock:24 },
  { id:102, tipo:"producto", nombre:"Leche Entera 1L",            precio:1590, imagen:"/img/catalogos/leche.webp",             descripcion:"Leche entera pasteurizada, 1 litro.",       categoria:"lacteos",   minimarket:"Villa Norte",   popular:false, dietas:["sin-gluten"],                           stock:18 },
  { id:103, tipo:"producto", nombre:"pan amasado (4 un)",         precio:1290, imagen:"/img/catalogos/pan.jpg",                descripcion:"Pan marraqueta recién horneado.",           categoria:"panaderia", minimarket:"Villa Sur",     popular:true,  dietas:["vegetariano"],                            stock:32 },
  { id:104, tipo:"producto", nombre:"Manzanas Rojas 1kg",         precio:1490, imagen:"/img/catalogos/manzanas.webp",          descripcion:"Manzanas rojas frescas, 1kg.",              categoria:"frutas",    minimarket:"Villa Este",    popular:false, dietas:["vegano","vegetariano","sin-gluten"],    stock:27 },
  { id:105, tipo:"producto", nombre:"Jugo de Naranja 1L",         precio:1990, imagen:"/img/catalogos/jugos.webp",              descripcion:"Jugo de naranja 100% exprimido.",           categoria:"bebidas",   minimarket:"Villa Central", popular:true,  dietas:["vegano","vegetariano","sin-gluten"],    stock:30 },
  { id:106, tipo:"producto", nombre:"Papas Fritas 140g",          precio:1490, imagen:"/img/catalogos/lays.webp",               descripcion:"Snacks de papas fritas clásicas.",          categoria:"snacks",    minimarket:"Villa Norte",   popular:false, dietas:["vegano","vegetariano","sin-gluten"],    stock:40 },
  { id:107, tipo:"producto", nombre:"Pizza Congelada Napolitana", precio:4490, imagen:"/img/catalogos/pizza.webp",              descripcion:"Pizza congelada sabor napolitana.",         categoria:"congelados",minimarket:"Villa Sur",     popular:false, dietas:["vegetariano"],                           stock:14 },
  { id:108, tipo:"producto", nombre:"Detergente Líquido 1L",      precio:3990, imagen:"/img/catalogos/deterge.webp",            descripcion:"Detergente líquido para ropa, 1L.",          categoria:"limpieza",  minimarket:"Villa Este",    popular:false, dietas:[],                                      stock:20 },
  { id:109, tipo:"producto", nombre:"Pasta Dental 90g",           precio:1290, imagen:"/img/catalogos/pasta-Dental.webp",       descripcion:"Crema dental protección completa.",          categoria:"higiene",   minimarket:"Villa Central", popular:false, dietas:[],                                      stock:26 },
  { id:110, tipo:"producto", nombre:"Alimento Perro 1kg",         precio:4990, imagen:"/img/catalogos/perroa.webp",             descripcion:"Alimento seco para perro, 1kg.",            categoria:"mascotas",  minimarket:"Villa Norte",   popular:false, dietas:[],                                      stock:16 },
];

// DATA unificada
const DATA = [
  ...comidas.map((c) => ({ ...c, stock: c.stock ?? 999 })),
  ...productos,
];

/* =========================
   Componente principal
========================= */
export default function ProductosGlobal() {
  // Filtros
  const [categoria, setCategoria] = useState("todos");
  const [orden, setOrden] = useState("nombre");
  const [minimarket, setMinimarket] = useState("todos");
  const [busqueda, setBusqueda] = useState("");
  const [debounced, setDebounced] = useState("");

  // Paginación
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 12;

  // Debounce búsqueda
  useEffect(() => {
    const t = setTimeout(() => setDebounced(busqueda.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [busqueda]);

  // Actualizar badge al montar
  useEffect(() => {
    updateCartBadge();
  }, []);

  // Minimarkets únicos para el select
  const minimarketsOpts = useMemo(() => {
    const set = new Set(DATA.map((i) => i.minimarket));
    return ["todos", ...Array.from(set)];
  }, []);

  // Filtrado + orden
  const filtered = useMemo(() => {
    let list = [...DATA];

    if (categoria !== "todos") list = list.filter((i) => i.categoria === categoria);
    if (minimarket !== "todos") list = list.filter((i) => i.minimarket === minimarket);

    if (debounced) {
      list = list.filter((i) => {
        const name = (i.nombre || "").toLowerCase();
        const desc = (i.descripcion || "").toLowerCase();
        const cat = (i.categoria || "").toLowerCase();
        const diets = Array.isArray(i.dietas) ? i.dietas.join(" ").toLowerCase() : "";
        return (
          name.includes(debounced) ||
          desc.includes(debounced) ||
          cat.includes(debounced) ||
          diets.includes(debounced)
        );
      });
    }

    switch (orden) {
      case "nombre":
        list.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      case "precio-asc":
        list.sort((a, b) => a.precio - b.precio);
        break;
      case "precio-desc":
        list.sort((a, b) => b.precio - a.precio);
        break;
      case "popular":
        list.sort((a, b) => (b.popular === true) - (a.popular === true));
        break;
      default:
        break;
    }

    return list;
  }, [categoria, minimarket, debounced, orden]);

  // Paginación derivada
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageSlice = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  useEffect(() => {
    // al cambiar filtros o búsqueda, vuelve a página 1
    setPage(1);
  }, [categoria, minimarket, debounced, orden]);

  function limpiarFiltros() {
    setCategoria("todos");
    setOrden("nombre");
    setMinimarket("todos");
    setBusqueda("");
  }

  function addToCart(item) {
    if ((item.stock || 0) <= 0) {
      if (window.Swal) {
        window.Swal.fire({
          icon: "error",
          title: "Sin stock",
          timer: 1200,
          showConfirmButton: false,
          toast: true,
          position: "bottom-end",
        });
      }
      return;
    }

    const cart = safeParse(STORAGE_KEY);
    const idx = cart.findIndex((i) => String(i.id) === String(item.id) && i.tipo === item.tipo);

    if (idx >= 0) cart[idx].cantidad = (cart[idx].cantidad || 1) + 1;
    else
      cart.push({
        id: item.id,
        tipo: item.tipo,
        nombre: item.nombre,
        precio: item.precio,
        imagen: item.imagen,
        minimarket: item.minimarket,
        cantidad: 1,
        categoria: item.categoria,
      });

    saveCart(cart);
    updateCartBadge();

    if (window.Swal) {
      window.Swal.fire({
        icon: "success",
        title: "Agregado",
        text: `${item.nombre} añadido al carrito`,
        timer: 1400,
        showConfirmButton: false,
        toast: true,
        position: "bottom-end",
      });
    }
  }

  function Card({ item }) {
    const inStock = (item.stock || 0) > 0;

    // HTML ---------------------------------------------------------------------------------------------------------------------------
    return (
      <div className="col-12 col-sm-6 col-lg-4 col-xl-3">
        <div className="card h-100 position-relative food-card">
          <img
            src={item.imagen}
            alt={item.nombre}
            onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
          />
          <div className="card-body d-flex flex-column">
            <h5 className="card-title d-flex justify-content-between align-items-start">
              <span>{item.nombre}</span>
              <span className="d-inline-flex align-items-center gap-1">
                {item.popular && (
                  <span className="badge bg-warning text-dark">Popular</span>
                )}
                <span className="badge bg-secondary text-uppercase">{item.tipo}</span>
              </span>
            </h5>

            <p className="small text-muted mb-1">
              <i className="fas fa-store me-1" />
              {item.minimarket}
            </p>

            {item.descripcion && (
              <p className="small text-muted mb-1">{item.descripcion}</p>
            )}
            {item.tipo === "comida" && item.calorias && (
              <div className="small text-muted mb-1">
                <i className="fas fa-fire me-1" />
                {item.calorias} cal
              </div>
            )}
            {Array.isArray(item.dietas) && item.dietas.length > 0 && (
              <div className="small text-muted mb-1">
                <i className="fas fa-tag me-1" />
                {item.dietas.join(", ")}
              </div>
            )}

            <p className="fw-bold text-green mb-3">$ {formatoCLP(item.precio)}</p>

            <button
              className="btn btn-green w-100 mt-auto"
              onClick={() => addToCart(item)}
              disabled={!inStock}
            >
              <i className="fas fa-cart-plus me-2" />
              {inStock ? "Agregar" : "Sin stock"}
            </button>
          </div>

          <span
            className={`badge ${inStock ? "bg-success" : "bg-danger"}`}
            style={{ position: "absolute", top: ".5rem", right: ".5rem" }}
          >
            {inStock ? `Stock: ${item.stock}` : "Sin stock"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-3">
        <h1 className="text-green mb-0">Catálogo de productos</h1>
        <NavLink to="/carrito" className="btn btn-outline-secondary btn-sm">
          <i className="fas fa-shopping-cart me-1" />
          Ver carrito
        </NavLink>
      </div>

      {/* Filtros */}
      <div className="filter-section">
        <div className="row">
          <div className="col-md-3 mb-3">
            <label htmlFor="categoria" className="form-label">
              <i className="fas fa-tags me-1 text-green" /> Categoría
            </label>
            <select
              id="categoria"
              className="form-select"
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
            >
              <option value="todos">Todas las categorías</option>
              {/* Comidas */}
              <option value="plato-principal">Platos principales</option>
              <option value="comidas-preparadas">Comidas preparadas</option>
              <option value="entrada">Entradas</option>
              <option value="postre">Postres</option>
              <option value="vegetariano">Vegetarianos</option>
              <option value="vegano">Veganos</option>
              {/* Minimar-kits */}
              <option value="abarrotes">Abarrotes</option>
              <option value="lacteos">Lácteos</option>
              <option value="panaderia">Panadería</option>
              <option value="frutas">Frutas y verduras</option>
              <option value="bebidas">Bebidas</option>
              <option value="snacks">Snacks y golosinas</option>
              <option value="congelados">Congelados</option>
              <option value="limpieza">Artículos de limpieza</option>
              <option value="higiene">Higiene personal</option>
              <option value="mascotas">Alimentos para mascotas</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="orden" className="form-label">
              <i className="fas fa-sort me-1 text-green" /> Ordenar por
            </label>
            <select
              id="orden"
              className="form-select"
              value={orden}
              onChange={(e) => setOrden(e.target.value)}
            >
              <option value="nombre">Nombre A-Z</option>
              <option value="precio-asc">Precio: Menor a mayor</option>
              <option value="precio-desc">Precio: Mayor a menor</option>
              <option value="popular">Más populares</option>
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="minimarket" className="form-label">
              <i className="fas fa-store-alt me-1 text-green" /> Minimarket
            </label>
            <select
              id="minimarket"
              className="form-select"
              value={minimarket}
              onChange={(e) => setMinimarket(e.target.value)}
            >
              {minimarketsOpts.map((v) => (
                <option key={v} value={v}>
                  {v === "todos" ? "Todos los minimarkets" : v}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-3 mb-3">
            <label htmlFor="busqueda" className="form-label">
              <i className="fas fa-search me-1 text-green" /> Buscar
            </label>
            <div className="input-group">
              <input
                id="busqueda"
                type="text"
                className="form-control"
                placeholder="Buscar productos o platos..."
                autoComplete="off"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <button className="btn btn-green" type="button" onClick={() => setDebounced(busqueda.trim().toLowerCase())}>
                <i className="fas fa-search" />
              </button>
            </div>
          </div>
        </div>

        <div className="row mt-2">
          <div className="col-12 d-flex justify-content-between align-items-center">
            <button className="btn btn-sm btn-outline-secondary" onClick={limpiarFiltros}>
              <i className="fas fa-undo me-1" /> Limpiar filtros
            </button>
            <div id="productos-contador" className="text-muted small">
              {total === DATA.length
                ? `Mostrando todos (${total})`
                : `Mostrando ${total} de ${DATA.length}`}
            </div>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="row g-4" id="global-container">
        {pageSlice.map((item) => (
          <Card key={`${item.tipo}-${item.id}`} item={item} />
        ))}
        {pageSlice.length === 0 && (
          <div className="col-12">
            <div className="alert alert-info">
              No encontramos resultados con esos filtros. 🙈
            </div>
          </div>
        )}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <nav className="my-4" aria-label="Paginación de productos">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage((p) => Math.max(1, p - 1))}>
                Anterior
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li key={p} className={`page-item ${p === currentPage ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPage(p)}>{p}</button>
              </li>
            ))}

            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
                Siguiente
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
