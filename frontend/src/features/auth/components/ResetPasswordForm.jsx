// src/features/auth/components/ResetPasswordForm.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Auth.css";

function ResetPasswordForm({ onSubmit, error, successMessage, isLoading }) {
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!passwords.newPassword || !passwords.confirmPassword) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    onSubmit(passwords);
  };

  return (
    <form className="auth-form-content" onSubmit={handleSubmit}>
      <div className="auth-form-group">
        <label htmlFor="newPassword">Nueva Contraseña</label>
        <input
          type="password"
          id="newPassword"
          name="newPassword"
          placeholder="Introduce tu nueva contraseña"
          value={passwords.newPassword}
          onChange={handleChange}
          className="auth-form-input"
          required
        />
      </div>
      <div className="auth-form-group">
        <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirma tu nueva contraseña"
          value={passwords.confirmPassword}
          onChange={handleChange}
          className="auth-form-input"
          required
        />
      </div>

      {error && <p className="auth-form-error">{error}</p>}
      {successMessage && <p className="auth-form-success">{successMessage}</p>}

      <div className="auth-form-actions">
        <button type="submit" className="auth-primary-button" disabled={isLoading}>
          {isLoading ? "Restableciendo..." : "Restablecer Contraseña"}
        </button>
        <Link to="/login" className="auth-secondary-button">
          Ir al Login
        </Link>
      </div>
    </form>
  );
}

export default ResetPasswordForm;
