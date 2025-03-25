import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaRandom,
  FaUsers,
  FaBox,
  FaAddressBook,
  FaShoppingCart,
  FaUserTie,
  FaTags,
  FaBuilding,
  FaClipboardList,
  FaTasks,
  FaServicestack,
  FaArrowLeft,
  FaDashcube,
  FaChartLine,
  FaSignOutAlt, // Icono para cerrar sesión
} from "react-icons/fa";
import "./NavbarAdmin.css"; // Archivo de estilos exclusivo del Navbar

const NavbarAdmin = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Acción de cerrar sesión (puedes incluir lógica adicional, como limpiar datos almacenados)
    navigate("/login");
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="admin-section">
        <FaUserCircle className="admin-icon" />
        <p className="admin-label">Admin</p>
      </div>
      <nav className="dashboard-links">
        {/* Retorno al Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="dashboard-link"
        >
          <FaChartLine className="dashboard-icon" /> Dashboard
        </button>

        {/* Resto de los enlaces */}
        <button onClick={() => navigate("/Rol")} className="dashboard-link">
          <FaRandom className="dashboard-icon" /> Roles
        </button>
        <button
          onClick={() => navigate("/Usuarios")}
          className="dashboard-link"
        >
          <FaUsers className="dashboard-icon" /> Usuarios
        </button>
        <button
          onClick={() => navigate("/clientes")}
          className="dashboard-link"
        >
          <FaAddressBook className="dashboard-icon" /> Clientes
        </button>
        <button onClick={() => navigate("/compras")} className="dashboard-link">
          <FaShoppingCart className="dashboard-icon" /> Compras
        </button>
        <button
          onClick={() => navigate("/empleados")}
          className="dashboard-link"
        >
          <FaUserTie className="dashboard-icon" /> Empleados
        </button>
        <button onClick={() => navigate("/insumos")} className="dashboard-link">
          <FaTags className="dashboard-icon" /> Insumos
        </button>
        <button
          onClick={() => navigate("/proveedores")}
          className="dashboard-link"
        >
          <FaBuilding className="dashboard-icon" /> Proveedores
        </button>
        <button
          onClick={() => navigate("/abastecimiento")}
          className="dashboard-link"
        >
          <FaBox className="dashboard-icon" /> Abastecimiento
        </button>
        <button onClick={() => navigate("/ventas")} className="dashboard-link">
          <FaClipboardList className="dashboard-icon" /> Ventas
        </button>
        <button
          onClick={() => navigate("/productoadministrador")}
          className="dashboard-link"
        >
          <FaTasks className="dashboard-icon" /> Productos
        </button>
        <button
          onClick={() => navigate("/serviciosadministrador")}
          className="dashboard-link"
        >
          <FaServicestack className="dashboard-icon" /> Servicios
        </button>
      </nav>
      <div className="logout-section">
        {/* Botón de cerrar sesión */}
        <button onClick={handleLogout} className="dashboard-link logout-button">
          <FaSignOutAlt className="dashboard-icon" /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default NavbarAdmin;
