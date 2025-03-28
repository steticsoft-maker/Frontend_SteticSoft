import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaUserCircle,
  FaRandom,
  FaUsers,
  FaAddressBook,
  FaClipboardList,
  FaServicestack,
  FaChartLine,
  FaSignOutAlt,
  FaCalendar,
  FaShoppingCart,
  FaTags,
  FaBuilding,
  FaTasks,
  FaBox,
  FaCalendarCheck,
} from "react-icons/fa";
import "./NavbarAdmin.css"; // Archivo de estilos exclusivo del Navbar

const NavbarAdmin = () => {
  const navigate = useNavigate();

  // Estados para controlar el despliegue de los submenús por proceso
  const [showConfiguracion, setShowConfiguracion] = useState(false);
  const [showVentas, setShowVentas] = useState(false);
  const [showCompras, setShowCompras] = useState(false);
  const [showCitas, setShowCitas] = useState(false);

  // Funciones para alternar la visibilidad de los submenús
  const toggleConfiguracion = () => setShowConfiguracion(!showConfiguracion);
  const toggleVentas = () => setShowVentas(!showVentas);
  const toggleCompras = () => setShowCompras(!showCompras);
  const toggleCitas = () => setShowCitas(!showCitas);

  const handleLogout = () => {
    navigate("/login"); // Navega al login para cerrar sesión
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="admin-section">
        <FaUserCircle className="admin-icon" />
        <p className="admin-label">Admin</p>
      </div>
      <nav className="dashboard-links">
        {/* Dashboard */}
        <button
          onClick={() => navigate("/dashboard")}
          className="dashboard-link"
        >
          <FaChartLine className="dashboard-icon" /> Dashboard
        </button>

        {/* Configuración */}
        <button onClick={toggleConfiguracion} className="dashboard-link">
          <FaRandom className="dashboard-icon" /> Configuración
        </button>
        {showConfiguracion && (
          <div className="nested-links">
            <button onClick={() => navigate("/Rol")} className="nested-link">
              Roles
            </button>
            <button
              onClick={() => navigate("/Usuarios")}
              className="nested-link"
            >
              Usuarios
            </button>
          </div>
        )}

        {/* Ventas */}
        <button onClick={toggleVentas} className="dashboard-link">
          <FaClipboardList className="dashboard-icon" /> Ventas
        </button>
        {showVentas && (
          <div className="nested-links">
            <button onClick={() => navigate("/ventas")} className="nested-link">
              Ventas
            </button>
            <button
              onClick={() => navigate("/pedidos")}
              className="nested-link"
            >
              Pedidos
            </button>
            <button
              onClick={() => navigate("/clientes")}
              className="nested-link"
            >
              Clientes
            </button>
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

        {/* Compras */}
        <button onClick={toggleCompras} className="dashboard-link">
          <FaShoppingCart className="dashboard-icon" /> Compras
        </button>
        {showCompras && (
          <div className="nested-links">
            <button
              onClick={() => navigate("/compras")}
              className="nested-link"
            >
              Compras
            </button>
            <button
              onClick={() => navigate("/proveedores")}
              className="nested-link"
            >
              Proveedores
            </button>
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
            <button
              onClick={() => navigate("/abastecimiento")}
              className="nested-link"
            >
              Abastecimiento
            </button>
          </div>
        )}

        {/* Citas */}
        <button onClick={toggleCitas} className="dashboard-link">
          <FaCalendarCheck className="dashboard-icon" /> Citas
        </button>
        {showCitas && (
          <div className="nested-links">
            <button
              onClick={() => navigate("/horarioempleado")}
              className="nested-link"
            >
              Horario de Citas (Novedades)
            </button>
            <button onClick={() => navigate("/citas")} className="nested-link">
              Citas
            </button>
          </div>
        )}
      </nav>

      {/* Botón de cerrar sesión */}
      <div className="logout-section">
        <button onClick={handleLogout} className="dashboard-link logout-button">
          <FaSignOutAlt className="dashboard-icon" /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default NavbarAdmin;
