// src/features/auth/components/RegisterForm.jsx
import React, { useState } from "react";

function RegisterForm({ onSubmit, error, successMessage }) {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password || !confirmPassword) {
      alert("Por favor, completa todos los campos."); // Manteniendo alerta por simplicidad actual
      return;
    }
    if (user.password !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    if (!isCheckboxChecked) {
      alert("Debes aceptar los términos y condiciones.");
      return;
    }
    onSubmit({ ...user }); // Enviar solo los datos del usuario
  };

  return (
    <form className="auth-form-content" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        placeholder="Nombre completo"
        value={user.name}
        onChange={handleChange}
        className="auth-form-input"
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={user.email}
        onChange={handleChange}
        className="auth-form-input"
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={user.password}
        onChange={handleChange}
        className="auth-form-input"
        required
      />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirmar Contraseña"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="auth-form-input"
        required
      />
      <div className="auth-form-checkbox">
        <input
          type="checkbox"
          id="terms-check"
          checked={isCheckboxChecked}
          onChange={(e) => setIsCheckboxChecked(e.target.checked)}
        />
        <label htmlFor="terms-check">Acepto los términos y condiciones</label>
      </div>
      {error && <p className="auth-form-error">{error}</p>}
      {successMessage && (
        <p className="auth-form-success">{successMessage}</p>
      )}{" "}
      {/* Necesitarás estilo para .auth-form-success */}
      <button type="submit" className="auth-primary-button">
        Registrarse
      </button>
    </form>
  );
}

export default RegisterForm;
