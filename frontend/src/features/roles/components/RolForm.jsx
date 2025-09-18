// src/features/roles/components/RolForm.jsx

import React, { useState } from "react";
import PermisosSelector from "./PermisosSelector";

const RolForm = ({
  formData,
  onFormChange,
  permisosDisponibles,
  permisosAgrupados,
  onToggleModulo,
  onSelectAll,
  onDeselectAll,
  isEditing,
  isRoleAdmin,
  formErrors,
}) => {
  const [mostrarPermisos, setMostrarPermisos] = useState(isEditing || false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === "checkbox" ? checked : value);
  };

  const handleToggleMostrarPermisos = () => {
    if (!isRoleAdmin) {
      setMostrarPermisos((prev) => !prev);
    }
  };

  const modulosSeleccionadosNombres = (formData.idPermisos || [])
    .map((id) => permisosDisponibles.find((p) => p.idPermiso === id)?.nombre)
    .filter(Boolean);

  return (
    <>
      <div className="admin-form-section">
        <h3 className="admin-form-section-title">Información del Rol</h3>
        <div className="admin-form-row-2">
          <div className="admin-form-group">
            <label htmlFor="nombreRolInput" className="admin-form-label">
              Nombre del Rol: <span className="required-asterisk">*</span>
            </label>
            <input
              id="nombreRolInput"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className={`admin-form-input ${formErrors.nombre ? 'error' : ''}`}
              disabled={isRoleAdmin}
              required
            />
            {formErrors.nombre && (
              <span className="admin-form-error">{formErrors.nombre}</span>
            )}
          </div>

          <div className="admin-form-group">
            <label htmlFor="tipoPerfilInput" className="admin-form-label">
              Tipo de Perfil: <span className="required-asterisk">*</span>
            </label>
            <select
              id="tipoPerfilInput"
              name="tipoPerfil"
              value={formData.tipoPerfil || 'EMPLEADO'}
              onChange={handleInputChange}
              className={`admin-form-select ${formErrors.tipoPerfil ? 'error' : ''}`}
              disabled={isRoleAdmin}
              required
            >
              <option value="EMPLEADO">Empleado</option>
              <option value="CLIENTE">Cliente</option>
              <option value="NINGUNO">Ninguno (Solo Acceso al Sistema)</option>
            </select>
            {formErrors.tipoPerfil && (
              <span className="admin-form-error">{formErrors.tipoPerfil}</span>
            )}
          </div>
        </div>

        <div className="admin-form-group">
          <label htmlFor="descripcionRolInput" className="admin-form-label">
            Descripción del Rol: <span className="required-asterisk">*</span>
          </label>
          <textarea
            id="descripcionRolInput"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            className={`admin-form-textarea ${formErrors.descripcion ? 'error' : ''}`}
            disabled={isRoleAdmin}
            required
            rows={3}
          />
          {formErrors.descripcion && (
            <span className="admin-form-error">{formErrors.descripcion}</span>
          )}
        </div>

        {isEditing && !isRoleAdmin && (
          <div className="admin-form-group">
            <label className="admin-form-label">Estado:</label>
            <label className="switch">
              <input
                type="checkbox"
                name="estado"
                checked={formData.estado}
                onChange={handleInputChange}
              />
              <span className="slider"></span>
            </label>
          </div>
        )}
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-title">
          Módulos Disponibles
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button
              type="button"
              className="admin-form-button secondary"
              onClick={onSelectAll}
            >
              Marcar Todos
            </button>
            <button
              type="button"
              className="admin-form-button secondary"
              onClick={onDeselectAll}
            >
              Desmarcar Todos
            </button>
          </div>
        </div>
        
        <PermisosSelector
          permisosAgrupados={permisosAgrupados}
          permisosSeleccionadosIds={formData.idPermisos || []}
          onTogglePermiso={onToggleModulo}
          onSelectAll={onSelectAll}
          onDeselectAll={onDeselectAll}
          isRoleAdmin={isRoleAdmin}
          mostrar={true}
          isEditing={isEditing}
        />
      </div>

      <div className="admin-form-section">
        <h3 className="admin-form-section-title">
          Módulos Seleccionados ({modulosSeleccionadosNombres.length})
        </h3>
        {modulosSeleccionadosNombres.length > 0 ? (
          <div className="admin-modules-container">
            {modulosSeleccionadosNombres.map((nombre, index) => (
              <div key={index} className="admin-module-section">
                <div className="admin-module-title">{nombre}</div>
              </div>
            ))}
          </div>
        ) : (
          <p>No hay módulos seleccionados</p>
        )}
      </div>
    </>
  );
};

export default RolForm;