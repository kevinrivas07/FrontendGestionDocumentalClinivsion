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

  // 👇 Referencia al captcha
  const captchaRef = useRef(null);

  // Fondo de login
  useEffect(() => {
    document.body.classList.add("login-background");
    return () => {
      document.body.classList.remove("login-background");
    };
  }, []);

  // Verificar token existente
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        if (payload?.userId) {
          navigate("/home", { replace: true });
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          localStorage.removeItem("nombre");
        }
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("nombre");
        console.warn("⚠️ Token inválido en el localStorage");
      }
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 👇 Aquí agrego /login al endpoint
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, captcha: captchaToken }),
      });

      const data = await response.json();

      if (response.ok) {
        try {
          const payload = JSON.parse(atob(data.token.split(".")[1]));
          if (!payload.userId) throw new Error("Token sin userId");

          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);

          // 👇 Guardamos el nombre si viene en la respuesta
          if (data.user?.nombre) {
            localStorage.setItem("nombre", data.user.nombre);
          } else {
            console.warn("⚠️ El backend no envió el nombre del usuario");
          }

          if (data.role === "admin") {
            navigate("/admin/dashboard", { replace: true });
          } else {
            navigate("/home", { replace: true });
          }
        } catch (err) {
          console.error("❌ Token mal formado:", err.message);
          setError("Error al procesar el token de sesión.");
          captchaRef.current.reset();
          setCaptchaToken(null);
        }
      } else {
        setError(data.msg || "Credenciales incorrectas.");
        captchaRef.current.reset();
        setCaptchaToken(null);
      }
    } catch (err) {
      console.error("❌ Error de conexión:", err.message);
      setError("No se pudo conectar con el servidor.");
      captchaRef.current.reset();
      setCaptchaToken(null);
    }
  };

  return (
    <div className="main-container">
      {/* Columna izquierda - Imagen */}
      <div className="image-container">
      </div>

      {/* Columna derecha - Login */}
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
                placeholder="Ingrese su Usuario"
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
            ¿Olvidaste tu contraseña?{" "}
            <a href="/forgot-password">Recupérala aquí</a>
          </p>
          <p>
            ¿Olvidaste tu usuario?{" "}
            <a href="/recover-username">Recupéralo aquí</a>
          </p>
          <p>
            ¿Aún no estás registrado? <a href="/register">Registrarse</a>
          </p>
          <p>
            ¿Volver a la página principal? <a href="/">Inicio</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
