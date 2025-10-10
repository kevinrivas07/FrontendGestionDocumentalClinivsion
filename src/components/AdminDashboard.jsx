import React, { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  // 🔹 Cargar usuarios y asistencias al entrar
  useEffect(() => {
    fetchUsers();
    fetchAsistencias();
  }, []);

  // 📦 Obtener todos los usuarios
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("❌ Error al obtener usuarios:", err);
    }
  };

  // 📦 Obtener todas las asistencias
  const fetchAsistencias = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/asistencias");
      const data = await res.json();
      if (Array.isArray(data)) {
        setAsistencias(data);
      } else {
        console.error("⚠️ El backend no devolvió un array:", data);
        setAsistencias([]);
      }
    } catch (err) {
      console.error("❌ Error al obtener asistencias:", err);
      setAsistencias([]);
    }
  };

  // ➕ Crear nuevo usuario
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      const data = await res.json();
      if (res.ok) {
        alert("✅ Usuario creado con éxito");
        setNewUser({ username: "", email: "", password: "", role: "user" });
        fetchUsers();
      } else {
        alert(`⚠️ Error: ${data.msg || "No se pudo crear el usuario"}`);
      }
    } catch (err) {
      console.error("❌ Error al crear usuario:", err);
    }
  };

  // ❌ Eliminar usuario
  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("🗑️ Usuario eliminado");
        fetchUsers();
      } else {
        alert("⚠️ No se pudo eliminar el usuario");
      }
    } catch (err) {
      console.error("❌ Error al eliminar usuario:", err);
    }
  };

  return (
    <div>
      <h1>Panel de Administración</h1>

      {/* 🔹 Sección de creación de usuarios */}
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

      {/* 🔹 Tabla de usuarios */}
      <section>
        <h2>Lista de Usuarios</h2>
        <table border="1">
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
                  <button onClick={() => handleDeleteUser(u._id)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 🔹 Tabla de asistencias */}
      <section>
        <h2>Asistencias registradas</h2>
        <table border="1">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tema</th>
              <th>Responsable</th>
              <th>Sede</th>
              <th>Registrado por</th>
            </tr>
          </thead>
          <tbody>
            {asistencias.length > 0 ? (
              asistencias.map((a) => (
                <tr key={a._id}>
                  <td>{new Date(a.fecha).toLocaleDateString()}</td>
                  <td>{a.tema}</td>
                  <td>{a.responsable}</td>
                  <td>{a.sede}</td>
                  <td>{a.userId?.username || "Sin usuario"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No hay asistencias registradas</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;
