// src/shared/contexts/AuthContext.jsx
import React, { useState, useEffect, useCallback } from "react";
import { AuthContext } from "./authHooks";
import {
  loginAPI,
  logoutAPI as serviceLogoutAPI,
} from "../../features/auth/services/authService";
import tokenService from "../../features/auth/services/tokenService";

// AuthContext is now imported from authHooks.js

// Se exporta el proveedor (Provider) como antes.
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(null);
  const [sessionTimeout, setSessionTimeout] = useState(null);

  // Verificar token válido al inicializar
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // Obtener token válido usando el servicio de tokens
        const token = tokenService.getStoredToken();

        if (token) {
          // Obtener información del usuario desde el token
          const userFromToken = tokenService.getUserFromToken(token);

          if (userFromToken) {
            // Cargar datos adicionales del storage
            const storedUser =
              localStorage.getItem("authUser") ||
              sessionStorage.getItem("authUser");
            const storedPermissions =
              localStorage.getItem("authPermissions") ||
              sessionStorage.getItem("authPermissions");

            let userData = userFromToken;
            if (storedUser) {
              try {
                userData = { ...userFromToken, ...JSON.parse(storedUser) };
              } catch (e) {
                console.warn(
                  "Error parsing stored user data, using token data only"
                );
              }
            }

            let userPermissions = userFromToken.permisos || [];
            if (storedPermissions) {
              try {
                userPermissions = JSON.parse(storedPermissions);
              } catch (e) {
                console.warn(
                  "Error parsing stored permissions, using token data only"
                );
              }
            }

            setIsAuthenticated(true);
            setUser(userData);
            setPermissions(userPermissions);
            setLastActivity(Date.now());

            // Configurar timeout de sesión (30 minutos)
            const timeout = setTimeout(() => {
              console.warn("Session timeout - auto logout");
              logout();
            }, 30 * 60 * 1000);
            setSessionTimeout(timeout);
          } else {
            // Token inválido, limpiar datos
            tokenService.clearTokens();
            setIsAuthenticated(false);
            setUser(null);
            setPermissions([]);
          }
        } else {
          // No hay token válido
          setIsAuthenticated(false);
          setUser(null);
          setPermissions([]);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
        tokenService.clearTokens();
        setIsAuthenticated(false);
        setUser(null);
        setPermissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = useCallback(
    async (credentials, rememberMe) => {
      setIsLoading(true);
      try {
        const apiResponse = await loginAPI(credentials);

        if (
          apiResponse.success &&
          apiResponse.data?.token &&
          apiResponse.data?.usuario
        ) {
          const { token, usuario } = apiResponse.data;

           // Validar token antes de almacenarlo
           if (!tokenService.validateToken(token)) {
             throw new Error("Token recibido no es válido");
           }

          // Almacenar token usando el servicio
          tokenService.storeToken(token, rememberMe);

          // Escoge el almacenamiento correcto basado en 'rememberMe'
          const storage = rememberMe ? localStorage : sessionStorage;
          storage.setItem("authUser", JSON.stringify(usuario));
          storage.setItem(
            "authPermissions",
            JSON.stringify(usuario.permisos || [])
          );

          setIsAuthenticated(true);
          setUser(usuario);
          setPermissions(usuario.permisos || []);
          setLastActivity(Date.now());

          // Limpiar timeout anterior si existe
          if (sessionTimeout) {
            clearTimeout(sessionTimeout);
          }

          // Configurar nuevo timeout de sesión
          const timeout = setTimeout(() => {
            console.warn("Session timeout - auto logout");
            logout();
          }, 30 * 60 * 1000);
          setSessionTimeout(timeout);

          setIsLoading(false);
          return { success: true, role: usuario.rol.nombre };
        } else {
          setIsLoading(false);
          throw new Error(
            apiResponse.message || "Respuesta inesperada de la API."
          );
        }
      } catch (error) {
        setIsLoading(false);
        throw new Error(error.message || "Error durante el login.");
      }
    },
    [sessionTimeout]
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await serviceLogoutAPI();
    } catch (error) {
      console.error("Error en logout API (puede ignorarse):", error);
    } finally {
      // Limpiar timeout de sesión
      if (sessionTimeout) {
        clearTimeout(sessionTimeout);
        setSessionTimeout(null);
      }

      // Limpiar tokens usando el servicio
      tokenService.clearTokens();

      // Limpiar datos de usuario
      localStorage.removeItem("authUser");
      localStorage.removeItem("authPermissions");
      sessionStorage.removeItem("authUser");
      sessionStorage.removeItem("authPermissions");

      setIsAuthenticated(false);
      setUser(null);
      setPermissions([]);
      setLastActivity(null);
      setIsLoading(false);
    }
  }, [sessionTimeout]);

  // Función para actualizar la actividad del usuario
  const updateActivity = useCallback(() => {
    setLastActivity(Date.now());
  }, []);

  // Función para verificar si el token está expirando pronto
  const checkTokenExpiration = useCallback(() => {
    const token = tokenService.getStoredToken();
    if (token && tokenService.isTokenExpiringSoon(token)) {
      console.warn("Token expiring soon");
      // Aquí se podría implementar refresh token o notificar al usuario
      return true;
    }
    return false;
  }, []);

  // El valor del contexto
  const contextValue = {
    isAuthenticated,
    user,
    permissions,
    isLoading,
    lastActivity,
    login,
    logout,
    updateActivity,
    checkTokenExpiration,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// useAuth hook has been moved to authHooks.js
