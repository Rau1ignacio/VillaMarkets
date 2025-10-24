import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

/* ===== Config & utils===== */
const STORAGE_KEY = "carritoVillaMarket";
const LEGACY_KEYS = ["carrito", "carritoVillaMarkets"]; // migración

const PLACEHOLDER = "https://via.placeholder.com/64?text=VM";
const ENVIO_BASE = 990; // número para cálculos (UI: "desde 990")

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

/* ===== Componente principal ===== */
export default function Carrito() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [codigo, setCodigo] = useState("");
  const [envio, setEnvio] = useState(ENVIO_BASE);
  const [descPct, setDescPct] = useState(0); // 0..1 (10% => .1)

  // Cargar carrito con migración
  useEffect(() => {
    const current = safeParse(STORAGE_KEY);
    if (current.length) {
      setCart(current);
    } else {
      const legacyMerged = LEGACY_KEYS.flatMap((k) => safeParse(k));
      if (legacyMerged.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(legacyMerged));
        LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
        setCart(legacyMerged);
      }
    }
  }, []);

  // Sincroniza badge y storage cada vez que cambie
  useEffect(() => {
    saveCart(cart);
    updateCartBadge();
  }, [cart]);

  // Totales
  const { subtotal, subtotalConDesc, iva, total } = useMemo(() => {
    const sub = cart.reduce(
      (t, it) => t + (Number(it.precio) || 0) * (Number(it.cantidad) || 1),
      0
    );
    const subDesc = Math.round(sub * (1 - descPct));
    const iva_ = Math.round(subDesc * 0.19);
    const tot = subDesc + iva_ + (envio || 0);
    return { subtotal: sub, subtotalConDesc: subDesc, iva: iva_, total: tot };
  }, [cart, envio, descPct]);

  // Acciones
  const inc = (id, tipo = "producto") => {
    setCart((prev) =>
      prev.map((it) =>
        String(it.id) === String(id) && (it.tipo || "producto") === tipo
          ? { ...it, cantidad: Math.max(1, Number(it.cantidad || 1) + 1) }
          : it
      )
    );
  };
  const dec = (id, tipo = "producto") => {
    setCart((prev) =>
      prev.map((it) =>
        String(it.id) === String(id) && (it.tipo || "producto") === tipo
          ? { ...it, cantidad: Math.max(1, Number(it.cantidad || 1) - 1) }
          : it
      )
    );
  };
  const removeItem = (id, tipo = "producto") => {
    setCart((prev) =>
      prev.filter(
        (it) =>
          !(String(it.id) === String(id) && (it.tipo || "producto") === tipo)
      )
    );
  };
  const clearCart = () => {
    if (!confirm("¿Vaciar todo el carrito?")) return;
    setCart([]);
    // descuentos/envío vuelven por defecto
    setCodigo("");
    setEnvio(ENVIO_BASE);
    setDescPct(0);
  };

  const aplicarDescuento = () => {
    const code = (codigo || "").trim().toUpperCase();
    if (!code) return;

    if (code === "VILLA10") {
      setDescPct(0.1);
      alert("¡Descuento del 10% aplicado!");
      return;
    }
    if (code === "ENVIOGRATIS") {
      setEnvio(0);
      alert("¡Envío gratis aplicado!");
      return;
    }
    alert("Código de descuento inválido");
  };

  const procederPedido = () => {
    if (!cart.length) {
      alert("El carrito está vacío");
      return;
    }
    navigate("/pedido"); // ajusta a tu ruta real (antes usabas pedido.html)
  };

  // HTML ---------------------------------------------------------------------------------------------------------------------------
  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <h1 className="text-green mb-0">Carrito de Compras</h1>
        <NavLink to="/productos" className="btn btn-outline-secondary btn-sm">
          <i className="fas fa-basket-shopping me-1" />
          Seguir comprando
        </NavLink>
      </div>

      <div className="row">
        {/* Lista de productos */}
        <div className="col-lg-8 mb-4">
          <div className="cart-container">
            {/* Vacío */}
            {cart.length === 0 && (
              <div className="text-center py-5" id="empty-cart-message">
                <i className="fas fa-shopping-cart fa-4x text-muted mb-3" />
                <h3 className="text-muted">Tu carrito está vacío</h3>
                <p>Agrega productos desde nuestro catálogo</p>
                <NavLink to="/productos" className="btn btn-green mt-3">
                  Ver productos
                </NavLink>
              </div>
            )}

            {/* Items */}
            <div id="cart-items-container">
              {cart.map((item) => {
                const cantidad = Math.max(1, Number(item.cantidad || 1));
                const lineTotal = (Number(item.precio) || 0) * cantidad;
                const tipo = item.tipo || "producto";
                return (
                  <div className="cart-item" key={`${tipo}-${item.id}`}>
                    <div
                      className="row align-items-center"
                      data-id={item.id}
                      data-tipo={tipo}
                    >
                      <div className="col-2">
                        <img
                          src={item.imagen || PLACEHOLDER}
                          alt={item.nombre}
                          className="img-fluid"
                          onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                        />
                      </div>

                      <div className="col-4">
                        <h5 className="mb-0">{item.nombre}</h5>
                        <small className="text-muted">
                          {item.minimarket ? `${item.minimarket} · ` : ""}
                          ${formatoCLP(item.precio)} c/u
                        </small>
                        {tipo && (
                          <div className="small text-muted mt-1">
                            Tipo: {tipo}
                          </div>
                        )}
                      </div>

                      <div className="col-3">
                        <div className="quantity-control d-inline-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm btn-outline-secondary btn-restar"
                            aria-label="Restar"
                            onClick={() => dec(item.id, tipo)}
                          >
                            −
                          </button>
                          <input
                            type="text"
                            value={cantidad}
                            readOnly
                            style={{ width: 50, textAlign: "center" }}
                          />
                          <button
                            className="btn btn-sm btn-outline-secondary btn-sumar"
                            aria-label="Sumar"
                            onClick={() => inc(item.id, tipo)}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="col-2 text-end">
                        <span className="fw-bold">
                          ${formatoCLP(lineTotal)}
                        </span>
                      </div>

                      <div className="col-1 text-end">
                        <button
                          className="btn btn-sm text-danger btn-eliminar-directa"
                          aria-label="Eliminar"
                          onClick={() => removeItem(item.id, tipo)}
                        >
                          <i className="fas fa-trash" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resumen */}
        <div className="col-lg-4">
          <div className="cart-summary">
            <h3>Resumen</h3>

            <div className="d-flex justify-content-between mt-3">
              <span>Subtotal:</span>
              <span id="subtotal">${formatoCLP(subtotal)}</span>
            </div>

            {descPct > 0 && (
              <div className="d-flex justify-content-between mt-1">
                <span>Descuento ({Math.round(descPct * 100)}%):</span>
                <span>− ${formatoCLP(subtotal - subtotalConDesc)}</span>
              </div>
            )}

            <div className="d-flex justify-content-between mt-1">
              <span>IVA (19%):</span>
              <span id="iva">${formatoCLP(iva)}</span>
            </div>

            <div className="d-flex justify-content-between mt-2">
              <span>Envío:</span>
              <span id="envio">
                {envio === 0 ? "GRATIS" : `$${formatoCLP(envio)}`}
              </span>
            </div>

            <hr />

            <div className="d-flex justify-content-between fw-bold">
              <span>Total:</span>
              <span id="total" className="text-green">
                ${formatoCLP(total)}
              </span>
            </div>

            {/* Código de descuento */}
            <div className="mt-4">
              <label htmlFor="codigo-descuento" className="form-label">
                ¿Tienes un código de descuento?
              </label>
              <div className="input-group">
                <input
                  id="codigo-descuento"
                  type="text"
                  className="form-control"
                  placeholder="VILLA10 o ENVIOGRATIS"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={aplicarDescuento}
                >
                  Aplicar
                </button>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="mt-4">
              <button
                className="btn btn-green w-100 mb-2"
                onClick={procederPedido}
                disabled={!cart.length}
              >
                <i className="fas fa-shopping-bag me-2" />
                Realizar pedido
              </button>
              <button
                className="btn btn-outline-secondary w-100"
                onClick={clearCart}
                disabled={!cart.length}
              >
                Vaciar carrito
              </button>
            </div>

            {/* Tip: costos */}
            <p className="small text-muted mt-3 mb-0">
              Envío referencial <strong>desde $3.990</strong>. Puede variar por
              zona/dirección.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
