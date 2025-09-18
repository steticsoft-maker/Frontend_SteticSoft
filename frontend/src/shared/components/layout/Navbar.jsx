// src/shared/components/layout/Navbar.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from './ThemeToggle'; // Import the new component
// Corregido: Importamos el hook personalizado useAuth
import { useAuth } from "../../contexts/authHooks"; // Path updated
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  // Corregido: Usamos el hook useAuth() para obtener los datos del contexto
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogoutClick = async () => {
    // La función logout del contexto es asíncrona, usamos await
    await logout();
    navigate("/"); // Redirige al home
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          SteticSoft
        </Link>
        <ul className="navbar-list">
          <li>
            <Link to="/productos" className="navbar-link">
            Productos
            </Link>
          </li>
          <li>
            <Link to="/servicios" className="navbar-link">
            Servicios
            </Link>
          </li>


          {!isAuthenticated ? (
            // Fragmento para usuarios no autenticados
            <>
              <li>
                <Link to="/register" className="navbar-link">
                  Registro
                </Link>
              </li>
              <li>
                <Link to="/login" className="navbar-link">
                  Iniciar Sesión
                </Link>
              </li>
            </>
          ) : (
            // Fragmento para usuarios autenticados
            <>
              <li className="navbar-user">
                👤 {user?.nombre || "Usuario"}
              </li>
              <li>
                <button className="logout-button" onClick={handleLogoutClick}>
                  Cerrar Sesión
                </button>
              </li>
            </>
          )}
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;