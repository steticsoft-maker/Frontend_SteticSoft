// src/features/categoriasProductoAdmin/pages/ListaCategoriasProductoPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import CategoriasProductoTable from "../components/CategoriasProductoTable";
import CategoriaProductoCrearModal from "../components/CategoriaProductoCrearModal";
import CategoriaProductoEditarModal from "../components/CategoriaProductoEditarModal";
import CategoriaProductoDetalleModal from "../components/CategoriaProductoDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  fetchCategoriasProducto, // <--- Esta es la función que ahora aceptará un searchTerm
  saveCategoriaProducto,
  deleteCategoriaProductoById,
  toggleCategoriaProductoEstado,
} from "../services/categoriasProductoService";
import "../css/CategoriasProducto.css";

function ListaCategoriasProductoPage() {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState(""); // Término de búsqueda
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null); // Usado para errores internos o de carga inicial que no van al modal de validación

  // Estados para modales
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  /**
   * Carga las categorías de producto desde el backend, aplicando un término de búsqueda.
   * @param {string} [searchTerm=""] - El término de búsqueda a enviar al backend.
   */
  const loadCategorias = async (searchTerm = "") => { // Ahora acepta un searchTerm
    try {
      setLoading(true);
      setError(null); // Limpiar errores antes de una nueva carga
      const data = await fetchCategoriasProducto(searchTerm); // Pasa el searchTerm al servicio
      setCategorias(data);
    } catch (err) {
      console.error("Error al cargar las categorías:", err);
      setError("No se pudieron cargar las categorías. Inténtalo de nuevo.");
      setValidationMessage("No se pudieron cargar las categorías. Por favor, intente recargar la página o contacte soporte.");
      setIsValidationModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar categorías inicialmente y cada vez que el término de búsqueda cambie
  useEffect(() => {
    // Implementación de "debounce" para optimizar llamadas a la API mientras el usuario escribe
    const delayDebounceFn = setTimeout(() => {
      loadCategorias(busqueda); // Llama a `loadCategorias` con el término de búsqueda actual
    }, 300); // Espera 300ms después de que el usuario deja de escribir

    // Función de limpieza que se ejecuta si el componente se desmonta o si `busqueda` cambia de nuevo antes del timeout
    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]); // Este efecto se re-ejecuta cada vez que `busqueda` cambia


  const handleOpenModal = (type, categoria = null) => {
    setCurrentCategoria(categoria);
    if (type === "details") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsConfirmDeleteOpen(true);
    } else if (type === "create") {
      setIsCrearModalOpen(true);
    } else if (type === "edit") {
      if (categoria) {
        setIsEditarModalOpen(true);
      } else {
        console.error(
          "Intento de abrir modal de edición sin datos de categoría de producto."
        );
      }
    }
  };

  const handleCrearModalClose = () => {
    setIsCrearModalOpen(false);
    loadCategorias(busqueda); // Recargar categorías manteniendo el filtro de búsqueda
  };

  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentCategoria(null);
    loadCategorias(busqueda); // Recargar categorías manteniendo el filtro de búsqueda
  };

  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentCategoria(null);
    }
    loadCategorias(busqueda); // Recargar categorías manteniendo el filtro de búsqueda
  };


  const handleSave = async (categoriaData) => {
    try {
      const isEditing = !!categoriaData.idCategoriaProducto;
      await saveCategoriaProducto(categoriaData); // Llama al servicio API
      
      if (isEditing) {
        handleEditarModalClose();
      } else {
        handleCrearModalClose();
      }
      setValidationMessage(`Categoría ${isEditing ? "actualizada" : "creada"} exitosamente.`);
      setIsValidationModalOpen(true);

    } catch (error) {
      console.error("Error al guardar categoría:", error);
      const errorMessage = error.response?.data?.message || "Error al guardar la categoría. Por favor, revise los datos.";
      setValidationMessage(errorMessage);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (currentCategoria && currentCategoria.idCategoriaProducto) {
      try {
        await deleteCategoriaProductoById(currentCategoria.idCategoriaProducto);
        closeOtherModals();
        setValidationMessage("Categoría eliminada exitosamente.");
        setIsValidationModalOpen(true);
      } catch (error) {
        console.error("Error al eliminar categoría:", error);
        const errorMessage = error.response?.data?.message || "Error al eliminar la categoría.";
        setValidationMessage(errorMessage);
        setIsValidationModalOpen(true);
      }
    }
  };

  const handleToggleEstado = async (idCategoriaProducto) => {
    try {
      const categoriaToToggle = categorias.find(cat => cat.idCategoriaProducto === idCategoriaProducto);
      if (!categoriaToToggle) {
        throw new Error("Categoría no encontrada para cambiar estado.");
      }
      await toggleCategoriaProductoEstado(idCategoriaProducto, !categoriaToToggle.estado);
      
      setValidationMessage("Estado de la categoría actualizado exitosamente.");
      setIsValidationModalOpen(true);
      loadCategorias(busqueda); // Recargar categorías manteniendo el filtro de búsqueda

    } catch (error) {
      console.error("Error al cambiar estado de categoría:", error);
      const errorMessage = error.response?.data?.message || "Error al cambiar el estado de la categoría.";
      setValidationMessage(errorMessage);
      setIsValidationModalOpen(true);
    }
  };

  // La lógica de filtrado local (filteredCategorias) se ELIMINA porque el filtrado se hace en el backend.
  // La variable 'categorias' contendrá directamente los datos filtrados del backend.

  // Renderizado condicional para carga y errores
  if (loading) {
    return (
      <div className="categorias-producto-admin-page-container">
        <NavbarAdmin />
        <div className="categorias-producto-admin-main-content">
          <div className="categorias-producto-admin-content-wrapper">
            <h1>Gestión Categorías de Productos</h1>
            <p>Cargando categorías...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="categorias-producto-admin-page-container">
      <NavbarAdmin />
      <div className="categorias-producto-admin-main-content">
        <div className="categorias-producto-admin-content-wrapper">
          <h1>Gestión Categorías de Productos</h1>
          <div className="categorias-producto-admin-actions-bar">
            <div className="categorias-producto-admin-search-bar">
              <input
                type="text"
                // CAMBIO AQUÍ: Nuevo placeholder para la barra de búsqueda
                placeholder="Buscar por los campos de la tabla" 
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <button
              className="categorias-producto-admin-add-button"
              onClick={() => handleOpenModal("create")}
            >
              Agregar Categoría
            </button>
          </div>
          <CategoriasProductoTable
            categorias={categorias} // Pasa directamente el estado 'categorias' (que ya viene filtrado del backend)
            onView={(cat) => handleOpenModal("details", cat)}
            onEdit={(cat) => handleOpenModal("edit", cat)}
            onDeleteConfirm={(cat) => handleOpenModal("delete", cat)}
            onToggleEstado={handleToggleEstado}
          />
        </div>
      </div>

      <CategoriaProductoCrearModal
        isOpen={isCrearModalOpen}
        onClose={handleCrearModalClose}
        onSubmit={handleSave}
      />
      <CategoriaProductoEditarModal
        isOpen={isEditarModalOpen}
        onClose={handleEditarModalClose}
        onSubmit={handleSave}
        initialData={currentCategoria}
      />
      <CategoriaProductoDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeOtherModals}
        categoria={currentCategoria}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeOtherModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar la categoría "${
          currentCategoria?.nombre || ""
        }"?`}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeOtherModals}
        title="Aviso de Categorías de Producto"
        message={validationMessage}
      />
    </div>
  );
}
export default ListaCategoriasProductoPage;