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


        // ✅ 2. Obtener dotaciones (según el rol)
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

  if (loading) {
    return <div className="loading-state">Cargando dotaciones...</div>;
  }

  return (
    <div className="dotaciones-list-wrap">
      <img
        src={new URL("../assets/vision.jpg", import.meta.url).href}
        alt="Clínica de la Visión"
        className="header-image"
      />

      <div className="dotaciones-list-container">
        <h2>
          {userRole === "admin"
            ? "📦 Todas las Entregas de Dotación"
            : "📦 Mis Entregas de Dotación"}
        </h2>

        {dotaciones.length === 0 ? (
          <div className="empty-state">No hay registros de dotación.</div>
        ) : (
          <table className="dotaciones-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Cargo</th>
                {userRole === "admin" && <th>Registrado por</th>}
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {dotaciones.map((d) => (
                <tr key={d._id}>
                  <td>{new Date(d.fecha).toLocaleDateString()}</td>
                  <td>{d.nombre}</td>
                  <td>{d.cedula}</td>
                  <td>{d.cargo}</td>
                  {userRole === "admin" && (
                    <td>{d.creadoPor?.username || "Sin usuario"}</td>
                  )}
                  <td>
                    <button
                      onClick={() => descargarPDF(d._id)}
                      className="download-btn"
                    >
                      ⬇️ Descargar PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <button type="button" onClick={() => navigate("/")} className="back-btn">
          ← Volver
        </button>
      </div>
      <a href="#" className="created">Created by: Kevin Rivas</a>
    </div>
  );
}
