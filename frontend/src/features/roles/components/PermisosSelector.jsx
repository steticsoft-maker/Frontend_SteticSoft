// src/features/roles/components/PermisosSelector.jsx
import React from 'react';

const PermisosSelector = ({ permisosAgrupados, permisosSeleccionadosIds, onTogglePermiso, isRoleAdmin, mostrar }) => {
  if (!mostrar && !isRoleAdmin) {
    return null;
  }

  // CORRECCIÓN: Añadimos '|| {}' como valor de respaldo.
  // Si permisosAgrupados es null o undefined, usará un objeto vacío en su lugar, evitando el error.
  const modulos = Object.keys(permisosAgrupados || {});

  return (
    <div className="rol-seccionSeleccionarModulos">
      <h3>Módulos Disponibles</h3>
      <div className="rol-contenedorModulos">
        {modulos.length > 0 ? (
          modulos.map((nombreModulo) => (
            <div key={nombreModulo} className="rol-moduloGrupo">
              <h4>Módulo: {nombreModulo}</h4>
              <div className="rol-permisos-grid">
                {(permisosAgrupados[nombreModulo] || []).map((permiso) => (
                  <div key={permiso.idPermiso} className="rol-moduloItem">
                    <input
                      type="checkbox"
                      id={`permiso-${permiso.idPermiso}`}
                      checked={(permisosSeleccionadosIds || []).includes(permiso.idPermiso)}
                      onChange={() => onTogglePermiso(permiso.idPermiso)}
                      disabled={isRoleAdmin}
                    />
                    <label htmlFor={`permiso-${permiso.idPermiso}`}>{permiso.accion}</label>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No hay permisos disponibles para asignar.</p>
        )}
      </div>
    </div>
  );
};

export default PermisosSelector;