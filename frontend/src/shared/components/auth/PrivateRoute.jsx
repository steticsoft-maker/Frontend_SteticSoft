// src/shared/components/auth/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
// Opcional: Podrías importar y usar useAuth si decides integrarlo con AuthContext más adelante
// import { useAuth } from "../../hooks/useAuth";

function PrivateRoute({ children }) {
  // const { isAuthenticated, userRole } = useAuth(); // Ejemplo si usaras useAuth hook
  const token = localStorage.getItem("authToken");
  const userRole = localStorage.getItem("userRole");

  // Validar si es el administrador
  if (token === "admin-token" && userRole === "admin") {
    return children;
  } else {
    // Considera no usar alert para mejor UX en el futuro
    alert("Acceso denegado. Debes iniciar sesión como administrador.");
    return <Navigate to="/" />;
  }
}

export default PrivateRoute;
