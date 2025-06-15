import React, { useState, useMemo, useCallback } from 'react'; // useCallback imported
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authHooks'; // Updated import path
import {
  FaUserCircle, FaRandom, FaUsers, FaClipboardList,
  FaChartLine, FaSignOutAlt, FaCalendarCheck, FaShoppingCart,
} from 'react-icons/fa';
import './NavbarAdmin.css';

// La configuración del menú está perfecta, no necesita cambios.
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
  // Corregido: Usamos nuestro hook personalizado useAuth(). ¡Más limpio y funciona!
  const { logout, permissions } = useAuth();

  const [openSubMenus, setOpenSubMenus] = useState({});

  const hasPermission = useCallback((permission) => { // Wrapped in useCallback
    return !permission || (permissions && permissions.includes(permission));
  }, [permissions]); // permissions as dependency for useCallback

  const filteredMenu = useMemo(() => {
    return menuItemsConfig.map(item => {
      if (item.subItems) {
        const accessibleSubItems = item.subItems.filter(subItem => hasPermission(subItem.requiredPermission));
        return { ...item, subItems: accessibleSubItems };
      }
      return item;
    }).filter(item => {
      if (item.subItems) {
        return item.subItems.length > 0;
      }
      return hasPermission(item.requiredPermission);
    });
  }, [hasPermission]); // Dependency array now only has hasPermission

  const toggleSubMenu = (key) => {
    setOpenSubMenus(prev => ({ [key]: !prev[key] }));
  };

  const handleLogoutClick = async () => {
    // Es buena práctica hacer la función de logout asíncrona por si en el futuro
    // la llamada a la API de logout tarda un poco.
    await logout();
    navigate('/login');
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="admin-section">
        <FaUserCircle className="admin-icon" />
        <p className="admin-label">Admin</p>
      </div>
      <nav className="dashboard-links">
        {filteredMenu.map((item) => (
          <React.Fragment key={item.label}>
            {item.subItems ? (
              <button onClick={() => toggleSubMenu(item.subMenuKey)} className="dashboard-link">
                {item.icon && <item.icon className="dashboard-icon" />} {item.label}
              </button>
            ) : (
              <Link to={item.path} className="dashboard-link">
                {item.icon && <item.icon className="dashboard-icon" />} {item.label}
              </Link>
            )}
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