// src/shared/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
// Asegúrate que la ruta a authService sea correcta. Si authService está en '../../features/auth/services/authService.js'
// y AuthContext está en 'src/shared/contexts/', la ruta debería ser correcta o similar.
import { loginAPI, logoutAPI as serviceLogoutAPI } from '../../features/auth/services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hook para verificar el estado de autenticación al cargar la aplicación.
  // Intenta leer de localStorage primero (si el usuario eligió "Recordar"),
  // luego de sessionStorage (si no lo hizo).
  useEffect(() => {
    // console.log("[AuthContext.jsx] useEffect: Verificando estado de autenticación inicial...");
    let token = localStorage.getItem('authToken');
    let storedUser = localStorage.getItem('authUser');
    let storageUsed = localStorage; // Asumimos localStorage por defecto

    if (!token || !storedUser) {
      // Si no se encuentra en localStorage, intentar con sessionStorage
      // console.log("[AuthContext.jsx] useEffect: No en localStorage, intentando en sessionStorage...");
      token = sessionStorage.getItem('authToken');
      storedUser = sessionStorage.getItem('authUser');
      storageUsed = sessionStorage; // Cambiamos al storage donde se encontraron los datos (o el último intentado)
    }

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // console.log("[AuthContext.jsx] useEffect: Usuario encontrado en", storageUsed === localStorage ? "localStorage" : "sessionStorage", parsedUser);
        setIsAuthenticated(true);
        setUser(parsedUser);
      } catch (e) {
        // console.error("[AuthContext.jsx] useEffect: Error al parsear usuario de", storageUsed === localStorage ? "localStorage" : "sessionStorage", e);
        // Limpiar el storage donde se encontraron datos corruptos.
        storageUsed.removeItem('authToken');
        storageUsed.removeItem('authUser');
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      // console.log("[AuthContext.jsx] useEffect: No se encontró token o usuario en ningún storage.");
      // Asegurarse de que el estado esté limpio si no hay nada en los storages
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  // Función de login que maneja la llamada a la API y el almacenamiento del token.
  // Acepta 'rememberMe' para decidir si usar localStorage o sessionStorage.
  const login = useCallback(async (credentials, rememberMe) => {
    // console.log("[AuthContext.jsx] login: Iniciando proceso. Recordar usuario:", rememberMe);
    setIsLoading(true);
    try {
      const apiResponse = await loginAPI(credentials);
      // console.log("[AuthContext.jsx] login: Respuesta recibida de loginAPI:", apiResponse);

      if (apiResponse.success && apiResponse.data?.token && apiResponse.data?.usuario) {
        const { token, usuario } = apiResponse.data;
        // Determinar qué API de almacenamiento web usar.
        const storage = rememberMe ? localStorage : sessionStorage;

        // console.log("[AuthContext.jsx] login: Guardando en", rememberMe ? "localStorage" : "sessionStorage");
        storage.setItem('authToken', token);
        storage.setItem('authUser', JSON.stringify(usuario));

        setIsAuthenticated(true);
        setUser(usuario);
        setIsLoading(false);
        // console.log("[AuthContext.jsx] login: Login exitoso. Usuario y token guardados.");
        return { success: true, role: usuario.rol.nombre };
      } else {
        setIsLoading(false);
        const errorMessage = apiResponse.message || "Respuesta inesperada de la API de login.";
        // console.error("[AuthContext.jsx] login: Fallo (API no exitosa o datos incompletos):", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.message || "Error durante el proceso de login.";
      // console.error("[AuthContext.jsx] login: Error capturado:", error);
      throw new Error(errorMessage);
    }
  }, []); // `loginAPI` es una dependencia estable importada. `setIsLoading` es de `useState` y no necesita listarse si no cambia la lógica de la función.

  // Función de logout que limpia los datos de autenticación de ambos storages.
  const logout = useCallback(async () => {
    // console.log("[AuthContext.jsx] logout: Ejecutando logout.");
    setIsLoading(true);
    try {
      // Llama a la función de logout del servicio, aunque sea simulada o solo del lado del cliente en authService.
      // Esto es por si en el futuro authService.logoutAPI realiza una llamada al backend.
      await serviceLogoutAPI();
      // console.log("[AuthContext.jsx] logout: serviceLogoutAPI (simulada o real) completada.");
    } catch (error) {
      // console.error("[AuthContext.jsx] logout: Error llamando a serviceLogoutAPI (puede ignorarse si es solo cliente):", error);
      // No se detiene el proceso de logout del cliente en el frontend incluso si esto falla,
      // a menos que la llamada al backend sea crítica para la invalidación de sesión.
    } finally {
      // Limpiar ambos storages para asegurar que la sesión se cierre completamente.
      localStorage.removeItem('authToken');
      localStorage.removeItem('authUser');
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('authUser');

      setIsAuthenticated(false);
      setUser(null);
      setIsLoading(false);
      // console.log("[AuthContext.jsx] logout: Sesión local limpiada de localStorage y sessionStorage.");
    }
  }, []); // `serviceLogoutAPI` es una dependencia estable.

  const contextValue = {
    isAuthenticated,
    user,
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