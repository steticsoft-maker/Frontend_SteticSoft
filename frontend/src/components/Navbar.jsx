import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Mi Plataforma</Link>
        <ul className="navbar-list">
          <li><Link to="/Productos" className="navbar-link">Productos</Link></li>
          <li><Link to="/Servicios" className="navbar-link">Servicios</Link></li>
          {!token ? (
            <>
              <li><Link to="/register" className="navbar-link">Registro</Link></li>
              <li><Link to="/login" className="navbar-link">Iniciar Sesión</Link></li>
            </>
          ) : (
            <>
              <li className="navbar-user">👤 {userRole === "admin" ? "Admin" : "Usuario"}</li>
              <li>
                <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
