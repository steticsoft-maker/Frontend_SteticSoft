// src/features/auth/services/authService.js
import apiClient from "../../../shared/services/api"; // apiClient es tu instancia configurada de Axios

/**
 * Realiza la llamada al endpoint de inicio de sesión de la API.
 * Este servicio toma las credenciales del formulario (email y password),
 * transforma los nombres de los campos ('email' a 'correo', 'password' a 'contrasena')
 * para que coincidan con los esperados por el endpoint /auth/login del backend,
 * y envía la solicitud. Maneja la respuesta o los errores de la API.
 * @param {object} credentials - Objeto con las credenciales del usuario: { email: "usuario@example.com", password: "password123" }.
 * @returns {Promise<object>} La respuesta de la API, que típicamente incluye datos del usuario y el token JWT.
 * @throws {Error} Relanza el error si la llamada a la API falla, permitiendo que el llamador lo maneje.
 */
export const loginAPI = async (credentials) => {
  // console.log("[authService.js] loginAPI: Credenciales recibidas del formulario:", credentials);

  // Transformación de los nombres de los campos del frontend a los esperados por el backend.
  const datosParaAPI = {
    correo: credentials.email,
    contrasena: credentials.password,
  };

  // console.log("[authService.js] loginAPI: Datos transformados para enviar a la API:", datosParaAPI);

  try {
    // Petición POST al endpoint de login del backend.
    const response = await apiClient.post("/auth/login", datosParaAPI);
    // console.log("[authService.js] loginAPI: Respuesta exitosa de la API:", response.data);
    return response.data;
  } catch (error) {
    // console.error("[authService.js] loginAPI: Error en la llamada API:", error.response?.data || error.message);
    // Es importante relanzar el error para que la capa superior (ej. AuthContext, LoginPage)
    // pueda manejarlo y informar al usuario adecuadamente.
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido durante el inicio de sesión.")
    );
  }
};

/**
 * Realiza la llamada al endpoint de registro de nuevos usuarios en la API.
 * Este servicio recibe el objeto 'userData' directamente desde RegisterForm.jsx.
 * Se asume que 'userData' ya contiene todos los campos con los nombres correctos
 * que el backend espera para el registro en /auth/registrar (nombre, apellido, correo,
 * contrasena, telefono, tipoDocumento, numeroDocumento, fechaNacimiento).
 * No se realiza transformación de nombres de campos aquí si RegisterForm.jsx ya los alinea.
 * @param {object} userData - Objeto con todos los datos del usuario para el registro.
 * Ej: { nombre: "Ana", apellido: "Perez", correo: "ana@example.com", ... }.
 * @returns {Promise<object>} La respuesta de la API, usualmente con datos del usuario recién creado y token.
 * @throws {Error} Relanza el error si la llamada a la API falla, permitiendo que el llamador lo maneje.
 */
export const registerAPI = async (userData) => {
  // console.log("[authService.js] registerAPI: Datos de registro recibidos:", userData);

  // No se requiere un objeto intermedio 'datosRegistroParaAPI' para mapeo si 'userData'
  // ya viene de RegisterForm.jsx con los nombres de campo correctos que el backend espera:
  // { nombre, apellido, correo, contrasena, telefono, tipoDocumento, numeroDocumento, fechaNacimiento }

  try {
    // Petición POST al endpoint de registro del backend con los datos del usuario.
    const response = await apiClient.post("/auth/registrar", userData);
    // console.log("[authService.js] registerAPI: Respuesta exitosa de la API:", response.data);
    return response.data;
  } catch (error) {
    // console.error("[authService.js] registerAPI: Error en la llamada API:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido durante el proceso de registro.")
    );
  }
};

/**
 * Realiza la llamada al endpoint para solicitar un token de recuperación de contraseña.
 * El backend (/auth/solicitar-recuperacion) espera recibir el correo electrónico
 * del usuario que desea iniciar el proceso de recuperación.
 * @param {string} emailSolicitud - Correo electrónico del usuario.
 * @returns {Promise<object>} La respuesta de la API, generalmente un mensaje de confirmación.
 * @throws {Error} Relanza el error si la llamada a la API falla.
 */
export const solicitarRecuperacionAPI = async (emailSolicitud) => {
  // console.log("[authService.js] solicitarRecuperacionAPI: Email para recuperación:", emailSolicitud);
  try {
    // Petición POST al backend enviando el correo electrónico.
    const response = await apiClient.post("/auth/solicitar-recuperacion", {
      correo: emailSolicitud, // El backend espera un objeto con la propiedad 'correo'.
    });
    // console.log("[authService.js] solicitarRecuperacionAPI: Respuesta exitosa de la API:", response.data);
    return response.data;
  } catch (error) {
    // console.error("[authService.js] solicitarRecuperacionAPI: Error en la llamada API:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido al solicitar la recuperación de contraseña.")
    );
  }
};

/**
 * Realiza la llamada al endpoint para restablecer la contraseña utilizando un token.
 * El backend (/auth/resetear-contrasena) espera el token de recuperación,
 * la nueva contraseña y la confirmación de la nueva contraseña.
 * @param {string} token - Token de recuperación válido.
 * @param {string} nuevaContrasena - Nueva contraseña ingresada por el usuario.
 * @param {string} confirmarNuevaContrasena - Confirmación de la nueva contraseña.
 * @returns {Promise<object>} La respuesta de la API, generalmente un mensaje de éxito.
 * @throws {Error} Relanza el error si la llamada a la API falla.
 */
export const resetearContrasenaAPI = async (
  token,
  nuevaContrasena,
  confirmarNuevaContrasena
) => {
  const datosParaAPI = { token, nuevaContrasena, confirmarNuevaContrasena };
  // console.log("[authService.js] resetearContrasenaAPI: Enviando datos para reseteo (sin mostrar contraseñas).");
  try {
    // Petición POST al backend con los datos necesarios para el reseteo.
    const response = await apiClient.post(
      "/auth/resetear-contrasena",
      datosParaAPI
    );
    // console.log("[authService.js] resetearContrasenaAPI: Respuesta exitosa de la API:", response.data);
    return response.data;
  } catch (error) {
    // console.error("[authService.js] resetearContrasenaAPI: Error en la llamada API:", error.response?.data || error.message);
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido al intentar restablecer la contraseña.")
    );
  }
};

/**
 * Gestiona el proceso de logout del lado del cliente.
 * Si el backend tuviera un endpoint específico para invalidar tokens en el servidor
 * (ej. para invalidar refresh tokens o sesiones de larga duración), se realizaría
 * la llamada a dicho endpoint aquí. Actualmente, simula un logout exitoso del cliente.
 * @returns {Promise<object>} Un objeto indicando el éxito del logout del cliente.
 * @throws {Error} Si la llamada a un endpoint de logout del backend (si se implementara) falla.
 */
export const logoutAPI = async () => {
  // console.log("[authService.js] logoutAPI: Procesando logout del cliente.");
  try {
    // Ejemplo si el backend tuviera un endpoint de logout:
    // await apiClient.post("/auth/logout");
    // console.log("[authService.js] logoutAPI: Logout del cliente procesado.");
    // Como no hay una llamada al backend definida para logout en este momento,
    // se retorna un éxito simulado del lado del cliente.
    return { success: true, message: "Logout procesado por el cliente." };
  } catch (error) {
    // Este bloque catch se ejecutaría si la llamada al backend (comentada arriba) fallara.
    // console.error("[authService.js] logoutAPI: Error durante la llamada API de logout (si se implementara):", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};