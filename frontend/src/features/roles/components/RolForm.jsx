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
  errors,
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
              className="rol-input"
              disabled={isRoleAdmin}
              required
            />
            {errors.nombre && (
              <span className="error-message">{errors.nombre}</span>
            )}
          </div>

          {/* --- INICIO DE CORRECCIÓN --- */}
          <div className="rol-campoContainer">
            <label htmlFor="tipoPerfilInput" className="rol-label">
              Tipo de Perfil: <span className="required-asterisk">*</span>
            </label>
            <select
              id="tipoPerfilInput"
              name="tipoPerfil"
              // Lógica simplificada: usa el valor del formData o el default 'EMPLEADO'
              value={formData.tipoPerfil || 'EMPLEADO'}
              onChange={handleInputChange}
              className="rol-input"
              // No se puede cambiar el tipo de perfil de los roles base (Admin, Empleado, Cliente) una vez creados.
              disabled={isRoleAdmin}
              required
            >
              {/* No es necesaria una opción placeholder si siempre hay un valor seleccionado */}
              <option value="EMPLEADO">Empleado</option>
              <option value="CLIENTE">Cliente</option>
              <option value="NINGUNO">Ninguno (Solo Acceso al Sistema)</option>
            </select>
            {errors.tipoPerfil && (
              <span className="error-message">{errors.tipoPerfil}</span>
            )}
          </div>
          {/* --- FIN DE CORRECCIÓN --- */}

          <div className="rol-campoContainer">
            <label htmlFor="descripcionRolInput" className="rol-label">
              Descripción del Rol:
            </label>
            <textarea
              id="descripcionRolInput"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
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