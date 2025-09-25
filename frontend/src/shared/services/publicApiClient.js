// src/shared/services/publicApiClient.js
import axios from "axios";

// Cliente de API público que no requiere autenticación
// Para uso en páginas públicas como HomePage, PublicServiciosPage, etc.

// Lee la URL base de la API desde las variables de entorno de Vite.
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Creación de la instancia de Axios para uso público (sin autenticación)
const publicApiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor de respuesta para manejar errores sin redirección automática
publicApiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("⛔ Error en la respuesta de la API pública:", error.response);
    
    // Para el cliente público, no redirigimos automáticamente
    // Solo logueamos el error y rechazamos la promesa
    return Promise.reject(error);
  }
);

export default publicApiClient;
