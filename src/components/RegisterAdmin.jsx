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
        <div>
            <h2>Registro de Administrador</h2>
            {/* Formulario de registro */}
            <form onSubmit={handleRegister}>
                <input
                    type="text"
                    placeholder="Correo electrónico"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Registrar</button>
            </form>

            {/* Botón de salida */}
            <button onClick={handleLogout} style={{ marginTop: '10px', backgroundColor: 'red', color: 'white' }}>
                Salir
            </button>
        </div>
    );
};

export default RegisterAdmin;
