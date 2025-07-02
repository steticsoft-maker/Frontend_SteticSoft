// src/features/roles/components/PermisosSelector.jsx
import React from "react";

const PermisosSelector = ({
  permisosAgrupados,
  permisosSeleccionadosIds = [], // Asegurar que sea un array por defecto
  onTogglePermiso,
  onSelectAll,
  onDeselectAll,
  isRoleAdmin,
  mostrar,
  isEditing, // NUEVA PROP para determinar el modo
}) => {
  if (!mostrar && !isRoleAdmin) {
    return null;
  }

  const modulos = Object.keys(permisosAgrupados || {});

  // Función para determinar si un módulo debe estar abierto
  const debeEstarAbierto = (nombreModulo) => {
    if (isRoleAdmin) return true; // Para el rol Admin, siempre mostrar todo abierto si se decide mostrarle el selector
    if (!isEditing) {
      // Modo creación
      return false; // Cerrado por defecto en creación
    }
    // Modo edición: abierto si algún permiso del módulo está seleccionado
    const permisosDelModulo = permisosAgrupados[nombreModulo] || [];
    return permisosDelModulo.some((p) =>
      permisosSeleccionadosIds.includes(p.idPermiso)
    );
  };

  return (
    <div className="rol-seccionSeleccionarModulos">
      <div className="rol-permisos-header">
        <h3>Módulos Disponibles</h3>
        {!isRoleAdmin && (
          <div className="rol-permisos-action-buttons">
            <button
              type="button"
              className="rol-permisos-button"
              onClick={onSelectAll}
            >
              Marcar Todos
            </button>
            <button
              type="button"
              className="rol-permisos-button"
              onClick={onDeselectAll}
            >
              Desmarcar Todos
            </button>
          </div>
        )}
      </div>

      <div className="rol-contenedorModulos">
        {modulos.length > 0 ? (
          modulos.map((nombreModulo) => (
            <details
              key={nombreModulo}
              className="rol-modulo-acordeon"
              open={debeEstarAbierto(nombreModulo)} // Estado open dinámico
            >
              <summary className="rol-modulo-header-acordeon">
                {nombreModulo}
              </summary>
              <div className="rol-permisos-grid">
                {(permisosAgrupados[nombreModulo] || []).map((permiso) => (
                  <div key={permiso.idPermiso} className="rol-moduloItem">
                    <input
                      type="checkbox"
                      id={`permiso-${permiso.idPermiso}`}
                      checked={(permisosSeleccionadosIds || []).includes(
                        permiso.idPermiso
                      )}
                      onChange={() => onTogglePermiso(permiso.idPermiso)}
                      disabled={isRoleAdmin}
                    />
                    {(() => {
                      const parts = permiso.nombre.split("_");
                      let accionName =
                        parts.length > 2 && parts[0] === "MODULO"
                          ? parts.slice(2).join("_")
                          : permiso.nombre;

                      const displayAccion = accionName
                        .split("_")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() +
                            word.slice(1).toLowerCase()
                        )
                        .join(" ");

                      return (
                        <label htmlFor={`permiso-${permiso.idPermiso}`}>
                          {displayAccion}
                        </label>
                      );
                    })()}
                  </div>
                ))}
              </div>
            </details>
          ))
        ) : (
          <p>No hay permisos disponibles para asignar.</p>
        )}
      </div>
    </div>
  );
};

export default PermisosSelector;
