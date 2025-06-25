// src/features/clientes/components/ClienteForm.jsx
import React from 'react';

// Los tipos de documento DEBEN coincidir exactamente con los valores permitidos en el backend
// (src/shared/src_api/validators/cliente.validators.js -> isIn)
const TIPOS_DOCUMENTO = ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de Identidad'];
// Si necesitas "NIT", asegúrate de añadirlo también en el backend validator.

const ClienteForm = ({ formData, onFormChange, isEditing, formErrors, onFieldBlur }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === 'checkbox' ? checked : value);
  };

  const handleBlurEvent = (e) => {
    const { name, value } = e.target;
    if (onFieldBlur) {
      onFieldBlur(name, value);
    }
  };

  return (
    <div className="clientes-form-grid">
      <div className="clientes-form-group">
        <label htmlFor="nombre">Nombre: <span className="required-asterisk">*</span></label>
        <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} placeholder="Nombre" required />
        {formErrors.nombre && <p className="error-message">{formErrors.nombre}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="apellido">Apellido: <span className="required-asterisk">*</span></label>
        <input type="text" id="apellido" name="apellido" value={formData.apellido || ''} onChange={handleChange} placeholder="Apellido" required />
        {formErrors.apellido && <p className="error-message">{formErrors.apellido}</p>}
      </div>
      <div className="clientes-form-group">
        {/* Cambiado de 'email' a 'correo' para coincidir con el backend */}
        <label htmlFor="correo">Correo: <span className="required-asterisk">*</span></label>
        <input type="email" id="correo" name="correo" value={formData.correo || ''} onChange={handleChange} onBlur={handleBlurEvent} placeholder="Correo electrónico" required />
        {formErrors.correo && <p className="error-message">{formErrors.correo}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="telefono">Teléfono: <span className="required-asterisk">*</span></label>
        <input type="text" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleChange} placeholder="Teléfono" required />
        {formErrors.telefono && <p className="error-message">{formErrors.telefono}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="tipoDocumento">Tipo de Documento: <span className="required-asterisk">*</span></label>
        <select id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento || ''} onChange={handleChange} required>
          <option value="" disabled>Seleccione un tipo</option>
          {TIPOS_DOCUMENTO.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
        </select>
        {formErrors.tipoDocumento && <p className="error-message">{formErrors.tipoDocumento}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="numeroDocumento">Número de Documento: <span className="required-asterisk">*</span></label>
        <input type="text" id="numeroDocumento" name="numeroDocumento" value={formData.numeroDocumento || ''} onChange={handleChange} onBlur={handleBlurEvent} placeholder="Número de Documento" required />
        {formErrors.numeroDocumento && <p className="error-message">{formErrors.numeroDocumento}</p>}
      </div>

      <div className="clientes-form-group">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento: <span className="required-asterisk">*</span></label>
        <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento || ''} onChange={handleChange} required />
        {formErrors.fechaNacimiento && <p className="error-message">{formErrors.fechaNacimiento}</p>}
      </div>

      {/* --- SECCIÓN DE CONTRASEÑA MODIFICADA --- */}
      {/* Solo se muestran al crear un nuevo cliente */}
      {!isEditing && (
        <>
          <div className="clientes-form-group">
            {/* Cambiado de 'password' a 'contrasena' para coincidir con el backend */}
            <label htmlFor="contrasena">Contraseña: <span className="required-asterisk">*</span></label>
            <input type="password" id="contrasena" name="contrasena" value={formData.contrasena || ''} onChange={handleChange} placeholder="Contraseña" required />
            {formErrors.contrasena && <p className="error-message">{formErrors.contrasena}</p>}
          </div>

          {/* CAMPO AGREGADO: Confirmar Contraseña (validación solo de frontend) */}
          <div className="clientes-form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña: <span className="required-asterisk">*</span></label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword || ''} onChange={handleChange} placeholder="Confirmar Contraseña" required />
            {formErrors.confirmPassword && <p className="error-message">{formErrors.confirmPassword}</p>}
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
              checked={formData.estado || false} // Asegurarse que tenga un valor booleano
              onChange={(e) => onFormChange('estado', e.target.checked)}
            />
            <span className="slider"></span>
          </label>
          {formErrors.estado && <p className="error-message">{formErrors.estado}</p>}
        </div>
      )}
    </div>
  );
};

export default ClienteForm;