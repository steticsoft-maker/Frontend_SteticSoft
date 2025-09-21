// src/features/roles/components/PermisosSelector.jsx
import React, { useState } from "react";

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
  const [expandedModules, setExpandedModules] = useState(new Set());

  if (!mostrar && !isRoleAdmin) {
    return null;
  }

  const modulos = Object.keys(permisosAgrupados || {});

  // Función para obtener el icono del módulo
  const getModuloIcon = (nombreModulo) => {
    const iconMap = {
      USUARIOS: "👥",
      ROLES: "🛡️",
      CLIENTES: "👤",
      PRODUCTOS: "📦",
      VENTAS: "🛒",
      CITAS: "📅",
      CATEGORIAS: "📂",
      SERVICIOS: "🔧",
      PROVEEDORES: "🚚",
      COMPRAS: "🛍️",
      ABASTECIMIENTO: "📋",
      NOVEDADES: "📰",
      DASHBOARD: "📊",
      ESTADOS: "📊",
      EMPLEADOS: "👨‍💼",
      ESPECIALIDADES: "⭐",
      PERMISOS: "🔐",
    };
    return iconMap[nombreModulo] || "📁";
  };

  // Función para determinar si un módulo debe estar abierto
  const debeEstarAbierto = (nombreModulo) => {
    if (isRoleAdmin) return true;
    if (!isEditing) {
      return expandedModules.has(nombreModulo);
    }
    // Modo edición: abierto si algún permiso del módulo está seleccionado
    const permisosDelModulo = permisosAgrupados[nombreModulo] || [];
    return permisosDelModulo.some((p) =>
      permisosSeleccionadosIds.includes(p.idPermiso)
    );
  };

  const toggleModule = (nombreModulo) => {
    if (!isRoleAdmin) {
      setExpandedModules((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(nombreModulo)) {
          newSet.delete(nombreModulo);
        } else {
          newSet.add(nombreModulo);
        }
        return newSet;
      });
    }
  };

  // Función para contar permisos seleccionados por módulo
  const getSelectedCount = (nombreModulo) => {
    const permisosDelModulo = permisosAgrupados[nombreModulo] || [];
    return permisosDelModulo.filter((p) =>
      permisosSeleccionadosIds.includes(p.idPermiso)
    ).length;
  };

  const totalPermisos = permisosSeleccionadosIds.length;
  const totalDisponibles = Object.values(permisosAgrupados).flat().length;

  return (
    <div className="rol-seccionSeleccionarModulos">
      <div className="rol-permisos-header">
        <div className="rol-permisos-title-section">
          <h3>
            <span className="section-icon">🔐</span>
            Módulos y Permisos
          </h3>
          <div className="rol-permisos-summary">
            <span className="permisos-counter">
              {totalPermisos} de {totalDisponibles} permisos seleccionados
            </span>
          </div>
        </div>
        {!isRoleAdmin && (
          <div className="rol-permisos-action-buttons">
            <button
              type="button"
              className="rol-permisos-button rol-permisos-button-primary"
              onClick={onSelectAll}
            >
              <span className="button-icon">✅</span>
              Seleccionar Todos
            </button>
            <button
              type="button"
              className="rol-permisos-button rol-permisos-button-secondary"
              onClick={onDeselectAll}
            >
              <span className="button-icon">❌</span>
              Deseleccionar Todos
            </button>
          </div>
        )}
      </div>

      <div className="rol-contenedorModulos">
        {modulos.length > 0 ? (
          <div className="rol-modulos-grid">
            {modulos.map((nombreModulo) => {
              const isExpanded = debeEstarAbierto(nombreModulo);
              const selectedCount = getSelectedCount(nombreModulo);
              const totalInModule =
                permisosAgrupados[nombreModulo]?.length || 0;
              const moduloIcon = getModuloIcon(nombreModulo);

              return (
                <div
                  key={nombreModulo}
                  className={`rol-modulo-card ${isExpanded ? "expanded" : ""}`}
                >
                  <div
                    className="rol-modulo-header"
                    onClick={() => toggleModule(nombreModulo)}
                  >
                    <div className="rol-modulo-header-left">
                      <span className="rol-modulo-icon">{moduloIcon}</span>
                      <div className="rol-modulo-info">
                        <h4 className="rol-modulo-name">{nombreModulo}</h4>
                        <span className="rol-modulo-counter">
                          {selectedCount}/{totalInModule} permisos
                        </span>
                      </div>
                    </div>
                    <div className="rol-modulo-header-right">
                      <span
                        className={`rol-modulo-toggle ${
                          isExpanded ? "expanded" : ""
                        }`}
                      >
                        ▼
                      </span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="rol-permisos-content">
                      <div className="rol-permisos-grid">
                        {(permisosAgrupados[nombreModulo] || []).map(
                          (permiso) => {
                            const isSelected =
                              permisosSeleccionadosIds.includes(
                                permiso.idPermiso
                              );
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
                              <div
                                key={permiso.idPermiso}
                                className={`rol-permiso-item ${
                                  isSelected ? "selected" : ""
                                }`}
                              >
                                <label className="rol-permiso-label">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      onTogglePermiso(permiso.idPermiso)
                                    }
                                    disabled={isRoleAdmin}
                                    className="rol-permiso-checkbox"
                                  />
                                  <span className="rol-permiso-checkmark"></span>
                                  <span className="rol-permiso-text">
                                    {displayAccion}
                                  </span>
                                </label>
                              </div>
                            );
                          }
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rol-no-permisos">
            <span className="rol-no-permisos-icon">🔒</span>
            <p>No hay permisos disponibles para asignar.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PermisosSelector;
