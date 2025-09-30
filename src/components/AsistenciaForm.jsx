import { useState } from "react";
import axios from "axios";

const AsistenciaForm = () => {
  const [form, setForm] = useState({
    fecha: "",
    tema: "",
    responsable: "",
    cargo: "",
    modalidad: "",
    sede: "",
    horaInicio: "",
    horaFin: "",
    asistentes: [{ nombre: "", cargo: "" }],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAsistenteChange = (i, e) => {
    const newAsistentes = [...form.asistentes];
    newAsistentes[i][e.target.name] = e.target.value;
    setForm({ ...form, asistentes: newAsistentes });
  };

  const addAsistente = () => {
    if (form.asistentes.length < 25) {
      setForm({
        ...form,
        asistentes: [...form.asistentes, { nombre: "", cargo: "" }],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/asistencia", form, {
        responseType: "blob", // recibimos PDF
      });

      // Descargar PDF generado
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Lista_Asistencia.pdf");
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("❌ Error al generar PDF:", err);
    }
  };

  return (
    <div className="form-container">
      <h2>📋 Lista de Asistencia</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
        <input type="text" name="tema" placeholder="Tema" value={form.tema} onChange={handleChange} required />
        <input type="text" name="responsable" placeholder="Responsable" value={form.responsable} onChange={handleChange} required />
        <input type="text" name="cargo" placeholder="Cargo" value={form.cargo} onChange={handleChange} />
        <input type="text" name="modalidad" placeholder="Modalidad" value={form.modalidad} onChange={handleChange} />
        <input type="text" name="sede" placeholder="Sede" value={form.sede} onChange={handleChange} />
        <input type="time" name="horaInicio" value={form.horaInicio} onChange={handleChange} />
        <input type="time" name="horaFin" value={form.horaFin} onChange={handleChange} />

        <h3>👥 Asistentes</h3>
        {form.asistentes.map((a, i) => (
          <div key={i} className="asistente">
            <input
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              value={a.nombre}
              onChange={(e) => handleAsistenteChange(i, e)}
            />
            <input
              type="text"
              name="cargo"
              placeholder="Cargo"
              value={a.cargo}
              onChange={(e) => handleAsistenteChange(i, e)}
            />
          </div>
        ))}
        <button type="button" onClick={addAsistente}>
          ➕ Agregar Asistente
        </button>

        <button type="submit">Generar PDF</button>
      </form>
    </div>
  );
};

export default AsistenciaForm;
