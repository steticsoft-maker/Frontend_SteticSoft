// src/features/roles/components/RolForm.jsx
import React, { useState } from "react";
import PermisosSelector from "./PermisosSelector";

const RolForm = ({
  formData,
  onFormChange,
  onBlur,
  permisosDisponibles,
  permisosAgrupados,
  onToggleModulo,
  onSelectAll,
  onDeselectAll,
  isEditing,
  isRoleAdmin,
  errors = {},
}) => {
  const [mostrarPermisos, setMostrarPermisos] = useState(isEditing || false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    onFormChange(name, fieldValue);
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
      <div className="rol-seccionInformacionRol">
        <h3>Información del Rol</h3>
        <div className="rol-formularioInformacionRol">
          <div className="rol-campoContainer">
            <label htmlFor="nombreRolInput" className="rol-label">
              Nombre del Rol: <span className="required-asterisk">*</span>
            </label>
            <input
              id="nombreRolInput"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              onBlur={onBlur}
              className={`rol-input ${errors.nombre ? 'is-invalid' : ''}`}
              disabled={isRoleAdmin}
              required
            />
            {errors.nombre && (
              <p className="error-message">{errors.nombre}</p>
            )}
          </div>

          <div className="rol-campoContainer">
            <label htmlFor="tipoPerfilInput" className="rol-label">
              Tipo de Perfil: <span className="required-asterisk">*</span>
            </label>
            <select
              id="tipoPerfilInput"
              name="tipoPerfil"
              value={formData.tipoPerfil || 'EMPLEADO'}
              onChange={handleInputChange}
              onBlur={onBlur}
              className={`rol-input ${errors.tipoPerfil ? 'is-invalid' : ''}`}
              disabled={isRoleAdmin}
              required
            >
              <option value="EMPLEADO">Empleado</option>
              <option value="CLIENTE">Cliente</option>
              <option value="NINGUNO">Ninguno (Solo Acceso al Sistema)</option>
            </select>
            {errors.tipoPerfil && (
              <p className="error-message">{errors.tipoPerfil}</p>
            )}
          </div>

          <div className="rol-campoContainer">
            <label htmlFor="descripcionRolInput" className="rol-label">
              Descripción del Rol:
            </label>
            <textarea
              id="descripcionRolInput"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              onBlur={onBlur}
              className="rol-textarea"
              disabled={isRoleAdmin}
            />
          </div>

          {isEditing && !isRoleAdmin && (
            <div className="rol-campoContainer">
              <label className="rol-label">Estado (Activo):</label>
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
      </div>

      {!isRoleAdmin && (
        <button
          type="button"
          className="rol-botonSeleccionarPermisos"
          onClick={handleToggleMostrarPermisos}
        >
          {mostrarPermisos
            ? "Ocultar Selección de Módulos"
            : "Mostrar Selección de Módulos"}
        </button>
      )}

      <PermisosSelector
        permisosAgrupados={permisosAgrupados}
        permisosSeleccionadosIds={formData.idPermisos || []}
        onTogglePermiso={onToggleModulo}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        isRoleAdmin={isRoleAdmin}
        mostrar={mostrarPermisos || isRoleAdmin}
        isEditing={isEditing}
      />

      {(mostrarPermisos || isRoleAdmin) && (
        <div className="rol-seccionModulosSeleccionados">
          <h3>Módulos Seleccionados ({modulosSeleccionadosNombres.length})</h3>
          {modulosSeleccionadosNombres.length > 0 ? (
            <ul className="rol-listaModulosSeleccionados">
              {modulosSeleccionadosNombres.map((nombre, index) => (
                <li key={index}>{nombre}</li>
              ))}
            </ul>
          ) : (
            <p>No hay módulos seleccionados</p>
          )}
        </div>
      )}
    </>
  );
};

export default RolForm;