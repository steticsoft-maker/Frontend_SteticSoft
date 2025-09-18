import React from 'react';
import '../../../shared/styles/admin-layout.css';

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
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Información del Proveedor</h3>
        <div className="admin-form-group">
          <label htmlFor="tipo" className="admin-form-label">
            Tipo de Proveedor: <span className="required-asterisk">*</span>
          </label>
          <select 
            id="tipo" 
            name="tipo" 
            value={formData.tipo || "Natural"} 
            onChange={handleTipoProveedorChange} 
            onBlur={onBlur} 
            className={`admin-form-select ${errors.tipo ? 'error' : ''}`}
          >
            <option value="Natural">Natural</option>
            <option value="Juridico">Jurídico</option>
          </select>
          {errors.tipo && (
            <span className="admin-form-error">{errors.tipo}</span>
          )}
        </div>
      </div>

      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Datos de la Persona Encargada</h3>
      
        <div className="admin-form-row-2">
          {formData.tipo === "Natural" ? (
            <div className="admin-form-group">
              <label htmlFor="nombre" className="admin-form-label">
                Nombre Completo: <span className="required-asterisk">*</span>
              </label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                value={formData.nombre || ''} 
                onChange={handleChange} 
                onBlur={onBlur} 
                className={`admin-form-input ${errors.nombre ? 'error' : ''}`} 
              />
              {errors.nombre && (
                <span className="admin-form-error">{errors.nombre}</span>
              )}
            </div>
          ) : (
            <div className="admin-form-group">
              <label htmlFor="nombre" className="admin-form-label">
                Razón Social: <span className="required-asterisk">*</span>
              </label>
              <input 
                type="text" 
                id="nombre" 
                name="nombre" 
                value={formData.nombre || ''} 
                onChange={handleChange} 
                onBlur={onBlur} 
                className={`admin-form-input ${errors.nombre ? 'error' : ''}`} 
              />
              {errors.nombre && (
                <span className="admin-form-error">{errors.nombre}</span>
              )}
            </div>
          )}

          <div className="admin-form-group">
            <label htmlFor="nombrePersonaEncargada" className="admin-form-label">
              Nombre Encargado: <span className="required-asterisk">*</span>
            </label>
            <input 
              type="text" 
              id="nombrePersonaEncargada" 
              name="nombrePersonaEncargada" 
              value={formData.nombrePersonaEncargada || ''} 
              onChange={handleChange} 
              onBlur={onBlur} 
              className={`admin-form-input ${errors.nombrePersonaEncargada ? 'error' : ''}`} 
            />
            {errors.nombrePersonaEncargada && (
              <span className="admin-form-error">{errors.nombrePersonaEncargada}</span>
            )}
          </div>
        </div>

        <div className="admin-form-row-2">
          {formData.tipo === "Natural" ? (
            <div className="admin-form-group">
              <label className="admin-form-label">
                Documento de Identidad: <span className="required-asterisk">*</span>
              </label>
              <div className="documento-container">
                <select name="tipoDocumento" value={formData.tipoDocumento || "CC"} onChange={handleChange} className="admin-form-select">
                  <option value="CC">CC</option>
                  <option value="CE">CE</option>
                </select>
                <input type="text" name="numeroDocumento" value={formData.numeroDocumento || ''} onChange={handleChange} onBlur={onBlur} placeholder="Número" className={`admin-form-input ${errors.numeroDocumento ? 'error' : ''}`} />
              </div>
              {errors.numeroDocumento && (
                <span className="admin-form-error">{errors.numeroDocumento}</span>
              )}
            </div>
          ) : (
            <div className="admin-form-group">
              <label htmlFor="nitEmpresa" className="admin-form-label">
                NIT: <span className="required-asterisk">*</span>
              </label>
              <input type="text" id="nitEmpresa" name="nitEmpresa" value={formData.nitEmpresa || ''} onChange={handleChange} onBlur={onBlur} placeholder="123456789-0" className={`admin-form-input ${errors.nitEmpresa ? 'error' : ''}`} />
              {errors.nitEmpresa && (
                <span className="admin-form-error">{errors.nitEmpresa}</span>
              )}
            </div>
          )}

          <div className="admin-form-group">
            <label htmlFor="telefonoPersonaEncargada" className="admin-form-label">
              Teléfono Encargado: <span className="required-asterisk">*</span>
            </label>
            <input type="tel" id="telefonoPersonaEncargada" name="telefonoPersonaEncargada" value={formData.telefonoPersonaEncargada || ''} onChange={handleChange} onBlur={onBlur} className={`admin-form-input ${errors.telefonoPersonaEncargada ? 'error' : ''}`} />
            {errors.telefonoPersonaEncargada && (
              <span className="admin-form-error">{errors.telefonoPersonaEncargada}</span>
            )}
          </div>
        </div>

        <div className="admin-form-row-2">
          <div className="admin-form-group">
            <label htmlFor="telefono" className="admin-form-label">
              Teléfono Principal: <span className="required-asterisk">*</span>
            </label>
            <input type="tel" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleChange} onBlur={onBlur} className={`admin-form-input ${errors.telefono ? 'error' : ''}`} />
            {errors.telefono && (
              <span className="admin-form-error">{errors.telefono}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="emailPersonaEncargada" className="admin-form-label">
              Email Encargado: <span className="required-asterisk">*</span>
            </label>
            <input type="email" id="emailPersonaEncargada" name="emailPersonaEncargada" value={formData.emailPersonaEncargada || ''} onChange={handleChange} onBlur={onBlur} className={`admin-form-input ${errors.emailPersonaEncargada ? 'error' : ''}`} />
            {errors.emailPersonaEncargada && (
              <span className="admin-form-error">{errors.emailPersonaEncargada}</span>
            )}
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="correo" className="admin-form-label">
            Email Principal: <span className="required-asterisk">*</span>
          </label>
          <input type="email" id="correo" name="correo" value={formData.correo || ''} onChange={handleChange} onBlur={onBlur} className={`admin-form-input ${errors.correo ? 'error' : ''}`} />
          {errors.correo && (
            <span className="admin-form-error">{errors.correo}</span>
          )}
        </div>

        <div className="admin-form-group">
          <label htmlFor="direccion" className="admin-form-label">
            Dirección: <span className="required-asterisk">*</span>
          </label>
          <input type="text" id="direccion" name="direccion" value={formData.direccion || ''} onChange={handleChange} onBlur={onBlur} className={`admin-form-input ${errors.direccion ? 'error' : ''}`} />
          {errors.direccion && (
            <span className="admin-form-error">{errors.direccion}</span>
          )}
        </div>

        {isEditing && (
          <div className="admin-form-group">
            <label className="admin-form-label">Estado:</label>
            <label className="switch">
              <input type="checkbox" name="estado" checked={formData.estado === true} onChange={handleChange} />
              <span className="slider"></span>
            </label>
          </div>
        )}
      </div>
    </>
  );
};

export default ProveedorForm;