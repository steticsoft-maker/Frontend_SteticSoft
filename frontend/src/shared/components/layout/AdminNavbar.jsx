// src/shared/components/layout/AdminNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authHooks";
import ThemeToggle from "../common/ThemeToggle";
import useNavbarScroll from "../../hooks/useNavbarScroll";
import "./Navbar.css";
import {
  FaUser,
  FaSignOutAlt,
  FaCogs,
  FaBars,
  FaTimes,
  FaHome,
} from "react-icons/fa";

function AdminNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isScrolled = useNavbarScroll();

  const handleLogoutClick = async () => {
    await logout();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Verificar si el usuario tiene permisos para acceder a administración
  const canAccessAdmin =
    user?.rol?.nombre === "Administrador" ||
    (user?.permisos &&
      user.permisos.some(
        (permiso) =>
          permiso.includes("MODULO_DASHBOARD_VER") ||
          permiso.includes("MODULO_ROLES_GESTIONAR") ||
          permiso.includes("MODULO_USUARIOS_GESTIONAR") ||
          permiso.includes("MODULO_ABASTECIMIENTOS_GESTIONAR") ||
          permiso.includes("MODULO_CLIENTES_GESTIONAR") ||
          permiso.includes("MODULO_PROVEEDORES_GESTIONAR") ||
          permiso.includes("MODULO_PRODUCTOS_GESTIONAR") ||
          permiso.includes("MODULO_SERVICIOS_GESTIONAR") ||
          permiso.includes("MODULO_CITAS_GESTIONAR") ||
          permiso.includes("MODULO_COMPRAS_GESTIONAR") ||
          permiso.includes("MODULO_VENTAS_GESTIONAR")
      ));

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img
            src="/Stetic2.svg"
            alt="La Fuente del Peluquero Logo"
            className="navbar-logo-img"
          />
        </Link>

        {/* Botón hamburguesa para móvil */}
        <button
          className="mobile-menu-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <ul
          className={`navbar-list ${
            isMobileMenuOpen ? "mobile-menu-open" : ""
          }`}
        >
          <li>
            <Link to="/" className="navbar-link" onClick={closeMobileMenu}>
              <FaHome className="navbar-icon" />
              Inicio
            </Link>
          </li>

          {/* Botón de cambio de tema */}
          <li>
            <ThemeToggle className="navbar-theme-toggle" />
          </li>

          {isAuthenticated && (
            <>
              <li className="navbar-user">
                <FaUser className="navbar-icon" />
                {user?.nombre || "Usuario"}
              </li>
              {canAccessAdmin && (
                <li>
                  <button
                    className="admin-button"
                    onClick={() => {
                      navigate("/admin/dashboard");
                      closeMobileMenu();
                    }}
                  >
                    <FaCogs className="navbar-icon" />
                    Administración
                  </button>
                </li>
              )}
              <li>
                <button
                  className="logout-button"
                  onClick={() => {
                    handleLogoutClick();
                    closeMobileMenu();
                  }}
                >
                  <FaSignOutAlt className="navbar-icon" />
                  Cerrar Sesión
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default AdminNavbar;
