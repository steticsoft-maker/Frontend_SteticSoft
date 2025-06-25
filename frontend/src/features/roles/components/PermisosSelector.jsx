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
                    {(() => {
                      // Extraer la acción del nombre del permiso. Ej: MODULO_USUARIOS_CREAR -> CREAR
                      const parts = permiso.nombre.split('_');
                      let accionName = permiso.nombre; // Por defecto, el nombre completo si no sigue el patrón
                      if (parts.length > 2 && parts[0] === "MODULO") {
                        accionName = parts.slice(2).join('_'); // Ej: CREAR, GESTIONAR_ALGO
                      }
                      // Capitalizar primera letra de cada palabra de la acción para mejor lectura
                      const displayAccion = accionName.split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                      return <label htmlFor={`permiso-${permiso.idPermiso}`}>{displayAccion}</label>;
                    })()}
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