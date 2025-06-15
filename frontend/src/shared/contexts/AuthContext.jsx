// src/shared/contexts/AuthContext.jsx
import React, { useState, useEffect, useCallback } from 'react'; // useContext and createContext removed
import { AuthContext } from './authHooks'; // Import AuthContext
import { loginAPI, logoutAPI as serviceLogoutAPI } from '../../features/auth/services/authService';

// AuthContext is now imported from authHooks.js

// Se exporta el proveedor (Provider) como antes.
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Primero intenta cargar desde localStorage (si se marcó "Recordarme")
    let token = localStorage.getItem('authToken');
    let storedUser = localStorage.getItem('authUser');
    let storedPermissions = localStorage.getItem('authPermissions');

    // Si no encontró nada, intenta desde sessionStorage (sesión sin "Recordarme")
    if (!token) {
      token = sessionStorage.getItem('authToken');
      storedUser = sessionStorage.getItem('authUser');
      storedPermissions = sessionStorage.getItem('authPermissions');
    }
    
    if (token && storedUser && storedPermissions) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const parsedPermissions = JSON.parse(storedPermissions);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setPermissions(parsedPermissions);
      } catch (e) {
        console.error("Error al parsear datos de sesión:", e);
        localStorage.clear();
        sessionStorage.clear();
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

      if (apiResponse.success && apiResponse.data?.token && apiResponse.data?.usuario) {
        const { token, usuario } = apiResponse.data;
        // Escoge el almacenamiento correcto basado en 'rememberMe'
        const storage = rememberMe ? localStorage : sessionStorage;

        storage.setItem('authToken', token);
        storage.setItem('authUser', JSON.stringify(usuario));
        storage.setItem('authPermissions', JSON.stringify(usuario.permisos || [])); 

        setIsAuthenticated(true);
        setUser(usuario);
        setPermissions(usuario.permisos || []);
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
      setPermissions([]);
      setIsLoading(false);
    }
  }, []);

  // El valor del contexto no cambia
  const contextValue = {
    isAuthenticated,
    user,
    permissions,
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

// useAuth hook has been moved to authHooks.js