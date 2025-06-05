import React, { useState, useContext, useMemo } from 'react'; // Agregado useMemo
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import {
  FaUserCircle, FaRandom, FaUsers, FaClipboardList,
  FaChartLine, FaSignOutAlt, FaCalendarCheck, FaShoppingCart,
} from 'react-icons/fa';
import './NavbarAdmin.css';

// Estructura del menú con el permiso requerido para cada ruta.
const menuItemsConfig = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: FaChartLine, requiredPermission: 'MODULO_DASHBOARD_VER' },
  {
    label: 'Configuración', icon: FaRandom, subMenuKey: 'configuracion',
    subItems: [
      { label: 'Roles', path: '/admin/roles', requiredPermission: 'MODULO_ROLES_GESTIONAR' },
      { label: 'Usuarios', path: '/admin/usuarios', requiredPermission: 'MODULO_USUARIOS_GESTIONAR' },
    ],
  },
  {
    label: 'Ventas', icon: FaClipboardList, subMenuKey: 'ventas',
    subItems: [
      { label: 'Ventas', path: '/admin/ventas', requiredPermission: 'MODULO_VENTAS_GESTIONAR' },
      { label: 'Clientes', path: '/admin/clientes', requiredPermission: 'MODULO_CLIENTES_GESTIONAR' },
      { label: 'Servicios', path: '/admin/servicios-admin', requiredPermission: 'MODULO_SERVICIOS_GESTIONAR' },
      { label: 'Categoría Servicios', path: '/admin/categorias-servicio', requiredPermission: 'MODULO_CATEGORIAS_SERVICIOS_GESTIONAR' },
      { label: 'Productos', path: '/admin/productos-admin', requiredPermission: 'MODULO_PRODUCTOS_GESTIONAR' },
      { label: 'Categoría Productos', path: '/admin/categorias-producto', requiredPermission: 'MODULO_CATEGORIAS_PRODUCTOS_GESTIONAR' },
    ],
  },
  {
    label: 'Compras', icon: FaShoppingCart, subMenuKey: 'compras',
    subItems: [
      { label: 'Compras', path: '/admin/compras', requiredPermission: 'MODULO_COMPRAS_GESTIONAR' },
      { label: 'Proveedores', path: '/admin/proveedores', requiredPermission: 'MODULO_PROVEEDORES_GESTIONAR' },
      { label: 'Abastecimiento', path: '/admin/abastecimiento', requiredPermission: 'MODULO_ABASTECIMIENTOS_GESTIONAR' },
    ],
  },
  {
    label: 'Citas', icon: FaCalendarCheck, subMenuKey: 'citas',
    subItems: [
      { label: 'Horario de Citas', path: '/admin/horarios', requiredPermission: 'MODULO_NOVEDADES_EMPLEADOS_GESTIONAR' },
      { label: 'Citas', path: '/admin/citas', requiredPermission: 'MODULO_CITAS_GESTIONAR' },
    ],
  },
];


const NavbarAdmin = () => {
  const navigate = useNavigate();
  // Obtenemos 'logout' y la lista de 'permissions' del usuario desde el contexto.
  const { logout, permissions } = useContext(AuthContext);

  const [openSubMenus, setOpenSubMenus] = useState({});

  // Función para verificar si el usuario tiene un permiso.
  const hasPermission = (permission) => {
    // Si no se requiere permiso, se muestra. Si se requiere, se verifica.
    return !permission || (permissions && permissions.includes(permission));
  };

  // Usamos useMemo para filtrar el menú solo cuando los permisos cambien.
  // Esto mejora el rendimiento.
  const filteredMenu = useMemo(() => {
    return menuItemsConfig.map(item => {
      // Si el item tiene sub-items, filtramos los sub-items primero.
      if (item.subItems) {
        const accessibleSubItems = item.subItems.filter(subItem => hasPermission(subItem.requiredPermission));
        // Devolvemos el item principal solo si tiene sub-items accesibles.
        return { ...item, subItems: accessibleSubItems };
      }
      // Si es un item principal sin sub-menú, lo devolvemos tal cual (se filtrará después).
      return item;
    }).filter(item => {
      // Un item se muestra si:
      // 1. No tiene sub-items Y el usuario tiene permiso para él.
      // 2. Tiene sub-items Y la lista de sub-items accesibles no está vacía.
      if (item.subItems) {
        return item.subItems.length > 0;
      }
      return hasPermission(item.requiredPermission);
    });
  }, [permissions]); // La dependencia es 'permissions'.

  const toggleSubMenu = (key) => {
    setOpenSubMenus(prev => ({ [key]: !prev[key] }));
  };

  const handleLogoutClick = () => {
    logout();
    navigate('/login');
  };
  
  return (
    <aside className="dashboard-sidebar">
      <div className="admin-section">
        <FaUserCircle className="admin-icon" />
        <p className="admin-label">Admin</p>
      </div>
      <nav className="dashboard-links">
        {/* Mapeamos sobre el menú ya filtrado */}
        {filteredMenu.map((item) => (
          <React.Fragment key={item.label}>
            {item.subItems ? (
              // Botón para desplegar submenú
              <button onClick={() => toggleSubMenu(item.subMenuKey)} className="dashboard-link">
                {item.icon && <item.icon className="dashboard-icon" />} {item.label}
              </button>
            ) : (
              // Enlace directo
              <Link to={item.path} className="dashboard-link">
                {item.icon && <item.icon className="dashboard-icon" />} {item.label}
              </Link>
            )}
            {/* Si hay sub-items y el submenú está abierto, los mostramos */}
            {item.subItems && openSubMenus[item.subMenuKey] && (
              <div className="nested-links">
                {item.subItems.map((subItem) => (
                  <Link to={subItem.path} key={subItem.label} className="nested-link">
                    {subItem.icon && <subItem.icon className="dashboard-icon" />} {subItem.label}
                  </Link>
                ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="logout-section">
        <button onClick={handleLogoutClick} className="dashboard-link logout-button">
          <FaSignOutAlt className="dashboard-icon" /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default NavbarAdmin;