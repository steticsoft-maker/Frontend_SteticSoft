// src/features/roles/components/RolesTable.jsx
import React from "react";
import "../../../shared/styles/table-common.css";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaUsers,
  FaUserShield,
  FaBoxOpen,
  FaChartBar,
  FaUserFriends,
  FaCalendarAlt,
  FaConciergeBell,
  FaTags,
  FaShoppingCart,
  FaTruckLoading,
  FaStore,
  FaListAlt,
  FaUserTie,
  FaNewspaper,
  FaHome,
  FaQuestionCircle,
  FaArchive,
  FaStar,
  FaShoppingBag,
  FaClipboardCheck,
  FaFolderOpen,
  FaWrench,
  FaHistory,
} from "react-icons/fa";
import Tooltip from "../../../shared/components/common/Tooltip"; // Importar el componente Tooltip
import "../css/RolesTableExtensions.css"; // CSS adicional para los íconos de permisos

// Mapeo de nombres de módulos a íconos y un nombre legible (opcional)
// Asegúrate de que currentPage y rowsPerPage tengan valores por defecto si no se proporcionan
const moduloIconMap = {
  DEFAULT: { icon: FaQuestionCircle, name: "Desconocido" },
  USUARIOS: { icon: FaUsers, name: "Usuarios" },
  ROLES: { icon: FaUserShield, name: "Roles" },
  ABASTECIMIENTO: { icon: FaBoxOpen, name: "Abastecimiento" },
  DASHBOARD: { icon: FaChartBar, name: "Dashboard" },
  CLIENTES: { icon: FaUserFriends, name: "Clientes" },
  CITAS: { icon: FaCalendarAlt, name: "Citas" },
  SERVICIOSADMIN: { icon: FaConciergeBell, name: "Gestión de Servicios" }, // Asumiendo 'SERVICIOSADMIN' como el módulo
  PRODUCTOSADMIN: { icon: FaTags, name: "Gestión de Productos" }, // Asumiendo 'PRODUCTOSADMIN'
  PROVEEDORES: { icon: FaTruckLoading, name: "Proveedores" },
  COMPRAS: { icon: FaShoppingCart, name: "Compras" },
  VENTAS: { icon: FaStore, name: "Ventas" },
  CATEGORIASPRODUCTOADMIN: { icon: FaArchive, name: "Cat. Productos" },
  CATEGORIASSERVICIOADMIN: { icon: FaListAlt, name: "Cat. Servicios" },
  EMPLEADOS: { icon: FaUserTie, name: "Empleados" },
  NOVEDADES: { icon: FaNewspaper, name: "Novedades" },
  HOME: { icon: FaHome, name: "Home" },
  // Nuevos módulos y correcciones basadas en la retroalimentación del usuario
  ESPECIALIDADES: { icon: FaStar, name: "Especialidades" },
  PRODUCTOS: { icon: FaShoppingBag, name: "Productos" }, // Diferente de PRODUCTOSADMIN
  ESTADOS: { icon: FaClipboardCheck, name: "Estados" },
  PERMISOS: { icon: FaUserShield, name: "Permisos (Roles)" }, // Mapea a Roles si la clave es PERMISOS
  CATEGORIAS: { icon: FaFolderOpen, name: "Categorías Genéricas" }, // Para una clave genérica CATEGORIAS
  SERVICIOS: { icon: FaWrench, name: "Servicios" }, // Diferente de SERVICIOSADMIN
  ABAST: { icon: FaBoxOpen, name: "Abastecimiento (Alt.)" }, // Alias para ABASTECIMIENTO si la clave es ABAST
  ABAS: { icon: FaBoxOpen, name: "Abastecimiento (Abv.)" }, // Otra posible abreviatura para Abastecimiento
  // Mantener los existentes y añadir más módulos según sea necesario
};

