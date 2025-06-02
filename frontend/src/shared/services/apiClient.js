// src/shared/services/apiClient.js
import axios from "axios";

// URL base de tu API desplegada en Render
const API_BASE_URL =
  import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para añadir el token de autenticación a las cabeceras
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // O donde guardes tu token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Opcional: Interceptor para manejar respuestas globales (ej. errores 401)
apiClient.interceptors.response.use(
  (response) => response, // Si la respuesta es exitosa, la devuelve tal cual
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error(
        "Error 401: No autorizado o token expirado. Limpiando token y redirigiendo a login..."
      );
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole"); // Asegúrate de limpiar cualquier otra info de usuario
      // Considera usar un método del AuthContext para desloguear si centralizas esa lógica
      if (window.location.pathname !== "/login") {
        // Evitar bucles de redirección
        window.location.href = "/login"; // Redirección simple. Para SPAs, usa el router.
      }
    }
    return Promise.reject(error); // Importante: rechazar el error para que se maneje en la llamada original
  }
);

export default apiClient;
