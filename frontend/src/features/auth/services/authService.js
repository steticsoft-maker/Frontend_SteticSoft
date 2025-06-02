// src/features/auth/services/authService.js
import apiClient from "../../../shared/services/api"; // Ajusta la ruta si es necesario

/**
 * Llama al endpoint de login de la API.
 * @param {object} credentials - { email, password } // Lo que viene del formulario
 * @returns {Promise<object>} La respuesta de la API.
 */
export const loginAPI = async (credentials) => {
  // credentials viene como { email: 'user@example.com', password: 'userpass' }
  // console.log(
  //   "[authService.js] Credenciales recibidas del formulario:",
  //   credentials
  // );

  // Transformar los nombres de los campos para que coincidan con el backend
  const datosParaAPI = {
    correo: credentials.email, // Cambiar 'email' a 'correo'
    contrasena: credentials.password, // Cambiar 'password' a 'contrasena'
  };

  // console.log(
  //   "[authService.js] Intentando login con datos transformados para API:",
  //   datosParaAPI
  // );
  try {
    // apiClient ya tiene la baseURL
    const response = await apiClient.post("/auth/login", datosParaAPI); // Enviar los datos transformados
    // console.log("[authService.js] Respuesta de la API (login):", response.data);
    return response.data;
  } catch (error) {
    // console.error(
    //   "[authService.js] Error en la llamada API de login:",
    //   error.response?.data || error.message
    // );
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido en el servicio de login")
    );
  }
};

/**
 * Llama al endpoint de registro de la API.
 * @param {object} userData - Datos del formulario de registro (ej: { name, email, password, ... })
 * @returns {Promise<object>} La respuesta de la API.
 */
export const registerAPI = async (userData) => {
  // userData viene con { name: '...', email: '...', password: '...' } según RegisterForm.jsx
  // console.log(
  //   "[authService.js] Datos de registro recibidos del formulario:",
  //   userData
  // );

  // Transformar los nombres de los campos para que coincidan con el backend si es necesario
  // Tu backend auth.controller.js para registrar espera:
  // { nombre, apellido, correo, contrasena, telefono, tipoDocumento, numeroDocumento, fechaNacimiento }
  // Tu RegisterForm.jsx envía: { name, email, password }
  // Necesitas asegurar que todos los campos requeridos por el backend se envíen
  // y con los nombres correctos.

  // Ejemplo de transformación para el registro (ajusta según los campos reales de tu RegisterForm):
  const datosRegistroParaAPI = {
    nombre: userData.name, // Asumiendo que 'name' en el form es nombre completo
    // apellido: userData.apellido, // Si lo tienes en el form
    correo: userData.email,
    contrasena: userData.password,
    // telefono: userData.telefono, // Si lo tienes en el form
    // tipoDocumento: userData.tipoDocumento, // Si lo tienes en el form
    // numeroDocumento: userData.numeroDocumento, // Si lo tienes en el form
    // fechaNacimiento: userData.fechaNacimiento // Si lo tienes en el form
  };
  // ¡IMPORTANTE! Añade todos los campos que tu backend espera para el registro.
  // Si RegisterForm.jsx no los tiene, deberás añadirlos allí primero.

  // console.log(
  //   "[authService.js] Intentando registrar con datos transformados para API:",
  //   datosRegistroParaAPI
  // );
  try {
    const response = await apiClient.post(
      "/auth/registrar",
      datosRegistroParaAPI
    );
    // console.log(
    //   "[authService.js] Respuesta de la API (registro):",
    //   response.data
    // );
    return response.data;
  } catch (error) {
    // console.error(
    //   "[authService.js] Error en la llamada API de registro:",
    //   error.response?.data || error.message
    // );
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido en el servicio de registro")
    );
  }
};

/**
 * Llama al endpoint para solicitar la recuperación de contraseña.
 * @param {string} emailSolicitud - El email para la recuperación
 * @returns {Promise<object>} La respuesta de la API.
 */
export const solicitarRecuperacionAPI = async (emailSolicitud) => {
  // Renombrado el parámetro para evitar confusión con el campo 'correo'
  // console.log(
  //   "[authService.js] Solicitando recuperación para email:",
  //   emailSolicitud
  // );
  try {
    // El backend espera un objeto { correo: 'email@example.com' }
    const response = await apiClient.post("/auth/solicitar-recuperacion", {
      correo: emailSolicitud,
    });
    // console.log(
    //   "[authService.js] Respuesta de API (solicitar-recuperacion):",
    //   response.data
    // );
    return response.data;
  } catch (error) {
    // console.error(
    //   "[authService.js] Error en API (solicitar-recuperacion):",
    //   error.response?.data || error.message
    // );
    throw (
      error.response?.data ||
      new Error(
        error.message || "Error desconocido en el servicio de recuperación"
      )
    );
  }
};

/**
 * Llama al endpoint para resetear la contraseña.
 * @param {string} token
 * @param {string} nuevaContrasena
 * @param {string} confirmarNuevaContrasena
 * @returns {Promise<object>} La respuesta de la API.
 */
export const resetearContrasenaAPI = async (
  token,
  nuevaContrasena,
  confirmarNuevaContrasena
) => {
  const datosParaAPI = { token, nuevaContrasena, confirmarNuevaContrasena };
  // console.log(
  //   "[authService.js] Reseteando contraseña con token y nueva contraseña."
  // ); // No loguear contraseñas
  try {
    const response = await apiClient.post(
      "/auth/resetear-contrasena",
      datosParaAPI
    );
    // console.log(
    //   "[authService.js] Respuesta de API (resetear-contrasena):",
    //   response.data
    // );
    return response.data;
  } catch (error) {
    // console.error(
    //   "[authService.js] Error en API (resetear-contrasena):",
    //   error.response?.data || error.message
    // );
    throw (
      error.response?.data ||
      new Error(error.message || "Error desconocido al resetear contraseña")
    );
  }
};

export const logoutAPI = async () => {
  // console.log("[authService.js] Procesando logout del cliente.");
  try {
    // Si tu backend tuviera un endpoint /auth/logout para invalidar algo (ej. refresh tokens), lo llamarías aquí.
    // await apiClient.post("/auth/logout");
    return { success: true, message: "Logout procesado por el cliente." };
  } catch (error) {
    // console.error(
    //   "[authService.js] Error durante el logout API (si se implementara):",
    //   error.response?.data || error.message
    // );
    throw error.response?.data || error; // No debería fallar si es solo cliente
  }
};
