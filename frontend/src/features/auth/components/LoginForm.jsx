// src/features/auth/components/LoginForm.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import useRateLimit from "../hooks/useRateLimit";
import useFormValidation from "../hooks/useFormValidation";
import AuthNotification from "./AuthNotification";
import "../css/Auth.css";
import "../css/LoginStyles.css";

function LoginForm({ onSubmit, error, isLoading = false }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [showRateLimitWarning, setShowRateLimitWarning] = useState(false);

  // Hooks para validación y rate limiting
  const { validateFieldRealTime, getFieldError, hasFieldError } =
    useFormValidation("login");
  const {
    isBlocked,
    timeRemaining,
    canAttempt,
    recordAttempt,
    clearAttempts,
    remainingAttempts,
  } = useRateLimit();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newCredentials = { ...credentials, [name]: value };
    setCredentials(newCredentials);

    // Validar campo en tiempo real
    validateFieldRealTime(name, value, newCredentials);
  };

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar rate limiting
    if (!canAttempt()) {
      setShowRateLimitWarning(true);
      return;
    }

    // Validar formulario
    if (!credentials.email || !credentials.password) {
      return;
    }

    try {
      // Registrar intento
      recordAttempt();

      // Limpiar advertencia de rate limit si existe
      if (showRateLimitWarning) {
        setShowRateLimitWarning(false);
      }

      await onSubmit(credentials, isCheckboxChecked);

      // Limpiar intentos si el login fue exitoso
      clearAttempts();
    } catch (err) {
      // El error se manejará en el componente padre
      console.error("Login error:", err);
    }
  };

  const RequiredAsterisk = () => <span style={{ color: "red" }}>*</span>;

  return (
    <form className="auth-form-content" onSubmit={handleSubmit}>
      {/* Campo Correo Electrónico */}
      <div className="auth-form-group">
        <label htmlFor="login-email">
          Correo electrónico <RequiredAsterisk />
        </label>
        <input
          type="email"
          id="login-email"
          name="email"
          placeholder="ejemplo@correo.com"
          value={credentials.email}
          onChange={handleChange}
          className={`auth-form-input ${
            hasFieldError("email") ? "input-error" : ""
          }`}
          required
          autoComplete="username"
          disabled={isBlocked || isLoading}
        />
        {getFieldError("email") && (
          <span className="error-message">{getFieldError("email")}</span>
        )}
      </div>

      {/* Campo Contraseña */}
      <div className="auth-form-group">
        <label htmlFor="login-password">
          Contraseña <RequiredAsterisk />
        </label>
        <input
          type="password"
          id="login-password"
          name="password"
          placeholder="Tu contraseña"
          value={credentials.password}
          onChange={handleChange}
          className={`auth-form-input ${
            hasFieldError("password") ? "input-error" : ""
          }`}
          required
          autoComplete="current-password"
          disabled={isBlocked || isLoading}
        />
        {getFieldError("password") && (
          <span className="error-message">{getFieldError("password")}</span>
        )}
      </div>

      {/* Checkbox Recordar Usuario */}
      <div className="auth-form-checkbox">
        <input
          type="checkbox"
          id="remember-user"
          checked={isCheckboxChecked}
          onChange={handleCheckboxChange}
          disabled={isBlocked || isLoading}
        />
        <label htmlFor="remember-user">Recordar usuario</label>
      </div>

      {/* Notificaciones */}
      {showRateLimitWarning && (
        <AuthNotification
          type="warning"
          title="Demasiados intentos"
          message={`Espera ${timeRemaining} antes de intentar nuevamente. Intentos restantes: ${remainingAttempts}`}
          persistent={true}
          onClose={() => setShowRateLimitWarning(false)}
        />
      )}

      {isBlocked && (
        <AuthNotification
          type="error"
          title="Acceso bloqueado"
          message={`Has excedido el límite de intentos. Espera ${timeRemaining} para continuar.`}
          persistent={true}
        />
      )}

      {error && (
        <AuthNotification
          type="error"
          title="Error de inicio de sesión"
          message={error}
          persistent={false}
        />
      )}

      <div className="auth-form-actions">
        <button
          type="submit"
          className={`auth-primary-button ${isLoading ? "loading" : ""}`}
          disabled={isBlocked || isLoading}
        >
          {isLoading ? "Iniciando sesión..." : "Entrar"}
        </button>
        <Link to="/" className="auth-secondary-button">
          Regresar
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;
