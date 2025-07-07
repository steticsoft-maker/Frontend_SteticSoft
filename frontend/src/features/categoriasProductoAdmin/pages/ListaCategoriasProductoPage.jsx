// RUTA: src/features/categoriasProductoAdmin/pages/ListaCategoriasProductoPage.jsx

import React, { useState, useEffect, useMemo } from "react"; // Quitamos useMemo que ya no se usa
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import CategoriasProductoTable from "../components/CategoriasProductoTable";
import CategoriaProductoCrearModal from "../components/CategoriaProductoCrearModal";
import CategoriaProductoEditarModal from "../components/CategoriaProductoEditarModal";
import CategoriaProductoDetalleModal from "../components/CategoriaProductoDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import Pagination from "../../../shared/components/common/Pagination";
import {
  fetchCategoriasProducto,
  saveCategoriaProducto,
  deleteCategoriaProductoById,
  toggleCategoriaProductoEstado,
} from "../services/categoriasProductoService";
import "../css/CategoriasProducto.css";

function ListaCategoriasProductoPage() {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // 'error' en lugar de '[, setError]' para poder usarlo

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Estados para modales (sin cambios)
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  const loadCategorias = async (searchTerm = "") => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCategoriasProducto({ search: searchTerm });
      setCategorias(Array.isArray(data) ? data : []); // Aseguramos que siempre sea un array
    } catch (err) {
      console.error("Error al cargar las categorías:", err);
      setError("No se pudieron cargar las categorías. Inténtalo de nuevo.");
      setCategorias([]); // Dejamos un array vacío en caso de error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadCategorias(busqueda);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]);

  // ✅ --- CAMBIO PRINCIPAL AQUÍ --- ✅
  // 1. Se elimina el bloque 'useMemo' que creaba 'categoriasFiltradas'.
  // 2. La paginación ahora se calcula directamente sobre 'categorias'.
  
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // Usamos 'categorias' directamente
  const categoriasPaginadas = categorias.slice(indexOfFirstItem, indexOfLastItem);
  // Usamos 'categorias.length' directamente
  const totalPages = Math.ceil(categorias.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // El resto de tus funciones handle (handleOpenModal, handleSave, etc.)
  // se mantienen EXACTAMENTE IGUALES. No las pego para no alargar,
  // pero NO necesitas cambiar absolutamente nada en ellas.

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
    loadCategorias(busqueda);
  };

  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentCategoria(null);
    loadCategorias(busqueda);
  };

  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentCategoria(null);
    }
    loadCategorias(busqueda);
  };


  const handleSave = async (categoriaData) => {
    try {
      const isEditing = !!categoriaData.idCategoriaProducto;
      await saveCategoriaProducto(categoriaData);
      
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
      loadCategorias(busqueda);

    } catch (error) {
      console.error("Error al cambiar estado de categoría:", error);
      const errorMessage = error.response?.data?.message || "Error al cambiar el estado de la categoría.";
      setValidationMessage(errorMessage);
      setIsValidationModalOpen(true);
    }
  };


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
          
          {/* El renderizado condicional se simplifica un poco */}
          {loading ? (
            <p>Cargando categorías...</p>
          ) : error ? (
             <p className="error-message">{error}</p>
          ) : (
            <>
              <CategoriasProductoTable
                categorias={categoriasPaginadas}
                startIndex={indexOfFirstItem} 
                onView={(cat) => handleOpenModal("details", cat)}
                onEdit={(cat) => handleOpenModal("edit", cat)}
                onDeleteConfirm={(cat) => handleOpenModal("delete", cat)}
                onToggleEstado={handleToggleEstado}
              />
              <Pagination
                itemsPerPage={itemsPerPage}
                // ✅ CAMBIO FINAL: Usamos 'categorias.length'
                totalItems={categorias.length}
                paginate={paginate}
                currentPage={currentPage}
              />
            </>
          )}
        </div>
      </div>

      {/* Todos tus modales se mantienen exactamente igual */}
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