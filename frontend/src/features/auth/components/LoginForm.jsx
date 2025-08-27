// INICIO DE MODIFICACIÓN
import React, { useState } from "react";
import "../css/Auth.css";
import "../css/LoginStyles.css";

function LoginForm({ onSubmit, errors, loading, setErrors }) {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCheckboxChange = (e) => {
    setIsCheckboxChecked(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(credentials, isCheckboxChecked);
  };

  const RequiredAsterisk = () => <span style={{ color: "red" }}>*</span>;

  return (
    <form className="auth-form-content" onSubmit={handleSubmit}>
      {errors.general && <p className="error-message">{errors.general}</p>}

      {/* Campo Correo Electrónico */}
      <div className="auth-form-group">
        <label htmlFor="login-email">Correo electrónico <RequiredAsterisk /></label>
        <input
          type="email"
          id="login-email"
          name="email"
          placeholder="ejemplo@correo.com"
          value={credentials.email}
          onChange={handleChange}
          className={`auth-form-input ${errors.email ? 'input-error' : ''}`}
          required
          autoComplete="email"
        />
        {errors.email && <p className="error-message">{errors.email}</p>}
      </div>

      {/* Campo Contraseña */}
      <div className="auth-form-group">
        <label htmlFor="login-password">Contraseña <RequiredAsterisk /></label>
        <input
          type="password"
          id="login-password"
          name="password"
          placeholder="Tu contraseña"
          value={credentials.password}
          onChange={handleChange}
          className={`auth-form-input ${errors.password ? 'input-error' : ''}`}
          required
          autoComplete="current-password"
        />
        {errors.password && <p className="error-message">{errors.password}</p>}
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

      <button type="submit" className="auth-primary-button" disabled={loading}>
        {loading ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}
// FIN DE MODIFICACIÓN

export default LoginForm;