// src/features/auth/services/tokenService.js
import { jwtDecode } from "jwt-decode";

/**
 * Servicio para gestión avanzada de tokens
 * Maneja validación, renovación y limpieza de tokens
 */
export const tokenService = {
  /**
   * Valida si un token JWT es válido y no ha expirado
   * @param {string} token - Token JWT a validar
   * @returns {boolean} - True si el token es válido
   */
  validateToken(token) {
    if (!token) {
      console.warn("No token provided");
      return false;
    }

    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token:", decoded); // Debug log

      const currentTime = Date.now() / 1000;

      // Verificar si el token ha expirado
      if (decoded.exp && decoded.exp < currentTime) {
        console.warn("Token has expired");
        return false;
      }

      // Verificar si el token es válido - más flexible
      // Un token es válido si se puede decodificar y no ha expirado
      return true;
    } catch (error) {
      console.error("Error validating token:", error);
      return false;
    }
  },

  /**
   * Obtiene el token almacenado (localStorage o sessionStorage)
   * @returns {string|null} - Token si existe y es válido
   */
  getStoredToken() {
    let token = localStorage.getItem("authToken");

    // Si no hay en localStorage, buscar en sessionStorage
    if (!token) {
      token = sessionStorage.getItem("authToken");
    }

    // Validar el token antes de devolverlo
    return this.validateToken(token) ? token : null;
  },

  /**
   * Almacena un token en el storage apropiado
   * @param {string} token - Token a almacenar
   * @param {boolean} rememberMe - Si debe usar localStorage
   */
  storeToken(token, rememberMe = false) {
    if (!this.validateToken(token)) {
      throw new Error("Invalid token provided");
    }

    const storage = rememberMe ? localStorage : sessionStorage;

    // Limpiar el otro storage para evitar conflictos
    if (rememberMe) {
      sessionStorage.removeItem("authToken");
    } else {
      localStorage.removeItem("authToken");
    }

    storage.setItem("authToken", token);
  },

  /**
   * Limpia todos los tokens almacenados
   */
  clearTokens() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("refreshToken");
  },

  /**
   * Obtiene información del usuario desde el token
   * @param {string} token - Token JWT
   * @returns {object|null} - Información del usuario o null
   */
  getUserFromToken(token) {
    if (!token) return null;

    try {
      const decoded = jwtDecode(token);
      console.log("Getting user from token:", decoded); // Debug log

      return {
        id: decoded.idUsuario || decoded.sub || decoded.user_id || decoded.id,
        email: decoded.correo || decoded.email,
        rol: decoded.rolNombre || decoded.rol || decoded.role,
        permisos: decoded.permissions || decoded.permisos || [],
      };
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  },

  /**
   * Verifica si el token expirará pronto (en los próximos 5 minutos)
   * @param {string} token - Token JWT
   * @returns {boolean} - True si expira pronto
   */
  isTokenExpiringSoon(token) {
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      const fiveMinutesFromNow = currentTime + 5 * 60;

      return decoded.exp && decoded.exp < fiveMinutesFromNow;
    } catch (error) {
      console.error("Error checking token expiration:", error);
      return false;
    }
  },
};

export default tokenService;
