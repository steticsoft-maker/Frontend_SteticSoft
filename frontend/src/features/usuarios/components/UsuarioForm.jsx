// src/features/usuarios/components/UsuarioForm.jsx
import React from 'react';

const UsuarioForm = ({ formData, onFormChange, availableRoles, isEditing, isUserAdmin }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  return (
    <>
      <div className="usuarios-form-group">
        <label htmlFor="tipoDocumento" className="usuarios-form-label">
          Tipo de Documento: <span className="required-asterisk">*</span>
        </label>
        <select
          id="tipoDocumento"
          name="tipoDocumento"
          value={formData.tipoDocumento || ""}
          onChange={handleChange}
          required
          className="usuarios-form-select"
          disabled={isUserAdmin}
        >
          <option value="" disabled>Seleccione</option>
          <option value="CC">Cédula de Ciudadanía</option>
          <option value="CE">Cédula de Extranjería</option>
          {/* Añadir más tipos si es necesario */}
        </select>
      </div>

      <div className="usuarios-form-group">
        <label htmlFor="documento" className="usuarios-form-label">
          Número de Documento: <span className="required-asterisk">*</span>
        </label>
        <input
          type="text"
          id="documento"
          name="documento"
          placeholder="Número de documento"
          value={formData.documento || ""}
          onChange={handleChange}
          required
          className="usuarios-form-input"
          disabled={isUserAdmin}
        />
      </div>

      <div className="usuarios-form-group">
        <label htmlFor="nombre" className="usuarios-form-label">
          Nombre y Apellido: <span className="required-asterisk">*</span>
        </label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre || ""}
          onChange={handleChange}
          required
          className="usuarios-form-input"
          disabled={isUserAdmin}
        />
      </div>

      <div className="usuarios-form-group">
        <label htmlFor="email" className="usuarios-form-label">
          Email: <span className="required-asterisk">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Correo electrónico"
          value={formData.email || ""}
          onChange={handleChange}
          required
          className="usuarios-form-input"
          disabled={isUserAdmin}
        />
      </div>

      <div className="usuarios-form-group">
        <label htmlFor="telefono" className="usuarios-form-label">
          Teléfono: <span className="required-asterisk">*</span>
        </label>
        <input
          type="text" // Podría ser 'tel'
          id="telefono"
          name="telefono"
          placeholder="Número de teléfono"
          value={formData.telefono || ""}
          onChange={handleChange}
          required
          className="usuarios-form-input"
          disabled={isUserAdmin}
        />
      </div>

      <div className="usuarios-form-group">
        <label htmlFor="direccion" className="usuarios-form-label">
          Dirección: <span className="required-asterisk">*</span>
        </label>
        <input
          type="text"
          id="direccion"
          name="direccion"
          placeholder="Dirección de residencia"
          value={formData.direccion || ""}
          onChange={handleChange}
          required
          className="usuarios-form-input"
          disabled={isUserAdmin}
        />
      </div>

      <div className="usuarios-form-group">
        <label htmlFor="rol" className="usuarios-form-label">
          Rol: <span className="required-asterisk">*</span>
        </label>
        <select
          id="rol"
          name="rol"
          value={formData.rol || ""}
          onChange={handleChange}
          required
          className="usuarios-form-select"
          disabled={isUserAdmin}
        >
          <option value="" disabled>Seleccionar rol</option>
          {isUserAdmin && <option value="Administrador">Administrador (Fijo)</option>}
          {availableRoles.map((rol) => (
            <option key={rol} value={rol}>
              {rol}
            </option>
          ))}
        </select>
      </div>
      {isEditing && !isUserAdmin && ( // Solo mostrar para editar usuarios que no sean admin
         <div className="usuarios-form-group">
            <label className="usuarios-form-label">Anulado (Inactivo):</label>
            <label className="switch">
                <input
                    type="checkbox"
                    name="anulado"
                    checked={formData.anulado || false}
                    onChange={(e) => onFormChange('anulado', e.target.checked)}
                />
                <span className="slider"></span>
            </label>
        </div>
      )}
    </>
  );
};

export default UsuarioForm;