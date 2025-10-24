// src/pages/Pedido.jsx
import { useEffect, useMemo, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

/* =========================
   Utils / Storage
========================= */
const CART_KEY = "carritoVillaMarket";
const PEDIDOS_KEY = "pedidosVillaMarkets";
const PLACEHOLDER = "https://via.placeholder.com/64?text=VM";

function safeParse(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
}
function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
function updateCartBadge() {
  const el = document.getElementById("cart-count");
  if (!el) return;
  const cart = safeParse(CART_KEY);
  el.textContent = cart.reduce((t, i) => t + (i.cantidad || 0), 0);
}
const clp = (n) => Number(n || 0).toLocaleString("es-CL");

/* =========================
   Dataset Minimarkets
========================= */
const minimarkets = [
  { id: "M001", nombre: "Villa Central", direccion: "Av. Central 123", comuna: "Santiago",   horario: "Lun-Vie: 8:00-21:00, Sáb-Dom: 9:00-20:00" },
  { id: "M002", nombre: "Villa Norte",   direccion: "Av. Norte 456",   comuna: "La Reina",   horario: "Lun-Vie: 8:00-21:00, Sáb-Dom: 9:00-20:00" },
  { id: "M003", nombre: "Villa Sur",     direccion: "Av. Sur 789",     comuna: "La Florida", horario: "Lun-Vie: 8:00-21:00, Sáb-Dom: 9:00-20:00" },
  { id: "M004", nombre: "Villa Este",    direccion: "Av. Este 321",    comuna: "Ñuñoa",      horario: "Lun-Vie: 8:00-21:00, Sáb-Dom: 9:00-20:00" },
];

/* =========================
   Componente
========================= */
export default function Pedido() {
  const navigate = useNavigate();

  // Carrito
  const [cart, setCart] = useState([]);

  // Entrega
  const [entrega, setEntrega] = useState("recoger"); // recoger | delivery
  const [envio, setEnvio] = useState(0);             // 0 ó 2990
  const [minimarketId, setMinimarketId] = useState("M001");

  // Pago
  const [pago, setPago] = useState("efectivo"); // efectivo | tarjeta | transferencia
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });

  // Descuentos
  const [codigo, setCodigo] = useState("");
  const [descMonto, setDescMonto] = useState(0);

  // Contacto
  const [contacto, setContacto] = useState({
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
  });

  // Dirección (delivery)
  const [direccion, setDireccion] = useState({
    calle: "",
    numero: "",
    comuna: "",
    depto: "",
    referencias: "",
  });

  // Cargar carrito + datos usuario
  useEffect(() => {
    const c = safeParse(CART_KEY);
    setCart(Array.isArray(c) ? c : []);

    const u = safeParse("usuarioActual");
    if (u) {
      setContacto((s) => ({
        ...s,
        nombre: u.nombre || s.nombre,
        apellido: u.apellidos || s.apellido,
        email: u.email || u.correo || s.email,
        telefono: u.telefono || s.telefono,
      }));
      // parseo simple de dirección para completar campos
      if (u.direccion) {
        const partes = u.direccion.split(", ");
        if (partes.length >= 1) {
          const trozos = partes[0].split(" ");
          const numero = trozos.pop();
          const calle = trozos.join(" ");
          setDireccion((d) => ({ ...d, calle: calle || "", numero: numero || "" }));
        }
        if (partes.length >= 2) setDireccion((d) => ({ ...d, comuna: partes[1] }));
        if (partes.length >= 3) setDireccion((d) => ({ ...d, depto: partes[2] }));
      }
    }
  }, []);

  // Redirigir si carrito vacío
  useEffect(() => {
    if (Array.isArray(cart) && cart.length === 0) {
      // Si quieres mantener vista vacía, puedes quitar esta navegación:
      navigate("/carrito");
    }
  }, [cart, navigate]);

  // Badge y persistencia
  useEffect(() => {
    save(CART_KEY, cart);
    updateCartBadge();
  }, [cart]);

  // Totales
  const itemsCount = useMemo(
    () => cart.reduce((t, i) => t + (Number(i.cantidad) || 0), 0),
    [cart]
  );
  const subtotal = useMemo(
    () =>
      cart.reduce(
        (t, i) => t + (Number(i.precio) || 0) * (Number(i.cantidad) || 0),
        0
      ),
    [cart]
  );
  const iva = useMemo(() => Math.round(subtotal * 0.19), [subtotal]);
  const total = useMemo(() => Math.max(0, subtotal + iva + envio - descMonto), [subtotal, iva, envio, descMonto]);

  /* -------- Lógica UI -------- */
  function seleccionarEntrega(metodo) {
    setEntrega(metodo);
    setEnvio(metodo === "delivery" ? 2990 : 0);
  }
  function seleccionarPago(met) {
    setPago(met);
  }
  function aplicarDescuento() {
    const code = (codigo || "").trim().toUpperCase();
    if (!code) return;

    if (code === "VILLA10") {
      setDescMonto(Math.round(subtotal * 0.1));
      window.Swal?.fire({ icon: "success", title: "¡Descuento aplicado!", text: "10% sobre el subtotal", confirmButtonColor: "#2d8f3c" });
      return;
    }
    if (code === "ENVIOGRATIS") {
      setEnvio(0);
      window.Swal?.fire({ icon: "success", title: "¡Envío gratis!", text: "Se descontó el costo de envío", confirmButtonColor: "#2d8f3c" });
      return;
    }
    window.Swal?.fire({ icon: "error", title: "Código inválido", text: "Revisa tu código e inténtalo de nuevo", confirmButtonColor: "#2d8f3c" });
  }

  function validar() {
    // contacto
    if (!contacto.nombre || !contacto.apellido || !contacto.email || !contacto.telefono) {
      window.Swal?.fire({ icon: "warning", title: "Datos incompletos", text: "Completa todos los campos de contacto", confirmButtonColor: "#2d8f3c" });
      return false;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contacto.email);
    if (!emailOk) {
      window.Swal?.fire({ icon: "warning", title: "Email inválido", text: "Ingresa un email válido", confirmButtonColor: "#2d8f3c" });
      return false;
    }
    if (entrega === "delivery") {
      if (!direccion.calle || !direccion.numero || !direccion.comuna) {
        window.Swal?.fire({ icon: "warning", title: "Dirección incompleta", text: "Completa calle, número y comuna", confirmButtonColor: "#2d8f3c" });
        return false;
      }
    }
    if (pago === "tarjeta") {
      if (!card.number || !card.name || !card.expiry || !card.cvv) {
        window.Swal?.fire({ icon: "warning", title: "Tarjeta incompleta", text: "Completa todos los campos de tu tarjeta", confirmButtonColor: "#2d8f3c" });
        return false;
      }
    }
    return true;
  }

  function confirmarPedido() {
    if (!cart.length) {
      window.Swal?.fire({ icon: "info", title: "Carrito vacío", confirmButtonColor: "#2d8f3c" });
      return;
    }
    if (!validar()) return;

    const pedido = {
      id: `P-${Math.floor(Math.random() * 90000) + 10000}`,
      fecha: new Date().toLocaleDateString("es-CL"),
      hora: new Date().toLocaleTimeString("es-CL"),
      cliente: { ...contacto },
      tipoEntrega: entrega,
      metodoPago: pago,
      minimarket: entrega === "recoger" ? minimarketId : null,
      direccionEntrega:
        entrega === "delivery"
          ? { ...direccion }
          : null,
      items: cart,
      totales: {
        subtotal,
        iva,
        costoEnvio: envio,
        descuento: descMonto,
        total,
      },
      notas: document.getElementById("notas")?.value || "",
      estado: "Pendiente",
      fechaCreacion: new Date().toISOString(),
    };

    const prev = safeParse(PEDIDOS_KEY);
    save(PEDIDOS_KEY, [...prev, pedido]);

    // limpiar carrito
    localStorage.removeItem(CART_KEY);
    setCart([]);

    window.Swal
      ? window.Swal.fire({
          icon: "success",
          title: "¡Pedido realizado con éxito!",
          html: `<p>Tu pedido <strong>#${pedido.id}</strong> ha sido recibido.</p><p>Te enviaremos una confirmación por email.</p>`,
          confirmButtonColor: "#2d8f3c",
        }).then(() => navigate("/menuprincipal#pedidos"))
      : navigate("/menuprincipal#pedidos");
  }

  // HTML ---------------------------------------------------------------------------------------------------------------------------
  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-3">
        <h1 className="text-green mb-0">Finalizar Pedido</h1>
        <NavLink to="/carrito" className="btn btn-outline-secondary btn-sm">
          <i className="fas fa-cart-shopping me-1" />
          Volver al carrito
        </NavLink>
      </div>

      <div className="row">
        {/* Izquierda */}
        <div className="col-lg-8">
          {/* Revisión del carrito */}
          <div className="cart-container">
            <div className="d-flex align-items-center mb-3">
              <div className="step-icon">
                <i className="fas fa-shopping-cart" />
              </div>
              <h4 className="mb-0">Revisa tu pedido</h4>
            </div>

            <div id="checkout-cart-items">
              {cart.map((it) => (
                <div className="cart-item" key={`${it.tipo || "producto"}-${it.id}`}>
                  <div className="row align-items-center">
                    <div className="col-2">
                      <img
                        src={it.imagen || PLACEHOLDER}
                        alt={it.nombre}
                        className="img-fluid"
                        onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
                      />
                    </div>
                    <div className="col-6">
                      <h6 className="mb-0">{it.nombre}</h6>
                      {it.tipo && <small className="text-muted">Tipo: {it.tipo}</small>}
                      <small className="d-block text-muted">
                        {it.minimarket || "Todos los minimarkets"}
                      </small>
                    </div>
                    <div className="col-2 text-center">
                      <span className="badge bg-secondary">{it.cantidad}x</span>
                    </div>
                    <div className="col-2 text-end">
                      <span className="fw-bold">
                        ${clp((Number(it.precio) || 0) * (Number(it.cantidad) || 0))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mt-3 pt-3 border-top">
              <div>
                <p className="mb-0">
                  <strong>Total productos:</strong> <span id="checkout-items-count">{itemsCount}</span>
                </p>
              </div>
              <div>
                <p className="mb-0">
                  <strong>Subtotal:</strong>{" "}
                  <span id="checkout-subtotal">${clp(subtotal)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Método de entrega */}
          <div className="cart-container checkout-step">
            <div className="d-flex align-items-center mb-3">
              <div className="step-icon">
                <i className="fas fa-truck" />
              </div>
              <h4 className="mb-0">Método de entrega</h4>
            </div>

            <div className="delivery-options mt-3">
              <div
                className={`delivery-option ${entrega === "recoger" ? "selected" : ""}`}
                onClick={() => seleccionarEntrega("recoger")}
              >
                <div className="d-flex align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="deliveryOption"
                      id="recoger"
                      value="recoger"
                      checked={entrega === "recoger"}
                      onChange={() => seleccionarEntrega("recoger")}
                    />
                  </div>
                  <div className="ms-3">
                    <label className="form-check-label fw-bold" htmlFor="recoger">
                      Recoger en tienda
                    </label>
                    <p className="mb-0 small text-muted">Pasa a buscar tu pedido cuando esté listo</p>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-success">Gratis</span>
                  </div>
                </div>
              </div>

              <div
                className={`delivery-option ${entrega === "delivery" ? "selected" : ""}`}
                onClick={() => seleccionarEntrega("delivery")}
              >
                <div className="d-flex align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="deliveryOption"
                      id="delivery"
                      value="delivery"
                      checked={entrega === "delivery"}
                      onChange={() => seleccionarEntrega("delivery")}
                    />
                  </div>
                  <div className="ms-3">
                    <label className="form-check-label fw-bold" htmlFor="delivery">
                      Delivery a domicilio
                    </label>
                    <p className="mb-0 small text-muted">Recibe tu pedido en casa</p>
                  </div>
                  <div className="ms-auto">
                    <span className="badge bg-dark">$2.990</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recoger: elegir minimarket */}
            {entrega === "recoger" && (
              <div id="recoger-opciones" className="mt-3">
                <h6>Selecciona el minimarket donde recogerás tu pedido:</h6>
                <div className="minimarket-selector">
                  {minimarkets.map((m) => (
                    <div className="form-check mb-2" key={m.id}>
                      <input
                        className="form-check-input"
                        type="radio"
                        name="minimarket"
                        id={m.id}
                        value={m.id}
                        checked={minimarketId === m.id}
                        onChange={() => setMinimarketId(m.id)}
                      />
                      <label className="form-check-label" htmlFor={m.id}>
                        <strong>{m.nombre}</strong>
                        <div className="small text-muted">
                          {m.direccion}, {m.comuna}
                        </div>
                        <div className="small text-muted">{m.horario}</div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Delivery: dirección */}
            {entrega === "delivery" && (
              <div id="delivery-opciones" className="mt-3">
                <h6>Dirección de entrega:</h6>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="calle" className="form-label">
                      Calle
                    </label>
                    <input
                      id="calle"
                      type="text"
                      className="form-control"
                      value={direccion.calle}
                      onChange={(e) =>
                        setDireccion((d) => ({ ...d, calle: e.target.value }))
                      }
                      required
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="numero" className="form-label">
                      Número
                    </label>
                    <input
                      id="numero"
                      type="text"
                      className="form-control"
                      value={direccion.numero}
                      onChange={(e) =>
                        setDireccion((d) => ({ ...d, numero: e.target.value }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="comuna" className="form-label">
                      Comuna
                    </label>
                    <select
                      id="comuna"
                      className="form-select"
                      value={direccion.comuna}
                      onChange={(e) =>
                        setDireccion((d) => ({ ...d, comuna: e.target.value }))
                      }
                      required
                    >
                      <option value="" disabled>
                        Selecciona una comuna
                      </option>
                      <option value="Santiago">Santiago</option>
                      <option value="Providencia">Providencia</option>
                      <option value="Las Condes">Las Condes</option>
                      <option value="Ñuñoa">Ñuñoa</option>
                      <option value="La Florida">La Florida</option>
                      <option value="La Reina">La Reina</option>
                    </select>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="depto" className="form-label">
                      Depto/Casa (opcional)
                    </label>
                    <input
                      id="depto"
                      type="text"
                      className="form-control"
                      value={direccion.depto}
                      onChange={(e) =>
                        setDireccion((d) => ({ ...d, depto: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="referencias" className="form-label">
                    Referencias adicionales (opcional)
                  </label>
                  <textarea
                    id="referencias"
                    rows={2}
                    className="form-control"
                    value={direccion.referencias}
                    onChange={(e) =>
                      setDireccion((d) => ({
                        ...d,
                        referencias: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            )}
          </div>

          {/* Forma de pago */}
          <div className="cart-container checkout-step">
            <div className="d-flex align-items-center mb-3">
              <div className="step-icon">
                <i className="fas fa-credit-card" />
              </div>
              <h4 className="mb-0">Forma de pago</h4>
            </div>

            <div className="payment-methods mt-3">
              <div
                className={`payment-method ${pago === "efectivo" ? "selected" : ""}`}
                onClick={() => seleccionarPago("efectivo")}
              >
                <div className="d-flex align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="efectivo"
                      checked={pago === "efectivo"}
                      onChange={() => seleccionarPago("efectivo")}
                    />
                  </div>
                  <div className="ms-3">
                    <label className="form-check-label fw-bold" htmlFor="efectivo">
                      Efectivo
                    </label>
                    <p className="mb-0 small text-muted">
                      Paga al recoger o al momento de la entrega
                    </p>
                  </div>
                  <div className="ms-auto">
                    <i className="fas fa-money-bill-wave fa-lg text-success" />
                  </div>
                </div>
              </div>

              <div
                className={`payment-method ${pago === "tarjeta" ? "selected" : ""}`}
                onClick={() => seleccionarPago("tarjeta")}
              >
                <div className="d-flex align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="tarjeta"
                      checked={pago === "tarjeta"}
                      onChange={() => seleccionarPago("tarjeta")}
                    />
                  </div>
                  <div className="ms-3">
                    <label className="form-check-label fw-bold" htmlFor="tarjeta">
                      Tarjeta de crédito/débito
                    </label>
                    <p className="mb-0 small text-muted">Paga online de forma segura</p>
                  </div>
                  <div className="ms-auto">
                    <i className="fab fa-cc-visa fa-lg me-2" />
                    <i className="fab fa-cc-mastercard fa-lg me-2" />
                    <i className="fab fa-cc-amex fa-lg" />
                  </div>
                </div>
              </div>

              <div
                className={`payment-method ${pago === "transferencia" ? "selected" : ""}`}
                onClick={() => seleccionarPago("transferencia")}
              >
                <div className="d-flex align-items-center">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="paymentMethod"
                      id="transferencia"
                      checked={pago === "transferencia"}
                      onChange={() => seleccionarPago("transferencia")}
                    />
                  </div>
                  <div className="ms-3">
                    <label className="form-check-label fw-bold" htmlFor="transferencia">
                      Transferencia bancaria
                    </label>
                    <p className="mb-0 small text-muted">Te enviaremos los datos por email</p>
                  </div>
                  <div className="ms-auto">
                    <i className="fas fa-university fa-lg text-primary" />
                  </div>
                </div>
              </div>
            </div>

            {/* Datos de tarjeta */}
            {pago === "tarjeta" && (
              <div id="tarjeta-opciones" className="mt-3">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cardNumber" className="form-label">
                      Número de tarjeta
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      className="form-control"
                      placeholder="1234 5678 9012 3456"
                      value={card.number}
                      onChange={(e) => setCard((c) => ({ ...c, number: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cardName" className="form-label">
                      Nombre en la tarjeta
                    </label>
                    <input
                      id="cardName"
                      type="text"
                      className="form-control"
                      value={card.name}
                      onChange={(e) => setCard((c) => ({ ...c, name: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cardExpiry" className="form-label">
                      Fecha de expiración
                    </label>
                    <input
                      id="cardExpiry"
                      type="text"
                      className="form-control"
                      placeholder="MM/AA"
                      value={card.expiry}
                      onChange={(e) => setCard((c) => ({ ...c, expiry: e.target.value }))}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="cardCVV" className="form-label">
                      CVV
                    </label>
                    <input
                      id="cardCVV"
                      type="text"
                      className="form-control"
                      placeholder="123"
                      value={card.cvv}
                      onChange={(e) => setCard((c) => ({ ...c, cvv: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Información de contacto */}
          <div className="cart-container">
            <div className="d-flex align-items-center mb-3">
              <div className="step-icon">
                <i className="fas fa-user" />
              </div>
              <h4 className="mb-0">Información de contacto</h4>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre
                </label>
                <input
                  id="nombre"
                  type="text"
                  className="form-control"
                  value={contacto.nombre}
                  onChange={(e) => setContacto((s) => ({ ...s, nombre: e.target.value }))}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="apellido" className="form-label">
                  Apellido
                </label>
                <input
                  id="apellido"
                  type="text"
                  className="form-control"
                  value={contacto.apellido}
                  onChange={(e) => setContacto((s) => ({ ...s, apellido: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={contacto.email}
                  onChange={(e) => setContacto((s) => ({ ...s, email: e.target.value }))}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="telefono" className="form-label">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  type="tel"
                  className="form-control"
                  value={contacto.telefono}
                  onChange={(e) => setContacto((s) => ({ ...s, telefono: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="notas" className="form-label">
                Notas adicionales (opcional)
              </label>
              <textarea id="notas" rows={2} className="form-control" placeholder="Instrucciones especiales para tu pedido..." />
            </div>

            <div className="form-check mb-0">
              <input className="form-check-input" type="checkbox" id="terminos" required />
              <label className="form-check-label" htmlFor="terminos">
                Acepto los <span className="text-decoration-none">términos y condiciones</span>
              </label>
            </div>
          </div>
        </div>

        {/* Derecha: resumen */}
        <div className="col-lg-4">
          <div className="cart-summary sticky-lg-top" style={{ top: 20 }}>
            <h4 className="mb-3">Resumen del pedido</h4>

            <div className="d-flex justify-content-between mb-2">
              <span>
                Productos (<span id="resumen-cantidad">{itemsCount}</span>):
              </span>
              <span id="resumen-subtotal">${clp(subtotal)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>IVA (19%):</span>
              <span id="resumen-iva">${clp(iva)}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Envío:</span>
              <span id="resumen-envio">{envio === 0 ? "Gratis" : `$${clp(envio)}`}</span>
            </div>

            <div className="d-flex justify-content-between mb-2">
              <span>Descuentos:</span>
              <span id="resumen-descuentos" className="text-danger">
                -${clp(descMonto)}
              </span>
            </div>

            <hr />

            <div className="d-flex justify-content-between mb-3">
              <span className="fw-bold">Total:</span>
              <span className="fw-bold text-green" id="resumen-total">
                ${clp(total)}
              </span>
            </div>

            {/* Código de descuento */}
            <div className="mb-3">
              <div className="input-group">
                <input
                  id="codigo-descuento"
                  type="text"
                  className="form-control"
                  placeholder="VILLA10 o ENVIOGRATIS"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button" onClick={aplicarDescuento}>
                  Aplicar
                </button>
              </div>
            </div>

            {/* Entrega rápida */}
            <div className="mb-3">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="env"
                  id="env-recoger-badge"
                  checked={entrega === "recoger"}
                  onChange={() => seleccionarEntrega("recoger")}
                />
                <label className="form-check-label" htmlFor="env-recoger-badge">
                  Recoger en tienda (Gratis)
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="env"
                  id="env-delivery-badge"
                  checked={entrega === "delivery"}
                  onChange={() => seleccionarEntrega("delivery")}
                />
                <label className="form-check-label" htmlFor="env-delivery-badge">
                  Delivery ($2.990)
                </label>
              </div>
            </div>

            <button className="btn btn-green w-100" onClick={confirmarPedido}>
              <i className="fas fa-check-circle me-1" />
              Confirmar Pedido
            </button>

            <div className="text-center mt-3">
              <small className="text-muted">
                <i className="fas fa-lock me-1" />
                Pago seguro garantizado
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
