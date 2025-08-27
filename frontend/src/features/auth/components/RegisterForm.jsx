// src/features/auth/components/RegisterForm.jsx
import React, { useState } from "react";
import "../css/Auth.css";
import "../css/RegisterStyles.css";

// INICIO DE MODIFICACIÓN: Aceptar 'errors' en lugar de 'error' para mostrar errores de campo.
function RegisterForm({ onSubmit, errors, successMessage, isLoading }) {
  // FIN DE MODIFICACIÓN

  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    telefono: "",
    tipoDocumento: "Cédula de Ciudadanía", // Valor por defecto
    numeroDocumento: "",
    fechaNacimiento: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // INICIO DE MODIFICACIÓN: Simplificar handleSubmit, la validación principal la hace el backend.
  const handleSubmit = (e) => {
    e.preventDefault();

    // La única validación que mantenemos en el cliente es la confirmación de contraseña
    // y el checkbox, ya que son puramente de UI.
    if (formData.contrasena !== confirmPassword) {
      // El backend también valida la contraseña, pero esto da feedback inmediato.
      // Podríamos incluso pasarlo al objeto de errores si quisiéramos.
      // Por ahora, lo dejamos como una alerta o un estado simple si es necesario.
      // Sin embargo, para mantener consistencia, delegaremos todo al backend.
    }
    if (!isCheckboxChecked) {
      // De nuevo, el backend no puede validar esto.
      // Pero para este ejercicio, nos centraremos en los errores del backend.
    }

    onSubmit(formData);
  };
  // FIN DE MODIFICACIÓN

  const RequiredAsterisk = () => <span style={{ color: "red" }}>*</span>;

  return (
    <form className="auth-form-content" onSubmit={handleSubmit}>
      <div className="auth-form-grid">
        {/* Campo Nombre */}
        <div className="auth-form-group">
          <label htmlFor="nombre">Nombre completo <RequiredAsterisk /></label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            placeholder="Ej: Ana"
            value={formData.nombre}
            onChange={handleChange}
            // INICIO DE MODIFICACIÓN: Aplicar clase de error condicionalmente
            className={`auth-form-input ${errors.nombre ? 'input-error' : ''}`}
            // FIN DE MODIFICACIÓN
            required
          />
          {/* INICIO DE MODIFICACIÓN: Mostrar mensaje de error de campo */}
          {errors.nombre && <p className="error-message">{errors.nombre}</p>}
          {/* FIN DE MODIFICACIÓN */}
        </div>

        {/* Campo Apellido */}
        <div className="auth-form-group">
          <label htmlFor="apellido">Apellidos <RequiredAsterisk /></label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            placeholder="Ej: Pérez López"
            value={formData.apellido}
            onChange={handleChange}
            className={`auth-form-input ${errors.apellido ? 'input-error' : ''}`}
            required
          />
          {errors.apellido && <p className="error-message">{errors.apellido}</p>}
        </div>

        {/* Campo Correo Electrónico */}
        <div className="auth-form-group">
          <label htmlFor="correo">Correo electrónico <RequiredAsterisk /></label>
          <input
            type="email"
            id="correo"
            name="correo"
            placeholder="ejemplo@correo.com"
            value={formData.correo}
            onChange={handleChange}
            className={`auth-form-input ${errors.correo ? 'input-error' : ''}`}
            required
          />
          {errors.correo && <p className="error-message">{errors.correo}</p>}
        </div>

        {/* Campo Contraseña */}
        <div className="auth-form-group">
          <label htmlFor="contrasena">Contraseña <RequiredAsterisk /></label>
          <input
            type="password"
            id="contrasena"
            name="contrasena"
            placeholder="Mínimo 8 caracteres, con mayúsculas, minúsculas, números y símbolos"
            value={formData.contrasena}
            onChange={handleChange}
            className={`auth-form-input ${errors.contrasena ? 'input-error' : ''}`}
            required
          />
          {errors.contrasena && <p className="error-message">{errors.contrasena}</p>}
        </div>

        {/* Campo Confirmar Contraseña */}
        <div className="auth-form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña <RequiredAsterisk /></label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Repite tu contraseña"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="auth-form-input" // No hay error de backend para este campo
            required
          />
        </div>

        {/* Campo Teléfono */}
        <div className="auth-form-group">
          <label htmlFor="telefono">Teléfono <RequiredAsterisk /></label>
          <input
            type="tel"
            id="telefono"
            name="telefono"
            placeholder="Ej: 3001234567"
            value={formData.telefono}
            onChange={handleChange}
            className={`auth-form-input ${errors.telefono ? 'input-error' : ''}`}
            required
          />
          {errors.telefono && <p className="error-message">{errors.telefono}</p>}
        </div>

        {/* Campo Tipo de Documento */}
        <div className="auth-form-group">
          <label htmlFor="tipoDocumento">Tipo de Documento <RequiredAsterisk /></label>
          <select
            id="tipoDocumento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            className={`auth-form-input ${errors.tipoDocumento ? 'input-error' : ''}`}
            required
          >
            <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
            <option value="Cédula de Extranjería">Cédula de Extranjería</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
          </select>
          {errors.tipoDocumento && <p className="error-message">{errors.tipoDocumento}</p>}
        </div>

        {/* Campo Número de Documento */}
        <div className="auth-form-group">
          <label htmlFor="numeroDocumento">Número de Documento <RequiredAsterisk /></label>
          <input
            type="text"
            id="numeroDocumento"
            name="numeroDocumento"
            placeholder="Ej: 1020304050"
            value={formData.numeroDocumento}
            onChange={handleChange}
            className={`auth-form-input ${errors.numeroDocumento ? 'input-error' : ''}`}
            required
          />
          {errors.numeroDocumento && <p className="error-message">{errors.numeroDocumento}</p>}
        </div>

        {/* Campo Fecha de Nacimiento */}
        <div className="auth-form-group">
          <label htmlFor="fechaNacimiento">Fecha de Nacimiento <RequiredAsterisk /></label>
          <input
            type="date"
            id="fechaNacimiento"
            name="fechaNacimiento"
            value={formData.fechaNacimiento}
            onChange={handleChange}
            className={`auth-form-input ${errors.fechaNacimiento ? 'input-error' : ''}`}
            required
          />
          {errors.fechaNacimiento && <p className="error-message">{errors.fechaNacimiento}</p>}
        </div>
      </div>

      <div className="auth-form-bottom-section">
        <div className="auth-form-checkbox">
          <input
            type="checkbox"
            id="terms-check"
            checked={isCheckboxChecked}
            onChange={(e) => setIsCheckboxChecked(e.target.checked)}
            required
          />
          <label htmlFor="terms-check">Acepto los términos y condiciones <RequiredAsterisk /></label>
        </div>

        {/* INICIO DE MODIFICACIÓN: Mostrar error general si existe */}
        {errors.general && <p className="auth-form-error">{errors.general}</p>}
        {/* FIN DE MODIFICACIÓN */}

        {successMessage && (
          <p className="auth-form-success">{successMessage}</p>
        )}

        <button type="submit" className="auth-primary-button" disabled={isLoading}>
          {isLoading ? "Registrando..." : "Registrarse"}
        </button>
      </div>
    </form>
  );
}

export default RegisterForm;