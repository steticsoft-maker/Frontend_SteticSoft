// INICIO DE MODIFICACIÓN
import React, { useState } from "react";
import "../css/Auth.css";
import "../css/RegisterStyles.css";

function RegisterForm({ onSubmit, errors, setErrors, successMessage, loading }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    telefono: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaNacimiento: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.contrasena !== confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: "Las contraseñas no coinciden." }));
      return;
    }
    if (!isCheckboxChecked) {
        setErrors((prev) => ({ ...prev, terms: "Debes aceptar los términos y condiciones." }));
        return;
    }
    onSubmit(formData);
  };

  const RequiredAsterisk = () => <span style={{ color: "red" }}>*</span>;

  return (
    <form className="auth-form-content" onSubmit={handleSubmit}>
      {errors.general && <p className="error-message">{errors.general}</p>}
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
            className={`auth-form-input ${errors.nombre ? 'input-error' : ''}`}
            required
          />
          {errors.nombre && <p className="error-message">{errors.nombre}</p>}
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
            placeholder="Mínimo 8 caracteres"
            value={formData.contrasena}
            onChange={handleChange}
            className={`auth-form-input ${errors.contrasena ? 'input-error' : ''}`}
            required
            minLength="8"
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
            onChange={handleConfirmPasswordChange}
            className={`auth-form-input ${errors.confirmPassword ? 'input-error' : ''}`}
            required
            minLength="8"
          />
          {errors.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
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
            <option value="" disabled>Selecciona un tipo...</option>
            <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
            <option value="Cédula de Extranjería">Cédula de Extranjería</option>
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
        {errors.terms && <p className="error-message">{errors.terms}</p>}

        {successMessage && (
          <p className="auth-form-success">{successMessage}</p>
        )}

        <button type="submit" className="auth-primary-button" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </div>
    </form>
  );
}
// FIN DE MODIFICACIÓN

export default RegisterForm;