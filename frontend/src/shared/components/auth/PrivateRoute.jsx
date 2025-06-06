// src/shared/components/auth/PrivateRoute.jsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
// Corregido: Importamos nuestro hook personalizado
import { useAuth } from '../../contexts/AuthContext';

// El componente ahora es más simple y se enfoca solo en los permisos.
const PrivateRoute = ({ requiredPermission }) => {
  // Corregido: Usamos el hook useAuth() para obtener la información.
  const { isAuthenticated, permissions, isLoading } = useAuth();

  // Mientras se verifica la sesión, mostramos un mensaje de carga.
  if (isLoading) {
    return <div>Cargando...</div>;
  }

  // Si el usuario NO está autenticado, lo redirigimos al login.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Si la ruta requiere un permiso y el usuario NO lo tiene,
  // lo redirigimos a una página segura (el dashboard es una buena opción).
  if (requiredPermission && !permissions.includes(requiredPermission)) {
    console.warn(
      `Acceso DENEGADO por PERMISO. Permiso requerido: "${requiredPermission}"`
    );
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Si el usuario está autenticado y tiene los permisos necesarios,
  // <Outlet /> renderiza el componente de la ruta hija que corresponde.
  return <Outlet />;
};

export default PrivateRoute;