// src/features/roles/components/PermisosSelector.jsx
import React from 'react';

const PermisosSelector = ({ 
    permisosAgrupados, 
    permisosSeleccionadosIds, 
    onTogglePermiso, 
    onSelectAll, // NUEVA PROP
    onDeselectAll, // NUEVA PROP
    isRoleAdmin, 
    mostrar 
}) => {
  if (!mostrar && !isRoleAdmin) {
    return null;
  }

  const modulos = Object.keys(permisosAgrupados || {});

  return (
    <div className="rol-seccionSeleccionarModulos">
      <div className="rol-permisos-header">
        <h3>Módulos Disponibles</h3>
        {/* --- INICIO DE NUEVO CÓDIGO: BOTONES DE ACCIÓN --- */}
        {!isRoleAdmin && (
          <div className="rol-permisos-action-buttons">
            <button type="button" className="rol-permisos-button" onClick={onSelectAll}>
              Marcar Todos
            </button>
            <button type="button" className="rol-permisos-button" onClick={onDeselectAll}>
              Desmarcar Todos
            </button>
          </div>
        )}
        {/* --- FIN DE NUEVO CÓDIGO --- */}
      </div>

      <div className="rol-contenedorModulos">
        {modulos.length > 0 ? (
          modulos.map((nombreModulo) => (
            // --- INICIO DE MODIFICACIÓN: Usamos <details> para el acordeón ---
            <details key={nombreModulo} className="rol-modulo-acordeon" open>
              <summary className="rol-modulo-header-acordeon">
                {nombreModulo}
              </summary>
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
                      const parts = permiso.nombre.split('_');
                      let accionName = parts.length > 2 && parts[0] === "MODULO" 
                        ? parts.slice(2).join('_') 
                        : permiso.nombre;
                      
                      const displayAccion = accionName.split('_')
                        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                        .join(' ');
                        
                      return <label htmlFor={`permiso-${permiso.idPermiso}`}>{displayAccion}</label>;
                    })()}
                  </div>
                ))}
              </div>
            </details>
            // --- FIN DE MODIFICACIÓN ---
          ))
        ) : (
          <p>No hay permisos disponibles para asignar.</p>
        )}
      </div>
    </div>
  );
};

export default PermisosSelector;