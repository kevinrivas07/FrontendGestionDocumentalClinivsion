import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/DotacionesList.css";

export default function DotacionesList() {
  const navigate = useNavigate();
  const [dotaciones, setDotaciones] = useState([]);
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDotaciones = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.warn("⚠️ No hay token en localStorage. Redirigiendo al login...");
          navigate("/login");
          return;
        }

        // ✅ Obtener rol del usuario
        const userData = JSON.parse(localStorage.getItem("user"));
        if (userData && userData.role) setUserRole(userData.role);

        // ✅ Obtener dotaciones (según el rol)
        const res = await axios.get("http://localhost:5000/api/dotaciones", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📦 Dotaciones recibidas:", res.data);
        setDotaciones(res.data);
      } catch (err) {
        console.error("❌ Error al cargar dotaciones:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDotaciones();
  }, [navigate]);

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
      alert("Error al descargar PDF");
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

  if (loading) {
    return <div className="loading-state">Cargando dotaciones...</div>;
  }

  return (
    <div className="dotaciones-wrap">
      <img
        src={new URL("../assets/vision.jpg", import.meta.url).href}
        alt="Clínica de la Visión"
        className="home-hero-img"
      />
      <h2>
        {userRole === "admin"
          ? "📦 Todas las Entregas de Dotación"
          : "📦 Mis Entregas de Dotación"}
      </h2>

      {dotaciones.length === 0 ? (
        <p className="dotaciones-empty">No hay registros de dotación.</p>
      ) : (
        <ul className="dotaciones-list">
          {dotaciones.map((d) => (
            <li key={d._id} className="dotaciones-item">
              <div className="dotaciones-info">
                <strong className="dotaciones-name">{d.nombre || "Sin nombre"}</strong>
                <span className="dotaciones-date">{formatDate(d.fecha)}</span>
                <small className="dotaciones-details">
                  🪪 {d.cedula || "Sin cédula"} • 💼 {d.cargo || "Sin cargo"}
                </small>
                {userRole === "admin" && (
                  <small className="dotaciones-user">
                    👤 {d.creadoPor?.username || "Desconocido"}
                  </small>
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

      <button className="back" type="button" onClick={() => navigate("/")}>
        Volver
      </button>
      <a href="#" className="created">
        Created by: Kevin Rivas
      </a>
    </div>
  );
}
