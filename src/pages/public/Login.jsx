
import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import usuarioService from '../../services/usuarioService';

/* Para demo (admin/admin123, cliente1/cliente123) */
function seedUsuarios() {
  const store = JSON.parse(localStorage.getItem("usuarios") || "[]");


  const base = [
    { usuario:"admin",    clave:"admin123",   email:"admin@villamarket.com",  rol:"admin"},
    { usuario:"cliente1", clave:"cliente123", email:"cliente1@villamarket.com", rol:"cliente" }
  ];

  const faltan = base.filter(b => !store.some(u => u.usuario === b.usuario));
  if (store.length === 0 || faltan.length) {
    localStorage.setItem("usuarios", JSON.stringify([...store, ...faltan]));
  }
}

// Componente Login
export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername,] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => { seedUsuarios(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    // Primero intentar login contra backend
    try {
      const resp = await usuarioService.login({ username, password });
      // resp puede venir con varias formas: { token, usuario } o { authToken, user }
      const token = resp?.token || resp?.authToken || resp?.accessToken || null;
      const user = resp?.usuario || resp?.user || resp?.usuarioActual || (resp && !token ? resp : null);

      if (token) localStorage.setItem('authToken', token);
      if (user) {
        // normalizar campos mínimos
        if (!user.email && user.correo) user.email = user.correo;
        if (!user.correo && user.email) user.correo = user.email;
        if (user.tipoUsuario === "admin") user.rol = "admin";
        else if (user.tipoUsuario === "cliente") user.rol = "cliente";
        else if (user.rol === "administrador") user.rol = "admin";

        localStorage.setItem('usuarioActual', JSON.stringify(user));
      }

      setLoading(false);
      const finalUser = user || (token ? null : null);

      // Si recibimos rol desde backend lo usamos, sino intentamos redirigir por defecto al home
      if (finalUser && (finalUser.tipoUsuario === 'admin' || finalUser.rol === 'admin')) {
        navigate('/admin', { replace: true });
      } else if (finalUser && (finalUser.tipoUsuario === 'cliente' || finalUser.rol === 'cliente')) {
        navigate('/clienteinicio', { replace: true });
      } else {
        // Si no tenemos user pero sí token, redirigimos a cliente por defecto
        if (token) navigate('/clienteinicio', { replace: true });
        else navigate('/', { replace: true });
      }

      return;
    } catch (err) {
      console.warn('Login backend falló, intentando fallback local:', err?.message || err);
      // continuar con fallback local
    } finally {
      setLoading(false);
    }

    // Fallback: verificar usuarios en localStorage (demo)
    const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
    const user = usuarios.find(u => {
      const matchUser = [u.usuario, u.email, u.correo].includes(username);
      const matchPass = u.clave === password || u.password === password;
      return matchUser && matchPass;
    });

    if (!user) {
      setErrorMsg("Usuario o contraseña incorrectos.");
      return;
    }

    // Normalizar datos del usuario
    if (!user.email && user.correo) user.email = user.correo;
    if (!user.correo && user.email) user.correo = user.email;
    if (user.tipoUsuario === "admin") user.rol = "admin";
    else if (user.tipoUsuario === "cliente") user.rol = "cliente";
    else if (user.rol === "administrador") user.rol = "admin";

    // Guardar usuario actual en localStorage
    localStorage.setItem("usuarioActual", JSON.stringify(user));
    setLoading(false);

    // Redireccionar según el rol del usuario
    if (user.tipoUsuario === "admin" || user.rol === "admin") {
      navigate("/admin", { replace: true });
    } else if (user.tipoUsuario === "cliente" || user.rol === "cliente") {
      navigate("/clienteinicio", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  };


  // HTML ---------------------------------------------------------------------------------------------------------------------------
  return (
    <div className="login-pretty-bg">
      <main className="login-pretty container-xxl">
        {/* Columna izquierda: tarjeta de login */}
        <section className="login-pretty-card" aria-labelledby="login-title">
          <div className="brand-mini">
              <img src="/img/Logos/Logotipo Transparente.png" alt="Villa Markets" width="44" height="44" />
            <span>Villa Markets</span>
          </div>

          <h1 id="login-title" className="login-pretty-title">Bienvenido 👋</h1>
          <p className="login-pretty-sub">Ingresa para continuar comprando en tus minimarkets favoritos.</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="input-group-pretty">
              <i className="fas fa-user" aria-hidden="true" />
              <input
                type="text"
                placeholder="Usuario o Email"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-label="Usuario o Email"
              />
            </div>

            <div className="input-group-pretty">
              <i className="fas fa-lock" aria-hidden="true" />
              <input
                type={show ? "text" : "password"}
                placeholder="Contraseña"
                autoComplete="current-password"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Contraseña"
              />
              {/* Boton para mostrar o ocultar contraseña */}
              <button
                type="button"
                className="show-btn"
                aria-label={show ? "Ocultar contraseña" : "Mostrar contraseña"}
                onClick={() => setShow(s => !s)}
              >
                <i className={`fas ${show ? "fa-eye-slash" : "fa-eye"}`} />
              </button>
            </div>

            {errorMsg && <div className="alert-pretty" role="alert">{errorMsg}</div>}

            {/*Boton de entrar*/}
            <button type="submit" className="btn-pretty" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </button>

            <div className="links-row">
              <span />
              <NavLink to="/registro" className="link-pretty">Crear cuenta</NavLink>
            </div>
          </form>

          <div className="tips-demo">
            <span className="badge-hint">Demo</span>
            <span>admin / admin123 (→ Admin Dashboard) · cliente1 / cliente123 (→ Cliente Inicio)</span>
          </div>
        </section>

        {/* Columna derecha: panel visual con productos */}
        <aside className="login-pretty-aside" aria-hidden="true">
          <div className="aside-overlay">
            <h2>Novedades de Villa Markets</h2>
            <div className="chips">
              <span className="chip">Fresco</span>
              <span className="chip">Ofertas</span>
              <span className="chip">Locales</span>
            </div>

            <div className="cards">
              {[
                { img: "/img/Catalogos/tiramisu.jpg", name: "Tiramisú", price: "$1.500" },
                { img: "/img/Catalogos/ensalada-cesar.jpg", name: "Ensalada César", price: "$1.500" },
                { img: "/img/Catalogos/lasana-de-carne.jpg", name: "Lasaña de carne", price: "$5.000" },
                { img: "/img/Catalogos/sopa-tomate.jpg", name: "Sopa de Tomate", price: "$10.000" },
              ].map((p, i) => (
                <div className="mini-card" key={i}>
                  <img src={p.img} alt={p.name} />
                  <div>
                    <strong>{p.name}</strong>
                    <span>{p.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>
    </div>
  );

}
