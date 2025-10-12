import React, { useState } from 'react';
import './Login.css';



// Login.jsx
// 
const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
// funcionalidades de login aqui
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
// 
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <img src="/src/images/logovilla.jpg" alt="Villa Market" />
                    <h2>Iniciar Sesión</h2>
                </div>
                
                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            placeholder="Ingresa tu email"
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            placeholder="Ingresa tu contraseña"
                        />
                    </div>
                    
                    <button type="submit" className="login-btn">
                        Iniciar Sesión
                    </button>
                </form>
                
                <div className="login-footer">
                    <p>¿No tienes cuenta? <a href="/registro">Regístrate</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;