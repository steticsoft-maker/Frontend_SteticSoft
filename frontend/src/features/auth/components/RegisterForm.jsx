// src/features/auth/components/RegisterForm.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import PasswordInput from "../../../shared/components/PasswordInput/PasswordInput";
import "../css/Auth.css"; // Estilos comunes
import "../css/RegisterStyles.css"; // Estilos específicos del registro

function RegisterForm({ onSubmit, error, successMessage, isLoading }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    contrasena: "",
    telefono: "",
    tipoDocumento: "",
    numeroDocumento: "",
    fechaNacimiento: "",
    direccion: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCheckboxChecked, setIsCheckboxChecked] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // Expresiones regulares para validación
  const nameRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
  const numericOnlyRegex = /^\d+$/;
  const alphanumericRegex = /^[a-zA-Z0-9]+$/;
  const addressRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.,#\-_]+$/;

  const validateField = (name, value) => {
    let error = "";
    
    switch (name) {
      case "nombre":
      case "apellido":
        if (!value) error = `El ${name} es obligatorio.`;
        else if (!nameRegex.test(value)) error = `El ${name} solo puede contener letras y espacios.`;
        else if (value.length < 2 || value.length > 100) error = `Debe tener entre 2 y 100 caracteres.`;
        break;
      case "correo":
        if (!value) error = "El correo electrónico es obligatorio.";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Debe proporcionar un correo electrónico válido.";
        break;
      case "contrasena":
        if (!value) error = "La contraseña es obligatoria.";
        else if (value.length < 8) error = "La contraseña debe tener al menos 8 caracteres.";
        else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,;?¡¿"'(){}[\]\-_+=|\\/°¬~`´¨´`+*çÇªº]).{8,}$/.test(value)) {
          error = "La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial.";
        }
        break;
      case "telefono":
        if (!value) error = "El teléfono es obligatorio.";
        else if (!numericOnlyRegex.test(value)) error = "El teléfono solo debe contener números.";
        else if (value.length < 7 || value.length > 15) error = "Debe tener entre 7 y 15 dígitos.";
        break;
      case "numeroDocumento":
        if (!value) error = "El número de documento es obligatorio.";
        else {
          const docType = formData.tipoDocumento;
          if (docType === "Cédula de Ciudadanía" || docType === "Cédula de Extranjería") {
            if (!numericOnlyRegex.test(value)) error = "Para este tipo de documento, ingrese solo números.";
          } else if (docType === "Pasaporte") {
            if (!alphanumericRegex.test(value)) error = "Para Pasaporte, ingrese solo letras y números.";
          }
          if (!error && (value.length < 5 || value.length > 20)) {
            error = "Debe tener entre 5 y 20 caracteres.";
          }
        }
        break;
      case "fechaNacimiento":
        if (!value) error = "La fecha de nacimiento es obligatoria.";
        else {
          const birthDate = new Date(`${value}T00:00:00`);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          
          if (isNaN(birthDate.getTime())) {
            error = "La fecha ingresada no es válida.";
          } else if (birthDate > today) {
            error = "La fecha de nacimiento no puede ser una fecha futura.";
          } else {
            let age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }
            if (age < 18) {
              error = "El usuario debe ser mayor de 18 años.";
            }
          }
        }
        break;
      case "direccion":
        if (!value) error = "La dirección es obligatoria.";
        else if (!addressRegex.test(value)) error = "La dirección contiene caracteres no permitidos.";
        else if (value.length < 5 || value.length > 255) error = "La dirección debe tener entre 5 y 255 caracteres.";
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Validar campo en tiempo real
    const error = validateField(name, value);
    setFieldErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError("");

    // Validar todos los campos
    const newFieldErrors = {};
    let hasErrors = false;

    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newFieldErrors[key] = error;
        hasErrors = true;
      }
    });

    // Validar confirmación de contraseña
    if (!confirmPassword) {
      newFieldErrors.confirmPassword = "Por favor, confirma tu contraseña.";
      hasErrors = true;
    } else if (formData.contrasena !== confirmPassword) {
      newFieldErrors.confirmPassword = "Las contraseñas no coinciden.";
      hasErrors = true;
    }

    setFieldErrors(newFieldErrors);

    if (hasErrors) {
      setFormError("Por favor, corrige los errores en el formulario.");
      return;
    }

    if (!isCheckboxChecked) {
      setFormError("Debes aceptar los términos y condiciones.");
      return;
    }

    onSubmit(formData);
  };

  // Componente para el asterisco rojo
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
            className={`auth-form-input ${fieldErrors.nombre ? "input-error" : ""}`}
            required
          />
          {fieldErrors.nombre && <span className="error-message">{fieldErrors.nombre}</span>}
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
            className={`auth-form-input ${fieldErrors.apellido ? "input-error" : ""}`}
            required
          />
          {fieldErrors.apellido && <span className="error-message">{fieldErrors.apellido}</span>}
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
            className={`auth-form-input ${fieldErrors.correo ? "input-error" : ""}`}
            required
          />
          {fieldErrors.correo && <span className="error-message">{fieldErrors.correo}</span>}
        </div>

        {/* Campo Contraseña */}
        <div className="auth-form-group">
          <label htmlFor="contrasena">Contraseña <RequiredAsterisk /></label>
          <PasswordInput
            name="contrasena"
            value={formData.contrasena}
            onChange={handleChange}
            className={`auth-form-input ${fieldErrors.contrasena ? "input-error" : ""}`}
            required
            helpText="Mín 8 caract, 1 Mayús, 1 minús, 1 núm, 1 símb"
          />
          {fieldErrors.contrasena && <span className="error-message">{fieldErrors.contrasena}</span>}
        </div>

        {/* Campo Confirmar Contraseña */}
        <div className="auth-form-group">
          <label htmlFor="confirmPassword">Confirmar Contraseña <RequiredAsterisk /></label>
          <PasswordInput
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={`auth-form-input ${fieldErrors.confirmPassword ? "input-error" : ""}`}
            required
          />
          {fieldErrors.confirmPassword && <span className="error-message">{fieldErrors.confirmPassword}</span>}
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
            className={`auth-form-input ${fieldErrors.telefono ? "input-error" : ""}`}
            required
          />
          {fieldErrors.telefono && <span className="error-message">{fieldErrors.telefono}</span>}
        </div>

        {/* Campo Tipo de Documento */}
        <div className="auth-form-group">
          <label htmlFor="tipoDocumento">Tipo de Documento <RequiredAsterisk /></label>
          <select
            id="tipoDocumento"
            name="tipoDocumento"
            value={formData.tipoDocumento}
            onChange={handleChange}
            className={`auth-form-input ${fieldErrors.tipoDocumento ? "input-error" : ""}`}
            required
          >
            <option value="" disabled>Selecciona un tipo...</option>
            <option value="Cédula de Ciudadanía">Cédula de Ciudadanía</option>
            <option value="Cédula de Extranjería">Cédula de Extranjería</option>
            <option value="Pasaporte">Pasaporte</option>
            <option value="Tarjeta de Identidad">Tarjeta de Identidad</option>
          </select>
          {fieldErrors.tipoDocumento && <span className="error-message">{fieldErrors.tipoDocumento}</span>}
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
            className={`auth-form-input ${fieldErrors.numeroDocumento ? "input-error" : ""}`}
            required
          />
          {fieldErrors.numeroDocumento && <span className="error-message">{fieldErrors.numeroDocumento}</span>}
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
            className={`auth-form-input ${fieldErrors.fechaNacimiento ? "input-error" : ""}`}
            required
            max={new Date().toISOString().split("T")[0]}
          />
          {fieldErrors.fechaNacimiento && <span className="error-message">{fieldErrors.fechaNacimiento}</span>}
        </div>

        {/* Campo Dirección */}
        <div className="auth-form-group">
          <label htmlFor="direccion">Dirección <RequiredAsterisk /></label>
          <input
            type="text"
            id="direccion"
            name="direccion"
            placeholder="Ej: Calle 5 # 4-3"
            value={formData.direccion}
            onChange={handleChange}
            className={`auth-form-input ${fieldErrors.direccion ? "input-error" : ""}`}
            required
          />
          {fieldErrors.direccion && <span className="error-message">{fieldErrors.direccion}</span>}
        </div>
      </div>

      <div className="auth-form-bottom-section">
        <div className="auth-form-checkbox">
          <input
            type="checkbox"
            id="terms-check" // El label ya tiene htmlFor="terms-check"
            checked={isCheckboxChecked}
            onChange={(e) => setIsCheckboxChecked(e.target.checked)}
            required
          />
          <label htmlFor="terms-check">Acepto los términos y condiciones <RequiredAsterisk /></label>
        </div>

        {formError && <p className="auth-form-error">{formError}</p>}
        {error && <p className="auth-form-error">{error}</p>}
        {successMessage && (
          <p className="auth-form-success">{successMessage}</p>
        )}

        <div className="auth-form-actions">
          <button type="submit" className="auth-primary-button" disabled={isLoading}>
            {isLoading ? "Registrando..." : "Registrarse"}
          </button>
          <Link to="/" className="auth-secondary-button">
            Regresar
          </Link>
        </div>
      </div>
    </form>
  );
}

export default RegisterForm;