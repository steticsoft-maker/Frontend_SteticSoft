import React from 'react';

const ProveedorForm = ({ formData, onFormChange, onBlur, isEditing, errors = {} }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // --- CORRECCIÓN DEFINITIVA APLICADA AQUÍ ---
    // Ahora, para el checkbox, enviamos un valor booleano (true/false).
    // Esto previene la corrupción de datos que causaba la URL inválida.
    onFormChange(name, type === 'checkbox' ? checked : value);
  };

  const handleTipoProveedorChange = (e) => {
    onFormChange('tipo', e.target.value);
  };

  return (
    <>
      {/* Columna 1 */}
      <div className="proveedores-form-group">
        <label htmlFor="tipo">Tipo de Proveedor: <span className="required-asterisk">*</span></label>
        <select id="tipo" name="tipo" value={formData.tipo || "Natural"} onChange={handleTipoProveedorChange} onBlur={onBlur}>
          <option value="Natural">Natural</option>
          <option value="Juridico">Jurídico</option>
        </select>
      </div>

      {/* --- Título de la Segunda Columna (se posicionará con grid) --- */}
      <div className="form-section-title-container">
        <h4>Datos de la Persona Encargada</h4>
      </div>
      
      {/* Columna 1 */}
      {formData.tipo === "Natural" ? (
        <div className="proveedores-form-group">
          <label htmlFor="nombre">Nombre Completo: <span className="required-asterisk">*</span></label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} onBlur={onBlur} className={errors.nombre ? 'is-invalid' : ''} />
          {errors.nombre && <p className="error-proveedores">{errors.nombre}</p>}
        </div>
      ) : (
        <div className="proveedores-form-group">
          <label htmlFor="nombre">Razón Social: <span className="required-asterisk">*</span></label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} onBlur={onBlur} className={errors.nombre ? 'is-invalid' : ''} />
          {errors.nombre && <p className="error-proveedores">{errors.nombre}</p>}
        </div>
      )}

      {/* Columna 2 */}
      <div className="proveedores-form-group">
        <label htmlFor="nombrePersonaEncargada">Nombre Encargado: <span className="required-asterisk">*</span></label>
        <input type="text" id="nombrePersonaEncargada" name="nombrePersonaEncargada" value={formData.nombrePersonaEncargada || ''} onChange={handleChange} onBlur={onBlur} className={errors.nombrePersonaEncargada ? 'is-invalid' : ''} />
        {errors.nombrePersonaEncargada && <p className="error-proveedores">{errors.nombrePersonaEncargada}</p>}
      </div>

      {/* Columna 1 */}
      {formData.tipo === "Natural" ? (
        <div className="proveedores-form-group">
          <label>Documento de Identidad: <span className="required-asterisk">*</span></label>
          <div className="documento-container">
            <select name="tipoDocumento" value={formData.tipoDocumento || "CC"} onChange={handleChange} className="select-tipo-documento">
              <option value="CC">CC</option>
              <option value="CE">CE</option>
            </select>
            <input type="text" name="numeroDocumento" value={formData.numeroDocumento || ''} onChange={handleChange} onBlur={onBlur} placeholder="Número" className={`input-documento ${errors.numeroDocumento ? 'is-invalid' : ''}`} />
          </div>
          {errors.numeroDocumento && <p className="error-proveedores">{errors.numeroDocumento}</p>}
        </div>
      ) : (
        <div className="proveedores-form-group">
          <label htmlFor="nitEmpresa">NIT: <span className="required-asterisk">*</span></label>
          <input type="text" id="nitEmpresa" name="nitEmpresa" value={formData.nitEmpresa || ''} onChange={handleChange} onBlur={onBlur} placeholder="123456789-0" className={errors.nitEmpresa ? 'is-invalid' : ''} />
          {errors.nitEmpresa && <p className="error-proveedores">{errors.nitEmpresa}</p>}
        </div>
      )}

      {/* Columna 2 */}
      <div className="proveedores-form-group">
        <label htmlFor="telefonoPersonaEncargada">Teléfono Encargado: <span className="required-asterisk">*</span></label>
        <input type="tel" id="telefonoPersonaEncargada" name="telefonoPersonaEncargada" value={formData.telefonoPersonaEncargada || ''} onChange={handleChange} onBlur={onBlur} className={errors.telefonoPersonaEncargada ? 'is-invalid' : ''} />
        {errors.telefonoPersonaEncargada && <p className="error-proveedores">{errors.telefonoPersonaEncargada}</p>}
      </div>

      {/* Columna 1 */}
      <div className="proveedores-form-group">
        <label htmlFor="telefono">Teléfono Principal: <span className="required-asterisk">*</span></label>
        <input type="tel" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleChange} onBlur={onBlur} className={errors.telefono ? 'is-invalid' : ''} />
        {errors.telefono && <p className="error-proveedores">{errors.telefono}</p>}
      </div>

      {/* Columna 2 */}
      <div className="proveedores-form-group">
        <label htmlFor="emailPersonaEncargada">Email Encargado: <span className="required-asterisk">*</span></label>
        <input type="email" id="emailPersonaEncargada" name="emailPersonaEncargada" value={formData.emailPersonaEncargada || ''} onChange={handleChange} onBlur={onBlur} className={errors.emailPersonaEncargada ? 'is-invalid' : ''} />
        {errors.emailPersonaEncargada && <p className="error-proveedores">{errors.emailPersonaEncargada}</p>}
      </div>

      {/* Columna 1 */}
      <div className="proveedores-form-group">
        <label htmlFor="correo">Email Principal: <span className="required-asterisk">*</span></label>
        <input type="email" id="correo" name="correo" value={formData.correo || ''} onChange={handleChange} onBlur={onBlur} className={errors.correo ? 'is-invalid' : ''} />
        {errors.correo && <p className="error-proveedores">{errors.correo}</p>}
      </div>

      {/* Columna 2 (Switch de estado) */}
      {isEditing && (
        <div className="proveedores-form-group">
          <label>Estado (Activo):</label>
          <label className="switch">
            <input type="checkbox" name="estado" checked={formData.estado === true} onChange={handleChange} />
            <span className="slider"></span>
          </label>
        </div>
      )}
      
      {/* Columna 1 (Dirección ocupa todo el ancho) */}
      <div className="proveedores-form-group form-full-width">
        <label htmlFor="direccion">Dirección: <span className="required-asterisk">*</span></label>
        <input type="text" id="direccion" name="direccion" value={formData.direccion || ''} onChange={handleChange} onBlur={onBlur} className={errors.direccion ? 'is-invalid' : ''} />
        {errors.direccion && <p className="error-proveedores">{errors.direccion}</p>}
      </div>
    </>
  );
};

export default ProveedorForm;