import React from 'react';
import {Link } from 'react-router-dom';


export default function Perfil() {
    const usuario = JSON.parse(localStorage.getItem('usuarioActual')) || {usuario: 'Invitado', email: '', rol: ''};
    const handleLogout = () => {
        localStorage.removeItem('usuarioActual');
        window.location.href = '/login';
    };
    return (
        <div style={{ maxWidth: 420, margin: "24px auto", textAlign: "center" }}>
            <img
                src="https://via.placeholder.com/120.png?text=Perfil"
                alt="avatar"
                style={{ borderRadius: "50%", width: 120, height: 120, objectFit: "cover" }}
            />
            <h2 style={{ marginTop: 12 }}>{usuario.usuario || usuario.nombre || 'Invitado'}</h2>
            <p className="text-muted">{usuario.email || 'Sin correo'}</p>
            <div style={{ margin: '16px 0' }}>
                <button className="btn btn-light" style={{ marginRight: 8 }} disabled>Mi perfil</button>
                <button className="btn btn-outline-danger" onClick={handleLogout}>Cerrar sesión</button>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 16 }}>
                <Link to="/minimarkets"><button className="btn btn-outline-primary">Ver Tiendas</button></Link>
                <Link to="/ofertas"><button className="btn btn-primary">Ofertas</button></Link>
            </div>
        </div>
    );
}