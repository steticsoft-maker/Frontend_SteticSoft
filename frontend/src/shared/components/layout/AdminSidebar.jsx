import React, { useState, useMemo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authHooks";
import { menuItemsConfig } from "../../config/navigationConfig.jsx"; // Importar la configuración central
import ThemeToggle from "../common/ThemeToggle";
import UserProfileCard from "../common/UserProfileCard";
import "./AdminSidebar.css"; // Importar el CSS renombrado
import {
  FaUserCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
  FaHome,
} from "react-icons/fa";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { user, permissions, logout } = useAuth(); // Obtener user, permissions y logout

  // Validación de datos críticos
  if (!logout) {
    console.error("AdminSidebar: logout function not available");
    return <div>Error: Función de logout no disponible</div>;
  }

  const [openSubMenus, setOpenSubMenus] = useState({});
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // El núcleo de la lógica de permisos: robusta y centralizada.
  const hasPermission = useCallback(
    (requiredPermission) => {
      // Si no se requiere permiso, el acceso es concedido.
      if (!requiredPermission) {
        return true;
      }
      // El rol "Administrador" tiene acceso total, sin importar los permisos individuales.
      if (user?.rol?.nombre === "Administrador") {
        return true;
      }
      // Para otros roles, verificar si el permiso está en la lista de permisos del usuario.
      return permissions && permissions.includes(requiredPermission);
    },
    [user, permissions]
  );

  // El núcleo de la lógica de renderizado: un menú filtrado y memoizado.
  const filteredMenu = useMemo(() => {
    // Primero, procesar los sub-ítems de cada menú desplegable.
    const menuWithFilteredSubItems = menuItemsConfig.map((item) => {
      if (item.subItems) {
        const accessibleSubItems = item.subItems.filter((subItem) =>
          hasPermission(subItem.requiredPermission)
        );
        return { ...item, subItems: accessibleSubItems };
      }
      return item;
    });

    // Después, filtrar el menú principal.
    return menuWithFilteredSubItems.filter((item) => {
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
    setOpenSubMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLinkClick = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    // Cerrar todos los submenús abiertos al navegar
    setOpenSubMenus({});
  };

  const handleLogoutClick = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      // Fallback: navegar directamente al login
      navigate("/login");
    }
  };

  // Verificar si el usuario tiene permisos para acceder al landing
  const canAccessLanding = useMemo(() => {
    // Si es administrador, puede acceder a todo
    if (user?.rol?.nombre === "Administrador") {
      return true;
    }
    // Verificar permisos específicos para el landing
    return (
      permissions &&
      (permissions.includes("MODULO_PRODUCTOS_VER") ||
        permissions.includes("MODULO_SERVICIOS_VER") ||
        permissions.includes("MODULO_CITAS_GESTIONAR"))
    );
  }, [user, permissions]);

  const handleLandingClick = () => {
    navigate("/");
  };

  return (
    <>
      <button
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      <aside className={`dashboard-sidebar ${isMobileMenuOpen ? "open" : ""}`}>
        {/* Componente mejorado de información del usuario */}
        {user && (
          <UserProfileCard
            user={user}
            onLogout={handleLogoutClick}
            onSettings={() => navigate("/admin/configuracion")}
          />
        )}

        {/* Botón de navegación al landing */}
        {canAccessLanding && (
          <div className="landing-navigation">
            <button
              className="landing-button"
              onClick={handleLandingClick}
              title="Ir al sitio web principal"
            >
              <FaHome className="landing-icon" />
              <span>Inicio</span>
            </button>
          </div>
        )}

        <nav className="dashboard-links">
          {filteredMenu.map((item) => (
            <div key={item.label}>
              {item.subItems ? (
                <button
                  onClick={() => toggleSubMenu(item.subMenuKey)}
                  className="dashboard-link"
                >
                  <span className="dashboard-icon">{item.icon}</span>
                  <span className="dashboard-link-label">{item.label}</span>
                </button>
              ) : (
                <Link
                  to={item.path}
                  className="dashboard-link"
                  onClick={handleLinkClick}
                >
                  <span className="dashboard-icon">{item.icon}</span>
                  <span className="dashboard-link-label">{item.label}</span>
                </Link>
              )}
              {item.subItems && openSubMenus[item.subMenuKey] && (
                <div className="nested-links">
                  {item.subItems.map((subItem) => (
                    <Link
                      to={subItem.path}
                      key={subItem.label}
                      className="nested-link"
                      onClick={handleLinkClick}
                    >
                      <span className="dashboard-icon">{subItem.icon}</span>
                      <span className="dashboard-link-label">
                        {subItem.label}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Contenedor para empujar los botones al final */}
        <div className="sidebar-footer">
          {/* Botón de cambio de tema */}
          <div className="theme-section">
            <ThemeToggle className="sidebar-theme-toggle" />
          </div>

          {/* Botón de logout */}
          <button
            onClick={handleLogoutClick}
            className="dashboard-link logout-button"
          >
            <span className="dashboard-icon">
              <FaSignOutAlt />
            </span>
            <span className="dashboard-link-label">Cerrar Sesión</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
