import { useState } from "react";
import Swal from "sweetalert2";

/**
 * Página de Soporte y Contacto - Villa Markets
 * Adaptación de soporte.html + soporte.js
 */
export default function Soporte() {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    asunto: "",
    mensaje: "",
    terminos: false,
  });

  // Manejar cambio de inputs
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [id]: type === "checkbox" ? checked : value }));
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones básicas (puedes mejorarlas con librerías)
    if (!form.nombre || !form.email || !form.asunto || !form.mensaje || !form.terminos) {
      Swal.fire({
        icon: "warning",
        title: "Formulario incompleto",
        text: "Por favor completa todos los campos y acepta los términos.",
        confirmButtonColor: "#28a745",
      });
      return;
    }

    console.log("Formulario enviado:", form);

    Swal.fire({
      icon: "success",
      title: "¡Mensaje enviado!",
      text: "Gracias por contactarnos. Te responderemos a la brevedad.",
      confirmButtonColor: "#28a745",
    });

    setForm({
      nombre: "",
      email: "",
      asunto: "",
      mensaje: "",
      terminos: false,
    });
  };

  // HTML ---------------------------------------------------------------------------------------------------------------------------
  return (
    <div className="container my-5">
      {/* Hero */}
      <section className="text-center mb-5">
        <h1 className="display-5 fw-bold text-green mb-3">Centro de Ayuda y Soporte</h1>
        <p className="lead text-muted">
          Estamos aquí para ayudarte con cualquier duda o problema.
        </p>
      </section>

      <div className="row mb-5">
        {/* Preguntas frecuentes */}
        <div className="col-md-8">
          <h2 className="mb-4 text-green">Preguntas Frecuentes</h2>

          <div className="accordion" id="faqAccordion">
            {[
              {
                id: 1,
                icon: "fa-question-circle",
                pregunta: "¿Cómo puedo crear una cuenta en Villa Markets?",
                respuesta:
                  "Ve a la opción “Registrarse” en el menú superior, completa tus datos y acepta los términos. ¡Y listo! Ya puedes empezar a comprar.",
              },
              {
                id: 2,
                icon: "fa-truck",
                pregunta: "¿Cuál es el tiempo estimado de entrega?",
                respuesta:
                  "Depende de tu ubicación y del minimarket. En general, entre 30 minutos y 2 horas después de confirmar la compra.",
              },
              {
                id: 3,
                icon: "fa-credit-card",
                pregunta: "¿Qué métodos de pago aceptan?",
                respuesta:
                  "Aceptamos tarjetas, transferencias, WebPay, pago contra entrega y Junaeb (en algunos minimarkets).",
              },
              {
                id: 4,
                icon: "fa-exchange-alt",
                pregunta: "¿Cuál es la política de devoluciones?",
                respuesta:
                  "Puedes solicitar una devolución dentro de 24 horas si el producto está en mal estado o no corresponde.",
              },
              {
                id: 5,
                icon: "fa-store",
                pregunta: "¿Cómo puedo registrar mi minimarket?",
                respuesta:
                  "Regístrate como usuario comercial en la sección 'Registrar mi negocio'. Te contactaremos dentro de 48 horas hábiles.",
              },
            ].map((faq) => (
              <div className="accordion-item faq-card mb-3" key={faq.id}>
                <h2 className="accordion-header" id={`heading${faq.id}`}>
                  <button
                    className={`accordion-button ${faq.id !== 1 ? "collapsed" : ""}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${faq.id}`}
                    aria-expanded={faq.id === 1 ? "true" : "false"}
                    aria-controls={`collapse${faq.id}`}
                  >
                    <i className={`fas ${faq.icon} me-2 text-green`} />
                    {faq.pregunta}
                  </button>
                </h2>
                <div
                  id={`collapse${faq.id}`}
                  className={`accordion-collapse collapse ${faq.id === 1 ? "show" : ""}`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">{faq.respuesta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contacto */}
        <div className="col-md-4">
          <div className="contact-card p-4 bg-white shadow-sm rounded">
            <h3 className="mb-4 text-green">Contáctanos</h3>
            <p>
              <i className="fas fa-phone me-2" /> +56 9 1234 5678
            </p>
            <p>
              <i className="fas fa-envelope me-2" /> soporte@villamarkets.cl
            </p>
            <p>
              <i className="fas fa-clock me-2" /> Lun-Vie: 9:00 - 18:00
            </p>
            <p>
              <i className="fas fa-map-marker-alt me-2" /> Álvarez 2366, Viña del Mar
            </p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <div className="row">
        <div className="col-12">
          <h2 className="mb-4 text-green">Formulario de Contacto</h2>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label htmlFor="nombre" className="form-label">
                  Nombre completo
                </label>
                <input
                  id="nombre"
                  type="text"
                  className="form-control"
                  value={form.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="col-md-6 mb-3">
                <label htmlFor="email" className="form-label">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="asunto" className="form-label">
                Asunto
              </label>
              <select
                id="asunto"
                className="form-select"
                value={form.asunto}
                onChange={handleChange}
                required
              >
                <option value="">Selecciona un asunto</option>
                <option value="consulta">Consulta general</option>
                <option value="problema">Problema con un pedido</option>
                <option value="devolucion">Solicitud de devolución</option>
                <option value="sugerencia">Sugerencia</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div className="mb-3">
              <label htmlFor="mensaje" className="form-label">
                Mensaje
              </label>
              <textarea
                id="mensaje"
                rows="5"
                className="form-control"
                value={form.mensaje}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-check mb-4">
              <input
                id="terminos"
                type="checkbox"
                className="form-check-input"
                checked={form.terminos}
                onChange={handleChange}
              />
              <label htmlFor="terminos" className="form-check-label">
                Acepto los términos y condiciones de privacidad
              </label>
            </div>

            <button type="submit" className="btn btn-green">
              <i className="fas fa-paper-plane me-2" />
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