const RolesTable = ({
  roles,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleAnular,
  onHistory,
  currentPage = 1, // Valor por defecto para currentPage
  rowsPerPage = roles ? roles.length : 10, // Valor por defecto para rowsPerPage
}) => {
  const getPermissionsForModule = (rolPermisos, moduloNombre) => {
    if (!rolPermisos) return [];
    return rolPermisos
      .filter((p) => {
        const parts = p.nombre.split("_");
        return (
          parts.length > 2 && parts[0] === "MODULO" && parts[1] === moduloNombre
        );
      })
      .map((p) => {
        const parts = p.nombre.split("_");
        // Extraer la acción, ej. LEER, CREAR, GESTIONAR
        let action = parts.slice(2).join("_");
        // Capitalizar la primera letra de la acción para mejor lectura
        action = action.charAt(0).toUpperCase() + action.slice(1).toLowerCase();
        return {
          action: action,
          fullName: p.nombre,
          id: p.idPermiso,
        };
      });
  };

  return (
    <table className="rol-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre del Rol</th>
          <th>Descripción</th>
          <th>Permisos por Módulo</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(roles) &&
          roles.map((rol, index) => {
            const numeroFila = (currentPage - 1) * rowsPerPage + index + 1;
            const modulosConPermisos = new Map();
            (rol.permisos || []).forEach((p) => {
              const parts = p.nombre.split("_");
              if (parts.length > 1 && parts[0] === "MODULO") {
                const moduloNombreOriginal = parts[1];
                const moduloNombreKey = moduloNombreOriginal.toUpperCase();
                if (!modulosConPermisos.has(moduloNombreKey)) {
                  modulosConPermisos.set(moduloNombreKey, {
                    originalName: moduloNombreOriginal,
                    permissions: [],
                  });
                }
              }
            });
            const modulosParaMostrar = Array.from(modulosConPermisos.entries());

            return (
              <tr key={rol.idRol}>
                <td data-label="#">{numeroFila}</td>
                <td data-label="Nombre del Rol">{rol.nombre}</td>
                <td data-label="Descripción">{rol.descripcion}</td>
                <td data-label="Permisos por Módulo:" className="permisos-cell">
                  {modulosParaMostrar.length > 0
                    ? modulosParaMostrar.map(([moduloKey, moduloData]) => {
                        const IconComponent =
                          moduloIconMap[moduloKey]?.icon ||
                          moduloIconMap.DEFAULT.icon;
                        const permisos = getPermissionsForModule(
                          rol.permisos,
                          moduloData.originalName
                        );
                        const displayName =
                          moduloIconMap[moduloKey]?.name ||
                          moduloData.originalName;

                        // Mostrar un solo icono por módulo con tooltip que liste todos los permisos
                        if (permisos.length > 0) {
                          // Función para dividir permisos en columnas
                          const formatPermissionsInColumns = (permissions) => {
                            const totalPermissions = permissions.length;
                            let columns = 1;

                            // Determinar número de columnas según cantidad de permisos
                            if (totalPermissions <= 3) {
                              columns = 1;
                            } else if (totalPermissions <= 6) {
                              columns = 2;
                            } else {
                              columns = 3;
                            }

                            const itemsPerColumn = Math.ceil(
                              totalPermissions / columns
                            );
                            const columnsData = [];

                            // Dividir permisos en columnas
                            for (let i = 0; i < columns; i++) {
                              const start = i * itemsPerColumn;
                              const end = Math.min(
                                start + itemsPerColumn,
                                totalPermissions
                              );
                              columnsData.push(permissions.slice(start, end));
                            }

                            // Crear texto formateado en columnas
                            let result = `${displayName}\n\n`;

                            // Calcular el ancho máximo de cada columna para alineación
                            const maxColumnWidth = Math.max(
                              ...columnsData.map((col) =>
                                Math.max(...col.map((p) => p.action.length))
                              )
                            );

                            // Formatear cada fila
                            const maxRows = Math.max(
                              ...columnsData.map((col) => col.length)
                            );
                            for (let row = 0; row < maxRows; row++) {
                              let rowText = "";
                              for (let col = 0; col < columns; col++) {
                                if (columnsData[col][row]) {
                                  const permission =
                                    columnsData[col][row].action;
                                  const paddedPermission = permission.padEnd(
                                    maxColumnWidth + 2
                                  );
                                  rowText += `• ${paddedPermission}`;
                                } else {
                                  rowText += " ".repeat(maxColumnWidth + 4);
                                }
                              }
                              result += rowText.trim() + "\n";
                            }

                            return result.trim();
                          };

                          const permissionsText =
                            formatPermissionsInColumns(permisos);

                          return (
                            <Tooltip key={moduloKey} text={permissionsText}>
                              <span
                                className="permission-icon-wrapper"
                                tabIndex={0}
                              >
                                <IconComponent
                                  size="1.4em"
                                  className="rol-permission-table-icon"
                                />
                              </span>
                            </Tooltip>
                          );
                        }

                        // Fallback si no hay permisos
                        return null;
                      })
                    : "Ninguno"}
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
                  <div className="table-iconos">
                    <button
                      className="table-button btn-view"
                      onClick={() => onView(rol)}
                      title="Ver Detalles"
                    >
                      <FaEye />
                    </button>
                    <button
                      className="table-button btn-history"
                      onClick={() => onHistory(rol)}
                      title="Ver Historial de Cambios"
                    >
                      <FaHistory />
                    </button>
                    {rol.nombre !== "Administrador" && (
                      <>
                        <button
                          className="table-button btn-edit"
                          onClick={() => onEdit(rol)}
                          title="Editar Rol"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="table-button btn-delete"
                          onClick={() => onDeleteConfirm(rol)}
                          title="Eliminar Rol"
                        >
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
