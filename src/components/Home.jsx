import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFileAlt,
  FaClipboardList,
  FaSignOutAlt,
} from "react-icons/fa";
import "../styles/Home.css";

const Home = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const nombre = localStorage.getItem("nombre");
    if (nombre) setNombreUsuario(nombre);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("nombre");
    navigate("/login");
  };

  return (
    <div className="home-container">
      {/* Contenido principal */}
      <main className="main-content">
        <img
          src={new URL("../assets/vision.jpg", import.meta.url).href}
          alt="Clínica de la Visión"
          className="home-hero-img"
        />

        <h1 className="welcome-title">Hola {nombreUsuario || "bienvenido"}</h1>
        <p className="welcome-subtitle">Formatos</p>

        <div className="quick-access">
          {/* Registrar nueva lista de asistencia */}
          <div className="card" onClick={() => navigate("/asistencia")}>
            <FaFileAlt size={32} className="card-icon blue" />
            <p>➕ Lista Asistencia</p>
          </div>

          {/* Registrar nueva entrega de dotación */}
          <div className="card" onClick={() => navigate("/dotaciones")}>
            <FaFileAlt size={32} className="card-icon blue" />
            <p>➕ Entrega Dotación</p>
          </div>

          {/* Ver listas guardadas */}
          <div className="card" onClick={() => navigate("/asistencias")}>
            <FaClipboardList size={32} className="card-icon green" />
            <p>📂 Ver Asistencias Guardadas</p>
          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <FaSignOutAlt size={16} />
          Cerrar Sesión
        </button>
      </main>
    </div>
  );
};

export default Home;
