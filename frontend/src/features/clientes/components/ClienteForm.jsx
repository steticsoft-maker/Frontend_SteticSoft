// src/features/clientes/components/ClienteForm.jsx
import React from 'react';

// Tipos de documento podrían venir de una constante o servicio
const TIPOS_DOCUMENTO = ["Cédula", "Pasaporte", "Cédula de Extranjería", "NIT"];


const ClienteForm = ({ formData, onFormChange, isEditing }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  return (
    // En el CSS original, el form tiene clase "formularioModalClientes"
    // y los inputs están dentro de un div "formularioModalInputClientes"
    // Aquí agruparemos con "clientes-form-group" como en Usuarios
    <div className="clientes-form-grid"> {/* Para layout de 2 columnas si se desea */}
      <div className="clientes-form-group">
        <label htmlFor="nombre">Nombre: <span className="required-asterisk">*</span></label>
        <input type="text" id="nombre" name="nombre" value={formData.nombre || ''} onChange={handleChange} placeholder="Nombre" required />
      </div>
      <div className="clientes-form-group">
        <label htmlFor="apellido">Apellido: <span className="required-asterisk">*</span></label>
        <input type="text" id="apellido" name="apellido" value={formData.apellido || ''} onChange={handleChange} placeholder="Apellido" required />
      </div>
      <div className="clientes-form-group">
        <label htmlFor="email">Correo: <span className="required-asterisk">*</span></label>
        <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="Correo electrónico" required />
      </div>
      <div className="clientes-form-group">
        <label htmlFor="telefono">Teléfono: <span className="required-asterisk">*</span></label>
        <input type="text" id="telefono" name="telefono" value={formData.telefono || ''} onChange={handleChange} placeholder="Teléfono" required />
      </div>
      <div className="clientes-form-group">
        <label htmlFor="tipoDocumento">Tipo de Documento: <span className="required-asterisk">*</span></label>
        <select id="tipoDocumento" name="tipoDocumento" value={formData.tipoDocumento || ''} onChange={handleChange} required>
          <option value="" disabled>Seleccione un tipo</option>
          {TIPOS_DOCUMENTO.map(tipo => <option key={tipo} value={tipo}>{tipo}</option>)}
        </select>
      </div>
      <div className="clientes-form-group">
        <label htmlFor="numeroDocumento">Número de Documento: <span className="required-asterisk">*</span></label>
        <input type="text" id="numeroDocumento" name="numeroDocumento" value={formData.numeroDocumento || ''} onChange={handleChange} placeholder="Número de Documento" required />
      </div>
      <div className="clientes-form-group full-width-group"> {/* Para que ocupe todo el ancho si es necesario */}
        <label htmlFor="direccion">Dirección: <span className="required-asterisk">*</span></label>
        <input type="text" id="direccion" name="direccion" value={formData.direccion || ''} onChange={handleChange} placeholder="Dirección" required />
      </div>
      <div className="clientes-form-group">
        <label htmlFor="ciudad">Ciudad:</label> {/* Campo opcional según script original */}
        <input type="text" id="ciudad" name="ciudad" value={formData.ciudad || ''} onChange={handleChange} placeholder="Ciudad" />
      </div>
      <div className="clientes-form-group">
        <label htmlFor="fechaNacimiento">Fecha de Nacimiento: <span className="required-asterisk">*</span></label>
        <input type="date" id="fechaNacimiento" name="fechaNacimiento" value={formData.fechaNacimiento || ''} onChange={handleChange} required />
      </div>
      {!isEditing && ( // Password solo al crear, o manejarlo con un botón "cambiar contraseña" en edición
        <div className="clientes-form-group">
          <label htmlFor="password">Contraseña: <span className="required-asterisk">*</span></label>
          <input type="password" id="password" name="password" value={formData.password || ''} onChange={handleChange} placeholder="Contraseña" required />
        </div>
      )}
       {isEditing && (
        <div className="clientes-form-group">
            <label className="clientes-form-label">Estado (Activo):</label>
            <label className="switch">
                <input
                    type="checkbox"
                    name="estado"
                    checked={formData.estado}
                    onChange={(e) => onFormChange('estado', e.target.checked)}
                />
                <span className="slider"></span>
            </label>
        </div>
      )}
    </div>
  );
};

export default ClienteForm;