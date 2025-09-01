// src/features/clientes/services/clientesService.js
import apiClient from "../../../shared/services/apiClient"; // Asegúrate de que apiClient maneje headers de autenticación y errores HTTP.

/**
 * Obtiene todos los clientes del backend, con soporte para búsqueda.
 * @param {string} [searchTerm=''] - El término de búsqueda para filtrar clientes.
 * @returns {Promise<Array>} Una promesa que resuelve con un array de objetos cliente.
 */
export const fetchClientes = async (searchTerm = '') => { // Ahora acepta un searchTerm opcional
  try {
    let url = "/clientes";
    // Si hay un término de búsqueda, lo añadimos como parámetro de consulta
    if (searchTerm) {
      // Codificamos el término de búsqueda para que sea seguro en la URL
      url = `/clientes?search=${encodeURIComponent(searchTerm)}`;
    }

    const response = await apiClient.get(url);
    
    // El backend devuelve { success: true, data: clientes }.
    // Asegúrate de retornar directamente el array de clientes.
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    
    // Si la respuesta no es el formato esperado, puedes loggear o devolver un array vacío
    console.warn("Formato de respuesta inesperado para fetchClientes:", response.data);
    return [];
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }
};

/**
 * Verifica si un correo electrónico ya existe en el sistema para un cliente.
 * @param {string} correo - El correo electrónico a verificar.
 * @returns {Promise<object>} La respuesta de la API.
 */
export const verificarCorreoClienteAPI = async (correo) => {
  try {
    const response = await apiClient.get(
      `/clientes/verificar-correo?correo=${encodeURIComponent(correo)}`
    );
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error(error.message || "Error al verificar el correo.")
    );
  }
};

/**
 * Obtiene un cliente específico por su ID del backend.
 * Útil para pre-rellenar formularios de edición.
 * @param {number} clienteId - El ID del cliente a obtener.
 * @returns {Promise<object>} Una promesa que resuelve con el objeto cliente.
 */
export const getClienteById = async (clienteId) => {
  try {
    const response = await apiClient.get(`/clientes/${clienteId}`);
    // El backend devuelve { success: true, data: cliente }.
    if (response.data && typeof response.data.data === 'object') {
      return response.data.data;
    }
    console.warn("Formato de respuesta inesperado para getClienteById:", response.data);
    return null; // O un objeto vacío si es lo que tu UI espera
  } catch (error) {
    console.error(`Error al obtener cliente con ID ${clienteId}:`, error);
    throw error;
  }
};

/**
 * Guarda un cliente (crea uno nuevo o actualiza uno existente) a través de la API del backend.
 *
 * @param {object} clienteData - Los datos del cliente a guardar.
 * @param {boolean} isCreating - `true` si se está creando un nuevo cliente, `false` si se está actualizando.
 * @param {number|null} [currentEditingClienteId=null] - El ID del cliente que se está editando (solo relevante si `isCreating` es `false`).
 * @returns {Promise<object>} Una promesa que resuelve con el objeto cliente guardado/actualizado.
 */
export const saveCliente = async (clienteData, isCreating, currentEditingClienteId = null) => {
  try {
    if (isCreating) {
      const dataToSend = {
        nombre: clienteData.nombre,
        apellido: clienteData.apellido,
        correo: clienteData.correo, // Ahora usamos clienteData.correo directamente del ClienteForm
        telefono: clienteData.telefono,
        direccion: clienteData.direccion,
        tipoDocumento: clienteData.tipoDocumento,
        numeroDocumento: clienteData.numeroDocumento,
        fechaNacimiento: clienteData.fechaNacimiento,
        contrasena: clienteData.contrasena, // Ahora usamos clienteData.contrasena directamente del ClienteForm
      };
      const response = await apiClient.post("/clientes", dataToSend);
      return response.data.data; // Asumiendo que devuelve { success: true, data: nuevoCliente }
    } else { // Editando un cliente existente
      const dataToSend = { ...clienteData };

      // Eliminar el campo 'contrasena' si existe al actualizar
      // (No se actualiza la contraseña con esta ruta general de edición de datos del cliente)
      if (dataToSend.contrasena) {
        delete dataToSend.contrasena;
      }
      // Eliminar el campo 'password' por si acaso (del pasado)
      if (dataToSend.password) {
        delete dataToSend.password;
      }

      // Mapear 'estado' del frontend a 'estadoCliente' y 'estadoUsuario' para el backend
      // ¡ESTO ES CLAVE PARA EL 400!
      if (Object.prototype.hasOwnProperty.call(dataToSend, 'estado')) {
        dataToSend.estadoCliente = dataToSend.estado;
        dataToSend.estadoUsuario = dataToSend.estado; // Asumiendo que el estado del usuario se sincroniza con el del cliente
        delete dataToSend.estado; // Eliminar el campo 'estado' original del frontend
      }

      // Si tu backend espera el idCliente en el cuerpo al editar, descomenta la siguiente línea:
      // dataToSend.idCliente = currentEditingClienteId;

      const response = await apiClient.put(`/clientes/${currentEditingClienteId}`, dataToSend);
      return response.data.data; // Asumiendo que devuelve { success: true, data: clienteActualizado }
    }
  } catch (error) {
    console.error("Error al guardar cliente:", error);
    // Verificar si el error tiene una respuesta con datos (por ejemplo, mensajes de validación del backend)
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message); // Lanza el mensaje de error específico del backend
    }
    throw error; // Re-lanzar el error genérico si no hay mensaje específico
  }
};

/**
 * Elimina un cliente por su ID a través de la API del backend.
 * @param {number} clienteId - El ID del cliente a eliminar.
 * @returns {Promise<boolean>} Una promesa que resuelve a `true` si la eliminación fue exitosa.
*/
export const deleteClienteById = async (clienteId) => {
  try {
    const response = await apiClient.delete(`/clientes/${clienteId}`);
    return response.status === 204 || response.status === 200; // A veces el backend devuelve 200 con un mensaje
  } catch (error) {
    console.error(`Error al eliminar cliente con ID ${clienteId}:`, error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};

/**
 * Cambia el estado (activo/inactivo) de un cliente a través de la API del backend.
 * @param {number} clienteId - El ID del cliente cuyo estado se va a cambiar.
 * @param {boolean} nuevoEstado - El nuevo estado (`true` para activo, `false` para inactivo).
 * @returns {Promise<object>} Una promesa que resuelve con el objeto cliente actualizado.
 */
export const toggleClienteEstado = async (clienteId, nuevoEstado) => {
  try {
    // ¡CORRECCIÓN CLAVE AQUÍ!
    // Tu backend espera un campo 'estado' en la ruta PATCH /:idCliente/estado
    // No 'estadoCliente' y 'estadoUsuario' en esta ruta específica.
    const dataToSend = {
        estado: nuevoEstado // Enviar el campo 'estado' con el booleano
    };
    const response = await apiClient.patch(`/clientes/${clienteId}/estado`, dataToSend);
    return response.data.data; // Asumiendo que devuelve { success: true, data: clienteActualizado }
  } catch (error) {
    console.error(`Error al cambiar el estado del cliente ID ${clienteId}:`, error);
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};