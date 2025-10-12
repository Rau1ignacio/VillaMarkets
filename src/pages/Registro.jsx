import React, { useState } from 'react';
import './Registro.css';



const Registro =() =>{
    const [formData,setFormData] = useState({
        nombre:'',
        apellido:'',
        email:'',
        rut:'',
        telefono:'',
        password:'',
        
        confirmarPassword:'',


        
        terminos: false
    });

    const [errors,setErrors] = useState({});


    // manejar cambios en los inputs
    const handleInputChange =(e)=>{
        const {name, value ,type ,checked}= e.target;
        setFormData(prev =>({
            ...prev,
            [name]: type ==='checkbox' ? checked : value
        }));

    //// limpiar error del campo cuando el usuario empiece
    if(errors[name]){
        setErrors(prev =>({
            ...prev,
            [name]: ''

        }));

    }
};

    // validar formulario
   const validateForm = () => {
        const newErrors = {};

        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        }
        if (!formData.rut.trim()) {
            newErrors.rut = 'El RUT es obligatorio';
        }

        if (!formData.apellido.trim()) {
            newErrors.apellido = 'El apellido es obligatorio';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'El email no es válido';
        }

        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es obligatorio';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!formData.terminos) {
            newErrors.terminos = 'Debes aceptar los términos y condiciones';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Manejar envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            console.log('Registro exitoso:', formData);
            // Aquí harías la llamada a tu API
            alert('¡Registro exitoso!');
        }
    };

    return (
        <div className="registro-container">
            <div className="registro-card">
                <div className="registro-header">
                    <img 
                        src="./src/images/logovilla.jpg" alt="Villa Market Logo" className="logo"
                        
                    />
                    <h2>Crear Cuenta</h2>
                    <p>Únete a Villa Markets</p>
                </div>

                <form onSubmit={handleSubmit} className="registro-form">
                    {/* Nombre y Apellido */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre *</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                placeholder="Tu nombre"
                                className={errors.nombre ? 'error' : ''}
                            />
                            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="apellido">Apellido *</label>
                            <input
                                type="text"
                                id="apellido"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleInputChange}
                                placeholder="Tu apellido"
                                className={errors.apellido ? 'error' : ''}
                            />
                            {errors.apellido && <span className="error-message">{errors.apellido}</span>}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Email *</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="tu@email.com"
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    {/* Teléfono */}
                    <div className="form-group">
                        <label htmlFor="telefono">Teléfono *</label>
                        <input
                            type="tel"
                            id="telefono"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            placeholder="+1 234 567 8900"
                            className={errors.telefono ? 'error' : ''}
                        />
                        {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                    </div>
                    {/* rut*/}
                    <div className="form-group">
                        <label htmlFor="rut">RUT *</label>
                        <input
                            type="text"
                            id="rut"
                            name="rut"
                            value={formData.rut}
                            onChange={handleInputChange}
                            placeholder="Tu RUT"
                            className={errors.rut ? 'error' : ''}
                        />
                        {errors.rut && <span className="error-message">{errors.rut}</span>}
                    </div>

                    {/* Tipo de Usuario */}
                    <div className="form-group">
                        <label htmlFor="tipoUsuario">Tipo de Usuario</label>
                        <select
                            id="tipoUsuario"
                            name="tipoUsuario"
                            value={formData.tipoUsuario}
                            onChange={handleInputChange}
                        >
                            <option value="cliente">Cliente</option>
                            <option value="vendedor">Vendedor</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>

                    {/* Contraseñas */}
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="password">Contraseña *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Mínimo 6 caracteres"
                                className={errors.password ? 'error' : ''}
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                placeholder="Repite la contraseña"
                                className={errors.confirmPassword ? 'error' : ''}
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    {/* Términos y condiciones */}
                    <div className="form-group checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="terminos"
                                checked={formData.terminos}
                                onChange={handleInputChange}
                            />
                            <span className="checkmark"></span>
                            Acepto los <a href="/terminos" target="_blank">términos y condiciones</a>
                        </label>
                        {errors.terminos && <span className="error-message">{errors.terminos}</span>}
                    </div>

                    {/* Botón de registro */}
                    <button type="submit" className="registro-btn">
                        Crear Cuenta
                    </button>
                </form>

                <div className="registro-footer">
                    <p>¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
                </div>
            </div>
        </div>
    );
};

export default Registro;