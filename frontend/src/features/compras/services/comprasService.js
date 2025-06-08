import apiClient from '../../../shared/services/apiClient';

const getCompras = async () => {
  const response = await apiClient.get('/compras');
  return response.data;
};

const getCompraById = async (id) => {
  const response = await apiClient.get(`/compras/${id}`);
  return response.data;
};

const createCompra = async (compraData) => {
  const response = await apiClient.post('/compras', compraData);
  return response.data;
};

// NUEVO CÓDIGO EMPIEZA AQUÍ
const anularCompra = async (compraId) => {
  // Usamos .patch como definimos en la ruta del backend
  const response = await apiClient.patch(`/compras/${compraId}/anular`);
  return response.data;
};
// NUEVO CÓDIGO TERMINA AQUÍ

export const comprasService = {
  getCompras,
  getCompraById,
  createCompra,
  anularCompra // CAMBIO: Exportamos la nueva función
};