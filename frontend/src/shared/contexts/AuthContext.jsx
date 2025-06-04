// src/shared/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import { loginAPI } from '../../features/auth/services/authService'; // Importamos la función API real

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null); // Almacenará el objeto de usuario de la API
  const [isLoading, setIsLoading] = useState(true); // Para la carga inicial del estado de autenticación

  // Verificar el estado de autenticación inicial desde localStorage
  useEffect(() => {
    // console.log("[AuthContext.jsx] Verificando estado de autenticación inicial...");
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser'); // Guardaremos el objeto usuario completo

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        // console.log("[AuthContext.jsx] Usuario encontrado en localStorage:", parsedUser);
        setIsAuthenticated(true);
        setUser(parsedUser); // El objeto 'user' incluye el rol y otra info
      } catch (e) {
        // console.error("[AuthContext.jsx] Error al parsear usuario de localStorage:", e);
        // Limpiar en caso de datos corruptos
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
        setIsAuthenticated(false);
        setUser(null);
      }
    } else {
      // console.log("[AuthContext.jsx] No se encontró token o usuario en localStorage.");
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false); // Termina la carga inicial
  }, []);

  const login = useCallback(async (credentials) => {
    // console.log("[AuthContext.jsx] Iniciando proceso de login con credenciales:", credentials);
    setIsLoading(true);
    try {
      const apiResponse = await loginAPI(credentials); // Llama al servicio que llama a la API
      // console.log("[AuthContext.jsx] Respuesta recibida de loginAPI:", apiResponse);

      // Tu API devuelve: { success: true, data: { token, usuario }, message }
      // Donde usuario es: { idUsuario, nombre, apellido, correo, telefono, ..., rol: { idRol, nombre } }
      if (apiResponse.success && apiResponse.data?.token && apiResponse.data?.usuario) {
        const { token, usuario } = apiResponse.data;

        localStorage.setItem('authToken', token);
        localStorage.setItem('authUser', JSON.stringify(usuario)); // Guardar el objeto usuario completo

        setIsAuthenticated(true);
        setUser(usuario); // El 'usuario' ya contiene el objeto 'rol'
        // console.log("[AuthContext.jsx] Login exitoso. Usuario y token guardados:", usuario);
        setIsLoading(false);
        return { success: true, role: usuario.rol.nombre }; // Devuelve el nombre del rol para la redirección
      } else {
        // Si success es false o faltan datos cruciales en la respuesta
        setIsLoading(false);
        const errorMessage = apiResponse.message || "Respuesta inesperada de la API de login.";
        // console.error("[AuthContext.jsx] Fallo en login (API no exitosa o datos incompletos):", errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      setIsLoading(false);
      // El error ya debería venir formateado desde authService.js (ej. error.message)
      // o ser el objeto de error de la API { success: false, message: "..." }
      const errorMessage = error.message || "Error durante el proceso de login.";
      // console.error("[AuthContext.jsx] Error capturado en la función login:", error);
      throw new Error(errorMessage); // Propagar el error para que LoginPage lo muestre
    }
  }, []); // No olvides añadir setIsLoading a las dependencias si lo usas dentro y quieres que se actualice correctamente

  const logout = useCallback(() => {
    // console.log("[AuthContext.jsx] Ejecutando logout.");
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser'); // Remover el objeto usuario
    setIsAuthenticated(false);
    setUser(null);
    // Considera redirigir a /login aquí globalmente o en el componente que llama a logout.
    // Ejemplo: if (window.location.pathname !== "/login") window.location.href = "/login";
  }, []);

  const contextValue = {
    isAuthenticated,
    user, // Ahora user es un objeto { idUsuario, correo, ..., rol: { idRol, nombre } }
    isLoading, // Exponer isLoading
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};