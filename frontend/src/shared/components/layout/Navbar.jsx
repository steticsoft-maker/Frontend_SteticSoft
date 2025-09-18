// src/shared/components/layout/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
// Corregido: Importamos el hook personalizado useAuth
import { useAuth } from "../../contexts/authHooks"; // Path updated
import ThemeToggle from "../common/ThemeToggle";
import "./Navbar.css";
import { FaBoxOpen, FaStore, FaUserPlus, FaSignInAlt, FaUser, FaSignOutAlt, FaCogs } from "react-icons/fa";

function Navbar() {
  const navigate = useNavigate();
  // Corregido: Usamos el hook useAuth() para obtener los datos del contexto
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogoutClick = async () => {
    // La función logout del contexto es asíncrona, usamos await
    await logout();
    navigate("/"); // Redirige al home
  };

  const handleAdminClick = () => {
    navigate("/admin/dashboard");
  };

  // Verificar si el usuario tiene permisos para acceder a administración
  const canAccessAdmin = user?.rol?.nombre === "Administrador" || 
    (user?.permisos && user.permisos.some(permiso => 
      permiso.includes("MODULO_") || permiso.includes("GESTIONAR")
    ));

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          SteticSoft
        </Link>
        <ul className="navbar-list">
          <li>
            <Link to="/productos" className="navbar-link">
              <FaBoxOpen className="navbar-icon" />
              Productos
            </Link>
          </li>
          <li>
            <Link to="/servicios" className="navbar-link">
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
                <Link to="/register" className="navbar-link">
                  <FaUserPlus className="navbar-icon" />
                  Registro
                </Link>
              </li>
              <li>
                <Link to="/login" className="navbar-link">
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
                  <button className="admin-button" onClick={handleAdminClick}>
                    <FaCogs className="navbar-icon" />
                    Administración
                  </button>
                </li>
              )}
              <li>
                <button className="logout-button" onClick={handleLogoutClick}>
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