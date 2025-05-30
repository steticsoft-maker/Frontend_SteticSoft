// src/shared/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Para almacenar { role, name, etc. }

  // Verificar el estado de autenticación inicial desde localStorage
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUserRole = localStorage.getItem('userRole');
    // Podrías también tener un 'userName' o un objeto 'user' completo en localStorage
    // const storedUserName = localStorage.getItem('userName');

    if (token && storedUserRole) {
      setIsAuthenticated(true);
      setUser({
        role: storedUserRole,
        // name: storedUserName || (storedUserRole === 'admin' ? 'Admin' : 'Usuario'),
        // Aquí podrías añadir más info del usuario si la guardas en login
      });
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const login = useCallback((userData) => {
    // userData debería ser un objeto como { token, role, name (opcional), etc. }
    // que se recibe después de un inicio de sesión exitoso.
    // Por ahora, para simular y mantener compatibilidad con tu Login.jsx:
    // Si es admin: { token: 'admin-token', role: 'admin' }
    // Si es cliente: { token: 'user-token', role: 'client' }

    localStorage.setItem('authToken', userData.token);
    localStorage.setItem('userRole', userData.role);
    // if (userData.name) localStorage.setItem('userName', userData.name);

    setIsAuthenticated(true);
    setUser({
      role: userData.role,
      // name: userData.name || (userData.role === 'admin' ? 'Admin' : 'Usuario'),
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    // localStorage.removeItem('userName');
    setIsAuthenticated(false);
    setUser(null);
  }, []);

  const contextValue = {
    isAuthenticated,
    user,
    login,
    logout,
    // setIsAuthenticated // Ya no es necesario exponerla directamente, se maneja con login/logout
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};