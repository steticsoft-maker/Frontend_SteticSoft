import React, { useState, useMemo, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/authHooks';
import { menuItemsConfig } from '../../config/navigationConfig.jsx'; // Importar la configuración central
import './AdminSidebar.css'; // Importar el CSS renombrado
import { FaUserCircle, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { user, permissions, logout } = useAuth(); // Obtener user, permissions y logout

  const [openSubMenus, setOpenSubMenus] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // El núcleo de la lógica de permisos: robusta y centralizada.
  const hasPermission = useCallback((requiredPermission) => {
    // Si no se requiere permiso, el acceso es concedido.
    if (!requiredPermission) {
      return true;
    }
    // El rol "Administrador" tiene acceso total, sin importar los permisos individuales.
    if (user?.rol?.nombre === 'Administrador') {
      return true;
    }
    // Para otros roles, verificar si el permiso está en la lista de permisos del usuario.
    return permissions && permissions.includes(requiredPermission);
  }, [user, permissions]);

  // El núcleo de la lógica de renderizado: un menú filtrado y memoizado.
  const filteredMenu = useMemo(() => {
    // Primero, procesar los sub-ítems de cada menú desplegable.
    const menuWithFilteredSubItems = menuItemsConfig.map(item => {
      if (item.subItems) {
        const accessibleSubItems = item.subItems.filter(subItem => hasPermission(subItem.requiredPermission));
        return { ...item, subItems: accessibleSubItems };
      }
      return item;
    });

    // Después, filtrar el menú principal.
    return menuWithFilteredSubItems.filter(item => {
      // Si es un menú desplegable, solo mostrarlo si tiene sub-ítems visibles.
      if (item.subItems) {
        return item.subItems.length > 0;
      }
      // Si es un enlace directo, mostrarlo solo si el usuario tiene el permiso.
      return hasPermission(item.requiredPermission);
    });
  }, [hasPermission]);

  const toggleSubMenu = (key) => {
    // Permite que múltiples submenús estén abiertos a la vez.
    setOpenSubMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogoutClick = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation">
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      <aside className={`admin-sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="user-section">
            <FaUserCircle className="user-icon" />
            <div className="user-info">
              <p className="user-name">{user?.nombre || 'Usuario'}</p>
              <p className="user-role">{user?.rol?.nombre || 'Rol'}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {filteredMenu.map((item) => (
            <div key={item.label} className="menu-item">
              {item.subItems ? (
                <button onClick={() => toggleSubMenu(item.subMenuKey)} className="nav-link has-submenu">
                  {item.icon}
                  <span className="nav-label">{item.label}</span>
                </button>
              ) : (
                <Link to={item.path} className="nav-link" onClick={handleLinkClick}>
                  {item.icon}
                  <span className="nav-label">{item.label}</span>
                </Link>
              )}
              {item.subItems && openSubMenus[item.subMenuKey] && (
                <div className="submenu">
                  {item.subItems.map((subItem) => (
                    <Link to={subItem.path} key={subItem.label} className="submenu-link" onClick={handleLinkClick}>
                      {subItem.icon}
                      <span className="nav-label">{subItem.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogoutClick} className="nav-link logout-button">
            <FaSignOutAlt />
            <span className="nav-label">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;