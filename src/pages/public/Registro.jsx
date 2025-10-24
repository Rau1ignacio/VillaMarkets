// src/pages/Registro.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // para tooltips si los usas

// --- Utilidades RUT (módulo 11) ---
function validarRut(raw) {
  if (!raw) return false;
  let rut = raw.replace(/\./g, "").replace(/-/g, "");
  if (rut.length < 2) return false;

  const dv = rut.slice(-1).toUpperCase();
  const rutSinDV = rut.slice(0, -1);

  if (!/^\d+$/.test(rutSinDV) || !/^[\dK]$/.test(dv)) return false;

  let suma = 0;
  let multiplicador = 2;
  for (let i = rutSinDV.length - 1; i >= 0; i--) {
    suma += parseInt(rutSinDV[i], 10) * multiplicador;
    multiplicador = multiplicador < 7 ? multiplicador + 1 : 2;
  }
  const dvEsperado = 11 - (suma % 11);
  const dvCalculado =
    dvEsperado === 11 ? "0" : dvEsperado === 10 ? "K" : String(dvEsperado);

  return dvCalculado === dv;
}

function formatearRut(raw) {
  let rut = raw.replace(/\./g, "").replace(/-/g, "");
  const dv = rut.slice(-1);
  const cuerpo = rut.slice(0, -1);
  let out = "";
  for (let i = cuerpo.length; i > 0; i -= 3) {
    const inicio = Math.max(0, i - 3);
    out = (i < cuerpo.length ? "." : "") + cuerpo.substring(inicio, i) + out;
  }
  return `${out}-${dv}`;
}

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nombre: "",
    apellidos: "",
    rut: "",
    correo: "",
    confirmarCorreo: "",
    direccion: "",
    telefono: "",
    dieta: "Ninguna",
    password: "",
    confirmarPassword: "",
    terminos: false,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Inicializar tooltips si usas data-bs-toggle
  useEffect(() => {
    if (window.bootstrap) {
      const list = [].slice.call(
        document.querySelectorAll('[data-bs-toggle="tooltip"]')
      );
      list.forEach((el) => new window.bootstrap.Tooltip(el));
    }
  }, []);

  const setField = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
  };

  // Validación del formulario
  const validate = () => {
    const e = {};
  
    if (!form.nombre.trim()) e.nombre = "Ingresa tu nombre.";
    if (!form.apellidos.trim()) e.apellidos = "Ingresa tus apellidos.";

    if (!form.rut.trim()) e.rut = "Ingresa tu RUT.";
    else if (!validarRut(form.rut)) e.rut = "RUT inválido.";

    if (!form.correo.trim()) e.correo = "Ingresa tu correo.";
    else if (!/\S+@\S+\.\S+/.test(form.correo)) e.correo = "Correo inválido."; // valida los caracteres básicos como @ y .
    if (!form.confirmarCorreo.trim()) e.confirmarCorreo = "Confirma tu correo.";
    if (form.correo && form.confirmarCorreo && form.correo !== form.confirmarCorreo) {
      e.confirmarCorreo = "Los correos no coinciden.";
    }

    if (!form.direccion.trim()) e.direccion = "Ingresa tu dirección.";
    if (!form.telefono.trim()) e.telefono = "Ingresa tu número de celular.";

    if (!form.password) e.password = "Ingresa una contraseña.";
    else if (form.password.length < 8)
      e.password = "La contraseña debe tener al menos 8 caracteres.";

    if (!form.confirmarPassword) e.confirmarPassword = "Confirma tu contraseña.";
    if (form.password && form.confirmarPassword && form.password !== form.confirmarPassword) {
      e.confirmarPassword = "Las contraseñas no coinciden.";
    }

    if (!form.terminos) e.terminos = "Debes aceptar los Términos y Condiciones.";

    return e;
  };

  const onBlurRut = () => {
    if (form.rut.trim() && validarRut(form.rut)) {
      setField("rut", formatearRut(form.rut));
      setErrors((prev) => ({ ...prev, rut: undefined }));
    }
    setTouched((t) => ({ ...t, rut: true }));
  };

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    const eMap = validate();
    setErrors(eMap);
    setTouched({
      nombre: true,
      apellidos: true,
      rut: true,
      correo: true,
      confirmarCorreo: true,
      direccion: true,
      telefono: true,
      password: true,
      confirmarPassword: true,
      terminos: true,
    });

    if (Object.keys(eMap).length > 0) return;

    // Construir usuario simulado
    const nuevoUsuario = {
      nombre: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      rut: formatearRut(form.rut),
      email: form.correo.trim(),
      direccion: form.direccion.trim(),
      telefono: form.telefono.trim(),
      dieta: form.dieta,
      password: form.password, // solo para demo/login local
      rol: "cliente",
    };

    // Persistencia simulada
    localStorage.setItem("usuarioActual", JSON.stringify(nuevoUsuario));
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    usuarios.push(nuevoUsuario);
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    // SweetAlert2 (CDN) o fallback a alert
    const done = () =>
      navigate("/", { replace: true }); // redirige al Home (ajusta ruta si es necesario)

    if (window.Swal) {
      window.Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Bienvenido a Villa Markets. Tu cuenta ha sido creada correctamente.",
        confirmButtonColor: "#2d8f3c",
      }).then(done);
    } else {
      alert("¡Registro exitoso!");
      done();
    }
  };

  // helper de clase de error bootstrap
  const invalid = (field) => touched[field] && errors[field] ? "is-invalid" : "";
  const feedback = (field) =>
    touched[field] && errors[field] ? (
      <div className="invalid-feedback">{errors[field]}</div>
    ) : null;


  // HTML ---------------------------------------------------------------------------------------------------------------------------
  return (

    <div className="container py-5">
     <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8 col-xl-7 mx-auto">
       <div className="form-container">
        <h1 className="text-center text-green mb-4">Crear una cuenta</h1>
        <p className="text-center text-muted mb-4">
          Completa el formulario para registrarte en Villa Markets
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="nombre" className="form-label">Nombre</label>
              <input
                id="nombre"
                type="text"
                className={`form-control ${invalid("nombre")}`}
                value={form.nombre}
                onChange={(e) => setField("nombre", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, nombre: true }))}
                required
              />
              {feedback("nombre")}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="apellidos" className="form-label">Apellidos</label>
              <input
                id="apellidos"
                type="text"
                className={`form-control ${invalid("apellidos")}`}
                value={form.apellidos}
                onChange={(e) => setField("apellidos", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, apellidos: true }))}
                required
              />
              {feedback("apellidos")}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="rut" className="form-label">RUT</label>
            <input
              id="rut"
              type="text"
              className={`form-control ${invalid("rut")}`}
              placeholder="12.345.678-9"
              value={form.rut}
              onChange={(e) => setField("rut", e.target.value)}
              onBlur={onBlurRut}
              required
            />
            {feedback("rut")}
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="correo" className="form-label">Correo Electrónico</label>
              <input
                id="correo"
                type="email"
                className={`form-control ${invalid("correo")}`}
                value={form.correo}
                onChange={(e) => setField("correo", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, correo: true }))}
                required
              />
              {feedback("correo")}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="confirmarCorreo" className="form-label">Confirmar Correo</label>
              <input
                id="confirmarCorreo"
                type="email"
                className={`form-control ${invalid("confirmarCorreo")}`}
                value={form.confirmarCorreo}
                onChange={(e) => setField("confirmarCorreo", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, confirmarCorreo: true }))}
                required
              />
              {feedback("confirmarCorreo")}
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="direccion" className="form-label">Dirección</label>
            <input
              id="direccion"
              type="text"
              className={`form-control ${invalid("direccion")}`}
              value={form.direccion}
              onChange={(e) => setField("direccion", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, direccion: true }))}
              required
            />
            {feedback("direccion")}
          </div>

          <div className="mb-3">
            <label htmlFor="telefono" className="form-label">Número de Celular</label>
            <input
              id="telefono"
              type="tel"
              className={`form-control ${invalid("telefono")}`}
              placeholder="+56912345678"
              value={form.telefono}
              onChange={(e) => setField("telefono", e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, telefono: true }))}
              required
            />
            {feedback("telefono")}
          </div>

          <div className="mb-3">
            <label htmlFor="dieta" className="form-label">Tipo de Dieta</label>
            <select
              id="dieta"
              className="form-select"
              value={form.dieta}
              onChange={(e) => setField("dieta", e.target.value)}
            >
              <option value="Ninguna">Ninguna</option>
              <option value="Vegana">Vegana</option>
              <option value="Vegetariana">Vegetariana</option>
              <option value="Sin gluten">Sin gluten</option>
              <option value="Keto">Keto</option>
              <option value="Otra">Otra</option>
            </select>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                id="password"
                type="password"
                className={`form-control ${invalid("password")}`}
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                required
              />
              {feedback("password")}
            </div>

            <div className="col-md-6 mb-3">
              <label htmlFor="confirmarPassword" className="form-label">Confirmar Contraseña</label>
              <input
                id="confirmarPassword"
                type="password"
                className={`form-control ${invalid("confirmarPassword")}`}
                value={form.confirmarPassword}
                onChange={(e) => setField("confirmarPassword", e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, confirmarPassword: true }))}
                required
              />
              {feedback("confirmarPassword")}
            </div>
          </div>

          <div className="mb-4 form-check">
            <input
              id="terminos"
              type="checkbox"
              className={`form-check-input ${invalid("terminos")}`}
              checked={form.terminos}
              onChange={(e) => setField("terminos", e.target.checked)}
              onBlur={() => setTouched((t) => ({ ...t, terminos: true }))}
              required
            />
            <label className="form-check-label" htmlFor="terminos">
              Acepto los <NavLink to="/soporte">Términos y Condiciones</NavLink>
            </label>
            {feedback("terminos")}
          </div>

          <button type="submit" className="btn btn-green btn-lg w-100">
            Registrarse
          </button>
        </form>

        <div className="text-center mt-3">
          <p>
            ¿Ya tienes una cuenta?{" "}
            <NavLink to="/login" className="text-green">
              Inicia sesión aquí
            </NavLink>
          </p>
        </div>
       </div>
      </div>
     </div>
    </div>
  );
}
