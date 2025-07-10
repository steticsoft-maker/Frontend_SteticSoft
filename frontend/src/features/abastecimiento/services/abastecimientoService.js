// src/features/abastecimiento/services/abastecimientoService.js
import apiClient from "../../../shared/services/apiClient";

/**
 * Calcula los días de vida útil restantes para una entrada de abastecimiento.
 * @param {object} abastecimientoEntry - El objeto de abastecimiento de la API.
 * @returns {string} Una cadena de texto que indica los días restantes, si está vencido o si no hay datos.
 */
export const calculateRemainingLifetime = (abastecimientoEntry) => {
  if (
    !abastecimientoEntry?.producto?.categoria?.vidaUtilDias ||
    !abastecimientoEntry.fechaIngreso
  ) {
    return "N/A";
  }

  const vidaUtilDias = parseInt(
    abastecimientoEntry.producto.categoria.vidaUtilDias,
    10
  );
  const fechaIngreso = new Date(abastecimientoEntry.fechaIngreso);
  fechaIngreso.setMinutes(
    fechaIngreso.getMinutes() + fechaIngreso.getTimezoneOffset()
  );

  const fechaVencimiento = new Date(fechaIngreso);
  fechaVencimiento.setDate(fechaVencimiento.getDate() + vidaUtilDias);

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const diffTime = fechaVencimiento - hoy;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return "Vencido";
  }
  return `${diffDays} días`;
};

// Obtiene todos los registros de abastecimiento.
const getAbastecimientos = async () => {
  try {
    const response = await apiClient.get("/abastecimientos");
    // Corregido: El controlador de abastecimiento devuelve el array directamente en response.data
    return response.data || [];
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Error al obtener los registros de abastecimiento.")
    );
  }
};

// Declaración de agotarAbastecimiento movida aquí, ANTES de su uso.
const agotarAbastecimiento = async (id, razon) => {
  try {
    // Asegurarse de enviar 'razon_agotamiento' como espera el backend
    const response = await apiClient.patch(`/abastecimientos/${id}/agotar`, { razon_agotamiento: razon });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Error al marcar el producto como agotado.")
    );
  }
};

// Crea un nuevo registro de abastecimiento.
const createAbastecimiento = async (data) => {
  try {
    const response = await apiClient.post("/abastecimientos", data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Error al crear el registro de abastecimiento.")
    );
  }
};

// Actualiza un registro de abastecimiento.
const updateAbastecimiento = async (id, data) => {
  try {
    const response = await apiClient.put(`/abastecimientos/${id}`, data);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Error al actualizar el registro de abastecimiento.")
    );
  }
};

// Cambia el estado (habilita/anula) de un registro.
const toggleEstadoAbastecimiento = async (id, estado) => {
  try {
    const response = await apiClient.patch(`/abastecimientos/${id}/estado`, {
      estado,
    });
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Error al cambiar el estado del registro.")
    );
  }
};

// Elimina físicamente un registro de abastecimiento.
const deleteAbastecimiento = async (id) => {
  try {
    const response = await apiClient.delete(`/abastecimientos/${id}`);
    return response.data;
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Error al eliminar el registro de abastecimiento.")
    );
  }
};

// Obtiene productos activos filtrados por tipo de uso "Interno".
const getProductosActivosUsoInterno = async () => {
  try {
    const response = await apiClient.get(
      "/productos?estado=true&tipoUso=Interno"
    );
    // --- INICIO DE CORRECCIÓN ---
    // La API ahora devuelve un objeto con paginación. Los productos están en `response.data.data.productos`.
    // Antes estaba `response.data?.data?.data` lo cual es incorrecto.
    return response.data?.data?.productos || [];
    // --- FIN DE CORRECCIÓN ---
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Error al obtener los productos activos.")
    );
  }
};

// Obtiene los usuarios con el rol de "Empleado" que están activos.
const getEmpleadosActivos = async () => {
  try {
    const response = await apiClient.get("/usuarios?estado=true");
    const allUsers = response.data?.data || [];
    return allUsers.filter((u) => u.rol?.nombre === "Empleado");
  } catch (error) {
    throw (
      error.response?.data ||
      new Error("Error al obtener los empleados activos.")
    );
  }
};

export const abastecimientoService = {
  getAbastecimientos,
  createAbastecimiento,
  updateAbastecimiento,
  toggleEstadoAbastecimiento,
  deleteAbastecimiento,
  getProductosActivosUsoInterno,
  getEmpleadosActivos,
  agotarAbastecimiento,
};
