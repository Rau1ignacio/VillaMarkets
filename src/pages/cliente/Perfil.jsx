import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Perfil.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faCamera, faLink, faUpload, faSave, faSignOutAlt, faStore } from '@fortawesome/free-solid-svg-icons';

export default function Perfil() {
    // Carga perfil desde localStorage (clave existente: 'usuarioActual')
    const usuarioLS = JSON.parse(localStorage.getItem('usuarioActual')) || { usuario: 'Invitado', email: '', rol: '' };

    // Estado del formulario
    const [nombre, setNombre] = useState(usuarioLS.usuario || usuarioLS.nombre || 'Invitado');
    const [email] = useState(usuarioLS.email || '');
    const [avatarSrc, setAvatarSrc] = useState(usuarioLS.avatar || 'https://via.placeholder.com/120.png?text=Perfil');
    const [metodoFoto, setMetodoFoto] = useState('url'); // 'url' | 'file'
    const [fotoUrl, setFotoUrl] = useState('');
    const [feedback, setFeedback] = useState(null); // { type: 'success'|'error', msg: string }

    useEffect(() => {
        // Si viene avatar en LS usarlo; si no, dejar placeholder
        if (usuarioLS && usuarioLS.avatar) {
            setAvatarSrc(usuarioLS.avatar);
        }
        // Prefill URL si el avatar guardado fue una URL
        if (usuarioLS && usuarioLS.avatar && typeof usuarioLS.avatar === 'string' && usuarioLS.avatar.startsWith('http')) {
            setFotoUrl(usuarioLS.avatar);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('usuarioActual');
        window.location.href = '/clienteinicio';
    };

    const validarUrl = (url) => {
        try {
            const u = new URL(url);
            return /^https?:/.test(u.protocol);
        } catch {
            return false;
        }
    };

    const leerArchivoComoDataUrl = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });

    const onFileChange = async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        // Validaciones básicas
        if (!/^image\/(jpeg|jpg|png|webp)$/i.test(file.type)) {
            setFeedback({ type: 'error', msg: 'Formato no soportado. Usa JPG, PNG o WebP.' });
            return;
        }
        const maxMB = 2;
        if (file.size > maxMB * 1024 * 1024) {
            setFeedback({ type: 'error', msg: `La imagen supera ${maxMB}MB.` });
            return;
        }
        try {
            const dataUrl = await leerArchivoComoDataUrl(file);
            setAvatarSrc(dataUrl);
            setFeedback({ type: 'success', msg: 'Imagen cargada correctamente.' });
            } catch {
            setFeedback({ type: 'error', msg: 'No se pudo leer la imagen.' });
        }
    };

    const aplicarUrl = () => {
        if (!fotoUrl || !validarUrl(fotoUrl)) {
            setFeedback({ type: 'error', msg: 'Ingresa una URL válida (http/https).' });
            return;
        }
        setAvatarSrc(fotoUrl);
        setFeedback({ type: 'success', msg: 'URL aplicada al avatar.' });
    };

    const guardarCambios = () => {
        const actualizado = {
            ...usuarioLS,
            usuario: nombre,
            avatar: avatarSrc,
        };
        localStorage.setItem('usuarioActual', JSON.stringify(actualizado));
        setFeedback({ type: 'success', msg: 'Perfil actualizado.' });
    };

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="avatar-container">
                    <img
                        src={avatarSrc}
                        alt="avatar"
                        className="profile-avatar"
                    />
                </div>
                <h1 className="profile-name">{nombre}</h1>
                <p className="profile-email">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    {email || 'Sin correo'}
                </p>
            </div>

            {feedback && (
                <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                    <FontAwesomeIcon 
                        icon={feedback.type === 'success' ? faSave : faCamera} 
                        className="me-2" 
                    />
                    {feedback.msg}
                </div>
            )}

            <div className="profile-card card">
                <div className="card-body">
                    <h5 className="card-title">
                        <FontAwesomeIcon icon={faUser} className="me-2" />
                        Editar perfil
                    </h5>
                    
                    <div className="mb-4">
                        <label className="form-label">
                            <FontAwesomeIcon icon={faUser} className="me-2" />
                            Nombre
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">
                            <FontAwesomeIcon icon={faCamera} className="me-2" />
                            Cambiar foto de perfil
                        </label>
                        <div className="btn-group" role="group" aria-label="Método de foto">
                            <button
                                type="button"
                                className={`btn ${metodoFoto === 'url' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setMetodoFoto('url')}
                            >
                                <FontAwesomeIcon icon={faLink} className="me-2" />
                                Usar URL
                            </button>
                            <button
                                type="button"
                                className={`btn ${metodoFoto === 'file' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setMetodoFoto('file')}
                            >
                                <FontAwesomeIcon icon={faUpload} className="me-2" />
                                Subir archivo
                            </button>
                        </div>

                        {metodoFoto === 'url' ? (
                            <div className="input-group mt-3">
                                <input
                                    type="url"
                                    className="form-control"
                                    placeholder="https://..."
                                    value={fotoUrl}
                                    onChange={(e) => setFotoUrl(e.target.value)}
                                />
                                <button className="btn btn-outline-primary" type="button" onClick={aplicarUrl}>
                                    <FontAwesomeIcon icon={faLink} className="me-2" />
                                    Aplicar URL
                                </button>
                            </div>
                        ) : (
                            <div className="mt-3">
                                <input
                                    type="file"
                                    accept="image/jpeg,image/jpg,image/png,image/webp"
                                    className="form-control"
                                    onChange={onFileChange}
                                />
                            </div>
                        )}
                    </div>

                    <div className="profile-actions">
                        <div className="d-flex gap-2">
                            <button className="btn btn-outline-danger" onClick={handleLogout}>
                                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                                Cerrar sesión
                            </button>
                        </div>
                        <button className="btn btn-success" onClick={guardarCambios}>
                            <FontAwesomeIcon icon={faSave} className="me-2" />
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </div>

            <div className="navigation-buttons">
                <Link to="/clienteinicio/minimarket">
                    <button className="btn btn-outline-primary">
                        <FontAwesomeIcon icon={faStore} className="me-2" />
                        Ver Tiendas
                    </button>
                </Link>
                <Link to="/clienteinicio">
                    <button className="btn btn-outline-secondary">
                        <FontAwesomeIcon icon={faUser} className="me-2" />
                        Volver al Inicio
                    </button>
                </Link>
            </div>
        </div>
    );
}