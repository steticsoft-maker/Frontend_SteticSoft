// src/features/auth/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// Corregido: Importamos el hook personalizado useAuth
import { useAuth } from "../../../shared/contexts/authHooks"; // Path updated
import LoginForm from "../components/LoginForm";
import "../css/Auth.css";
import "../css/LoginStyles.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (credentials, rememberMe) => {
    setErrors({});
    setIsLoading(true);
    try {
      const loginResult = await login(credentials, rememberMe);

      if (loginResult.success) {
        // Redirección basada en el rol
        if (loginResult.role === "Administrador") {
          navigate("/admin/dashboard");
        } else if (loginResult.role === "Cliente") {
          navigate("/");
        } else if (loginResult.role === "Empleado") {
          navigate("/empleado/dashboard");
        } else {
          navigate("/"); // Ruta por defecto
        }
      }
    } catch (err) {
      if (err.response && (err.response.status === 400 || err.response.status === 422) && err.response.data.errors) {
        const backendErrors = err.response.data.errors;
        const newErrors = {};
        backendErrors.forEach(error => {
          newErrors[error.param] = error.msg;
        });
        setErrors(newErrors);
      } else {
        setErrors({ general: err.message || "Error al iniciar sesión. Por favor, inténtalo de nuevo." });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img src="/logo.png" alt="SteticSoft Logo" className="auth-form-logo" />
        <h2 className="auth-form-title">Iniciar Sesión</h2>
        <LoginForm onSubmit={handleLoginSubmit} errors={errors} isLoading={isLoading} />
        <div className="auth-form-actions">
          <Link to="/auth/solicitar-recuperacion" className="auth-secondary-button">
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