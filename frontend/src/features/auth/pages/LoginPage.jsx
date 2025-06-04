// src/features/auth/pages/LoginPage.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../../shared/contexts/AuthContext"; // Ajusta la ruta si es necesario
import LoginForm from "../components/LoginForm"; // Ajusta la ruta si es necesario
import "../css/Auth.css"; // Estilos comunes
import "../css/LoginStyles.css"; // Estilos específicos del login

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Para el estado de carga del botón

  const handleLoginSubmit = async (credentials, rememberMe) => {
    // <--- Acepta 'rememberMe'
    setError("");
    setIsLoading(true);
    try {
      // Pasa 'credentials' y 'rememberMe' a la función login del contexto
      const loginResult = await login(credentials, rememberMe);

      if (loginResult.success) {
        // Redirección basada en el rol devuelto por la función login del AuthContext
        // (Asumiendo que loginResult.role contiene el nombre del rol)
        if (loginResult.role === "Administrador") {
          navigate("/admin/dashboard");
        } else if (loginResult.role === "Cliente") {
          navigate("/"); // O la ruta del dashboard del cliente
        } else if (loginResult.role === "Empleado") {
          navigate("/empleado/dashboard"); // O la ruta del dashboard del empleado
        } else {
          navigate("/"); // Ruta por defecto si el rol no coincide o no se maneja específicamente
        }
      } else {
        // Este else podría no ser necesario si el login del context siempre lanza error en caso de fallo
        setError(
          loginResult.message || "Error desconocido al intentar iniciar sesión."
        );
      }
    } catch (err) {
      setError(
        err.message || "Error al iniciar sesión. Por favor, inténtalo de nuevo."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img src="/logo.png" alt="SteticSoft Logo" className="auth-form-logo" />
        <h2 className="auth-form-title">Iniciar Sesión</h2>
        <LoginForm onSubmit={handleLoginSubmit} error={error} />
        <div className="auth-form-actions">
          <Link
            to="/auth/solicitar-recuperacion"
            className="auth-secondary-button"
          >
            ¿Olvidaste tu contraseña?
          </Link>
          <Link to="/register" className="auth-secondary-button">
            Crear cuenta
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
