// src/components/DotacionesForm.jsx
import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import axios from "axios";

export default function DotacionesForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fecha: "",
    nombre: "",
    cedula: "",
    cargo: "",
    elementos: [{ nombre: "", cantidad: "" }],
    firma: "",
  });

  const sigPadRef = useRef(null);
  const [firmaAbierta, setFirmaAbierta] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleElementoChange = (i, e) => {
    const nuevos = [...form.elementos];
    nuevos[i][e.target.name] = e.target.value;
    setForm({ ...form, elementos: nuevos });
  };

  const agregarElemento = () => {
    setForm({ ...form, elementos: [...form.elementos, { nombre: "", cantidad: "" }] });
  };

  const eliminarElemento = (i) => {
    const nuevos = form.elementos.filter((_, idx) => idx !== i);
    setForm({ ...form, elementos: nuevos });
  };

  const guardarFirma = () => {
    const dataURL = sigPadRef.current.toDataURL("image/png");
    setForm({ ...form, firma: dataURL });
    setFirmaAbierta(false);
  };

  const borrarFirma = () => sigPadRef.current.clear();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/dotaciones", form, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Entrega_Dotacion.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Error al generar PDF:", err);
      alert("Error al generar PDF");
    }
  };

  return (
    <div>
      <h2>Entrega de Dotación</h2>
      <form onSubmit={handleSubmit}>
        <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
        <input type="text" name="nombre" placeholder="Nombre del colaborador" value={form.nombre} onChange={handleChange} required />
        <input type="text" name="cedula" placeholder="Cédula" value={form.cedula} onChange={handleChange} required />
        <input type="text" name="cargo" placeholder="Cargo" value={form.cargo} onChange={handleChange} />

        <h3>Elementos Entregados</h3>
        {form.elementos.map((el, i) => (
          <div key={i}>
            <input
              name="cantidad"
              type="number"
              placeholder="Cantidad"
              value={el.cantidad}
              onChange={(e) => handleElementoChange(i, e)}
            />
            <input
              name="nombre"
              type="text"
              placeholder="Elemento"
              value={el.nombre}
              onChange={(e) => handleElementoChange(i, e)}
            />
            <button type="button" onClick={() => eliminarElemento(i)}>❌</button>
          </div>
        ))}
        <button type="button" onClick={agregarElemento}>➕ Agregar elemento</button>

        <div>
          <h3>Firma del colaborador</h3>
          {form.firma ? (
            <img src={form.firma} alt="firma" width="200" />
          ) : (
            <button type="button" onClick={() => setFirmaAbierta(true)}>Agregar Firma</button>
          )}
        </div>

        <button type="submit">Generar PDF</button>
        <button type="button" onClick={() => navigate("/")}>Volver</button>
      </form>

      {firmaAbierta && (
        <div>
          <SignatureCanvas ref={sigPadRef} penColor="black" canvasProps={{ width: 400, height: 120 }} />
          <button onClick={borrarFirma}>Borrar</button>
          <button onClick={guardarFirma}>Guardar Firma</button>
          <button onClick={() => setFirmaAbierta(false)}>Cerrar</button>
        </div>
      )}
    </div>
  );
}
