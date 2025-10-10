import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "../styles/Login.css";

const API_URL = "http://localhost:5000/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const captchaRef = useRef(null);

  useEffect(() => {
    document.body.classList.add("login-background");
    return () => document.body.classList.remove("login-background");
  }, []);

  // 👇 Si hay sesión activa, redirige según el rol
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload?.userId) {
          if (role === "admin") navigate("/admin/dashboard", { replace: true });
          else navigate("/home", { replace: true });
        } else {
          localStorage.clear();
        }
      } catch {
        localStorage.clear();
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, captcha: captchaToken }),
      });

      const data = await res.json();

      if (res.ok) {
        const payload = JSON.parse(atob(data.token.split(".")[1]));
        if (!payload.userId) throw new Error("Token inválido");

        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("nombre", data.user?.nombre || username);

        if (data.role === "admin") navigate("/admin/dashboard", { replace: true });
        else navigate("/home", { replace: true });
      } else {
        setError(data.msg || "Credenciales incorrectas.");
      }
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor.");
    } finally {
      captchaRef.current?.reset();
      setCaptchaToken(null);
    }
  };

  return (
    <div className="main-container">
      <div className="image-container"></div>
      <div className="login-container">
        <div className="login-box">
          <h2>INICIO DE SESIÓN</h2>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label htmlFor="usuario">Usuario:</label>
              <input
                type="text"
                id="usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingrese su usuario"
                required
              />
            </div>

            <div className="input-group password-group">
              <label htmlFor="password">Contraseña:</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="********"
                  required
                />
                <span
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
            <button type="submit">Iniciar Sesión</button>
          </form>

          {error && <p className="error-message">{error}</p>}

          <p>
            ¿Olvidaste tu contraseña? <a href="/forgot-password">Recupérala</a>
          </p>
          <p>
            ¿No tienes cuenta? <a href="/register">Regístrate</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
