// src/features/roles/components/RolForm.jsx
import React from 'react';
import PermisosSelector from './PermisosSelector';

const RolForm = ({
  formData,
  onFormChange,
  modulosPermisos,
  modulosSeleccionadosIds,
  onToggleModulo,
  isEditing,
  isRoleAdmin,
  mostrarPermisos,
  onToggleMostrarPermisos,
}) => {
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === 'checkbox' ? checked : value);
  };

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
              placeholder="Ingrese el nombre del rol"
              value={formData.nombre}
              onChange={handleInputChange}
              className="rol-input"
              disabled={isRoleAdmin}
              required
            />
          </div>
          <div className="rol-campoContainer">
            <label htmlFor="descripcionRolInput" className="rol-label">
              Descripción del Rol: {/* No es obligatorio según el código original, se puede añadir asterisco si se desea */}
            </label>
            <textarea
              id="descripcionRolInput"
              name="descripcion"
              placeholder="Ingrese la descripción del rol"
              value={formData.descripcion}
              onChange={handleInputChange}
              className="rol-textarea"
              disabled={isRoleAdmin}
            />
          </div>
          {isEditing && !isRoleAdmin && (
            <div className="rol-campoContainer">
              <label className="rol-label">Anulado (Inactivo):</label>
              <label className="switch">
                <input
                  type="checkbox"
                  name="anulado"
                  checked={formData.anulado}
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
          onClick={onToggleMostrarPermisos}
        >
          {mostrarPermisos ? "Ocultar Módulos" : "Seleccionar Módulos"}
          {isEditing ? "" : <span className="required-asterisk">*</span>} {/* Solo obligatorio en creación si no se muestran por defecto */}
        </button>
      )}

      <PermisosSelector
        modulosPermisos={modulosPermisos}
        modulosSeleccionadosIds={modulosSeleccionadosIds}
        onToggleModulo={onToggleModulo}
        isRoleAdmin={isRoleAdmin}
        mostrar={mostrarPermisos || isRoleAdmin}
      />

      { (mostrarPermisos || isRoleAdmin) &&
        <div className="rol-seccionModulosSeleccionados">
            <h3>Módulos Seleccionados ({modulosSeleccionadosIds.length})</h3>
            {modulosSeleccionadosIds.length > 0 ? (
            <ul className="rol-listaModulosSeleccionados">
                {modulosSeleccionadosIds
                .map(id => modulosPermisos.find(m => m.id === id)?.nombre)
                .filter(nombre => nombre !== undefined)
                .map((moduloNombre, index) => (
                    <li key={index}>{moduloNombre}</li>
                ))}
            </ul>
            ) : (
            <p>No hay módulos seleccionados</p>
            )}
        </div>
      }
    </>
  );
};

export default RolForm;