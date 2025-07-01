// src/features/roles/components/PermisosSelector.jsx
import React, { useState, useEffect } from 'react';
import { FiChevronDown, FiChevronRight, FiPackage, FiUsers, FiSettings, FiShoppingCart, FiDollarSign, FiFileText, FiBarChart2 } from 'react-icons/fi'; // Ejemplos de iconos

const PermisosSelector = ({ permisosAgrupados, permisosSeleccionadosIds, onTogglePermiso, onToggleAllPermisos, isRoleAdmin, mostrar }) => {
  const [openModules, setOpenModules] = useState({}); // Estado para acordeón: { moduloName: true/false }

  if (!mostrar && !isRoleAdmin) {
    return null;
  }

  const modulos = Object.keys(permisosAgrupados || {});

  useEffect(() => {
    // Inicializar todos los módulos como cerrados por defecto
    const initialOpenState = {};
    modulos.forEach(nombreModulo => {
      initialOpenState[nombreModulo] = false;
    });
    setOpenModules(initialOpenState);
  }, [permisosAgrupados]); // Se ejecuta si permisosAgrupados cambia


  const toggleModuleOpen = (nombreModulo) => {
    setOpenModules(prev => ({ ...prev, [nombreModulo]: !prev[nombreModulo] }));
  };

  const handleToggleModulePermissions = (nombreModulo, selectAll) => {
    if (isRoleAdmin) return;
    const permisosDelModulo = (permisosAgrupados[nombreModulo] || []).map(p => p.idPermiso);
    onToggleAllPermisos(permisosDelModulo, selectAll);
  };

  const handleSelectAllGlobal = () => {
    if (isRoleAdmin) return;
    const allPermisoIds = modulos.flatMap(nombreModulo =>
      (permisosAgrupados[nombreModulo] || []).map(p => p.idPermiso)
    );
    onToggleAllPermisos(allPermisoIds, true); // true para seleccionar todos
  };

  const handleDeselectAllGlobal = () => {
    if (isRoleAdmin) return;
    const allPermisoIds = modulos.flatMap(nombreModulo =>
      (permisosAgrupados[nombreModulo] || []).map(p => p.idPermiso)
    );
    onToggleAllPermisos(allPermisoIds, false); // false para deseleccionar todos
  };

  const getModuleIcon = (moduleName) => {
    // Mapeo simple de nombres de módulo a iconos
    // Puedes expandir esto según los nombres reales de tus módulos
    const upperModuleName = moduleName.toUpperCase();
    if (upperModuleName.includes("USUARIO")) return <FiUsers className="rol-module-icon" />;
    if (upperModuleName.includes("ROL")) return <FiSettings className="rol-module-icon" />;
    if (upperModuleName.includes("PRODUCTO")) return <FiPackage className="rol-module-icon" />;
    if (upperModuleName.includes("COMPRA")) return <FiShoppingCart className="rol-module-icon" />;
    if (upperModuleName.includes("VENTA")) return <FiDollarSign className="rol-module-icon" />;
    if (upperModuleName.includes("CATEGORIA")) return <FiFileText className="rol-module-icon" />;
    return <FiBarChart2 className="rol-module-icon" />; // Icono por defecto
  };


  return (
    <div className="rol-seccionSeleccionarModulos">
      <h3>Asignar Permisos</h3>
      {!isRoleAdmin && (
        <div className="rol-botonesMarcarGlobal">
          <button type="button" onClick={handleSelectAllGlobal} className="rol-botonMarcarTodos">
            Marcar Todos
          </button>
          <button type="button" onClick={handleDeselectAllGlobal} className="rol-botonDesmarcarTodos">
            Desmarcar Todos
          </button>
        </div>
      )}
      <div className="rol-contenedorAcordeon">
        {modulos.length > 0 ? (
          modulos.map((nombreModulo) => {
            const permisosDelModulo = permisosAgrupados[nombreModulo] || [];
            const todosSeleccionadosEnModulo = permisosDelModulo.length > 0 && permisosDelModulo.every(p => (permisosSeleccionadosIds || []).includes(p.idPermiso));
            const isOpen = openModules[nombreModulo];

            return (
              <div key={nombreModulo} className="rol-acordeon-item">
                <div className="rol-acordeon-header" onClick={() => toggleModuleOpen(nombreModulo)}>
                  {getModuleIcon(nombreModulo)}
                  <span className="rol-acordeon-module-name">Módulo: {nombreModulo}</span>
                  {!isRoleAdmin && (
                    <input
                      type="checkbox"
                      className="rol-acordeon-module-checkbox"
                      checked={todosSeleccionadosEnModulo}
                      onChange={(e) => {
                        e.stopPropagation(); // Evitar que el click en el checkbox abra/cierre el acordeón
                        handleToggleModulePermissions(nombreModulo, e.target.checked);
                      }}
                      disabled={isRoleAdmin}
                      title={todosSeleccionadosEnModulo ? "Desmarcar todos los permisos de este módulo" : "Marcar todos los permisos de este módulo"}
                    />
                  )}
                  <span className="rol-acordeon-toggle-icon">
                    {isOpen ? <FiChevronDown /> : <FiChevronRight />}
                  </span>
                </div>
                {isOpen && (
                  <div className="rol-acordeon-content">
                    <div className="rol-permisos-grid">
                      {permisosDelModulo.map((permiso) => {
                        // Extraer la acción del nombre del permiso. Ej: MODULO_USUARIOS_CREAR -> CREAR
                        const parts = permiso.nombre.split('_');
                        let accionName = permiso.nombre;
                        if (parts.length > 2 && parts[0] === "MODULO") {
                          accionName = parts.slice(2).join('_');
                        }
                        const displayAccion = accionName.split('_')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                          .join(' ');

                        return (
                          <div key={permiso.idPermiso} className="rol-permiso-item">
                            <input
                              type="checkbox"
                              id={`permiso-${permiso.idPermiso}`}
                              checked={(permisosSeleccionadosIds || []).includes(permiso.idPermiso)}
                              onChange={() => onTogglePermiso(permiso.idPermiso)}
                              disabled={isRoleAdmin}
                            />
                            <label htmlFor={`permiso-${permiso.idPermiso}`}>{displayAccion}</label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <p>No hay permisos disponibles para asignar.</p>
        )}
      </div>
    </div>
  );
};

export default PermisosSelector;