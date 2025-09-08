// src/routes.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Link, Navigate } from "react-router-dom";

// Layouts
import NavbarAdmin from "./shared/components/layout/NavbarAdmin"; //
import Navbar from "./shared/components/layout/Navbar"; //

// Contexto y Rutas Privadas
import PrivateRoute from "./shared/components/auth/PrivateRoute"; //

// ---- Páginas Públicas ------
import { LoginPage, RegisterPage } from "./features/auth"; //
import { HomePage, PublicProductosPage, PublicServiciosPage, NovedadesPage } from './features/home'; //

// ---- Páginas de Administrador ------
import { DashboardPage } from './features/dashboard'; //
import { ListaRolesPage } from './features/roles'; //
import { ListaUsuariosPage } from "./features/usuarios"; //
import { ListaAbastecimientoPage } from './features/abastecimiento'; //
import { ListaClientesPage } from "./features/clientes"; //
import { ListaProveedoresPage } from "./features/proveedores"; //
import { ListaCategoriasProductoPage } from './features/categoriasProductoAdmin'; //
import { ListaProductosAdminPage } from "./features/productosAdmin"; //
import { ListaServiciosAdminPage } from "./features/serviciosAdmin"; //
import { ListaCategoriasServicioPage } from "./features/categoriasServicioAdmin"; //
import { CalendarioCitasPage } from "./features/citas"; //
import { ConfigHorariosPage } from "./features/novedades"; //
import { ListaComprasPage, FormCompraPage } from "./features/compras"; //
import { ListaVentasPage, ProcesoVentaPage } from "./features/ventas"; //

// ---- Páginas de Empleado ------
import EmpleadoDashboard from './features/empleado/pages/EmpleadoDashboard';

// --- Componentes de Layout ---
import EmpleadoLayout from './shared/layouts/EmpleadoLayout';

const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
); //

const AdminLayout = () => (
  <div className="admin-page-layout">
    <NavbarAdmin />
    <main className="admin-main-content-area">
      <Outlet />
    </main>
  </div>
); //

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* Corregí tus rutas públicas para que no apunten a /public y sean más directas */}
          <Route path="/productos" element={<PublicProductosPage />} />
          <Route path="/servicios" element={<PublicServiciosPage />} />
          <Route path="/novedades-publicas" element={<NovedadesPage />} />
        </Route>

        {/* Autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* --- ESTRUCTURA CORREGIDA DE RUTAS DE ADMINISTRADOR --- */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* Grupo de rutas que usan PrivateRoute como contenedor */}
          
          <Route element={<PrivateRoute requiredPermission="MODULO_DASHBOARD_VER" />}>
            <Route path="dashboard" element={<DashboardPage />} />
          </Route>

          <Route element={<PrivateRoute requiredPermission="MODULO_ROLES_GESTIONAR" />}>
            <Route path="roles" element={<ListaRolesPage />} />
          </Route>

          <Route element={<PrivateRoute requiredPermission="MODULO_USUARIOS_GESTIONAR" />}>
            <Route path="usuarios" element={<ListaUsuariosPage />} />
          </Route>

          <Route element={<PrivateRoute requiredPermission="MODULO_ABASTECIMIENTOS_GESTIONAR" />}>
            <Route path="abastecimiento" element={<ListaAbastecimientoPage />} />
          </Route>

          <Route element={<PrivateRoute requiredPermission="MODULO_CLIENTES_GESTIONAR" />}>
            <Route path="clientes" element={<ListaClientesPage />} />
          </Route>
          
          <Route element={<PrivateRoute requiredPermission="MODULO_PROVEEDORES_GESTIONAR" />}>
            <Route path="proveedores" element={<ListaProveedoresPage />} />
          </Route>

          {/* Hubo un typo en el nombre del permiso, lo corregí a 'MODULO_CATEGORIAS_PRODUCTOS_GESTIONAR' */}
          <Route element={<PrivateRoute requiredPermission="MODULO_CATEGORIAS_PRODUCTOS_GESTIONAR" />}>
            <Route path="categorias-producto" element={<ListaCategoriasProductoPage />} />
          </Route>

          <Route element={<PrivateRoute requiredPermission="MODULO_PRODUCTOS_GESTIONAR" />}>
            <Route path="productos-admin" element={<ListaProductosAdminPage />} />
          </Route>

          <Route element={<PrivateRoute requiredPermission="MODULO_SERVICIOS_GESTIONAR" />}>
            <Route path="servicios-admin" element={<ListaServiciosAdminPage />} />
          </Route>

          <Route element={<PrivateRoute requiredPermission="MODULO_CATEGORIAS_SERVICIOS_GESTIONAR" />}>
            <Route path="categorias-servicio" element={<ListaCategoriasServicioPage />} />
          </Route>

          <Route element={<PrivateRoute requiredPermission="MODULO_CITAS_GESTIONAR" />}>
            <Route path="citas" element={<CalendarioCitasPage />} />
          </Route>

          <Route element={<PrivateRoute requiredPermission="MODULO_NOVEDADES_EMPLEADOS_GESTIONAR" />}>
            <Route path="horarios" element={<ConfigHorariosPage />} />
          </Route>

          <Route element={<PrivateRoute requiredPermission="MODULO_COMPRAS_GESTIONAR" />}>
            <Route path="compras" element={<ListaComprasPage />} />
            <Route path="compras/agregar" element={<FormCompraPage />} />
          </Route>

          <Route element={<PrivateRoute requiredPermission="MODULO_VENTAS_GESTIONAR" />}>
            <Route path="ventas" element={<ListaVentasPage />} />
            <Route path="ventas/proceso" element={<ProcesoVentaPage />} />
          </Route>
        </Route>

        {/* --- RUTAS DE EMPLEADO --- */}
        {/* Aquí usamos PrivateRoute asumiendo que puede verificar roles */}
        <Route element={<PrivateRoute allowedRoles={['empleado']} />}>
          <Route path="/empleado" element={<EmpleadoLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<EmpleadoDashboard />} />
            {/* Aquí se podrían agregar más rutas anidadas para el empleado en el futuro */}
          </Route>
        </Route>

        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<div><h2>Página no encontrada (404)</h2><Link to="/">Ir al Inicio</Link></div>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;