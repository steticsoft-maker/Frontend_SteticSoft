// src/features/proveedores/components/ProveedorForm.jsx
import React from 'react';

const TIPOS_DOCUMENTO_NATURAL = ["CC", "CE", "Pasaporte"]; // Ejemplo

const ProveedorForm = ({ formData, onFormChange, isEditing }) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === 'checkbox' ? checked : value);
  };

  const handleTipoDocumentoChange = (e) => {
    const newTipo = e.target.value;
    // Limpiar campos del tipo anterior al cambiar
    const resetData = {
      nombre: newTipo === "Jurídico" ? "" : formData.nombre,
      nombreEmpresa: newTipo === "Natural" ? "" : formData.nombreEmpresa,
      tipoDocumentoNatural: newTipo === "Natural" ? (formData.tipoDocumentoNatural || "CC") : "",
      numeroDocumento: newTipo === "Jurídico" ? "" : formData.numeroDocumento,
      nit: newTipo === "Natural" ? "" : formData.nit,
    };
    onFormChange('tipoDocumento', newTipo, resetData);
  };


  return (
    // Usaremos el layout de grid del modal-content-Proveedores,
    // aquí solo definimos los grupos de campos.
    <>
      <div className="proveedores-form-group"> {/* Clase genérica para grupo */}
        <label htmlFor="tipoDocumento">Tipo de Proveedor: <span className="required-asterisk">*</span></label>
        <select
          id="tipoDocumento"
          name="tipoDocumento"
          value={formData.tipoDocumento || "Natural"}
          onChange={handleTipoDocumentoChange} // Usar handler específico
          className="tipo-documento-proveedor-select" // Clase del CSS original
        >
          <option value="Natural">Natural</option>
          <option value="Jurídico">Jurídico</option>
        </select>
      </div>

      {formData.tipoDocumento === "Natural" ? (
        <>
          <div className="proveedores-form-group">
            <label htmlFor="nombre">Nombre Completo (Natural): <span className="required-asterisk">*</span></label>
            <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} placeholder="Nombre Completo" required />
          </div>
          <div className="proveedores-form-group">
            <label>Documento de Identidad: <span className="required-asterisk">*</span></label>
            <div className="documento-container"> {/* Clase del CSS original */}
              <select
                name="tipoDocumentoNatural"
                value={formData.tipoDocumentoNatural || "CC"}
                onChange={handleChange}
                className="select-tipo-documento" /* Clase del CSS original */
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
                className="input-documento" /* Clase del CSS original */
                required
              />
            </div>
          </div>
        </>
      ) : ( // Jurídico
        <>
          <div className="proveedores-form-group">
            <label htmlFor="nombreEmpresa">Nombre de la Empresa: <span className="required-asterisk">*</span></label>
            <input type="text" id="nombreEmpresa" name="nombreEmpresa" value={formData.nombreEmpresa || ''} onChange={handleChange} placeholder="Nombre de la Empresa" required />
          </div>
          <div className="proveedores-form-group">
            <label htmlFor="nit">NIT: <span className="required-asterisk">*</span></label>
            <input type="text" id="nit" name="nit" value={formData.nit || ''} onChange={handleChange} placeholder="NIT (Ej: 900123456-7)" required />
          </div>
        </>
      )}

      <div className="proveedores-form-group">
        <label htmlFor="telefono">Teléfono Principal: <span className="required-asterisk">*</span></label>
        <input type="tel" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleChange} placeholder="Teléfono Principal" required />
      </div>
      <div className="proveedores-form-group">
        <label htmlFor="email">Email Principal: <span className="required-asterisk">*</span></label>
        <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="Email Principal" required />
      </div>
      <div className="proveedores-form-group form-full-width"> {/* Ocupa todo el ancho */}
        <label htmlFor="direccion">Dirección: <span className="required-asterisk">*</span></label>
        <input type="text" id="direccion" name="direccion" value={formData.direccion || ''} onChange={handleChange} placeholder="Dirección" required />
      </div>

      <h4 className="modal-subtitle-proveedores">Datos de la Persona Encargada</h4>
      <div className="proveedores-form-group">
        <label htmlFor="personaEncargadaNombre">Nombre Encargado: <span className="required-asterisk">*</span></label>
        <input type="text" id="personaEncargadaNombre" name="personaEncargadaNombre" value={formData.personaEncargadaNombre || ''} onChange={handleChange} placeholder="Nombre persona encargada" required />
      </div>
      <div className="proveedores-form-group">
        <label htmlFor="personaEncargadaTelefono">Teléfono Encargado: <span className="required-asterisk">*</span></label>
        <input type="tel" id="personaEncargadaTelefono" name="personaEncargadaTelefono" value={formData.personaEncargadaTelefono || ''} onChange={handleChange} placeholder="Teléfono persona encargada" required />
      </div>
      <div className="proveedores-form-group">
        <label htmlFor="personaEncargadaEmail">Email Encargado:</label>
        <input type="email" id="personaEncargadaEmail" name="personaEncargadaEmail" value={formData.personaEncargadaEmail || ''} onChange={handleChange} placeholder="Email persona encargada (opcional)" />
      </div>
      
      {isEditing && (
         <div className="proveedores-form-group">
            <label>Estado (Activo):</label>
            <label className="switch">
                <input
                    type="checkbox"
                    name="estado"
                    checked={formData.estado === "Activo"}
                    onChange={(e) => onFormChange('estado', e.target.checked ? "Activo" : "Inactivo")}
                />
                <span className="slider"></span>
            </label>
        </div>
      )}
    </>
  );
};

export default ProveedorForm;