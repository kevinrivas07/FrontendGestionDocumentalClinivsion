import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterAdmin.css';

const RegisterAdmin = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:5000/api/admin/register-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                alert('Administrador registrado con éxito');
                navigate('/'); // Redirige al login después del registro exitoso
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error en el registro:', error);
            alert('Hubo un problema con el registro del administrador');
        }
    };

    const handleLogout = () => {
        navigate('/'); // Redirige al login
    };

    return (
        <div className="register-admin-wrap">
            <div className="register-admin-container">
                <h2>👨‍💼 Registro de Administrador</h2>
                
                <form onSubmit={handleRegister} className="register-form">
                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Correo electrónico"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>
                    
                    <button type="submit" className="register-btn">
                        Registrar Administrador
                    </button>
                </form>

                <button onClick={handleLogout} className="logout-btn">
                    ← Volver al Login
                </button>
            </div>
        </div>
    );
};

export default RegisterAdmin;
