// src/features/clientes/components/ClienteForm.jsx
import React, { useState, useEffect } from 'react';
import "../css/Clientes.css";

const TIPOS_DOCUMENTO = ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de Identidad'];

const ClienteForm = ({ formData, onFormChange, isEditing, formErrors: initialFormErrors }) => {
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    setErrors(initialFormErrors || {});
  }, [initialFormErrors]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "nombre":
      case "apellido":
      case "telefono":
      case "numeroDocumento":
        if (!value) error = "Este campo es obligatorio.";
        break;
      case "direccion":
        if (!value) error = "La dirección es obligatoria.";
        break;
      case "correo":
        if (!value) {
          error = "El correo es obligatorio.";
        } else if (!/\S+@\S+\.\S+/.test(value)) {
          error = "El formato del correo no es válido.";
        }
        break;
      case "contrasena":
        if (!isEditing && !value) {
          error = "La contraseña es obligatoria.";
        } else if (!isEditing && value.length < 8) {
          error = "La contraseña debe tener al menos 8 caracteres.";
        } else if (!isEditing && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(value)) {
          error = "Debe incluir mayúscula, minúscula, número y símbolo.";
        }
        break;
      case "confirmPassword":
        if (!isEditing && value !== formData.contrasena) {
          error = "Las contraseñas no coinciden.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    onFormChange(name, fieldValue);

    const error = validateField(name, fieldValue);
    setErrors(prev => ({ ...prev, [name]: error }));

    if (name === 'contrasena' && formData.confirmPassword) {
      const confirmError = validateField('confirmPassword', formData.confirmPassword);
      setErrors(prev => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const showError = (name) => touched[name] && errors[name];

  return (
    <div className="clientes-form-grid">
      <div className="clientes-form-group">
        <label htmlFor="nombre">Nombre: <span className="required-asterisk">*</span></label>
        <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} onBlur={handleBlur} placeholder="Nombre" required className={showError('nombre') ? 'input-error' : ''} />
        {showError('nombre') && <p className="error-message">{errors.nombre}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="apellido">Apellido: <span className="required-asterisk">*</span></label>
        <input type="text" id="apellido" name="apellido" value={formData.apellido || ''} onChange={handleChange} onBlur={handleBlur} placeholder="Apellido" required className={showError('apellido') ? 'input-error' : ''} />
        {showError('apellido') && <p className="error-message">{errors.apellido}</p>}
      </div>

      <div className="clientes-form-group-full-width">
        <label htmlFor="correo">Correo: <span className="required-asterisk">*</span></label>
        <input type="email" id="correo" name="correo" value={formData.correo || ''} onChange={handleChange} onBlur={handleBlur} placeholder="Correo electrónico" required className={showError('correo') ? 'input-error' : ''} />
        {showError('correo') && <p className="error-message">{errors.correo}</p>}
      </div>

      <div className="clientes-form-group-full-width">
        <label htmlFor="direccion">Dirección: <span className="required-asterisk">*</span></label>
        <input type="text" id="direccion" name="direccion" value={formData.direccion || ''} onChange={handleChange} onBlur={handleBlur} placeholder="Dirección" required className={showError('direccion') ? 'input-error' : ''} />
        {showError('direccion') && <p className="error-message">{errors.direccion}</p>}
      </div>

      <div className="clientes-form-group">
        <label htmlFor="telefono">Teléfono: <span className="required-asterisk">*</span></label>
        <input type="text" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleChange} onBlur={handleBlur} placeholder="Teléfono" required className={showError('telefono') ? 'input-error' : ''} />
        {showError('telefono') && <p className="error-message">{errors.telefono}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="tipoDocumento">Tipo de Documento: <span className="required-asterisk">*</span></label>
        <select id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento || ''} onChange={handleChange} onBlur={handleBlur} required className={showError('tipoDocumento') ? 'input-error' : ''}>
          <option value="" disabled>Seleccione un tipo</option>
          {TIPOS_DOCUMENTO.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
        </select>
        {showError('tipoDocumento') && <p className="error-message">{errors.tipoDocumento}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="numeroDocumento">Número de Documento: <span className="required-asterisk">*</span></label>
        <input type="text" id="numeroDocumento" name="numeroDocumento" value={formData.numeroDocumento || ''} onChange={handleChange} onBlur={handleBlur} placeholder="Número de Documento" required className={showError('numeroDocumento') ? 'input-error' : ''} />
        {showError('numeroDocumento') && <p className="error-message">{errors.numeroDocumento}</p>}
      </div>

      <div className="clientes-form-group">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento: <span className="required-asterisk">*</span></label>
        <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento || ''} onChange={handleChange} onBlur={handleBlur} required className={showError('fechaNacimiento') ? 'input-error' : ''} />
        {showError('fechaNacimiento') && <p className="error-message">{errors.fechaNacimiento}</p>}
      </div>

      {!isEditing && (
        <>
          <div className="clientes-form-group">
            <label htmlFor="contrasena">Contraseña: <span className="required-asterisk">*</span></label>
            <input type="password" id="contrasena" name="contrasena" value={formData.contrasena || ''} onChange={handleChange} onBlur={handleBlur} placeholder="Contraseña" required className={showError('contrasena') ? 'input-error' : ''} />
            {showError('contrasena') && <p className="error-message">{errors.contrasena}</p>}
          </div>

          <div className="clientes-form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña: <span className="required-asterisk">*</span></label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword || ''} onChange={handleChange} onBlur={handleBlur} placeholder="Confirmar Contraseña" required className={showError('confirmPassword') ? 'input-error' : ''} />
            {showError('confirmPassword') && <p className="error-message">{errors.confirmPassword}</p>}
          </div>
        </>
      )}

      {isEditing && (
        <div className="clientes-form-group">
          <label className="clientes-form-label">Estado (Activo):</label>
          <label className="switch">
            <input
              type="checkbox"
              name="estado"
              checked={formData.estado || false}
              onChange={(e) => onFormChange('estado', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
          {errors.estado && <p className="error-message">{errors.estado}</p>}
        </div>
      )}
    </div>
  );
};

export default ClienteForm;