// src/shared/components/layout/Navbar.jsx
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext"; // Asegúrate que la ruta sea correcta
import "./Navbar.css"; // Se moverá junto con el JSX

function Navbar() {
  const navigate = useNavigate();
  // Asumimos que AuthContext provee:
  // isAuthenticated (boolean)
  // user (objeto { role: 'admin'/'client', name: 'NombreUsuario' } o null)
  // logout (función para cerrar sesión)
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const handleLogoutClick = () => {
    logout(); // Llama a la función logout del contexto
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
            <Link to="/Productos" className="navbar-link">
              Productos
            </Link>
          </li>
          <li>
            <Link to="/Servicios" className="navbar-link">
              Servicios
            </Link>
          </li>
          {/* Podrías añadir Novedades aquí si es un enlace principal */}
          {/* <li><Link to="/Novedades" className="navbar-link">Novedades</Link></li> */}

          {!isAuthenticated ? (
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
            <>
              <li className="navbar-user">
                👤 {user?.role === "admin" ? "Admin" : user?.name || "Usuario"}
              </li>
              <li>
                <button className="logout-button" onClick={handleLogoutClick}>
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
