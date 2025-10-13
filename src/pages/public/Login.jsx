import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';


// Login.jsx
// 
const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const navigate = useNavigate();
    const [error, setError] = useState('');

    // Productos en descuento de la semana
    const productosDescuento = [
        {
            id: 1,
            nombre: "Arroz miraflores chaufan Premium 1kg",
            precioOriginal: 29.99,
            precioDescuento: 24.99,
            descuento: 15,
            imagen: "/images/productos/arroz-integral-miraflores.webp"
        },
        {
            id: 2,
            nombre: "Aceite de Oliva 500ml",
            precioOriginal: 89.99,
            precioDescuento: 85.99,
            descuento: 10,
            imagen: "/images/productos/aceite.jpg"
        },
        {
            id: 3,
            nombre: "Pan Integral",
            precioOriginal: 25.00,
            precioDescuento: 19.00,
            descuento: 20,
            imagen: "/images/productos/pan.jpg"
        }
    ];
// datos de usuarios para login simulado
const usuarios = [
    {
        email: 'admin@villamarkets.com',
        password: 'admin123',
        role: 'admin',
        name: 'Administrador'
    },
    {
        email: 'cliente@villamarkets.com',
        password: 'cliente123',
        role: 'cliente',
        name: 'ana lopez'
    }
];

// funcionalidades de login aqui
    function handleInputChange(e) {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) {
            setError('');
        }
    }

// definir la funcion de submit del formulario
const handleSubmit = (e) => {
    e.preventDefault();
    
    // Simular delay de autenticación
    setTimeout(() => {
        const usuario = usuarios.find(
            user => user.email === formData.email && user.password === formData.password
        );

        if (usuario) {
            localStorage.setItem('usuario', JSON.stringify(usuario));
            console.log('Login exitoso:', usuario);

            if (usuario.role === 'admin') {
                alert(`Bienvenido Admin: ${usuario.name}! Acceso de administrador concedido.`);
                navigate('/admin/dashboard');
            } else if (usuario.role === 'cliente') {
                alert(`Bienvenido Cliente: ${usuario.name}! Acceso de cliente concedido.`);
                navigate('/cliente/inicio');
            } else {
                alert(`Bienvenido Invitado: ${usuario.name}!`);
            }
            setError('');
        } else {
            setError('Email o contraseña incorrectos');
        }
    }, 700);
};

// JSX del formulario de login
return (
        <div className="login-container">
            {/* Cuadro de productos en descuento */}
            <div className="ofertas-semana">
                <h3>🔥 Ofertas de la Semana</h3>
                <div className="productos-grid">
                    {productosDescuento.map(producto => (
                        <div key={producto.id} className="producto-card">
                            <div className="descuento-badge">
                                -{producto.descuento}%
                            </div>
                            <img 
                                src={producto.imagen} 
                                alt={producto.nombre}
                                onError={(e) => {
                                    e.target.src = "/images/producto-placeholder.png";
                                }}
                            />
                            <div className="producto-info">
                                <h4>{producto.nombre}</h4>
                                <div className="precios">
                                    <span className="precio-original">${producto.precioOriginal}</span>
                                    <span className="precio-descuento">${producto.precioDescuento}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <p className="oferta-texto">¡Regístrate y aprovecha estos descuentos!</p>
            </div>

            {/* Formulario de login */}
            <div className="login-card">
                <div className="login-header">
                    <img src="./src/images/logovilla.jpg" alt="Villa Market" />
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