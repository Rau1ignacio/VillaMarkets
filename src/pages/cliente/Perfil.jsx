import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';


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
        window.location.href = '/login';
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
        <div style={{ maxWidth: 560, margin: '24px auto' }}>
            <div style={{ textAlign: 'center' }}>
                <img
                    src={avatarSrc}
                    alt="avatar"
                    style={{ borderRadius: '50%', width: 120, height: 120, objectFit: 'cover', border: '3px solid #e9ecef' }}
                />
                <h2 style={{ marginTop: 12 }}>{nombre}</h2>
                <p className="text-muted">{email || 'Sin correo'}</p>
            </div>

            {feedback && (
                <div className={`alert ${feedback.type === 'success' ? 'alert-success' : 'alert-danger'}`} role="alert">
                    {feedback.msg}
                </div>
            )}

            <div className="card" style={{ marginTop: 16 }}>
                <div className="card-body">
                    <h5 className="card-title">Editar perfil</h5>
                    <div className="mb-3">
                        <label className="form-label">Nombre</label>
                        <input
                            type="text"
                            className="form-control"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            placeholder="Tu nombre"
                        />
                    </div>

                    <div className="mb-2">
                        <label className="form-label">Cambiar foto de perfil</label>
                        <div className="btn-group mb-2" role="group" aria-label="Método de foto">
                            <button
                                type="button"
                                className={`btn ${metodoFoto === 'url' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setMetodoFoto('url')}
                            >
                                Usar URL
                            </button>
                            <button
                                type="button"
                                className={`btn ${metodoFoto === 'file' ? 'btn-primary' : 'btn-outline-primary'}`}
                                onClick={() => setMetodoFoto('file')}
                            >
                                Subir archivo
                            </button>
                        </div>

                        {metodoFoto === 'url' ? (
                            <div className="input-group">
                                <input
                                    type="url"
                                    className="form-control"
                                    placeholder="https://..."
                                    value={fotoUrl}
                                    onChange={(e) => setFotoUrl(e.target.value)}
                                />
                                <button className="btn btn-outline-secondary" type="button" onClick={aplicarUrl}>
                                    Aplicar URL
                                </button>
                            </div>
                        ) : (
                            <input
                                type="file"
                                accept="image/jpeg,image/jpg,image/png,image/webp"
                                className="form-control"
                                onChange={onFileChange}
                            />
                        )}
                    </div>

                    <div className="d-flex justify-content-between mt-3">
                        <div>
                            <button className="btn btn-light" style={{ marginRight: 8 }} disabled>
                                Mi perfil
                            </button>
                            <button className="btn btn-outline-danger" onClick={handleLogout}>
                                Cerrar sesión
                            </button>
                        </div>
                        <button className="btn btn-success" onClick={guardarCambios}>
                            Guardar cambios
                        </button>
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16 }}>
                <Link to="/minimarkets">
                    <button className="btn btn-outline-primary">Ver Tiendas</button>
                </Link>
                
                
            </div>
        </div>
    );
}