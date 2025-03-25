import React, { useState } from "react";
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
  FaChartLine,
  FaSignOutAlt, // Icono para cerrar sesión
} from "react-icons/fa";
import "./NavbarAdmin.css"; // Archivo de estilos exclusivo del Navbar

const NavbarAdmin = () => {
  const navigate = useNavigate();

  // Estados para controlar el despliegue de los submenús
  const [showInsumos, setShowInsumos] = useState(false);
  const [showProductos, setShowProductos] = useState(false);
  const [showServicios, setShowServicios] = useState(false);

  // Funciones para alternar la visibilidad de los submenús
  const toggleInsumos = () => setShowInsumos(!showInsumos);
  const toggleProductos = () => setShowProductos(!showProductos);
  const toggleServicios = () => setShowServicios(!showServicios);

  const handleLogout = () => {
    navigate("/login"); // Acción de cerrar sesión, navegando al login
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

        {/* Menú desplegable de Categoria Insumos */}
        <button onClick={toggleInsumos} className="dashboard-link">
          <FaTags className="dashboard-icon" /> Insumos - Categoria
        </button>
        {showInsumos && (
          <div className="nested-links">
            <button
              onClick={() => navigate("/insumos")}
              className="nested-link"
            >
              Insumos
            </button>
            <button
              onClick={() => navigate("/categoriainsumos")}
              className="nested-link"
            >
              Categoría Insumos
            </button>
          </div>
        )}

        {/* Menú desplegable de Categoria Productos */}
        <button onClick={toggleProductos} className="dashboard-link">
          <FaTasks className="dashboard-icon" /> Productos - Categoria
        </button>
        {showProductos && (
          <div className="nested-links">
            <button
              onClick={() => navigate("/productoadministrador")}
              className="nested-link"
            >
              Productos
            </button>
            <button
              onClick={() => navigate("/categoriaproducto")}
              className="nested-link"
            >
              Categoría Productos
            </button>
          </div>
        )}

        {/* Menú desplegable de Categoria Servicios */}
        <button onClick={toggleServicios} className="dashboard-link">
          <FaServicestack className="dashboard-icon" /> Servicios - Categoria
        </button>
        {showServicios && (
          <div className="nested-links">
            <button
              onClick={() => navigate("/serviciosadministrador")}
              className="nested-link"
            >
              Servicios
            </button>
            <button
              onClick={() => navigate("/categoriaservicio")}
              className="nested-link"
            >
              Categoría Servicios
            </button>
          </div>
        )}

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
