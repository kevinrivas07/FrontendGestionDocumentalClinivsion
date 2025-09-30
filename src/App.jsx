import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import RegisterAdmin from "./components/RegisterAdmin";
import Home from "./components/Home";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AutoLogout from "./components/AutoLogout";
import AsistenciaForm from "./components/AsistenciaForm";

import "./App.css";

// ✅ Funciones fuera del render
const getTokenPayload = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    return JSON.parse(atob(token.split(".")[1]));
  } catch (err) {
    return null;
  }
};

const isLoggedIn = () => {
  const payload = getTokenPayload();
  return !!payload?.userId;
};

const isAdmin = () => {
  const payload = getTokenPayload();
  return payload?.role === "admin";
};

// ✅ Componente reutilizable para rutas privadas
const ProtectedRoute = ({ children, adminOnly = false }) => {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  if (adminOnly && !isAdmin()) {
    return <Navigate to="/home" replace />;
  }
  return children;
};

function App() {
  const handleLogout = () => {
    localStorage.removeItem("token"); // 🔑 Elimina el token
  };

  return (
    <Router>
      <div className="App">
        {/* ⏱️ Auto cierre de sesión tras 2 minutos de inactividad */}
        <AutoLogout onLogout={handleLogout} />

        <Routes>
          {/* ✅ Redirige / al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/asistencia" element={<AsistenciaForm />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
