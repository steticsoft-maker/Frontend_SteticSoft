// src/features/auth/components/ForgotPasswordForm.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Auth.css";

function ForgotPasswordForm({ onSubmit, error, successMessage, isLoading }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) {
      alert("Por favor, ingresa tu correo electrónico.");
      return;
    }
    onSubmit(email);
  };

  return (
    <form className="auth-form-content" onSubmit={handleSubmit}>
      <div className="auth-form-group">
        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="ejemplo@correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-form-input"
          required
        />
      </div>

      {error && <p className="auth-form-error">{error}</p>}
      {successMessage && <p className="auth-form-success">{successMessage}</p>}

      <div className="auth-form-actions">
        <button type="submit" className="auth-primary-button" disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar enlace de recuperación"}
        </button>
        <Link to="/login" className="auth-secondary-button">
          Regresar al Login
        </Link>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;
