// src/features/auth/components/LoginForm.jsx
import React, { useState } from "react";
import "../css/Auth.css";
import "../css/RegisterStyles.css";

function LoginForm({ onSubmit, error }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      // La validación de campos vacíos podría hacerse aquí o en el servicio/página
      // Por simplicidad, la mantenemos aquí por ahora, pero idealmente el servicio maneja errores de lógica.
      // O la página podría mostrar un error más específico.
      alert("Por favor, completa todos los campos.");
      return;
    }
    if (!isCheckboxChecked) {
      alert("Debes marcar 'Recordar usuario' para continuar."); // O ajustar la lógica de esta validación
      return;
    }
    onSubmit(credentials);
  };

  return (
    <form className="auth-form-content" onSubmit={handleSubmit}>
      <input
        type="email"
        name="email" // Añadido name para el handleChange genérico
        placeholder="Correo electrónico"
        value={credentials.email}
        onChange={handleChange}
        className="auth-form-input"
        required
      />
      <input
        type="password"
        name="password" // Añadido name
        placeholder="Contraseña"
        value={credentials.password}
        onChange={handleChange}
        className="auth-form-input"
        required
      />
      <div className="auth-form-checkbox">
        <input
          type="checkbox"
          id="remember-user" // Cambiado id para evitar duplicados si hay otro form en la vista
          checked={isCheckboxChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="remember-user">Recordar usuario.</label>
      </div>
      {error && <p className="auth-form-error">{error}</p>}
      <button type="submit" className="auth-primary-button">
        Entrar
      </button>
    </form>
  );
}

export default LoginForm;
