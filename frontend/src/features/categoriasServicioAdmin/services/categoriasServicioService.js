// src/features/categoriasServicioAdmin/services/categoriasServicioService.js
const CATEGORIAS_SERVICIOS_STORAGE_KEY = 'categoriasServicios_steticsoft'; // Clave específica

const INITIAL_CATEGORIAS_SERVICIOS = [
  // Puedes añadir algunas categorías iniciales si lo deseas, o empezar vacío
  { id: 1, nombre: "Faciales", descripcion: "Tratamientos para el rostro", estado: "Activo" },
  { id: 2, nombre: "Corporales", descripcion: "Tratamientos para el cuerpo", estado: "Activo" },
];

export const fetchCategoriasServicio = () => {
  const stored = localStorage.getItem(CATEGORIAS_SERVICIOS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing categoriasServicios from localStorage", e);
      localStorage.removeItem(CATEGORIAS_SERVICIOS_STORAGE_KEY);
      persistCategoriasServicio(INITIAL_CATEGORIAS_SERVICIOS);
      return INITIAL_CATEGORIAS_SERVICIOS;
    }
  }
  persistCategoriasServicio(INITIAL_CATEGORIAS_SERVICIOS);
  return INITIAL_CATEGORIAS_SERVICIOS;
};

const persistCategoriasServicio = (categorias) => {
  localStorage.setItem(CATEGORIAS_SERVICIOS_STORAGE_KEY, JSON.stringify(categorias));
};

export const saveCategoriaServicio = (categoriaData, existingCategorias) => {
  if (!categoriaData.nombre?.trim()) {
    throw new Error("El nombre de la categoría es obligatorio.");
  }

  const nombreExists = existingCategorias.some(
    cat => cat.nombre.toLowerCase() === categoriaData.nombre.toLowerCase() && cat.id !== categoriaData.id
  );
  if (nombreExists) {
    throw new Error("Ya existe una categoría de servicio con ese nombre.");
  }

  let updatedCategorias;
  if (categoriaData.id) { // Editando
    updatedCategorias = existingCategorias.map(cat =>
      cat.id === categoriaData.id ? { ...cat, ...categoriaData } : cat
    );
  } else { // Creando
    const newId = existingCategorias.length > 0 ? Math.max(...existingCategorias.map(cat => cat.id)) + 1 : 1;
    const newCategoria = {
      ...categoriaData,
      id: newId,
      estado: categoriaData.estado || "Activo", // Default a Activo
    };
    updatedCategorias = [...existingCategorias, newCategoria];
  }
  persistCategoriasServicio(updatedCategorias);
  return updatedCategorias;
};

export const deleteCategoriaServicioById = (categoriaId, existingCategorias) => {
  // Considerar validación si la categoría está en uso por algún servicio
  const updatedCategorias = existingCategorias.filter(cat => cat.id !== categoriaId);
  persistCategoriasServicio(updatedCategorias);
  return updatedCategorias;
};

export const toggleCategoriaServicioEstado = (categoriaId, existingCategorias) => {
  const updatedCategorias = existingCategorias.map(cat =>
    cat.id === categoriaId ? { ...cat, estado: cat.estado === "Activo" ? "Inactivo" : "Activo" } : cat
  );
  persistCategoriasServicio(updatedCategorias);
  return updatedCategorias;
};