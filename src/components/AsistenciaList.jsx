// src/components/AsistenciaList.jsx
import { useEffect, useState } from "react";
import axios from "axios";

export default function AsistenciaList() {
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/asistencia");
        setAsistencias(res.data);
      } catch (err) {
        console.error("❌ Error cargando asistencias:", err);
      }
    };
    fetchData();
  }, []);

  const descargarPDF = async (id) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/asistencia/${id}`, {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Asistencia_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Error al descargar PDF:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>📂 Asistencias Guardadas</h2>
      {asistencias.length === 0 ? (
        <p>No hay registros guardados</p>
      ) : (
        <ul>
          {asistencias.map((a) => (
            <li key={a._id} style={{ margin: "10px 0" }}>
              <strong>{a.tema}</strong> — {a.fecha}
              <button onClick={() => descargarPDF(a._id)} style={{ marginLeft: "10px" }}>
                ⬇️ Descargar PDF
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
