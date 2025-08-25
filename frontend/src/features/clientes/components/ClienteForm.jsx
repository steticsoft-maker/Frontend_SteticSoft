// src/features/clientes/components/ClienteForm.jsx
import React from 'react';
import "../css/Clientes.css";

const TIPOS_DOCUMENTO = ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de Identidad'];

const ClienteForm = ({ formData, onFormChange, onBlur, isEditing, errors }) => {

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;
    onFormChange(name, fieldValue);
  };

  return (
    <div className="clientes-form-grid">
      <div className="clientes-form-group">
        <label htmlFor="nombre">Nombre: <span className="required-asterisk">*</span></label>
        <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} onBlur={onBlur} placeholder="Nombre" required className={errors?.nombre ? 'input-error' : ''} />
        {errors?.nombre && <p className="error-message">{errors.nombre}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="apellido">Apellido: <span className="required-asterisk">*</span></label>
        <input type="text" id="apellido" name="apellido" value={formData.apellido || ''} onChange={handleChange} onBlur={onBlur} placeholder="Apellido" required className={errors?.apellido ? 'input-error' : ''} />
        {errors?.apellido && <p className="error-message">{errors.apellido}</p>}
      </div>

      <div className="clientes-form-group-full-width">
        <label htmlFor="correo">Correo: <span className="required-asterisk">*</span></label>
        <input type="email" id="correo" name="correo" value={formData.correo || ''} onChange={handleChange} onBlur={onBlur} placeholder="Correo electrónico" required className={errors?.correo ? 'input-error' : ''} />
        {errors?.correo && <p className="error-message">{errors.correo}</p>}
      </div>

      <div className="clientes-form-group-full-width">
        <label htmlFor="direccion">Dirección: <span className="required-asterisk">*</span></label>
        <input type="text" id="direccion" name="direccion" value={formData.direccion || ''} onChange={handleChange} onBlur={onBlur} placeholder="Dirección" required className={errors?.direccion ? 'input-error' : ''} />
        {errors?.direccion && <p className="error-message">{errors.direccion}</p>}
      </div>

      <div className="clientes-form-group">
        <label htmlFor="telefono">Teléfono: <span className="required-asterisk">*</span></label>
        <input type="text" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleChange} onBlur={onBlur} placeholder="Teléfono" required className={errors?.telefono ? 'input-error' : ''} />
        {errors?.telefono && <p className="error-message">{errors.telefono}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="tipoDocumento">Tipo de Documento: <span className="required-asterisk">*</span></label>
        <select id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento || ''} onChange={handleChange} onBlur={onBlur} required className={errors?.tipoDocumento ? 'input-error' : ''}>
          <option value="" disabled>Seleccione un tipo</option>
          {TIPOS_DOCUMENTO.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
        </select>
        {errors?.tipoDocumento && <p className="error-message">{errors.tipoDocumento}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="numeroDocumento">Número de Documento: <span className="required-asterisk">*</span></label>
        <input type="text" id="numeroDocumento" name="numeroDocumento" value={formData.numeroDocumento || ''} onChange={handleChange} onBlur={onBlur} placeholder="Número de Documento" required className={errors?.numeroDocumento ? 'input-error' : ''} />
        {errors?.numeroDocumento && <p className="error-message">{errors.numeroDocumento}</p>}
      </div>

      <div className="clientes-form-group">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento: <span className="required-asterisk">*</span></label>
        <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento || ''} onChange={handleChange} onBlur={onBlur} required className={errors?.fechaNacimiento ? 'input-error' : ''} />
        {errors?.fechaNacimiento && <p className="error-message">{errors.fechaNacimiento}</p>}
      </div>

      {!isEditing && (
        <>
          <div className="clientes-form-group">
            <label htmlFor="contrasena">Contraseña: <span className="required-asterisk">*</span></label>
            <input type="password" id="contrasena" name="contrasena" value={formData.contrasena || ''} onChange={handleChange} onBlur={onBlur} placeholder="Contraseña" required className={errors?.contrasena ? 'input-error' : ''} />
            {errors?.contrasena && <p className="error-message">{errors.contrasena}</p>}
          </div>

          <div className="clientes-form-group">
            <label htmlFor="confirmPassword">Confirmar Contraseña: <span className="required-asterisk">*</span></label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword || ''} onChange={handleChange} onBlur={onBlur} placeholder="Confirmar Contraseña" required className={errors?.confirmPassword ? 'input-error' : ''} />
            {errors?.confirmPassword && <p className="error-message">{errors.confirmPassword}</p>}
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
          {errors?.estado && <p className="error-message">{errors.estado}</p>}
        </div>
      )}
    </div>
  );
};

export default ClienteForm;