// src/features/roles/components/RolesTable.jsx
import React from 'react';
import {
  FaEdit, FaTrash, FaEye, FaKey, FaUsers, FaUserTie, FaTruck, FaBoxOpen,
  FaCut, FaShoppingCart, FaCashRegister, FaCalendarAlt, FaDolly,
  FaChartBar, FaUserLock, FaToggleOn, FaStar, FaTags, FaClock, FaUserCog, FaQuestionCircle
} from 'react-icons/fa';
import '../css/RolesTableTooltips.css'; // Importar CSS para tooltips

// Mapeo de módulos a iconos
const moduleIcons = {
  DEFAULT: FaQuestionCircle,
  ROLES: FaKey,
  USUARIOS: FaUsers,
  CLIENTES: FaUserTie,
  PROVEEDORES: FaTruck,
  PRODUCTOS: FaBoxOpen,
  SERVICIOS: FaCut,
  COMPRAS: FaShoppingCart,
  VENTAS: FaCashRegister,
  CITAS: FaCalendarAlt,
  ABASTECIMIENTOS: FaDolly,
  DASHBOARD: FaChartBar,
  PERMISOS: FaUserLock,
  ESTADOS: FaToggleOn,
  ESPECIALIDADES: FaStar,
  CATEGORIASPRODUCTOS: FaTags, // Nombre de módulo sin guion bajo para clave de objeto
  CATEGORIASSERVICIOS: FaTags, // Nombre de módulo sin guion bajo
  NOVEDADESEMPLEADOS: FaClock,
  EMPLEADOS: FaUserCog,
  // Añadir más según sea necesario
};

const getModuleFromPermission = (permissionName) => {
  if (permissionName.startsWith("MODULO_")) {
    const parts = permissionName.split("_");
    if (parts.length > 1) {
      // Une todas las partes del nombre del módulo si son compuestas, ej. CATEGORIAS_PRODUCTOS
      return parts.slice(1, parts.length -1).join("").toUpperCase();
    }
  }
  return null;
};


const RolesTable = ({ roles, onView, onEdit, onDeleteConfirm, onToggleAnular }) => {

  const renderPermisosIconos = (permisosRol) => {
    if (!permisosRol || permisosRol.length === 0) {
      return 'Ninguno';
    }

    const permisosAgrupadosPorModulo = permisosRol.reduce((acc, permiso) => {
      const moduleKey = getModuleFromPermission(permiso.nombre);
      if (moduleKey) {
        if (!acc[moduleKey]) {
          acc[moduleKey] = {
            icon: moduleIcons[moduleKey] || moduleIcons.DEFAULT,
            permisosCompletos: []
          };
        }
        acc[moduleKey].permisosCompletos.push(permiso.nombre);
      }
      return acc;
    }, {});

    return (
      <div className="permisos-icon-container">
        {Object.entries(permisosAgrupadosPorModulo).map(([moduloNombre, data]) => {
          const IconComponent = data.icon;
          const tooltipText = data.permisosCompletos.join('\n');
          return (
            <span key={moduloNombre} className="permiso-icon-wrapper" title={tooltipText}>
              <IconComponent />
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <table className="rol-table">
      <thead>
        <tr>
          <th>Nombre del Rol</th>
          <th>Descripción</th>
          <th>Módulos Asignados</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {Array.isArray(roles) && roles.map((rol) => (
          <tr key={rol.idRol}>
            <td data-label="Nombre del Rol">{rol.nombre}</td>
            <td data-label="Descripción">{rol.descripcion}</td>
            <td data-label="Módulos Asignados">
              {renderPermisosIconos(rol.permisos)}
            </td>
            <td data-label="Estado">
              {rol.nombre !== "Administrador" ? (
                <label className="switch">
                  <input
                    type="checkbox"
                    // CORRECIÓN 3: Usamos 'rol.estado' y lo invertimos para el visual del switch si es necesario (ej. si 'anulado' es opuesto a 'activo')
                    // Asumiendo que 'estado: true' es Activo y 'estado: false' es Inactivo/Anulado.
                    checked={rol.estado}
                    // CORRECIÓN 4: La función espera el objeto 'rol' completo.
                    onChange={() => onToggleAnular(rol)}
                  />
                  <span className="slider"></span>
                </label>
              ) : (
                <span>No Aplicable</span>
              )}
            </td>
            <td data-label="Acciones:">
              <div className="rol-table-iconos">
                <button className="rol-table-button" onClick={() => onView(rol)} title="Ver Detalles">
                  <FaEye />
                </button>
                {/* La lógica para deshabilitar botones en el rol "Administrador" se mantiene */}
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
        ))}
      </tbody>
    </table>
  );
};

export default RolesTable;