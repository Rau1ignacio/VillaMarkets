// src/pages/Registro.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min.js"; // para tooltips si los usas
import registroService from "../../services/registroService";

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
    tipoUsuario: "cliente", // Nuevo campo para tipo de usuario
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
    // Campos específicos para administrador de minimarket
    nombreMinimarket: "",
    direccionMinimarket: "",
    descripcionMinimarket: "",
    horariosAtencion: {
      lunes: { abierto: true, inicio: "09:00", fin: "18:00" },
      martes: { abierto: true, inicio: "09:00", fin: "18:00" },
      miercoles: { abierto: true, inicio: "09:00", fin: "18:00" },
      jueves: { abierto: true, inicio: "09:00", fin: "18:00" },
      viernes: { abierto: true, inicio: "09:00", fin: "18:00" },
      sabado: { abierto: true, inicio: "09:00", fin: "14:00" },
      domingo: { abierto: false, inicio: "09:00", fin: "14:00" }
    }
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);

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

    // Validaciones específicas para administrador de minimarket
    if (form.tipoUsuario === "admin") {
      if (!form.nombreMinimarket.trim()) {
        e.nombreMinimarket = "Ingresa el nombre del minimarket.";
      }
      if (!form.direccionMinimarket.trim()) {
        e.direccionMinimarket = "Ingresa la dirección del minimarket.";
      }
      if (!form.descripcionMinimarket.trim()) {
        e.descripcionMinimarket = "Ingresa una descripción del minimarket.";
      }
    }

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
  const handleSubmit = async (e) => {
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

    setIsLoading(true);

    // Construir datos para enviar al backend
    const datosRegistro = {
      nombres: form.nombre.trim(),
      apellidos: form.apellidos.trim(),
      rut: formatearRut(form.rut),
      correo: form.correo.trim(),
      direccion: form.direccion.trim(),
      telefono: form.telefono.trim(),
      password: form.password,
      username: form.correo.split('@')[0], // usar parte del email como username
      rol: form.tipoUsuario // "cliente" o "admin"
    };

    try {
      // Enviar datos al backend
      const response = await registroService.registrar(datosRegistro);
      
      // Guardar token si el backend lo devuelve (opcional)
      if (response.token) {
        localStorage.setItem('authToken', response.token);
      }

      // Mostrar mensaje de éxito y redirigir al login
      const done = () => navigate("/login", { replace: true });

      if (window.Swal) {
        const mensajeAdmin = form.tipoUsuario === "admin" 
          ? "Tu solicitud será revisada por nuestro equipo. Te notificaremos cuando tu cuenta sea aprobada."
          : "Tu cuenta ha sido creada correctamente. Ya puedes iniciar sesión.";

        window.Swal.fire({
          icon: "success",
          title: "¡Registro exitoso!",
          text: `Bienvenido a Villa Markets. ${mensajeAdmin}`,
          confirmButtonColor: "#2d8f3c",
        }).then(done);
      } else {
        alert("¡Registro exitoso! Ahora inicia sesión.");
        done();
      }
    } catch (error) {
      // Mostrar error al usuario
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          error.message || 
                          "Error al registrarse. Intenta de nuevo.";
      
      setErrors({ form: errorMessage });

      if (window.Swal) {
        window.Swal.fire({
          icon: "error",
          title: "Error en el registro",
          text: errorMessage,
          confirmButtonColor: "#dc3545",
        });
      } else {
        alert(`Error: ${errorMessage}`);
      }
    } finally {
      setIsLoading(false);
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

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          {/* Selector de tipo de usuario */}
          <div className="mb-4">
            <div className="row justify-content-center text-center">
              <div className="col-md-6">
                <label className="form-label d-block mb-3">¿Cómo deseas registrarte?</label>
                <div className="btn-group" role="group">
                  <input
                    type="radio"
                    className="btn-check"
                    name="tipoUsuario"
                    id="tipoCliente"
                    value="cliente"
                    checked={form.tipoUsuario === "cliente"}
                    onChange={(e) => setField("tipoUsuario", e.target.value)}
                  />
                  <label className="btn btn-outline-primary" htmlFor="tipoCliente">
                    <i className="fas fa-user me-2"></i>
                    Cliente
                  </label>

                  <input
                    type="radio"
                    className="btn-check"
                    name="tipoUsuario"
                    id="tipoAdmin"
                    value="admin"
                    checked={form.tipoUsuario === "admin"}
                    onChange={(e) => setField("tipoUsuario", e.target.value)}
                  />
                  <label className="btn btn-outline-primary" htmlFor="tipoAdmin">
                    <i className="fas fa-store me-2"></i>
                    Administrador de Minimarket
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Campos específicos para administrador de minimarket */}
          {form.tipoUsuario === "admin" && (
            <div className="border rounded p-4 mb-4 bg-light">
              <h5 className="mb-3">
                <i className="fas fa-store me-2"></i>
                Información del Minimarket
              </h5>
              
              <div className="mb-3">
                <label htmlFor="nombreMinimarket" className="form-label">Nombre del Minimarket</label>
                <input
                  id="nombreMinimarket"
                  type="text"
                  className={`form-control ${invalid("nombreMinimarket")}`}
                  value={form.nombreMinimarket}
                  onChange={(e) => setField("nombreMinimarket", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, nombreMinimarket: true }))}
                  required
                />
                {feedback("nombreMinimarket")}
              </div>

              <div className="mb-3">
                <label htmlFor="direccionMinimarket" className="form-label">Dirección del Minimarket</label>
                <input
                  id="direccionMinimarket"
                  type="text"
                  className={`form-control ${invalid("direccionMinimarket")}`}
                  value={form.direccionMinimarket}
                  onChange={(e) => setField("direccionMinimarket", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, direccionMinimarket: true }))}
                  required
                />
                {feedback("direccionMinimarket")}
              </div>

              <div className="mb-3">
                <label htmlFor="descripcionMinimarket" className="form-label">Descripción del Minimarket</label>
                <textarea
                  id="descripcionMinimarket"
                  className={`form-control ${invalid("descripcionMinimarket")}`}
                  value={form.descripcionMinimarket}
                  onChange={(e) => setField("descripcionMinimarket", e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, descripcionMinimarket: true }))}
                  rows="3"
                  placeholder="Describe brevemente tu minimarket..."
                  required
                />
                {feedback("descripcionMinimarket")}
              </div>
            </div>
          )}

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

          <button type="submit" className="btn btn-green btn-lg w-100" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse"}
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
