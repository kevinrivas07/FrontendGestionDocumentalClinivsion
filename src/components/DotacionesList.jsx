import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <img
        src={new URL("../assets/vision.jpg", import.meta.url).href}
        alt="Clínica de la Visión"
        style={{ width: "100%", maxHeight: "200px", objectFit: "cover", marginBottom: "15px" }}
      />

      <h2>📦 Entregas de Dotación Registradas</h2>

      {dotaciones.length === 0 ? (
        <p>No hay registros de dotación guardados.</p>
      ) : (
        <table border="1" cellPadding="8" style={{ width: "100%", borderCollapse: "collapse" }}>
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
                <td>{new Date(d.fecha).toLocaleDateString()}</td>
                <td>{d.nombre}</td>
                <td>{d.cedula}</td>
                <td>{d.cargo}</td>
                <td>{d.creadoPor?.username || "Sin usuario"}</td>
                <td>
                  <button onClick={() => descargarPDF(d._id)}>⬇️ Descargar PDF</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        type="button"
        onClick={() => navigate("/")}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Volver
      </button>
    </div>
  );
}
