// src/routes.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Link, Navigate } from "react-router-dom";

// Layouts
import NavbarAdmin from "./shared/components/layout/NavbarAdmin";
import Navbar from "./shared/components/layout/Navbar";

// Contexto y Rutas Privadas
import PrivateRoute from "./shared/components/auth/PrivateRoute";

// ---- Páginas Públicas ------
import { LoginPage, RegisterPage } from "./features/auth";
import { HomePage, PublicProductosPage, PublicServiciosPage, NovedadesPage } from './features/home';

// ---- Páginas de Administrador ------
import { DashboardPage } from './features/dashboard';
import { ListaRolesPage } from './features/roles';
import { ListaUsuariosPage } from "./features/usuarios";
import { ListaAbastecimientoPage } from './features/abastecimiento';
import { ListaClientesPage } from "./features/clientes";
import { ListaProveedoresPage } from "./features/proveedores";
import { ListaCategoriasProductoPage } from './features/categoriasProductoAdmin';
import { ListaProductosAdminPage } from "./features/productosAdmin";
import { ListaServiciosAdminPage } from "./features/serviciosAdmin";
import { ListaCategoriasServicioPage } from "./features/categoriasServicioAdmin";
import { CalendarioCitasPage } from "./features/citas";
import { ConfigHorariosPage } from "./features/novedades";
import { ListaComprasPage, FormCompraPage } from "./features/compras";
import { ListaVentasPage, ProcesoVentaPage } from "./features/ventas";

// --- Componentes de Layout ---
const PublicLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
);

const AdminLayout = () => (
  <div className="admin-page-layout">
    <NavbarAdmin />
    <main className="admin-main-content-area">
      <Outlet />
    </main>
  </div>
);

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Rutas Públicas */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<PublicProductosPage />} />
          <Route path="/servicios" element={<PublicServiciosPage />} />
          <Route path="/novedades-publicas" element={<NovedadesPage />} />
        </Route>

        {/* Autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Privadas de Administrador con Layout y Permisos */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          
          {/* Dashboard (Ver) */}
          <Route path="dashboard" element={
            <PrivateRoute requiredPermission="MODULO_DASHBOARD_VER">
              <DashboardPage />
            </PrivateRoute>
          } />

          {/* Gestión de Roles y Permisos */}
          <Route path="roles" element={
            <PrivateRoute requiredPermission="MODULO_ROLES_GESTIONAR">
              <ListaRolesPage />
            </PrivateRoute>
          } />

          {/* Gestión de Usuarios */}
          <Route path="usuarios" element={
            <PrivateRoute requiredPermission="MODULO_USUARIOS_GESTIONAR">
              <ListaUsuariosPage />
            </PrivateRoute>
          } />
          
          {/* Gestión de Abastecimiento */}
          <Route path="abastecimiento" element={
            <PrivateRoute requiredPermission="MODULO_ABASTECIMIENTOS_GESTIONAR">
              <ListaAbastecimientoPage />
            </PrivateRoute>
          } />
          
          {/* Gestión de Clientes */}
          <Route path="clientes" element={
            <PrivateRoute requiredPermission="MODULO_CLIENTES_GESTIONAR">
              <ListaClientesPage />
            </PrivateRoute>
          } />
          
          {/* Gestión de Proveedores */}
          <Route path="proveedores" element={
            <PrivateRoute requiredPermission="MODULO_PROVEEDORES_GESTIONAR">
              <ListaProveedoresPage />
            </PrivateRoute>
          } />

          {/* Gestión de Categorías de Productos */}
          <Route path="categorias-producto" element={
            <PrivateRoute requiredPermission="MODULO_CATEGORias_PRODUCTOS_GESTIONAR">
              <ListaCategoriasProductoPage />
            </PrivateRoute>
          } />

          {/* Gestión de Productos */}
          <Route path="productos-admin" element={
            <PrivateRoute requiredPermission="MODULO_PRODUCTOS_GESTIONAR">
              <ListaProductosAdminPage />
            </PrivateRoute>
          } />

          {/* Gestión de Servicios */}
          <Route path="servicios-admin" element={
            <PrivateRoute requiredPermission="MODULO_SERVICIOS_GESTIONAR">
              <ListaServiciosAdminPage />
            </PrivateRoute>
          } />

          {/* Gestión de Categorías de Servicios */}
          <Route path="categorias-servicio" element={
            <PrivateRoute requiredPermission="MODULO_CATEGORIAS_SERVICIOS_GESTIONAR">
              <ListaCategoriasServicioPage />
            </PrivateRoute>
          } />

          {/* Gestión de Citas y Horarios */}
          <Route path="citas" element={
            <PrivateRoute requiredPermission="MODULO_CITAS_GESTIONAR">
              <CalendarioCitasPage />
            </PrivateRoute>
          } />
          <Route path="horarios" element={
            <PrivateRoute requiredPermission="MODULO_NOVEDADES_EMPLEADOS_GESTIONAR">
              <ConfigHorariosPage />
            </PrivateRoute>
          } />

          {/* Gestión de Compras */}
          <Route path="compras" element={
            <PrivateRoute requiredPermission="MODULO_COMPRAS_GESTIONAR">
              <ListaComprasPage />
            </PrivateRoute>
          } />
          <Route path="compras/agregar" element={
            <PrivateRoute requiredPermission="MODULO_COMPRAS_GESTIONAR">
              <FormCompraPage />
            </PrivateRoute>
          } />

          {/* Gestión de Ventas */}
          <Route path="ventas" element={
            <PrivateRoute requiredPermission="MODULO_VENTAS_GESTIONAR">
              <ListaVentasPage />
            </PrivateRoute>
          } />
          <Route path="ventas/proceso" element={
            <PrivateRoute requiredPermission="MODULO_VENTAS_GESTIONAR">
              <ProcesoVentaPage />
            </PrivateRoute>
          } />
          
        </Route>

        {/* Ruta para páginas no encontradas */}
        <Route path="*" element={<div><h2>Página no encontrada (404)</h2><Link to="/">Ir al Inicio</Link></div>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;