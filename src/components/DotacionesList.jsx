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
        const res = await axios.get("http://localhost:5000/api/dotaciones");
        setDotaciones(res.data);
      } catch (err) {
        console.error("❌ Error al cargar dotaciones:", err);
      }
    };
    fetchDotaciones();
  }, []);

  const descargarPDF = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/dotaciones/${id}/pdf`, {
        responseType: "blob",
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

  return (
    <div className="dotaciones-list-wrap">
      <img
        src={new URL("../assets/vision.jpg", import.meta.url).href}
        alt="Clínica de la Visión"
        className="header-image"
      />

      <div className="dotaciones-list-container">
        <h2>📦 Entregas de Dotación Registradas</h2>

        {dotaciones.length === 0 ? (
          <div className="empty-state">
            No hay registros de dotación guardados.
          </div>
        ) : (
          <table className="dotaciones-table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Nombre</th>
                <th>Cédula</th>
                <th>Cargo</th>
                <th>Registrado por</th>
                <th>PDF</th>
              </tr>
            </thead>
            <tbody>
              {dotaciones.map((d) => (
                <tr key={d._id}>
                  <td data-label="Fecha">{new Date(d.fecha).toLocaleDateString()}</td>
                  <td data-label="Nombre">{d.nombre}</td>
                  <td data-label="Cédula">{d.cedula}</td>
                  <td data-label="Cargo">{d.cargo}</td>
                  <td data-label="Registrado por">{d.creadoPor?.username || "Sin usuario"}</td>
                  <td data-label="PDF">
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

        <button
          type="button"
          onClick={() => navigate("/")}
          className="back-btn"
        >
          ← Volver
        </button>
      </div>
      <a href="" target="" className="created">Created by: Kevin Rivas</a>
    </div>
  );
}
