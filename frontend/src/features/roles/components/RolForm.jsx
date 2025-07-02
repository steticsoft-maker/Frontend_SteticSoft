// src/features/roles/components/RolForm.jsx
import React, { useState } from 'react';
import PermisosSelector from './PermisosSelector';

const RolForm = ({
  formData,
  onFormChange,
  permisosDisponibles,
  permisosAgrupados,
  onToggleModulo,
  // --- INICIO DE NUEVO CÓDIGO ---
  onSelectAll,
  onDeselectAll,
  isEditing,
  isRoleAdmin,
  formErrors,
}) => {
  // Estado para mostrar/ocultar la sección de permisos
  // En modo edición, se muestra por defecto si no es admin.
  // En modo creación, se oculta por defecto.
  // Si es admin, siempre se muestra (y está deshabilitado).
  const [mostrarPermisos, setMostrarPermisos] = useState(isRoleAdmin || (isEditing && !isRoleAdmin));

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onFormChange(name, type === 'checkbox' ? checked : value);
  };
  
  const handleToggleMostrarPermisos = () => {
    if (!isRoleAdmin) {
      setMostrarPermisos(prev => !prev);
    }
  };

  const modulosSeleccionadosNombres = (formData.idPermisos || [])
    .map(id => permisosDisponibles.find(p => p.idPermiso === id)?.nombre)
    .filter(Boolean);

  return (
    <>
      <div className="rol-seccionInformacionRol">
        {/* ... El resto de la sección de información del rol no cambia ... */}
        <h3>Información del Rol</h3>
        <div className="rol-formularioInformacionRol">
          <div className="rol-campoContainer">
            <label htmlFor="nombreRolInput" className="rol-label">
              Nombre del Rol: <span className="required-asterisk">*</span>
            </label>
            <input
              id="nombreRolInput" type="text" name="nombre" value={formData.nombre}
              onChange={handleInputChange} className="rol-input" disabled={isRoleAdmin} required
            />
            {formErrors.nombre && <span className="error-message">{formErrors.nombre}</span>}
          </div>
          <div className="rol-campoContainer">
            <label htmlFor="descripcionRolInput" className="rol-label">
              Descripción del Rol:
            </label>
            <textarea
              id="descripcionRolInput" name="descripcion" value={formData.descripcion}
              onChange={handleInputChange} className="rol-textarea" disabled={isRoleAdmin}
            />
          </div>
          {isEditing && !isRoleAdmin && (
            <div className="rol-campoContainer">
              <label className="rol-label">Estado (Activo):</label>
              <label className="switch">
                <input type="checkbox" name="estado" checked={formData.estado} onChange={handleInputChange} />
                <span className="slider"></span>
              </label>
            </div>
          )}
        </div>
      </div>

      {!isRoleAdmin && (
        <button type="button" className="rol-botonSeleccionarPermisos" onClick={handleToggleMostrarPermisos}>
          {mostrarPermisos ? "Ocultar Selección de Módulos" : "Mostrar Selección de Módulos"}
        </button>
      )}

      {/* --- INICIO DE MODIFICACIÓN --- */}
      <PermisosSelector
        permisosAgrupados={permisosAgrupados}
        permisosSeleccionadosIds={formData.idPermisos || []}
        onTogglePermiso={onToggleModulo}
        onSelectAll={onSelectAll}
        onDeselectAll={onDeselectAll}
        isRoleAdmin={isRoleAdmin}
        mostrar={mostrarPermisos} // 'mostrarPermisos' ya considera isRoleAdmin en su estado inicial
        // Calcular qué módulos tienen permisos seleccionados para pasarlo a PermisosSelector
        modulosConPermisosActivos={
          isEditing && !isRoleAdmin // Solo en edición y si no es admin
            ? Object.entries(permisosAgrupados || {})
                .filter(([nombreModulo, permisosDelModulo]) =>
                  permisosDelModulo.some(p => (formData.idPermisos || []).includes(p.idPermiso))
                )
                .map(([nombreModulo]) => nombreModulo)
            : [] // En creación, o si es admin (donde todos se fuerzan abiertos), pasar array vacío
        }
      />

       {(mostrarPermisos) && // 'mostrarPermisos' ya considera isRoleAdmin
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
      }
    </>
  );
};

export default RolForm;