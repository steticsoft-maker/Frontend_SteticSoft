// src/features/productosAdmin/services/categoriasProductoService.js
const CATEGORIAS_STORAGE_KEY = 'categorias_productos_steticsoft'; // Clave específica

// No hay initialCategorias en CategoriaProducto.jsx, se cargan de localStorage.
// Si localStorage está vacío, se empieza con un array vacío.
// Para el ejemplo, podemos definir unos iniciales si no hay nada guardado.
const INITIAL_CATEGORIAS = [
    { id: 1, nombre: "Shampoos", descripcion: "Para el cabello", estado: true, productos: [], tipoUso: "Externo", vidaUtil: 365 },
    { id: 2, nombre: "Acondicionadores", descripcion: "Suavizantes", estado: true, productos: [], tipoUso: "Externo", vidaUtil: 365 },
];

export const fetchCategoriasProducto = () => {
  const stored = localStorage.getItem(CATEGORIAS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing categorias from localStorage", e);
      localStorage.removeItem(CATEGORIAS_STORAGE_KEY); // Limpiar si está corrupto
      persistCategoriasProducto(INITIAL_CATEGORIAS);
      return INITIAL_CATEGORIAS;
    }
  }
  persistCategoriasProducto(INITIAL_CATEGORIAS); // Guardar iniciales si no hay nada
  return INITIAL_CATEGORIAS;
};

const persistCategoriasProducto = (categorias) => {
  localStorage.setItem(CATEGORIAS_STORAGE_KEY, JSON.stringify(categorias));
};

export const getCategoriaProductoById = (id, existingCategorias) => {
    return existingCategorias.find(cat => cat.id === parseInt(id));
};

export const saveCategoriaProducto = (categoriaData, existingCategorias) => {
  const vidaUtil = parseInt(categoriaData.vidaUtil, 10);
  if (!categoriaData.nombre?.trim() || !categoriaData.descripcion?.trim() || !categoriaData.tipoUso || isNaN(vidaUtil) || vidaUtil <= 0) {
    throw new Error("Por favor, completa todos los campos obligatorios (Nombre, Descripción, Tipo de Uso, Vida Útil válida).");
  }

  const nombreExists = existingCategorias.some(
    cat => cat.nombre.toLowerCase() === categoriaData.nombre.toLowerCase() && cat.id !== categoriaData.id
  );
  if (nombreExists) {
    throw new Error("Ya existe una categoría con ese nombre.");
  }

  let updatedCategorias;
  if (categoriaData.id) { // Editando
    updatedCategorias = existingCategorias.map(cat =>
      cat.id === categoriaData.id ? { ...cat, ...categoriaData, vidaUtil } : cat
    );
  } else { // Creando
    const newId = existingCategorias.length > 0 ? Math.max(...existingCategorias.map(cat => cat.id)) + 1 : 1;
    const newCategoria = {
      ...categoriaData,
      id: newId,
      estado: categoriaData.estado !== undefined ? categoriaData.estado : true, // Default a true si no se especifica
      productos: categoriaData.productos || [],
      vidaUtil,
    };
    updatedCategorias = [...existingCategorias, newCategoria];
  }
  persistCategoriasProducto(updatedCategorias);
  return updatedCategorias;
};

export const deleteCategoriaProductoById = (categoriaId, existingCategorias) => {
  // Aquí podrías añadir lógica para verificar si la categoría está en uso por algún producto
  // antes de permitir la eliminación, o manejarlo en el backend.
  const updatedCategorias = existingCategorias.filter(cat => cat.id !== categoriaId);
  persistCategoriasProducto(updatedCategorias);
  return updatedCategorias;
};

export const toggleCategoriaProductoEstado = (categoriaId, existingCategorias) => {
  const updatedCategorias = existingCategorias.map(cat =>
    cat.id === categoriaId ? { ...cat, estado: !cat.estado } : cat
  );
  persistCategoriasProducto(updatedCategorias);
  return updatedCategorias;
};