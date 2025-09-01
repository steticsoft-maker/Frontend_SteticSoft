// src/features/clientes/components/ClienteForm.jsx
import React from 'react';
import "../css/Clientes.css";
import PasswordInput from '../../../shared/components/PasswordInput/PasswordInput'; // Importar el componente reutilizable

const TIPOS_DOCUMENTO = ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de Identidad'];

const ClienteForm = ({ formData, onFormChange, isEditing, formErrors }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <div className="clientes-form-grid">
      <div className="clientes-form-group">
        <label htmlFor="nombre">Nombre: <span className="required-asterisk">*</span></label>
        <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} placeholder="Nombre" required className={formErrors.nombre ? "input-error" : ""} />
        {formErrors.nombre && <p className="error-message">{formErrors.nombre}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="apellido">Apellido: <span className="required-asterisk">*</span></label>
        <input type="text" id="apellido" name="apellido" value={formData.apellido || ''} onChange={handleChange} placeholder="Apellido" required className={formErrors.apellido ? "input-error" : ""} />
        {formErrors.apellido && <p className="error-message">{formErrors.apellido}</p>}
      </div>

      <div className="clientes-form-group-full-width">
        <label htmlFor="correo">Correo: <span className="required-asterisk">*</span></label>
        <input type="email" id="correo" name="correo" value={formData.correo || ''} onChange={handleChange} placeholder="Correo electrónico" required className={formErrors.correo ? "input-error" : ""} />
        {formErrors.correo && <p className="error-message">{formErrors.correo}</p>}
      </div>

      <div className="clientes-form-group-full-width">
        <label htmlFor="direccion">Dirección:</label>
        <input type="text" id="direccion" name="direccion" value={formData.direccion || ''} onChange={handleChange} placeholder="Dirección" className={formErrors.direccion ? "input-error" : ""} />
        {formErrors.direccion && <p className="error-message">{formErrors.direccion}</p>}
      </div>

      <div className="clientes-form-group">
        <label htmlFor="telefono">Teléfono: <span className="required-asterisk">*</span></label>
        <input type="text" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleChange} placeholder="Teléfono" required className={formErrors.telefono ? "input-error" : ""} />
        {formErrors.telefono && <p className="error-message">{formErrors.telefono}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="tipoDocumento">Tipo de Documento: <span className="required-asterisk">*</span></label>
        <select id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento || ''} onChange={handleChange} required className={formErrors.tipoDocumento ? "input-error" : ""}>
          <option value="" disabled>Seleccione un tipo</option>
          {TIPOS_DOCUMENTO.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
        </select>
        {formErrors.tipoDocumento && <p className="error-message">{formErrors.tipoDocumento}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="numeroDocumento">Número de Documento: <span className="required-asterisk">*</span></label>
        <input type="text" id="numeroDocumento" name="numeroDocumento" value={formData.numeroDocumento || ''} onChange={handleChange} placeholder="Número de Documento" required className={formErrors.numeroDocumento ? "input-error" : ""} />
        {formErrors.numeroDocumento && <p className="error-message">{formErrors.numeroDocumento}</p>}
      </div>

      <div className="clientes-form-group">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento: <span className="required-asterisk">*</span></label>
        <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento || ''} onChange={handleChange} required className={formErrors.fechaNacimiento ? "input-error" : ""} />
        {formErrors.fechaNacimiento && <p className="error-message">{formErrors.fechaNacimiento}</p>}
      </div>

      {!isEditing && (
        <>
          <div className="clientes-form-group">
            <label htmlFor="contrasena">Contraseña: <span className="required-asterisk">*</span></label>
            <PasswordInput
              name="contrasena"
              value={formData.contrasena || ''}
              onChange={handleChange}
              placeholder="Contraseña"
              required
              className={formErrors.contrasena ? "input-error" : ""}
            />
            {formErrors.contrasena && <p className="error-message">{formErrors.contrasena}</p>}
          </div>

          <div className="clientes-form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña: <span className="required-asterisk">*</span></label>
            <PasswordInput
              name="confirmPassword"
              value={formData.confirmPassword || ''}
              onChange={handleChange}
              placeholder="Confirmar Contraseña"
              required
              className={formErrors.confirmPassword ? "input-error" : ""}
            />
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
              checked={formData.estado || false}
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