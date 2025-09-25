// src/features/auth/components/PasswordRecoveryForm.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PasswordInput from "../../../shared/components/PasswordInput/PasswordInput";
import "../css/Auth.css";

function PasswordRecoveryForm({
  view,
  onSubmit,
  error,
  isLoading,
  email,
  tokenValidationError,
  isTokenValidated,
}) {
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    nuevaContrasena: "",
    confirmarNuevaContrasena: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Expresiones regulares para validación
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,;?¡¿"'(){}[\]\-_+=|\\/°¬~`´¨´`+*çÇªº]).{8,}$/;

  useEffect(() => {
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, [email]);

  // Resetear estado cuando cambia la vista
  useEffect(() => {
    // El estado de validación del token ahora se maneja en el componente padre
    // No necesitamos resetear aquí ya que viene como props
  }, [view]);

  const validatePassword = (password) => {
    if (!password) return "La nueva contraseña es obligatoria.";
    if (password.length < 8)
      return "La contraseña debe tener al menos 8 caracteres.";
    if (!passwordRegex.test(password)) {
      return "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validar campos en tiempo real
    if (name === "email") {
      const emailError = !value
        ? "El correo electrónico es obligatorio."
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
        ? "Debe proporcionar un correo electrónico válido."
        : "";
      setFieldErrors((prev) => ({ ...prev, email: emailError }));
    }

    if (name === "token") {
      const tokenError = !value
        ? "El código es obligatorio."
        : !/^\d{6}$/.test(value)
        ? "El código debe tener exactamente 6 dígitos."
        : "";
      setFieldErrors((prev) => ({ ...prev, token: tokenError }));

      // Los errores de validación del token se manejan en el componente padre
      // No necesitamos limpiarlos aquí
    }

    if (name === "nuevaContrasena") {
      const error = validatePassword(value);
      setFieldErrors((prev) => ({ ...prev, nuevaContrasena: error }));
    }

    if (name === "confirmarNuevaContrasena" || name === "nuevaContrasena") {
      const newPassword =
        name === "nuevaContrasena" ? value : formData.nuevaContrasena;
      const confirmPassword =
        name === "confirmarNuevaContrasena"
          ? value
          : formData.confirmarNuevaContrasena;

      if (confirmPassword && newPassword !== confirmPassword) {
        setPasswordError("Las contraseñas no coinciden.");
        setFieldErrors((prev) => ({
          ...prev,
          confirmarNuevaContrasena: "Las contraseñas no coinciden.",
        }));
      } else {
        setPasswordError("");
        setFieldErrors((prev) => ({ ...prev, confirmarNuevaContrasena: "" }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validar todos los campos según la vista
    let hasErrors = false;
    const newFieldErrors = {};

    if (view === "request") {
      if (!formData.email) {
        newFieldErrors.email = "El correo electrónico es obligatorio.";
        hasErrors = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newFieldErrors.email =
          "Debe proporcionar un correo electrónico válido.";
        hasErrors = true;
      }
    }

    if (view === "verify") {
      if (!formData.token) {
        newFieldErrors.token = "El código es obligatorio.";
        hasErrors = true;
      } else if (!/^\d{6}$/.test(formData.token)) {
        newFieldErrors.token = "El código debe tener exactamente 6 dígitos.";
        hasErrors = true;
      }
      // La validación real del token se hace en el componente padre (PasswordRecoveryPage)
      // que llama a verificarTokenAPI del servicio
    }

    if (view === "reset") {
      const passwordError = validatePassword(formData.nuevaContrasena);
      if (passwordError) {
        newFieldErrors.nuevaContrasena = passwordError;
        hasErrors = true;
      }

      if (!formData.confirmarNuevaContrasena) {
        newFieldErrors.confirmarNuevaContrasena =
          "Debe confirmar la nueva contraseña.";
        hasErrors = true;
      } else if (
        formData.nuevaContrasena !== formData.confirmarNuevaContrasena
      ) {
        newFieldErrors.confirmarNuevaContrasena =
          "Las contraseñas no coinciden.";
        hasErrors = true;
      }
    }

    setFieldErrors(newFieldErrors);

    if (hasErrors) {
      return;
    }

    onSubmit(formData);
  };

  const getButtonText = () => {
    if (isLoading) return "Procesando...";
    switch (view) {
      case "request":
        return "Enviar Código";
      case "verify":
        return "Verificar Código";
      case "reset":
        return "Restablecer Contraseña";
      default:
        return "Enviar";
    }
  };

  const isResetReady =
    view === "reset" &&
    formData.nuevaContrasena &&
    formData.confirmarNuevaContrasena &&
    !passwordError;

  const isVerifyReady =
    view === "verify" &&
    formData.token &&
    formData.token.length === 6 &&
    !fieldErrors.token &&
    !tokenValidationError;

  return (
    <form className="auth-form-content" onSubmit={handleSubmit}>
      {view === "request" && (
        <div className="auth-form-group">
          <label htmlFor="email">
            Correo Electrónico <span style={{ color: "red" }}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="ejemplo@correo.com"
            value={formData.email}
            onChange={handleChange}
            className={`auth-form-input ${
              fieldErrors.email ? "input-error" : ""
            }`}
            required
          />
          {fieldErrors.email && (
            <span className="error-message">{fieldErrors.email}</span>
          )}
        </div>
      )}

      {view === "verify" || view === "reset" ? (
        <>
          <div className="auth-form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              className="auth-form-input"
              disabled
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="token">
              Código de 6 dígitos <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              id="token"
              name="token"
              placeholder="123456"
              value={formData.token}
              onChange={handleChange}
              className={`auth-form-input ${
                fieldErrors.token
                  ? "input-error"
                  : isTokenValidated
                  ? "input-success"
                  : formData.token &&
                    formData.token.length === 6 &&
                    !fieldErrors.token
                  ? "input-pending"
                  : ""
              }`}
              required
              maxLength="6"
              disabled={view === "reset"}
              style={{
                borderColor: fieldErrors.token
                  ? "#dc3545"
                  : isTokenValidated
                  ? "#28a745"
                  : formData.token &&
                    formData.token.length === 6 &&
                    !fieldErrors.token
                  ? "#ffc107"
                  : undefined,
              }}
            />
            {fieldErrors.token && (
              <span className="error-message">{fieldErrors.token}</span>
            )}
            {tokenValidationError && (
              <span className="error-message" style={{ color: "red" }}>
                {tokenValidationError}
              </span>
            )}
          </div>
          {isTokenValidated && (
            <>
              <div className="auth-form-group">
                <label htmlFor="nuevaContrasena">
                  Nueva Contraseña <span style={{ color: "red" }}>*</span>
                </label>
                <PasswordInput
                  name="nuevaContrasena"
                  value={formData.nuevaContrasena}
                  onChange={handleChange}
                  className={`auth-form-input ${
                    fieldErrors.nuevaContrasena ? "input-error" : ""
                  }`}
                  required
                  disabled={view === "verify"}
                  helpText={
                    view === "reset"
                      ? "Mín 8 caract, 1 Mayús, 1 minús, 1 núm, 1 símb"
                      : ""
                  }
                />
                {fieldErrors.nuevaContrasena && (
                  <span className="error-message">
                    {fieldErrors.nuevaContrasena}
                  </span>
                )}
              </div>
              <div className="auth-form-group">
                <label htmlFor="confirmarNuevaContrasena">
                  Confirmar Nueva Contraseña{" "}
                  <span style={{ color: "red" }}>*</span>
                </label>
                <PasswordInput
                  name="confirmarNuevaContrasena"
                  value={formData.confirmarNuevaContrasena}
                  onChange={handleChange}
                  className={`auth-form-input ${
                    fieldErrors.confirmarNuevaContrasena ? "input-error" : ""
                  }`}
                  required
                  disabled={view === "verify"}
                />
                {fieldErrors.confirmarNuevaContrasena && (
                  <span className="error-message">
                    {fieldErrors.confirmarNuevaContrasena}
                  </span>
                )}
              </div>
            </>
          )}
        </>
      ) : null}

      {error && <p className="auth-form-error">{error}</p>}
      {passwordError && <p className="auth-form-error">{passwordError}</p>}

      <div className="auth-form-actions">
        <button
          type="submit"
          className="auth-primary-button"
          disabled={
            isLoading ||
            (view === "reset" && !isResetReady) ||
            (view === "verify" && !isVerifyReady)
          }
        >
          {getButtonText()}
        </button>
        <Link to="/login" className="auth-secondary-button">
          Regresar al Login
        </Link>
      </div>
    </form>
  );
}

export default PasswordRecoveryForm;
