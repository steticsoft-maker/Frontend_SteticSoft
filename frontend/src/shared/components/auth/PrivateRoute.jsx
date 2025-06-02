// src/shared/components/auth/PrivateRoute.jsx
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext'; // Ajusta la ruta si es diferente

function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return <div>Cargando autenticación...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && user?.rol && !allowedRoles.includes(user.rol.nombre)) {
    console.warn(
      `Acceso denegado para el rol: "${user.rol.nombre}" a la ruta: ${location.pathname}. Roles permitidos: ${allowedRoles.join(', ')}`
    );
    return <Navigate to="/" replace />; 
  }

  // Si está autenticado y su rol está permitido (o no se especificaron roles), renderizar children
  return children;
}

export default PrivateRoute;