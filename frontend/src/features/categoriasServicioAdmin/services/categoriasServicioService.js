import apiClient from "../../../shared/services/api";

export const fetchCategoriasServicio = async () => {
  const res = await apiClient.get("/categorias");
  return res.data;
};

export const saveCategoriaServicio = async (categoriaData, isEdit, id) => {
  if (isEdit) {
    const res = await apiClient.put(`/categorias/${id}`, categoriaData);
    return res.data;
  } else {
    const res = await apiClient.post("/categorias", categoriaData);
    return res.data;
  }
};

export const deleteCategoriaServicioById = async (id) => {
  const res = await apiClient.delete(`/categorias/${id}`);
  return res.data;
};

export const toggleCategoriaServicioEstado = async (id, nuevoEstado) => {
  // Asumiendo que el backend acepta un PATCH para cambiar solo el estado
  const res = await apiClient.patch(`/categorias/${id}`, { activo: nuevoEstado });
  return res.data;
};