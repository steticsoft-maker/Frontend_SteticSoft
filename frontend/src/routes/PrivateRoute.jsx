import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  // Validar si es el administrador
  if (token === "admin-token" && userRole === "admin") {
    return children; // Permitir acceso al Dashboard
  } else {
    alert("Acceso denegado. Debes iniciar sesión como administrador.");
    return <Navigate to="/" />; // Redirigir a Home
  }
}

export default PrivateRoute;
