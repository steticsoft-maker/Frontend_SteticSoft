// src/features/auth/components/PasswordRecoveryForm.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PasswordInput from "../../../shared/components/PasswordInput/PasswordInput";
import "../css/Auth.css";

function PasswordRecoveryForm({ view, onSubmit, error, isLoading, email }) {
  const [formData, setFormData] = useState({
    email: "",
    token: "",
    nuevaContrasena: "",
    confirmarNuevaContrasena: "",
  });
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (email) {
      setFormData((prev) => ({ ...prev, email }));
    }
  }, [email]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "confirmarNuevaContrasena" || name === "nuevaContrasena") {
      const newPassword = name === "nuevaContrasena" ? value : formData.nuevaContrasena;
      const confirmPassword = name === "confirmarNuevaContrasena" ? value : formData.confirmarNuevaContrasena;
      if (newPassword && confirmPassword && newPassword !== confirmPassword) {
        setPasswordError("Las contraseñas no son iguales.");
      } else {
        setPasswordError("");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwordError) return;
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

  const isResetReady = view === 'reset' && formData.nuevaContrasena && formData.confirmarNuevaContrasena && !passwordError;

  return (
    <form className="auth-form-content" onSubmit={handleSubmit}>
      {view === "request" && (
        <div className="auth-form-group">
          <label htmlFor="email">Correo Electrónico</label>
          <input type="email" id="email" name="email" placeholder="ejemplo@correo.com" value={formData.email} onChange={handleChange} className="auth-form-input" required />
        </div>
      )}

      {view === "verify" || view === "reset" ? (
        <>
          <div className="auth-form-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input type="email" id="email" name="email" value={formData.email} className="auth-form-input" disabled />
          </div>
          <div className="auth-form-group">
            <label htmlFor="token">Código de 6 dígitos</label>
            <input type="text" id="token" name="token" placeholder="123456" value={formData.token} onChange={handleChange} className="auth-form-input" required maxLength="6" disabled={view === 'reset'} />
          </div>
          <div className="auth-form-group">
            <label htmlFor="nuevaContrasena">Nueva Contraseña</label>
            <PasswordInput
              name="nuevaContrasena"
              value={formData.nuevaContrasena}
              onChange={handleChange}
              className="auth-form-input"
              required
              disabled={view === 'verify'}
              helpText={view === 'reset' ? "Mín 8 caract, 1 Mayús, 1 minús, 1 núm, 1 símb" : ""}
            />
          </div>
          <div className="auth-form-group">
            <label htmlFor="confirmarNuevaContrasena">Confirmar Nueva Contraseña</label>
            <PasswordInput
              name="confirmarNuevaContrasena"
              value={formData.confirmarNuevaContrasena}
              onChange={handleChange}
              className="auth-form-input"
              required
              disabled={view === 'verify'}
            />
          </div>
        </>
      ) : null}

      {error && <p className="auth-form-error">{error}</p>}
      {passwordError && <p className="auth-form-error">{passwordError}</p>}

      <div className="auth-form-actions">
        <button type="submit" className="auth-primary-button" disabled={isLoading || (view === 'reset' && !isResetReady)}>
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
