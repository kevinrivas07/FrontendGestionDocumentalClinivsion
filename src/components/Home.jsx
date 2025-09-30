import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaFolder, FaFileAlt, FaUser, FaSearch, FaPlus } from "react-icons/fa";
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
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="sidebar-title">👁 Clínica de la Visión del Valle</h2>
        <nav className="sidebar-nav">
          <button className="sidebar-btn">
            <FaFolder /> <span>Documentos</span>
          </button>
          <button className="sidebar-btn">
            <FaFileAlt /> <span>Plantillas</span>
          </button>
          <button className="sidebar-btn">
            <FaUser /> <span>Usuarios</span>{" "}
            <small className="only-admin">(solo admin)</small>
          </button>
          <button className="sidebar-btn">
            <FaSearch /> <span>Buscar documentos</span>
          </button>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="main-content">
        <h1 className="welcome-title">
          Hola {nombreUsuario || "bienvenido"}
        </h1>
        <p className="welcome-subtitle">Accesos rápidos</p>

        <div className="quick-access">
          <div
            className="card"
            onClick={() => navigate("/crear-documento")}
          >
            <FaPlus size={32} className="card-icon blue" />
            <p>Crear documento</p>
          </div>

          <div
            className="card"
            onClick={() => navigate("/crear-plantilla")}
          >
            <FaFileAlt size={32} className="card-icon green" />
            <p>Crear plantilla</p>
          </div>

          <div
            className="card"
            onClick={() => navigate("/buscar-documentos")}
          >
            <FaSearch size={32} className="card-icon purple" />
            <p>Buscar documentos</p>
          </div>
          <div
  className="card"
  onClick={() => navigate("/asistencia")}
>
  <FaFileAlt size={32} className="card-icon blue" />
  <p>Lista de Asistencia</p>
</div>

        </div>
      </main>
    </div>
  );
};

export default Home;
