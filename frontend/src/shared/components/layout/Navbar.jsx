// src/shared/components/layout/Navbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Corregido: Importamos el hook personalizado useAuth
import { useAuth } from "../../contexts/authHooks"; // Path updated
import ThemeToggle from "../common/ThemeToggle";
import "./Navbar.css";
import {
  FaBoxOpen,
  FaStore,
  FaUserPlus,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
  FaCogs,
  FaBars,
  FaTimes,
} from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  // Corregido: Usamos el hook useAuth() para obtener los datos del contexto
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogoutClick = async () => {
    // La función logout del contexto es asíncrona, usamos await
    await logout();
    navigate("/"); // Redirige al home
  };

  const handleAdminClick = () => {
    navigate("/admin/dashboard");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Verificar si el usuario tiene permisos para acceder a administración
  // Solo usuarios con rol de Administrador o con permisos específicos de administración
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
    <nav className="navbar">
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
            <Link
              to="/productos"
              className="navbar-link"
              onClick={closeMobileMenu}
            >
              <FaBoxOpen className="navbar-icon" />
              Productos
            </Link>
          </li>
          <li>
            <Link
              to="/servicios"
              className="navbar-link"
              onClick={closeMobileMenu}
            >
              <FaStore className="navbar-icon" />
              Servicios
            </Link>
          </li>

          {/* Botón de cambio de tema */}
          <li>
            <ThemeToggle className="navbar-theme-toggle" />
          </li>

          {!isAuthenticated ? (
            // Fragmento para usuarios no autenticados
            <>
              <li>
                <Link
                  to="/register"
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  <FaUserPlus className="navbar-icon" />
                  Registro
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="navbar-link"
                  onClick={closeMobileMenu}
                >
                  <FaSignInAlt className="navbar-icon" />
                  Iniciar Sesión
                </Link>
              </li>
            </>
          ) : (
            // Fragmento para usuarios autenticados
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
                      handleAdminClick();
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

export default Navbar;
