import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaFolder,
  FaFileAlt,
  FaUser,
  FaSearch,
  FaPlus,
  FaClipboardList,
} from "react-icons/fa";
import "../styles/Home.css";

const Home = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const nombre = localStorage.getItem("nombre");
    if (nombre) setNombreUsuario(nombre);
  }, []);

  return (
    <div className="home-container">
      {/* Contenido principal */}
      <main className="main-content">
        <h2 className="sidebar-title">👁 Clínica de la Visión del Valle</h2>
        <h1 className="welcome-title">Hola {nombreUsuario || "bienvenido"}</h1>
        <p className="welcome-subtitle">Formatos</p>

        <div className="quick-access">
          {/* Registrar nueva lista de asistencia */}
          <div className="card" onClick={() => navigate("/asistencia")}>
            <FaFileAlt size={32} className="card-icon blue" />
            <p>➕ Lista Asistencia</p>
          </div>

          {/* Ver listas guardadas */}
          <div className="card" onClick={() => navigate("/asistencias")}>
            <FaClipboardList size={32} className="card-icon green" />
            <p>📂 Ver Asistencias Guardadas</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
