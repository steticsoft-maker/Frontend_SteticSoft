// src/features/roles/components/RolForm.jsx

import React, { useState, useEffect } from "react";
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
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Si los errores del formulario del padre cambian, los mostramos.
    setErrors(formErrors);
  }, [formErrors]);

  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case "nombre":
        if (!value) {
          error = "El nombre del rol es obligatorio.";
        } else if (value.length < 3) {
          error = "El nombre del rol debe tener al menos 3 caracteres.";
        } else if (value.length > 50) {
          error = "El nombre del rol no debe exceder los 50 caracteres.";
        }
        break;
      case "descripcion":
        if (value.length > 255) {
          error = "La descripción no debe exceder los 255 caracteres.";
        }
        break;
      case "tipoPerfil":
        if (!value) {
          error = "El tipo de perfil es obligatorio.";
        }
        break;
      default:
        break;
    }
    return error;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    // Actualizar el estado del formulario en el componente padre
    onFormChange(name, fieldValue);

    // Validar en tiempo real y actualizar el estado de errores local
    const error = validateField(name, fieldValue);
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
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
              className={`rol-input ${errors.nombre ? 'input-error' : ''}`}
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
              className={`rol-textarea ${errors.descripcion ? 'input-error' : ''}`}
              disabled={isRoleAdmin}
            />
            {errors.descripcion && (
              <span className="error-message">{errors.descripcion}</span>
            )}
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