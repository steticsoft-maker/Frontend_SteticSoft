// src/shared/components/layout/NavbarAdmin.jsx
import React, { useState, useContext } // Agregado useContext
from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Agregado Link
import { AuthContext } from '../../contexts/AuthContext'; // Importar AuthContext
import {
  FaUserCircle, FaRandom, FaUsers, FaAddressBook, FaClipboardList,
  FaServicestack, FaChartLine, FaSignOutAlt, FaCalendar, FaShoppingCart,
  FaTags, FaBuilding, FaTasks, FaBox, FaCalendarCheck,
} from 'react-icons/fa';
import './NavbarAdmin.css';

// (Opcional) Definir la estructura del menú como datos para mejor mantenibilidad
const menuItemsConfig = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: FaChartLine }, // Actualizado
  {
    label: 'Configuración', icon: FaRandom, subMenuKey: 'configuracion',
    subItems: [
      { label: 'Roles', path: '/admin/roles' },         // Actualizado
      { label: 'Usuarios', path: '/admin/usuarios' },   // Actualizado
    ],
  },
  {
    label: 'Ventas', icon: FaClipboardList, subMenuKey: 'ventas',
    subItems: [
      { label: 'Ventas', path: '/admin/ventas' },                         // Actualizado
      { label: 'Clientes', path: '/admin/clientes' },                     // Actualizado
      { label: 'Servicios', path: '/admin/servicios-admin' },            // Actualizado
      { label: 'Categoría Servicios', path: '/admin/categorias-servicio' }, // Actualizado
      { label: 'Productos', path: '/admin/productos-admin' },              // Actualizado
      { label: 'Categoría Productos', path: '/admin/categorias-producto' },// Actualizado
    ],
  },
  {
    label: 'Compras', icon: FaShoppingCart, subMenuKey: 'compras',
    subItems: [
      { label: 'Compras', path: '/admin/compras' },             // Actualizado
      { label: 'Proveedores', path: '/admin/proveedores' },     // Actualizado
      { label: 'Abastecimiento', path: '/admin/abastecimiento' },// Actualizado
    ],
  },
  {
    label: 'Citas', icon: FaCalendarCheck, subMenuKey: 'citas',
    subItems: [
      { label: 'Horario de Citas (Novedades)', path: '/admin/horarios' }, // Actualizado
      { label: 'Citas', path: '/admin/citas' },                         // Actualizado
    ],
  },
];


const NavbarAdmin = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext); // Usar logout del contexto

  // Estados para controlar el despliegue de los submenús
  const [openSubMenus, setOpenSubMenus] = useState({});

  const toggleSubMenu = (key) => {
    setOpenSubMenus(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogoutClick = () => {
    logout(); // Llama a la función logout del contexto
    navigate('/login'); // Redirige al login
  };

  // Función para renderizar un ítem de menú (principal o anidado)
  const renderMenuItem = (item, isSubItem = false) => {
    const commonProps = {
      className: isSubItem ? "nested-link" : "dashboard-link",
      onClick: item.path ? () => navigate(item.path) : undefined,
    };

    return (
      <button {...commonProps} key={item.label}>
        {item.icon && <item.icon className="dashboard-icon" />} {item.label}
      </button>
    );
  };


  return (
    <aside className="dashboard-sidebar">
      <div className="admin-section">
        <FaUserCircle className="admin-icon" />
        <p className="admin-label">Admin</p>
      </div>
      <nav className="dashboard-links">
        {menuItemsConfig.map((item) => (
          <React.Fragment key={item.label}>
            {item.subItems ? (
              <button onClick={() => toggleSubMenu(item.subMenuKey)} className="dashboard-link">
                {item.icon && <item.icon className="dashboard-icon" />} {item.label}
              </button>
            ) : (
              renderMenuItem(item)
            )}
            {item.subItems && openSubMenus[item.subMenuKey] && (
              <div className="nested-links">
                {item.subItems.map((subItem) => renderMenuItem(subItem, true))}
              </div>
            )}
          </React.Fragment>
        ))}
      </nav>

      <div className="logout-section">
        <button onClick={handleLogoutClick} className="dashboard-link logout-button">
          <FaSignOutAlt className="dashboard-icon" /> Cerrar Sesión
        </button>
      </div>
    </aside>
  );
};

export default NavbarAdmin;