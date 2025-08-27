// src/features/auth/components/LoginForm.jsx
import React, { useState } from "react";
import "../css/Auth.css";
import "../css/LoginStyles.css";

// INICIO DE MODIFICACIÓN: Aceptar 'errors' en lugar de 'error'.
function LoginForm({ onSubmit, errors, isLoading }) {
  // FIN DE MODIFICACIÓN

  const [credentials, setCredentials] = useState({ correo: "", contrasena: "" });
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleChange = (e) => {
    // INICIO DE MODIFICACIÓN: El estado ahora usa 'correo' y 'contrasena' para coincidir con el backend.
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    // FIN DE MODIFICACIÓN
  };

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  // INICIO DE MODIFICACIÓN: Se elimina la validación del lado del cliente.
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(credentials, isCheckboxChecked);
  };
  // FIN DE MODIFICACIÓN

  const RequiredAsterisk = () => <span style={{ color: "red" }}>*</span>;

  return (
    <form className="auth-form-content" onSubmit={handleSubmit}>
      {/* Campo Correo Electrónico */}
      <div className="auth-form-group">
        <label htmlFor="login-email">Correo electrónico <RequiredAsterisk /></label>
        <input
          type="email"
          id="login-email"
          name="correo" // MODIFICADO: 'name' ahora es 'correo'
          placeholder="ejemplo@correo.com"
          value={credentials.correo}
          onChange={handleChange}
          // INICIO DE MODIFICACIÓN: Aplicar clase de error condicionalmente
          className={`auth-form-input ${errors.correo ? 'input-error' : ''}`}
          // FIN DE MODIFICACIÓN
          required
          autoComplete="email"
        />
        {/* INICIO DE MODIFICACIÓN: Mostrar mensaje de error de campo */}
        {errors.correo && <p className="error-message">{errors.correo}</p>}
        {/* FIN DE MODIFICACIÓN */}
      </div>

      {/* Campo Contraseña */}
      <div className="auth-form-group">
        <label htmlFor="login-password">Contraseña <RequiredAsterisk /></label>
        <input
          type="password"
          id="login-password"
          name="contrasena" // MODIFICADO: 'name' ahora es 'contrasena'
          placeholder="Tu contraseña"
          value={credentials.contrasena}
          onChange={handleChange}
          className={`auth-form-input ${errors.contrasena ? 'input-error' : ''}`}
          required
          autoComplete="current-password"
        />
        {errors.contrasena && <p className="error-message">{errors.contrasena}</p>}
      </div>

      {/* Checkbox Recordar Usuario */}
      <div className="auth-form-checkbox">
        <input
          type="checkbox"
          id="remember-user"
          checked={isCheckboxChecked}
          onChange={handleCheckboxChange}
        />
        <label htmlFor="remember-user">Recordar usuario</label>
      </div>

      {/* INICIO DE MODIFICACIÓN: Mostrar error general si existe */}
      {errors.general && <p className="auth-form-error">{errors.general}</p>}
      {/* FIN DE MODIFICACIÓN */}

      {/* MODIFICADO: Se pasa isLoading al botón */}
      <button type="submit" className="auth-primary-button" disabled={isLoading}>
        {isLoading ? 'Entrando...' : 'Entrar'}
      </button>
    </form>
  );
}

export default LoginForm;