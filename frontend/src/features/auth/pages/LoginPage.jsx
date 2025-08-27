// src/features/auth/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../shared/contexts/authHooks";
import LoginForm from "../components/LoginForm";
import "../css/Auth.css";
import "../css/LoginStyles.css";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // INICIO DE MODIFICACIÓN: Cambiar el estado de error a un objeto.
  const [errors, setErrors] = useState({});
  // FIN DE MODIFICACIÓN

  const [isLoading, setIsLoading] = useState(false);

  const handleLoginSubmit = async (credentials, rememberMe) => {
    // INICIO DE MODIFICACIÓN: Limpiar el objeto de errores.
    setErrors({});
    // FIN DE MODIFICACIÓN
    setIsLoading(true);
    try {
      const loginResult = await login(credentials, rememberMe);

      if (loginResult.success) {
        if (loginResult.role === "Administrador") {
          navigate("/admin/dashboard");
        } else if (loginResult.role === "Cliente") {
          navigate("/");
        } else if (loginResult.role === "Empleado") {
          navigate("/empleado/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (err) {
      // INICIO DE MODIFICACIÓN: Procesar errores de validación del backend.
      if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
        const backendErrors = err.response.data.errors.reduce((acc, error) => {
          const fieldName = error.param || error.path;
          acc[fieldName] = error.msg;
          return acc;
        }, {});
        setErrors(backendErrors);
      } else {
        // Error genérico para credenciales incorrectas o fallos de conexión.
        // El hook de login ya puede devolver un mensaje de error genérico.
        setErrors({ general: err.message || "Error al iniciar sesión. Por favor, inténtalo de nuevo." });
      }
      // FIN DE MODIFICACIÓN
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-form-box">
        <img src="/logo.png" alt="SteticSoft Logo" className="auth-form-logo" />
        <h2 className="auth-form-title">Iniciar Sesión</h2>
        {/* INICIO DE MODIFICACIÓN: Pasar el objeto de errores al formulario. */}
        <LoginForm onSubmit={handleLoginSubmit} errors={errors} isLoading={isLoading} />
        {/* FIN DE MODIFICACIÓN */}
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