// src/features/auth/services/authService.js
import apiClient from "../../../shared/services/api"; // Ajusta la ruta si es necesario

/**
 * Llama al endpoint de login de la API.
 * @param {object} credentials - { email, password }
 * @returns {Promise<object>} La respuesta de la API.
 */
export const loginAPI = async (credentials) => {
  console.log("[authService.js] Intentando login con credenciales:", credentials);
  try {
    // por lo que aquí solo necesitas la ruta específica del endpoint.
    const response = await apiClient.post("/auth/login", credentials);
    console.log("[authService.js] Respuesta de la API (login):", response.data);
    return response.data; // Axios devuelve la respuesta de la API en la propiedad 'data'.
                          // Tu backend devuelve { success: boolean, data: { token, usuario }, message?: string }
  } catch (error) {
    console.error("[authService.js] Error en la llamada API de login:", error.response?.data || error.message);
    // El interceptor de apiClient ya puede manejar errores 401 globales.
    // Aquí, el error ya ha sido procesado por el interceptor si fue un 401.
    // Relanzamos el error para que el AuthContext y/o el componente lo manejen.
    // Es importante que el error que se propague tenga la info útil, como error.response.data
    throw error.response?.data || new Error(error.message || "Error desconocido en el servicio de login");
  }
};

/**
 * Llama al endpoint de registro de la API.
 * @param {object} userData - Datos del usuario a registrar.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const registerAPI = async (userData) => {
  console.log("[authService.js] Intentando registrar con datos:", userData);
  try {
    const response = await apiClient.post("/auth/registrar", userData);
    console.log("[authService.js] Respuesta de la API (registro):", response.data);
    return response.data; // Tu backend devuelve { success: boolean, data: { usuario }, message?: string }
  } catch (error) {
    console.error("[authService.js] Error en la llamada API de registro:", error.response?.data || error.message);
    throw error.response?.data || new Error(error.message || "Error desconocido en el servicio de registro");
  }
};

// Puedes añadir más funciones aquí si las necesitas (ej. solicitarRecuperacionAPI, resetearContrasenaAPI)
// siguiendo el mismo patrón.