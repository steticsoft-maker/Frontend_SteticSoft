import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../modules/Home/Home";
import Login from "../modules/Auth/Login";
import Productos from "../modules/Home/Productos";
import Servicios from "../modules/Home/Servicios";
import Novedades from "../modules/Home/Novedades";
import Register from "../modules/Auth/Register";


import Dashboard from "../modules/Dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";

import Rol from "../modules/Rol/Rol";
import Usuarios from "../modules/Usuarios/Usuarios";
import Abastecimiento from "../modules/Abastecimiento/Abastecimiento"; // Módulo de abastecimiento
import Clientes from "../modules/Clientes/Clientes"; // Módulo de clientes
import Compras from "../modules/Compras/Compras"; // Módulo de compras
import Proveedores from "../modules/Proveedores/Proveedores"; // Módulo de proveedores
import Ventas from "../modules/Ventas/Ventas"; // Módulo de ventas
import ServiciosAdministrador from "../modules/Servicios/ServiciosAdministrador";
import CategoriaServicio from "../modules/Servicios/CategoriaServicio";
import ProductoAdministrador from "../modules/Productos/ProductoAdministrador";
import CategoriaProducto from "../modules/Productos/CategoriaProducto";
import Citas from "../modules/Servicios/Citas";
import HorarioEmpleado from "../modules/Empleados/HorarioCitas";
import ProcesoVentas from "../modules/Ventas/ProcesoVentas";



function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Productos" element={<Productos />} />
        <Route path="/Servicios" element={<Servicios />} />
        <Route path="/Novedades" element={<Novedades />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/Rol" element={<PrivateRoute><Rol /></PrivateRoute>} />
        <Route path="/Usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
        <Route path="/abastecimiento" element={<PrivateRoute><Abastecimiento /></PrivateRoute>} />
        <Route path="/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
        <Route path="/compras" element={<PrivateRoute><Compras /></PrivateRoute>} />
        <Route path="/horarioempleado" element={<PrivateRoute><HorarioEmpleado /></PrivateRoute>} />
        <Route path="/proveedores" element={<PrivateRoute><Proveedores /></PrivateRoute>} />
        <Route path="/ventas" element={<PrivateRoute><Ventas /></PrivateRoute>} />
        <Route path="/productoadministrador" element={<PrivateRoute><ProductoAdministrador /></PrivateRoute>} />
        <Route path="/categoriaproducto" element={<PrivateRoute><CategoriaProducto /></PrivateRoute>} />
        <Route path="/serviciosadministrador" element={<PrivateRoute><ServiciosAdministrador /></PrivateRoute>} />
        <Route path="/categoriaservicio" element={<PrivateRoute><CategoriaServicio /></PrivateRoute>} />
        <Route path="/citas" element={<PrivateRoute><Citas /></PrivateRoute>} />
        <Route path="/procesoventas" element={<PrivateRoute><ProcesoVentas /></PrivateRoute>} />

      </Routes>
    </Router>
  );
}

export default AppRouter;
