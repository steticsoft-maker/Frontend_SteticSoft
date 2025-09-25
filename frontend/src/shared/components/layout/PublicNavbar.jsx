// src/shared/components/layout/PublicNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/authHooks";
import ThemeToggle from "../common/ThemeToggle";
import useNavbarScroll from "../../hooks/useNavbarScroll";
import "./Navbar.css";
import {
  FaBoxOpen,
  FaStore,
  FaUserPlus,
  FaSignInAlt,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaTachometerAlt,
} from "react-icons/fa";

function PublicNavbar() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isScrolled, scrollDirection, isAtTop } = useNavbarScroll();

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

  return (
    <nav
      className={`navbar ${isScrolled ? "scrolled" : ""} ${
        scrollDirection === "down" ? "scroll-down" : "scroll-up"
      } ${isAtTop ? "at-top" : ""}`}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img
            src="/la-fuente-logo.png"
            alt="La Fuente del Peluquero Logo"
            className="public-navbar-logo-img"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "block";
            }}
          />
          <span style={{ display: "none" }}>La Fuente del Peluquero</span>
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
              {/* Botón para acceder al dashboard */}
              {(user?.rol === "Administrador" || user?.rol === "Empleado") && (
                <li>
                  <Link
                    to="/admin/dashboard"
                    className="navbar-link"
                    onClick={closeMobileMenu}
                  >
                    <FaTachometerAlt className="navbar-icon" />
                    Dashboard
                  </Link>
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

export default PublicNavbar;
