// src/shared/components/auth/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';

// El componente ahora acepta 'allowedRoles' o 'requiredPermission'
function PrivateRoute({ children, allowedRoles, requiredPermission }) {
  const { isAuthenticated, user, permissions, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <div>Cargando autenticación...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verificación por Rol (se mantiene por si lo necesitas en algún lado)
  if (allowedRoles && user?.rol && !allowedRoles.includes(user.rol.nombre)) {
    console.warn(
      `Acceso DENEGADO por ROL a: ${location.pathname}. Rol del usuario: "${user.rol.nombre}". Roles permitidos: ${allowedRoles.join(', ')}`
    );
    return <Navigate to="/" replace />; 
  }

  // ¡NUEVA VERIFICACIÓN POR PERMISO!
  if (requiredPermission && (!permissions || !permissions.includes(requiredPermission))) {
    console.warn(
        `Acceso DENEGADO por PERMISO a: ${location.pathname}. Permiso requerido: "${requiredPermission}". Permisos del usuario: [${permissions.join(', ')}]`
    );
    // Puedes redirigir a una página de "Acceso Denegado" o al dashboard principal.
    return <Navigate to="/admin/dashboard" replace />;
  }

  // Si pasa todas las verificaciones, permite el acceso.
  return children;
}

export default PrivateRoute;