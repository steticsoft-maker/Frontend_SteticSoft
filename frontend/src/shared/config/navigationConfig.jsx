import React from 'react';
import {
  FaTachometerAlt,
  FaCogs,
  FaUsers,
  FaUserTag,
  FaShoppingCart,
  FaBoxOpen,
  FaTruck,
  FaHandHoldingUsd,
  FaCalendarAlt,
  FaClipboardList,
  FaUserFriends,
  FaStore,
  FaBox,
  FaTags,
  FaPlusSquare,
  FaCalendarCheck,
  FaUserCog,
  FaFileInvoiceDollar
} from 'react-icons/fa';

export const menuItemsConfig = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
    icon: <FaTachometerAlt />,
    requiredPermission: "MODULO_DASHBOARD_VER",
  },
  {
    label: "Configuración",
    icon: <FaCogs />,
    subMenuKey: "configuracion",
    requiredPermission: null,
    subItems: [
      {
        label: "Roles",
        path: "/admin/roles",
        requiredPermission: "MODULO_ROLES_GESTIONAR",
      },
      {
        label: "Usuarios",
        path: "/admin/usuarios",
        requiredPermission: "MODULO_USUARIOS_GESTIONAR",
      },
    ],
  },
  {
    label: "Ventas",
    icon: <FaHandHoldingUsd />,
    subMenuKey: "ventas",
    requiredPermission: null,
    subItems: [
      {
        label: "Nueva Venta",
        path: "/admin/ventas/proceso",
        requiredPermission: "MODULO_VENTAS_GESTIONAR",
      },
      {
        label: "Historial de Ventas",
        path: "/admin/ventas",
        requiredPermission: "MODULO_VENTAS_GESTIONAR",
      },
      {
        label: "Clientes",
        path: "/admin/clientes",
        requiredPermission: "MODULO_CLIENTES_GESTIONAR",
      },
    ],
  },
  {
    label: "Compras",
    icon: <FaShoppingCart />,
    subMenuKey: "compras",
    requiredPermission: null,
    subItems: [
      {
        label: "Nueva Compra",
        path: "/admin/compras/agregar",
        requiredPermission: "MODULO_COMPRAS_GESTIONAR",
      },
      {
        label: "Historial de Compras",
        path: "/admin/compras",
        requiredPermission: "MODULO_COMPRAS_GESTIONAR",
      },
      {
        label: "Proveedores",
        path: "/admin/proveedores",
        requiredPermission: "MODULO_PROVEEDORES_GESTIONAR",
      },
    ],
  },
  {
    label: "Artículos",
    icon: <FaBoxOpen />,
    subMenuKey: "Artículos",
    requiredPermission: null,
    subItems: [
      {
        label: "Productos",
        path: "/admin/productos-admin",
        requiredPermission: "MODULO_PRODUCTOS_GESTIONAR",
      },
      {
        label: "Categorías de Productos",
        path: "/admin/categorias-producto",
        requiredPermission: "MODULO_CATEGORIAS_PRODUCTOS_GESTIONAR",
      },
      {
        label: "Abastecimiento",
        path: "/admin/abastecimiento",
        requiredPermission: "MODULO_ABASTECIMIENTOS_GESTIONAR",
      },
    ],
  },
  {
    label: "Servicios",
    icon: <FaStore />,
    subMenuKey: "servicios",
    requiredPermission: null,
    subItems: [
      {
        label: "Gestionar Servicios",
        path: "/admin/servicios-admin",
        requiredPermission: "MODULO_SERVICIOS_GESTIONAR",
      },
      {
        label: "Categorías de Servicios",
        path: "/admin/categorias-servicio",
        requiredPermission: "MODULO_CATEGORIAS_SERVICIOS_GESTIONAR",
      },
    ],
  },
  {
    label: "Citas",
    path: "/admin/citas",
    icon: <FaCalendarAlt />,
    requiredPermission: "MODULO_CITAS_GESTIONAR",
  },
  {
    label: "Config. Horarios",
    path: "/admin/horarios",
    icon: <FaCalendarCheck />,
    requiredPermission: "MODULO_NOVEDADES_EMPLEADOS_GESTIONAR",
  },
];
