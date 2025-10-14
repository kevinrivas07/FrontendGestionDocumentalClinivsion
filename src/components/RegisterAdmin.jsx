import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterAdmin.css';

const RegisterAdmin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    ciudad: '',
    cedula: '',
    fecha: '',
    phone: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const { confirmPassword, ...dataToSend } = formData; // 👈 Eliminamos el campo innecesario

      const response = await fetch('http://localhost:5000/api/register-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      const data = await response.json();
      if (response.ok) {
        alert('Administrador registrado con éxito');
        navigate('/'); // Redirige al login
      } else {
        alert(`Error: ${data.msg || 'No se pudo registrar el administrador'}`);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      alert('Hubo un problema con el registro del administrador');
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="register-admin-wrap">
      <div className="register-admin-container">
        <h2>👨‍💼 Registro de Administrador</h2>

        <form onSubmit={handleRegister} className="register-form">
          <input 
            type="text" 
            name="nombre" 
            placeholder="Nombre completo" 
            value={formData.nombre} 
            onChange={handleChange} 
            className="form-input"
            required 
          />
          <input 
            type="text" 
            name="ciudad" 
            placeholder="Ciudad" 
            value={formData.ciudad} 
            onChange={handleChange} 
            className="form-input"
            required 
          />
          <input 
            type="text" 
            name="cedula" 
            placeholder="Cédula" 
            value={formData.cedula} 
            onChange={handleChange} 
            className="form-input"
            required 
          />
          <input 
            type="date" 
            name="fecha" 
            value={formData.fecha} 
            onChange={handleChange} 
            className="form-input"
            required 
          />
          <input 
            type="text" 
            name="phone" 
            placeholder="Teléfono" 
            value={formData.phone} 
            onChange={handleChange} 
            className="form-input"
            required 
          />
          <input 
            type="text" 
            name="username" 
            placeholder="Usuario" 
            value={formData.username} 
            onChange={handleChange} 
            className="form-input"
            required 
          />
          <input 
            type="email" 
            name="email" 
            placeholder="Correo electrónico" 
            value={formData.email} 
            onChange={handleChange} 
            className="form-input"
            required 
          />
          <input 
            type="password" 
            name="password" 
            placeholder="Contraseña" 
            value={formData.password} 
            onChange={handleChange} 
            className="form-input"
            required 
          />
          <input 
            type="password" 
            name="confirmPassword" 
            placeholder="Confirmar contraseña" 
            value={formData.confirmPassword} 
            onChange={handleChange} 
            className="form-input"
            required 
          />

          <button type="submit" className="register-btn">Registrar Administrador</button>
        </form>

        <button onClick={handleLogout} className="logout-btn">← Volver al Login</button>
      </div>
    </div>
  );
};

export default RegisterAdmin;
