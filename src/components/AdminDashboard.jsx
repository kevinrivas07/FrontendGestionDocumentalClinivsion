import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
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
  }, []);

  // 📦 Obtener usuarios
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/users");
      setUsers(res.data);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
    }
  };

  // 📦 Obtener asistencias
  const fetchAsistencias = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/admin/asistencias");
      setAsistencias(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Error al obtener asistencias:", err);
      setAsistencias([]);
    }
  };

  // ➕ Crear nuevo usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/admin/users", newUser);
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
      const res = await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
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
      const res = await axios.put(
        `http://localhost:5000/api/admin/users/${editingUser._id}`,
        editingUser
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

  // ⬇️ Descargar PDF
  const descargarPDF = async (id) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/asistencia/${id}/pdf`,
        { responseType: "blob" }
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

  // 🚪 Cerrar sesión
  const handleLogout = () => {
    if (window.confirm("¿Deseas cerrar sesión?")) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <h1>Panel de Administración</h1>

      {/* 🔹 Botones principales */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setView("crear")}>Crear nuevo usuario</button>
        <button onClick={() => setView("lista")}>Lista de usuarios</button>
        <button onClick={() => setView("asistencias")}>Asistencias registradas</button>
        <button
          onClick={handleLogout}
          style={{ backgroundColor: "#dc3545", color: "white", cursor: "pointer" }}
        >
          🚪 Cerrar sesión
        </button>
      </div>

      {/* 🔹 Crear nuevo usuario */}
      {view === "crear" && (
        <section>
          <h2>Crear nuevo usuario</h2>
          <form onSubmit={handleCreateUser}>
            <input
              type="text"
              placeholder="Nombre de usuario"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Correo"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            <button type="submit">Crear</button>
          </form>
        </section>
      )}

      {/* 🔹 Lista de usuarios */}
      {view === "lista" && (
        <section>
          <h2>Lista de Usuarios</h2>
          <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
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
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button onClick={() => handleEditUser(u)}>Editar</button>
                    <button onClick={() => handleDeleteUser(u._id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {editingUser && (
            <div style={{ marginTop: "20px" }}>
              <h3>Editar Usuario</h3>
              <form onSubmit={handleUpdateUser}>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, username: e.target.value })
                  }
                  placeholder="Nombre de usuario"
                  required
                />
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, email: e.target.value })
                  }
                  placeholder="Correo"
                  required
                />
                <select
                  value={editingUser.role}
                  onChange={(e) =>
                    setEditingUser({ ...editingUser, role: e.target.value })
                  }
                >
                  <option value="user">Usuario</option>
                  <option value="admin">Administrador</option>
                </select>
                <button type="submit">Guardar cambios</button>
                <button type="button" onClick={() => setEditingUser(null)}>
                  Cancelar
                </button>
              </form>
            </div>
          )}
        </section>
      )}

      {/* 🔹 Asistencias registradas */}
      {view === "asistencias" && (
        <section>
          <h2>Asistencias Registradas</h2>
          {asistencias.length === 0 ? (
            <p>No hay asistencias registradas</p>
          ) : (
            <table border="1" cellPadding="6" style={{ width: "100%", borderCollapse: "collapse" }}>
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
                      <button onClick={() => descargarPDF(a._id)}>⬇️ Descargar PDF</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      )}
    </div>
  );
};

export default AdminDashboard;
