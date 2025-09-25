// src/shared/services/apiClient.js
import axios from "axios";

// NOTA IMPORTANTE:
// La carpeta `frontend/src/shared/src_api` es una copia espejo del código del backend
// y se mantiene únicamente con fines de análisis y referencia.
// NO DEBE HABER ninguna importación o conexión de código a dicha carpeta.
// Todo el acceso a la API debe realizarse a través de este cliente (`apiClient`).

// Lee la URL base de la API desde las variables de entorno de Vite.
// Si no está definida, usa '/api' para el proxy de Vite
const API_BASE_URL = import.meta.env.VITE_API_URL || "/api";

// Creación de la instancia de Axios con la configuración base.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// --- Interceptor de Petición (Request) ---
// Se ejecuta ANTES de que cada petición sea enviada.
apiClient.interceptors.request.use(
  (config) => {
    // CORRECCIÓN IMPORTANTE:
    // Busca el token primero en localStorage, si no lo encuentra, busca en sessionStorage.
    const token =
      localStorage.getItem("authToken") || sessionStorage.getItem("authToken");

    // Si encuentra un token, lo añade a la cabecera 'Authorization'.
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Si hay un error al configurar la petición, lo rechaza.
    return Promise.reject(error);
  }
);

// --- Interceptor de Respuesta (Response) ---
// Se ejecuta DESPUÉS de recibir una respuesta de la API.
apiClient.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa (ej: status 200), la retorna sin cambios.
  (error) => {
    // Si la respuesta es un error, entra aquí.

    // Verificamos si el error es un 401 (No Autorizado).
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      localStorage.removeItem("authPermissions");
      sessionStorage.clear();

      // Redirige al login solo si no estamos ya ahí Y estamos en una ruta que requiere autenticación
      const publicRoutes = [
        "/",
        "/productos",
        "/servicios",
        "/novedades-publicas",
        "/register",
        "/password-recovery",
      ];
      const isPublicRoute = publicRoutes.includes(window.location.pathname);

      if (window.location.pathname !== "/login" && !isPublicRoute) {
        window.location.href = "/login";
      }
    }

    // Es crucial rechazar el error para que las llamadas originales (ej. en las páginas)
    // también puedan manejarlo si es necesario.
    return Promise.reject(error);
  }
);

export default apiClient;
