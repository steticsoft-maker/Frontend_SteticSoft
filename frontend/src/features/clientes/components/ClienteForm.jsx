// src/features/clientes/components/ClienteForm.jsx
import React from 'react';
import "../css/Clientes.css";
import PasswordInput from '../../../shared/components/PasswordInput/PasswordInput'; // Importar el componente reutilizable

const TIPOS_DOCUMENTO = ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de Identidad'];

const ClienteForm = ({ formData, onFormChange, onFormBlur, isEditing, formErrors }) => {
  return (
    <div className="clientes-form-grid">
      <div className="clientes-form-group">
        <label htmlFor="nombre">Nombre: <span className="required-asterisk">*</span></label>
        <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={onFormChange} onBlur={onFormBlur} placeholder="Nombre" required className={formErrors.nombre ? "input-error" : ""} />
        {formErrors.nombre && <p className="error-message">{formErrors.nombre}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="apellido">Apellido: <span className="required-asterisk">*</span></label>
        <input type="text" id="apellido" name="apellido" value={formData.apellido || ''} onChange={onFormChange} onBlur={onFormBlur} placeholder="Apellido" required className={formErrors.apellido ? "input-error" : ""} />
        {formErrors.apellido && <p className="error-message">{formErrors.apellido}</p>}
      </div>

      <div className="clientes-form-group-full-width">
        <label htmlFor="correo">Correo: <span className="required-asterisk">*</span></label>
        <input type="email" id="correo" name="correo" value={formData.correo || ''} onChange={onFormChange} onBlur={onFormBlur} placeholder="Correo electrónico" required className={formErrors.correo ? "input-error" : ""} />
        {formErrors.correo && <p className="error-message">{formErrors.correo}</p>}
      </div>

      <div className="clientes-form-group-full-width">
        <label htmlFor="direccion">Dirección:</label>
        <input type="text" id="direccion" name="direccion" value={formData.direccion || ''} onChange={onFormChange} onBlur={onFormBlur} placeholder="Dirección" className={formErrors.direccion ? "input-error" : ""} />
        {formErrors.direccion && <p className="error-message">{formErrors.direccion}</p>}
      </div>

      <div className="clientes-form-group">
        <label htmlFor="telefono">Teléfono: <span className="required-asterisk">*</span></label>
        <input type="text" id="telefono" name="telefono" value={formData.telefono || ''} onChange={onFormChange} onBlur={onFormBlur} placeholder="Teléfono" required className={formErrors.telefono ? "input-error" : ""} />
        {formErrors.telefono && <p className="error-message">{formErrors.telefono}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="tipoDocumento">Tipo de Documento: <span className="required-asterisk">*</span></label>
        <select id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento || ''} onChange={onFormChange} onBlur={onFormBlur} required className={formErrors.tipoDocumento ? "input-error" : ""}>
          <option value="" disabled>Seleccione un tipo</option>
          {TIPOS_DOCUMENTO.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
        </select>
        {formErrors.tipoDocumento && <p className="error-message">{formErrors.tipoDocumento}</p>}
      </div>
      <div className="clientes-form-group">
        <label htmlFor="numeroDocumento">Número de Documento: <span className="required-asterisk">*</span></label>
        <input type="text" id="numeroDocumento" name="numeroDocumento" value={formData.numeroDocumento || ''} onChange={onFormChange} onBlur={onFormBlur} placeholder="Número de Documento" required className={formErrors.numeroDocumento ? "input-error" : ""} />
        {formErrors.numeroDocumento && <p className="error-message">{formErrors.numeroDocumento}</p>}
      </div>

      <div className="clientes-form-group">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento: <span className="required-asterisk">*</span></label>
        <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento || ''} onChange={onFormChange} onBlur={onFormBlur} required className={formErrors.fechaNacimiento ? "input-error" : ""} />
        {formErrors.fechaNacimiento && <p className="error-message">{formErrors.fechaNacimiento}</p>}
      </div>

      {!isEditing && (
        <>
          <div className="clientes-form-group">
            <label htmlFor="contrasena">Contraseña: <span className="required-asterisk">*</span></label>
            <PasswordInput
              name="contrasena"
              value={formData.contrasena || ''}
              onChange={onFormChange}
              onBlur={onFormBlur}
              placeholder="Contraseña"
              required
              className={formErrors.contrasena ? "input-error" : ""}
            />
            {formErrors.contrasena && <p className="error-message">{formErrors.contrasena}</p>}
          </div>

          <div className="clientes-form-group">
            <label htmlFor="confirmarContrasena">Confirmar Contraseña: <span className="required-asterisk">*</span></label>
            <PasswordInput
              name="confirmarContrasena"
              value={formData.confirmarContrasena || ''}
              onChange={onFormChange}
              onBlur={onFormBlur}
              placeholder="Confirmar Contraseña"
              required
              className={formErrors.confirmarContrasena ? "input-error" : ""}
            />
            {formErrors.confirmarContrasena && <p className="error-message">{formErrors.confirmarContrasena}</p>}
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
              onChange={onFormChange}
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