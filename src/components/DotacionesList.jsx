import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DotacionesList.css";

export default function DotacionesList() {
  const navigate = useNavigate();
  const [dotaciones, setDotaciones] = useState([]);

  useEffect(() => {
    const fetchDotaciones = async () => {
      try {
        const token = localStorage.getItem("token"); // ✅ Token del usuario logueado
        const res = await axios.get("http://localhost:5000/api/dotaciones", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDotaciones(res.data);
      } catch (err) {
        console.error("❌ Error cargando dotaciones:", err);
      }
    };
    fetchDotaciones();
  }, []);

  const descargarPDF = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/dotaciones/${id}/pdf`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Dotacion_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Error al descargar PDF:", err);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Sin fecha";
    const fecha = new Date(dateString);
    return fecha.toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="dotaciones-list-wrap">
      {/* 📷 Imagen principal */}
      <img
        src={new URL("../assets/vision.jpg", import.meta.url).href}
        alt="Clínica de la Visión"
        className="header-image"
      />

      {/* 🏥 Título */}
      <h2>📦 Dotaciones Entregadas</h2>

      {/* 📋 Estado vacío o lista */}
      {dotaciones.length === 0 ? (
        <div className="empty-state">No hay registros de dotación</div>
      ) : (
        <ul className="dotaciones-list">
          {dotaciones.map((d) => (
            <li key={d._id} className="dotaciones-item">
              <div className="dotaciones-info">
                <span className="dotaciones-name">{d.nombre || "Sin nombre"}</span>
                <span className="dotaciones-date">{formatDate(d.fecha)}</span>
                <span className="dotaciones-details">🪪 {d.cedula || "Sin cédula"}</span>
                <span className="dotaciones-details">💼 {d.cargo || "Sin cargo"}</span>
                {d.creadoPor && (
                  <span className="dotaciones-user">
                    👤 {d.creadoPor.username || "Desconocido"}
                  </span>
                )}
              </div>

              <button
                className="download-btn"
                onClick={() => descargarPDF(d._id)}
              >
                ⬇️ Descargar PDF
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* 🔙 Botón volver */}
      <button className="back-btn" onClick={() => navigate("/")}>
        ← Volver
      </button>

      {/* ✍️ Autor */}
      <a href="#" className="created">
        Created by: Kevin Rivas
      </a>
    </div>
  );
}
