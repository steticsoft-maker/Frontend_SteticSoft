// frontend/src/features/empleado/components/EmpleadoNavbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './EmpleadoNavbar.css';

const EmpleadoNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí iría la lógica para limpiar el estado de autenticación (ej. remover token)
    console.log('Cerrando sesión...');
    navigate('/login'); // Redirigir al login después de cerrar sesión
  };

  return (
    <nav className="empleado-navbar">
      <div className="empleado-navbar-brand">
        <Link to="/empleado/dashboard">Steticsoft</Link>
      </div>
      <ul className="empleado-navbar-links">
        <li>
          <Link to="/empleado/dashboard">Inicio</Link>
        </li>
      </ul>
      <button onClick={handleLogout} className="empleado-navbar-logout">
        Cerrar Sesión
      </button>
    </nav>
  );
};

export default EmpleadoNavbar;
