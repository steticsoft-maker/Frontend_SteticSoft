// src/routes.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet, Link, Navigate } from "react-router-dom"; // <--- AÑADIR Navigate AQUÍ

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
        {/* Rutas Públicas con Layout Público */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/productos" element={<PublicProductosPage />} />
          <Route path="/servicios" element={<PublicServiciosPage />} />
          <Route path="/novedades-publicas" element={<NovedadesPage />} />
        </Route>

        {/* Rutas de Autenticación */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Privadas de Administrador con AdminLayout */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={['Administrador']}>
              <AdminLayout />
            </PrivateRoute>
          }
        >
          {/* Esta es la línea 75 o cercana donde usas Navigate */}
          <Route index element={<Navigate to="dashboard" replace />} /> {/* Redirige /admin a /admin/dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="roles" element={<ListaRolesPage />} />
          <Route path="usuarios" element={<ListaUsuariosPage />} />
          <Route path="abastecimiento" element={<ListaAbastecimientoPage />} />
          <Route path="clientes" element={<ListaClientesPage />} />
          <Route path="proveedores" element={<ListaProveedoresPage />} />
          <Route path="categorias-producto" element={<ListaCategoriasProductoPage />} />
          <Route path="productos-admin" element={<ListaProductosAdminPage />} />
          <Route path="servicios-admin" element={<ListaServiciosAdminPage />} />
          <Route path="categorias-servicio" element={<ListaCategoriasServicioPage />} />
          <Route path="citas" element={<CalendarioCitasPage />} />
          <Route path="horarios" element={<ConfigHorariosPage />} />
          <Route path="compras" element={<ListaComprasPage />} />
          <Route path="compras/agregar" element={<FormCompraPage />} />
          <Route path="ventas" element={<ListaVentasPage />} />
          <Route path="ventas/proceso" element={<ProcesoVentaPage />} />
        </Route>

        {/* Ruta para manejar páginas no encontradas (404) */}
        <Route path="*" element={<div><h2>Página no encontrada (404)</h2><Link to="/">Ir al Inicio</Link></div>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;