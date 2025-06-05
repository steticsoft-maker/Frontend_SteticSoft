// src/shared/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginAPI, logoutAPI as serviceLogoutAPI } from '../../features/auth/services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let token = localStorage.getItem('authToken');
    let storedUser = localStorage.getItem('authUser');
    let storedPermissions = localStorage.getItem('authPermissions');

    if (token && storedUser && storedPermissions) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const parsedPermissions = JSON.parse(storedPermissions);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setPermissions(parsedPermissions);
      } catch (e) {
        localStorage.clear();
        setIsAuthenticated(false);
        setUser(null);
        setPermissions([]);
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials, rememberMe) => {
    setIsLoading(true);
    try {
      const apiResponse = await loginAPI(credentials);

      // El objeto 'usuario' de la API ahora debe incluir el array 'permisos'
      if (apiResponse.success && apiResponse.data?.token && apiResponse.data?.usuario) {
        const { token, usuario } = apiResponse.data;
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem('authToken', token);
        storage.setItem('authUser', JSON.stringify(usuario));
        // Esta línea es la más importante: ahora 'usuario.permisos' tendrá datos.
        storage.setItem('authPermissions', JSON.stringify(usuario.permisos || [])); 

        setIsAuthenticated(true);
        setUser(usuario);
        setPermissions(usuario.permisos || []); // Establecer permisos en el estado
        setIsLoading(false);
        return { success: true, role: usuario.rol.nombre };
      } else {
        setIsLoading(false);
        throw new Error(apiResponse.message || "Respuesta inesperada de la API.");
      }
    } catch (error) {
      setIsLoading(false);
      throw new Error(error.message || "Error durante el login.");
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await serviceLogoutAPI();
    } catch (error) {
      console.error("Error en logout API (puede ignorarse):", error);
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      setIsAuthenticated(false);
      setUser(null);
      setPermissions([]); // Limpiar permisos al cerrar sesión
      setIsLoading(false);
    }
  }, []);

  const contextValue = {
    isAuthenticated,
    user,
    permissions, // Pasar los permisos al contexto
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};