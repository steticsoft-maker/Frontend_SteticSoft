// RUTA: src/features/compras/services/comprasService.js
// DESCRIPCIÓN: Archivo completo con la función 'anularCompra' para llamar a la API.

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

// --- INICIO CÓDIGO NUEVO ---
const anularCompra = async (compraId) => {
  // Usamos .patch como se define en la ruta del backend: /compras/:id/anular
  const response = await apiClient.patch(`/compras/${compraId}/anular`);
  return response.data;
  // Useless try/catch removed. Errors will propagate naturally.
};
// --- FIN CÓDIGO NUEVO ---

export const comprasService = {
  getCompras,
  getCompraById,
  createCompra,
  anularCompra // --- AÑADIDO: Exportamos la nueva función
};