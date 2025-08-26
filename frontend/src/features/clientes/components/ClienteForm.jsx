// src/features/clientes/components/ClienteForm.jsx
import React from 'react';
import "../css/Clientes.css";

const TIPOS_DOCUMENTO = ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de Identidad'];

const ClienteForm = ({
    formData,
    onFormChange,
    onBlur,
    isEditing,
    formErrors,
    touchedFields = {},
    isVerifying
}) => {

  const handleChange = (e) => {
    onFormChange(e);
  };

  const showError = (name) => touchedFields[name] && formErrors[name];

  return (
    <div className="clientes-form-grid">
      <div className="clientes-form-group">
        <label htmlFor="nombre">Nombre: <span className="required-asterisk">*</span></label>
        <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} onBlur={onBlur} placeholder="Nombre" required className={showError('nombre') ? 'input-error' : ''} />
        {showError('nombre') && <p className="error-message">{formErrors.nombre}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="apellido">Apellido: <span className="required-asterisk">*</span></label>
        <input type="text" id="apellido" name="apellido" value={formData.apellido || ''} onChange={handleChange} onBlur={onBlur} placeholder="Apellido" required className={showError('apellido') ? 'input-error' : ''} />
        {showError('apellido') && <p className="error-message">{formErrors.apellido}</p>}
      </div>

      <div className="clientes-form-group-full-width">
        <label htmlFor="correo">Correo: <span className="required-asterisk">*</span></label>
        <input type="email" id="correo" name="correo" value={formData.correo || ''} onChange={handleChange} onBlur={onBlur} placeholder="Correo electrónico" required className={showError('correo') ? 'input-error' : ''} disabled={isVerifying} />
        {isVerifying && formErrors.correo?.includes("Verificando") && <p className="verifying-message">{formErrors.correo}</p>}
        {showError('correo') && !formErrors.correo?.includes("Verificando") && <p className="error-message">{formErrors.correo}</p>}
      </div>

      <div className="clientes-form-group-full-width">
        <label htmlFor="direccion">Dirección: <span className="required-asterisk">*</span></label>
        <input type="text" id="direccion" name="direccion" value={formData.direccion || ''} onChange={handleChange} onBlur={onBlur} placeholder="Dirección" required className={showError('direccion') ? 'input-error' : ''} />
        {showError('direccion') && <p className="error-message">{formErrors.direccion}</p>}
      </div>

      <div className="clientes-form-group">
        <label htmlFor="telefono">Teléfono: <span className="required-asterisk">*</span></label>
        <input type="text" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleChange} onBlur={onBlur} placeholder="Teléfono" required className={showError('telefono') ? 'input-error' : ''} />
        {showError('telefono') && <p className="error-message">{formErrors.telefono}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="tipoDocumento">Tipo de Documento: <span className="required-asterisk">*</span></label>
        <select id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento || ''} onChange={handleChange} onBlur={onBlur} required className={showError('tipoDocumento') ? 'input-error' : ''}>
          <option value="" disabled>Seleccione un tipo</option>
          {TIPOS_DOCUMENTO.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
        </select>
        {showError('tipoDocumento') && <p className="error-message">{formErrors.tipoDocumento}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="numeroDocumento">Número de Documento: <span className="required-asterisk">*</span></label>
        <input type="text" id="numeroDocumento" name="numeroDocumento" value={formData.numeroDocumento || ''} onChange={handleChange} onBlur={onBlur} placeholder="Número de Documento" required className={showError('numeroDocumento') ? 'input-error' : ''} disabled={isVerifying} />
        {isVerifying && formErrors.numeroDocumento?.includes("Verificando") && <p className="verifying-message">{formErrors.numeroDocumento}</p>}
        {showError('numeroDocumento') && !formErrors.numeroDocumento?.includes("Verificando") && <p className="error-message">{formErrors.numeroDocumento}</p>}
      </div>

      <div className="clientes-form-group">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento: <span className="required-asterisk">*</span></label>
        <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento || ''} onChange={handleChange} onBlur={onBlur} required className={showError('fechaNacimiento') ? 'input-error' : ''} />
        {showError('fechaNacimiento') && <p className="error-message">{formErrors.fechaNacimiento}</p>}
      </div>

      {!isEditing && (
        <>
          <div className="clientes-form-group">
            <label htmlFor="contrasena">Contraseña: <span className="required-asterisk">*</span></label>
            <input type="password" id="contrasena" name="contrasena" value={formData.contrasena || ''} onChange={handleChange} onBlur={onBlur} placeholder="Contraseña" required className={showError('contrasena') ? 'input-error' : ''} />
            {showError('contrasena') && <p className="error-message">{formErrors.contrasena}</p>}
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
              onChange={handleChange}
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