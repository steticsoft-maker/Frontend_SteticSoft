// src/shared/services/apiClient.js
import axios from "axios";

// 1. Lee la URL base de la API desde las variables de entorno.
//    Si VITE_API_URL no está definida en tu .env, usará el valor de respaldo.
const API_BASE_URL =
  import.meta.env.VITE_API_URL

// 2. Crea la instancia de Axios con la URL base.
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 3. Interceptor de Peticiones: Añade el token JWT a cada petición.
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // Asegúrate de que "authToken" es la clave que usas para guardar el token.
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 4. Interceptor de Respuestas (Opcional pero Recomendado): Maneja errores globales.
apiClient.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, la devuelve tal cual.
  (error) => {
    if (error.response && error.response.status === 401) {
      // Error 401: No autorizado (ej. token inválido o expirado).
      console.error(
        "Error 401: No autorizado. Limpiando token y redirigiendo a login..."
      );
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser"); // Limpia también la info del usuario si la guardas.
      // Aquí deberías usar tu lógica de enrutamiento para redirigir a /login.
      // Evita la redirección si ya estás en /login para prevenir bucles.
      if (
        window.location.pathname !== "/login" &&
        window.location.pathname !== "/auth/login"
      ) {
        window.location.href = "/login"; // O la ruta de tu página de login.
      }
    }
    // Es importante rechazar el error para que pueda ser manejado
    // por la función que originalmente hizo la llamada (ej., en tu servicio o componente).
    return Promise.reject(error);
  }
);

export default apiClient;
