// src/features/proveedores/components/ProveedorForm.jsx
import React from 'react';

const TIPOS_DOCUMENTO_NATURAL = ["CC", "CE"];

// CORRECCIÓN: Se simplifica el componente para que use el `handleChange` genérico del modal padre.
const ProveedorForm = ({ formData, onFormChange, isEditing }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === 'checkbox' ? checked : value);
  };
  
  // CORRECCIÓN: El cambio de tipo de proveedor ahora también usa el handleChange genérico.
  const handleTipoProveedorChange = (e) => {
    const newTipo = e.target.value;
    const resetData = {
      nombre: newTipo === "Jurídico" ? "" : formData.nombre,
      nitEmpresa: newTipo === "Natural" ? "" : formData.nitEmpresa,
      tipoDocumento: newTipo === "Natural" ? (formData.tipoDocumento || "CC") : "",
      numeroDocumento: newTipo === "Jurídico" ? "" : formData.numeroDocumento,
    };
    onFormChange('tipo', newTipo, resetData); // El campo se llama 'tipo', no 'tipoDocumento'
  };


  return (
    <>
      <div className="proveedores-form-group">
        <label htmlFor="tipo">Tipo de Proveedor: <span className="required-asterisk">*</span></label>
        {/* CORRECCIÓN: El 'name' y 'value' ahora apuntan a 'tipo' para que coincida con el estado y el backend. */}
        <select
          id="tipo"
          name="tipo" 
          value={formData.tipo || "Natural"}
          onChange={handleTipoProveedorChange}
          className="tipo-documento-proveedor-select"
        >
          <option value="Natural">Natural</option>
          <option value="Jurídico">Jurídico</option>
        </select>
      </div>

      {formData.tipo === "Natural" ? (
        <>
          <div className="proveedores-form-group">
            <label htmlFor="nombre">Nombre Completo (Natural): <span className="required-asterisk">*</span></label>
            <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} placeholder="Nombre Completo" required />
          </div>
          <div className="proveedores-form-group">
            <label>Documento de Identidad: <span className="required-asterisk">*</span></label>
            <div className="documento-container">
              {/* CORRECCIÓN: Se usa 'tipoDocumento' en lugar de 'tipoDocumentoNatural' para consistencia */}
              <select
                name="tipoDocumento" 
                value={formData.tipoDocumento || "CC"}
                onChange={handleChange}
                className="select-tipo-documento"
                required
              >
                <option value="" disabled>Tipo</option>
                {TIPOS_DOCUMENTO_NATURAL.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
              </select>
              <input
                type="text"
                name="numeroDocumento"
                value={formData.numeroDocumento || ''}
                onChange={handleChange}
                placeholder="Número de documento"
                className="input-documento"
                required
              />
            </div>
          </div>
        </>
      ) : ( // Jurídico
        <>
          <div className="proveedores-form-group">
            {/* CORRECCIÓN: Para Jurídico, el nombre de la empresa se guarda en el campo 'nombre' del modelo */}
            <label htmlFor="nombre">Nombre de la Empresa: <span className="required-asterisk">*</span></label>
            <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} placeholder="Nombre de la Empresa" required />
          </div>
          <div className="proveedores-form-group">
            <label htmlFor="nitEmpresa">NIT: <span className="required-asterisk">*</span></label>
            <input type="text" id="nitEmpresa" name="nitEmpresa" value={formData.nitEmpresa || ''} onChange={handleChange} placeholder="NIT (Ej: 900123456-7)" required />
          </div>
        </>
      )}

      <div className="proveedores-form-group">
        <label htmlFor="telefono">Teléfono Principal: <span className="required-asterisk">*</span></label>
        <input type="tel" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleChange} placeholder="Teléfono Principal" required />
      </div>
      <div className="proveedores-form-group">
        <label htmlFor="correo">Email Principal: <span className="required-asterisk">*</span></label>
        <input type="email" id="correo" name="correo" value={formData.correo || ''} onChange={handleChange} placeholder="Email Principal" required />
      </div>
      <div className="proveedores-form-group form-full-width">
        <label htmlFor="direccion">Dirección: <span className="required-asterisk">*</span></label>
        <input type="text" id="direccion" name="direccion" value={formData.direccion || ''} onChange={handleChange} placeholder="Dirección" required />
      </div>

      <h4 className="modal-subtitle-proveedores">Datos de la Persona Encargada</h4>
      <div className="proveedores-form-group">
        <label htmlFor="nombrePersonaEncargada">Nombre Encargado: <span className="required-asterisk">*</span></label>
        <input type="text" id="nombrePersonaEncargada" name="nombrePersonaEncargada" value={formData.nombrePersonaEncargada || ''} onChange={handleChange} placeholder="Nombre persona encargada" required />
      </div>
      <div className="proveedores-form-group">
        <label htmlFor="telefonoPersonaEncargada">Teléfono Encargado: <span className="required-asterisk">*</span></label>
        <input type="tel" id="telefonoPersonaEncargada" name="telefonoPersonaEncargada" value={formData.telefonoPersonaEncargada || ''} onChange={handleChange} placeholder="Teléfono persona encargada" required />
      </div>
      <div className="proveedores-form-group">
        <label htmlFor="emailPersonaEncargada">Email Encargado:</label>
        <input type="email" id="emailPersonaEncargada" name="emailPersonaEncargada" value={formData.emailPersonaEncargada || ''} onChange={handleChange} placeholder="Email persona encargada (opcional)" />
      </div>
      
      {isEditing && (
         <div className="proveedores-form-group">
            <label>Estado (Activo):</label>
            <label className="switch">
                <input
                    type="checkbox"
                    name="estado"
                    checked={formData.estado === true}
                    onChange={(e) => onFormChange('estado', e.target.checked)}
                />
                <span className="slider"></span>
            </label>
        </div>
      )}
    </>
  );
};

export default ProveedorForm;