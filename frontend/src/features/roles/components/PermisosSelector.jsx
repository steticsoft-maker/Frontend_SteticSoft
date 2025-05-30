// src/features/roles/components/PermisosSelector.jsx
import React from 'react';

const PermisosSelector = ({ modulosPermisos, modulosSeleccionadosIds, onToggleModulo, isRoleAdmin, mostrar }) => {
  if (!mostrar && !isRoleAdmin) { // Ocultar si no se debe mostrar Y no es Admin (Admin siempre muestra)
    return null;
  }

  return (
    <div className="rol-seccionSeleccionarModulos">
      <h3>Módulos Disponibles ({modulosPermisos.length})</h3>
      <div className="rol-contenedorModulos rol-modulos-grid">
        {modulosPermisos.map((modulo) => (
          <div key={modulo.id} className="rol-moduloItem">
            <input
              type="checkbox"
              id={`modulo-${modulo.id}`}
              checked={modulosSeleccionadosIds.includes(modulo.id)}
              onChange={() => onToggleModulo(modulo.id)}
              disabled={isRoleAdmin}
            />
            <label htmlFor={`modulo-${modulo.id}`}>{modulo.nombre}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PermisosSelector;