// src/routes.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// ---- Actualizado Cliente ------
import { LoginPage, RegisterPage } from "./features/auth"; 
import { HomePage, PublicProductosPage, PublicServiciosPage, NovedadesPage } from './features/home'; 
// ---- Actualizado Administrador  ------
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


// Importación de PrivateRoute
import PrivateRoute from "./shared/components/auth/PrivateRoute"; 

function AppRoutes() { 
  return (
    <Router> 
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/Productos" element={<PublicProductosPage />} />
        <Route path="/Servicios" element={<PublicServiciosPage />} />
        <Route path="/Novedades" element={<NovedadesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Rutas Privadas (usando PrivateRoute ) */}
        <Route path="/Dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/Rol" element={<PrivateRoute><ListaRolesPage /></PrivateRoute>} />
        <Route path="/Usuarios" element={<PrivateRoute><ListaUsuariosPage /></PrivateRoute>} />
        <Route path="/abastecimiento" element={<PrivateRoute><ListaAbastecimientoPage /></PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><ListaClientesPage /></PrivateRoute>} />
        <Route path="/proveedores" element={<PrivateRoute><ListaProveedoresPage /></PrivateRoute>} />
        <Route path="/categorias" element={<PrivateRoute><ListaCategoriasProductoPage /></PrivateRoute>} />
        <Route path="/productoadministrador" element={<PrivateRoute><ListaProductosAdminPage /></PrivateRoute>} />
        <Route path="/serviciosadministrador" element={<PrivateRoute><ListaServiciosAdminPage /></PrivateRoute>} />
        <Route path="/categoriaservicio" element={<PrivateRoute><ListaCategoriasServicioPage /></PrivateRoute>} />
        <Route path="/citas" element={<PrivateRoute><CalendarioCitasPage /></PrivateRoute>} />
        <Route path="/horarioempleado" element={<PrivateRoute><ConfigHorariosPage /></PrivateRoute>} />
        <Route path="/compras" element={<PrivateRoute><ListaComprasPage /></PrivateRoute>} />
        <Route path="/compras/agregar" element={<PrivateRoute><FormCompraPage /></PrivateRoute>} />
        <Route path="/ventas" element={<PrivateRoute><ListaVentasPage /></PrivateRoute>} />
        <Route path="/ventas/proceso" element={<PrivateRoute><ProcesoVentaPage /></PrivateRoute>} /> 
      </Routes>
    </Router>
  );
}

export default AppRoutes;