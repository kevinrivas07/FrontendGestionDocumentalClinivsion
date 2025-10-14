import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [dotaciones, setDotaciones] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [view, setView] = useState("crear");

  useEffect(() => {
    fetchUsers();
    fetchAsistencias();
    fetchDotaciones();
  }, []);

  // 📦 Obtener usuarios
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
    }
  };

  // 📋 Obtener asistencias
  const fetchAsistencias = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/asistencias", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAsistencias(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error al obtener asistencias:", err);
      setAsistencias([]);
    }
  };

  // 📦 Obtener dotaciones
  const fetchDotaciones = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/dotaciones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDotaciones(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error al obtener dotaciones:", err);
      setDotaciones([]);
    }
  };

  // ➕ Crear nuevo usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/admin/users", newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 200 || res.status === 201) {
        alert("✅ Usuario creado con éxito");
        setNewUser({ username: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else {
        alert("⚠️ No se pudo crear el usuario");
      }
    } catch (err) {
      console.error("❌ Error al crear usuario:", err);
      alert("⚠️ Error al crear usuario");
    }
  };

  // ❌ Eliminar usuario
  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.status === 200) {
        alert("🗑️ Usuario eliminado");
        fetchUsers();
      } else {
        alert("⚠️ No se pudo eliminar el usuario");
      }
    } catch (err) {
      console.error("❌ Error al eliminar usuario:", err);
    }
  };

  // ✏️ Editar usuario
  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  // 💾 Guardar cambios
  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `http://localhost:5000/api/admin/users/${editingUser._id}`,
        editingUser,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (res.status === 200) {
        alert("✅ Usuario actualizado correctamente");
        setEditingUser(null);
        fetchUsers();
      }
    } catch (err) {
      console.error("❌ Error al actualizar usuario:", err);
      alert("⚠️ No se pudo actualizar el usuario");
    }
  };

  // ⬇️ Descargar PDF de asistencia
  const descargarPDF = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/asistencia/${id}/pdf`,
        { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Asistencia_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Error al descargar PDF:", err);
      alert("No se pudo descargar el PDF");
    }
  };

  // ⬇️ Descargar PDF de dotación
  const descargarPDFDotacion = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `http://localhost:5000/api/dotaciones/${id}/pdf`,
        { responseType: "blob", headers: { Authorization: `Bearer ${token}` } }
      );
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Dotacion_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error("❌ Error al descargar PDF de dotación:", err);
      alert("No se pudo descargar el PDF de dotación");
    }
  };

  // 🚪 Cerrar sesión
  const handleLogout = () => {
    if (window.confirm("¿Deseas cerrar sesión?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="admin-dashboard-wrap">
      <div className="admin-dashboard-container">
        <h1>👨‍💼 Panel de Administración</h1>

        <div className="dashboard-nav">
          <button
            className={`nav-btn ${view === "crear" ? "active" : ""}`}
            onClick={() => setView("crear")}
          >
            ➕ Crear nuevo usuario
          </button>
          <button
            className={`nav-btn ${view === "lista" ? "active" : ""}`}
            onClick={() => setView("lista")}
          >
            👥 Lista de usuarios
          </button>
          <button
            className={`nav-btn ${view === "asistencias" ? "active" : ""}`}
            onClick={() => setView("asistencias")}
          >
            📋 Asistencias registradas
          </button>
          <button
            className={`nav-btn ${view === "dotaciones" ? "active" : ""}`}
            onClick={() => setView("dotaciones")}
          >
            📦 Dotaciones registradas
          </button>
          <button onClick={handleLogout} className="logout-btn">
            🚪 Cerrar sesión
          </button>
        </div>

        {/* 🔹 Crear nuevo usuario */}
        {view === "crear" && (
          <section className="dashboard-section">
            <h2>➕ Crear nuevo usuario</h2>
            <form onSubmit={handleCreateUser} className="dashboard-form">
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={newUser.username}
                  onChange={(e) =>
                    setNewUser({ ...newUser, username: e.target.value })
                  }
                  className="form-input"
                  required
                />
                <input
                  type="email"
                  placeholder="Correo electrónico"
                  value={newUser.email}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  className="form-input"
                  required
                />
              </div>
              <div className="form-row">
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  className="form-input"
                  required
                />
                <select
                  value={newUser.role}
                  onChange={(e) =>
                    setNewUser({ ...newUser, role: e.target.value })
                  }
                  className="form-select"
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <button type="submit" className="form-btn">
                ✅ Crear Usuario
              </button>
            </form>
          </section>
        )}

        {/* 🔹 Lista de usuarios */}
        {view === "lista" && (
          <section className="dashboard-section">
            <h2>👥 Lista de Usuarios</h2>
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Correo</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td data-label="Nombre">{u.username}</td>
                    <td data-label="Correo">{u.email}</td>
                    <td data-label="Rol">{u.role}</td>
                    <td data-label="Acciones">
                      <button
                        onClick={() => handleEditUser(u)}
                        className="form-btn secondary"
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u._id)}
                        className="form-btn danger"
                      >
                        🗑️ Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {editingUser && (
              <div className="edit-form">
                <h3>✏️ Editar Usuario</h3>
                <form onSubmit={handleUpdateUser} className="dashboard-form">
                  <div className="form-row">
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          username: e.target.value,
                        })
                      }
                      placeholder="Nombre de usuario"
                      className="form-input"
                      required
                    />
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                      placeholder="Correo electrónico"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <select
                      value={editingUser.role}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          role: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                    </select>
                  </div>
                  <div>
                    <button type="submit" className="form-btn">
                      💾 Guardar cambios
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="form-btn secondary"
                    >
                      ❌ Cancelar
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        )}

        {/* 🔹 Asistencias registradas */}
        {view === "asistencias" && (
          <section className="dashboard-section">
            <h2>📋 Asistencias Registradas</h2>
            {asistencias.length === 0 ? (
              <div className="empty-state">No hay asistencias registradas</div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tema</th>
                    <th>Responsable</th>
                    <th>Sede</th>
                    <th>Registrado por</th>
                    <th>PDF</th>
                  </tr>
                </thead>
                <tbody>
                  {asistencias.map((a) => (
                    <tr key={a._id}>
                      <td>{new Date(a.fecha).toLocaleDateString()}</td>
                      <td>{a.tema}</td>
                      <td>{a.responsable}</td>
                      <td>{a.sede}</td>
                      <td>{a.creadoPor?.username || "Sin usuario"}</td>
                      <td>
                        <button
                          onClick={() => descargarPDF(a._id)}
                          className="form-btn"
                        >
                          ⬇️ Descargar PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}

        {/* 🔹 Dotaciones registradas */}
        {view === "dotaciones" && (
          <section className="dashboard-section">
            <h2>📦 Dotaciones Registradas</h2>
            {dotaciones.length === 0 ? (
              <div className="empty-state">No hay dotaciones registradas</div>
            ) : (
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Nombre</th>
                    <th>Cédula</th>
                    <th>Cargo</th>
                    <th>Elementos</th>
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
                      <td>
                        {d.elementos?.map((el, i) => (
                          <div key={i}>
                            {el.nombre} ({el.cantidad})
                          </div>
                        ))}
                      </td>
                      <td>{d.creadoPor?.username || "Sin usuario"}</td>
                      <td>
                        <button
                          onClick={() => descargarPDFDotacion(d._id)}
                          className="form-btn"
                        >
                          ⬇️ Descargar PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        )}
      </div>

      <a href="#" target="_blank" className="created">
        Created by: Kevin Rivas
      </a>
    </div>
  );
};

export default AdminDashboard;
