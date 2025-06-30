// src/features/roles/components/RolesTable.jsx
import React from 'react';
import {
  FaEdit, FaTrash, FaEye, FaUsers, FaUserShield, FaBoxOpen, FaChartBar,
  FaUserFriends, FaCalendarAlt, FaConciergeBell, FaTags, FaShoppingCart,
  FaTruckLoading, FaStore, FaListAlt, FaUserTie, FaNewspaper, FaHome, FaQuestionCircle
} from 'react-icons/fa';
import Tooltip from '../../../shared/components/common/Tooltip'; // Importar el componente Tooltip
import '../css/RolesTableExtensions.css'; // CSS adicional para los íconos de permisos

// Mapeo de nombres de módulos a íconos y un nombre legible (opcional)
const moduloIconMap = {
  DEFAULT: { icon: FaQuestionCircle, name: 'Desconocido' },
  USUARIOS: { icon: FaUsers, name: 'Usuarios' },
  ROLES: { icon: FaUserShield, name: 'Roles' },
  ABASTECIMIENTO: { icon: FaBoxOpen, name: 'Abastecimiento' },
  DASHBOARD: { icon: FaChartBar, name: 'Dashboard' },
  CLIENTES: { icon: FaUserFriends, name: 'Clientes' },
  CITAS: { icon: FaCalendarAlt, name: 'Citas' },
  SERVICIOSADMIN: { icon: FaConciergeBell, name: 'Gestión de Servicios' }, // Asumiendo 'SERVICIOSADMIN' como el módulo
  PRODUCTOSADMIN: { icon: FaTags, name: 'Gestión de Productos' }, // Asumiendo 'PRODUCTOSADMIN'
  PROVEEDORES: { icon: FaTruckLoading, name: 'Proveedores' },
  COMPRAS: { icon: FaShoppingCart, name: 'Compras' },
  VENTAS: { icon: FaStore, name: 'Ventas' },
  CATEGORIASPRODUCTOADMIN: { icon: FaListAlt, name: 'Cat. Productos' },
  CATEGORIASSERVICIOADMIN: { icon: FaListAlt, name: 'Cat. Servicios' },
  EMPLEADOS: { icon: FaUserTie, name: 'Empleados' },
  NOVEDADES: { icon: FaNewspaper, name: 'Novedades' },
  HOME: { icon: FaHome, name: 'Home' },
  // Añadir más módulos según sea necesario
};

const RolesTable = ({ roles, onView, onEdit, onDeleteConfirm, onToggleAnular }) => {

  const getPermissionsForModule = (rolPermisos, moduloNombre) => {
    if (!rolPermisos) return [];
    return rolPermisos
      .filter(p => {
        const parts = p.nombre.split('_');
        return parts.length > 2 && parts[0] === 'MODULO' && parts[1] === moduloNombre;
      })
      .map(p => {
        const parts = p.nombre.split('_');
        // Extraer la acción, ej. LEER, CREAR, GESTIONAR
        let action = parts.slice(2).join('_');
        // Capitalizar la primera letra de la acción para mejor lectura
        action = action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
        return action;
      });
  };

  return (
    <table className="rol-table">
      <thead>
        <tr>
          <th>Nombre del Rol</th>
          <th>Descripción</th>
          <th>Permisos por Módulo</th> {/* Cambiado de "Módulos Asignados" */}
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(roles) && roles.map((rol) => {
          const modulosConPermisos = new Map();
          (rol.permisos || []).forEach(p => {
            const parts = p.nombre.split('_');
            if (parts.length > 1 && parts[0] === 'MODULO') {
              const moduloNombreOriginal = parts[1];
              const moduloNombreKey = moduloNombreOriginal.toUpperCase(); // Usar la versión en mayúsculas como clave
              if (!modulosConPermisos.has(moduloNombreKey)) {
                // Guardamos la clave en mayúsculas, y el nombre original para mostrar si no hay mapeo de 'name'
                modulosConPermisos.set(moduloNombreKey, { originalName: moduloNombreOriginal, permissions: [] });
              }
              // Aquí podríamos almacenar los permisos específicos si getPermissionsForModule no lo hiciera ya
            }
          });
          const modulosParaMostrar = Array.from(modulosConPermisos.entries());

          return (
            <tr key={rol.idRol}>
              <td data-label="Nombre del Rol">{rol.nombre}</td>
              <td data-label="Descripción">{rol.descripcion}</td>
              <td data-label="Permisos por Módulo:" className="permisos-cell">
                {modulosParaMostrar.length > 0 ? (
                  modulosParaMostrar.map(([moduloKey, moduloData]) => {
                    const IconComponent = moduloIconMap[moduloKey]?.icon || moduloIconMap.DEFAULT.icon;
                    // Pasamos el nombre original del módulo (antes de toUpperCase) a getPermissionsForModule
                    // Asumiendo que getPermissionsForModule espera el nombre tal cual viene en el permiso.
                    // Si getPermissionsForModule también necesita comparar con moduloKey (MAYUS), se ajustaría allí.
                    // La función getPermissionsForModule ya filtra por parts[1] === moduloNombre, así que necesita el original.
                    // Para esto, es mejor que getPermissionsForModule reciba el nombre original del módulo.
                    // Y que modulosConPermisos almacene la clave original para la lógica de permisos.
                    // Vamos a simplificar: getPermissionsForModule usará el moduloKey (MAYUSCULAS) si los permisos
                    // en la DB también tienen esa parte en mayúsculas. Si no, hay que ser consistente.
                    // Por ahora, asumiré que la comparación en getPermissionsForModule con parts[1] debe ser insensible a mayúsculas o usar la clave original.
                    // Para evitar romper getPermissionsForModule, le pasaremos moduloData.originalName
                    const acciones = getPermissionsForModule(rol.permisos, moduloData.originalName);
                    const displayName = moduloIconMap[moduloKey]?.name || moduloData.originalName;

                    const tooltipContent = (
                      <div>
                        <strong>{displayName}:</strong>
                        <ul>
                          {acciones.map(accion => <li key={accion}>{accion}</li>)}
                        </ul>
                      </div>
                    );
                    return (
                      <Tooltip key={moduloKey} content={tooltipContent} position="top">
                        <span className="permission-icon-wrapper" tabIndex={0}>
                          <IconComponent size="1.5em" className="rol-permission-table-icon" />
                        </span>
                      </Tooltip>
                    );
                  })
                ) : (
                  'Ninguno'
                )}
              </td>
              <td data-label="Estado">
                {rol.nombre !== "Administrador" ? (
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={rol.estado}
                      onChange={() => onToggleAnular(rol)}
                    />
                    <span className="slider"></span>
                  </label>
                ) : (
                  <span>No Aplicable</span>
                )}
              </td>
              <td data-label="Acciones">
                <div className="rol-table-iconos">
                  <button className="rol-table-button" onClick={() => onView(rol)} title="Ver Detalles">
                    <FaEye />
                  </button>
                  {rol.nombre !== "Administrador" && (
                    <>
                      <button className="rol-table-button" onClick={() => onEdit(rol)} title="Editar Rol">
                        <FaEdit />
                      </button>
                      <button className="rol-table-button rol-table-button-delete" onClick={() => onDeleteConfirm(rol)} title="Eliminar Rol">
                        <FaTrash />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default RolesTable;