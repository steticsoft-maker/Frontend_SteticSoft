// src/features/auth/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// INICIO DE MODIFICACIÓN
import { useAuth } from "../../../shared/contexts/authHooks";
import LoginForm from "../components/LoginForm";
import "../css/Auth.css";
import "../css/LoginStyles.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = async (credentials, rememberMe) => {
    setErrors({});
    setLoading(true);
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
      if (err.response && err.response.status === 400) {
        const backendErrors = err.response.data.errors.reduce((acc, error) => {
          acc[error.param] = error.msg;
          return acc;
        }, {});
        setErrors(backendErrors);
      } else {
        setErrors({ general: err.message || "Error al iniciar sesión. Por favor, inténtalo de nuevo." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img src="/logo.png" alt="SteticSoft Logo" className="auth-form-logo" />
        <h2 className="auth-form-title">Iniciar Sesión</h2>
        <LoginForm
          onSubmit={handleLoginSubmit}
          errors={errors}
          loading={loading}
          setErrors={setErrors} // Pasamos la función para limpiar errores
        />
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
// FIN DE MODIFICACIÓN

export default LoginPage;