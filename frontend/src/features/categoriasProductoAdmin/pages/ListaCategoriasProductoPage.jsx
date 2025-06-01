// src/features/categoriasProductoAdmin/pages/ListaCategoriasProductoPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import CategoriasProductoTable from "../components/CategoriasProductoTable";
// Importar nuevos modales separados
import CategoriaProductoCrearModal from "../components/CategoriaProductoCrearModal"; // NUEVO
import CategoriaProductoEditarModal from "../components/CategoriaProductoEditarModal"; // NUEVO
import CategoriaProductoDetalleModal from "../components/CategoriaProductoDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  fetchCategoriasProducto,
  saveCategoriaProducto,
  deleteCategoriaProductoById,
  toggleCategoriaProductoEstado,
} from "../services/categoriasProductoService";
import "../css/CategoriasProducto.css"; // Este CSS se actualizará significativamente

function ListaCategoriasProductoPage() {
  const [categorias, setCategorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // Estados para modales
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");
  // formModalType y modalType ya no se necesitan aquí con modales separados

  useEffect(() => {
    setCategorias(fetchCategoriasProducto());
  }, []);

  const handleOpenModal = (type, categoria = null) => {
    // console.log(`[LCProdPage] handleOpenModal - Tipo: ${type}`, categoria);
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
  };

  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentCategoria(null);
  };

  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentCategoria(null);
    }
  };

  const handleSave = (categoriaData) => {
    try {
      const isEditing = !!categoriaData.id;
      // El servicio saveCategoriaProducto ya maneja la lógica de ID
      const updatedCategorias = saveCategoriaProducto(
        categoriaData,
        categorias
      );
      setCategorias(updatedCategorias);
      if (isEditing) {
        handleEditarModalClose();
      } else {
        handleCrearModalClose();
      }
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (currentCategoria && currentCategoria.id) {
      try {
        const updatedCategorias = deleteCategoriaProductoById(
          currentCategoria.id,
          categorias
        );
        setCategorias(updatedCategorias);
        closeOtherModals();
      } catch (error) {
        setValidationMessage(error.message);
        setIsValidationModalOpen(true);
      }
    }
  };

  const handleToggleEstado = (categoriaId) => {
    try {
      const updatedCategorias = toggleCategoriaProductoEstado(
        categoriaId,
        categorias
      );
      setCategorias(updatedCategorias);
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const filteredCategorias = categorias.filter(
    (cat) =>
      cat.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (cat.descripcion &&
        cat.descripcion.toLowerCase().includes(busqueda.toLowerCase())) ||
      (cat.tipoUso &&
        cat.tipoUso.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    // Clase principal para la página, para aplicar estilos de layout
    <div className="categorias-producto-admin-page-container">
      <NavbarAdmin />
      {/* Contenedor del contenido principal */}
      <div className="categorias-producto-admin-main-content">
        {/* Wrapper interno para centrar el título, barra de acciones y tabla */}
        <div className="categorias-producto-admin-content-wrapper">
          <h1>Gestión Categorías de Productos</h1>
          {/* Barra de acciones superior con búsqueda y botón agregar */}
          <div className="categorias-producto-admin-actions-bar">
            <div className="categorias-producto-admin-search-bar">
              <input
                type="text"
                placeholder="Buscar categoría..."
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
            categorias={filteredCategorias}
            onView={(cat) => handleOpenModal("details", cat)}
            onEdit={(cat) => handleOpenModal("edit", cat)}
            onDeleteConfirm={(cat) => handleOpenModal("delete", cat)}
            onToggleEstado={handleToggleEstado}
          />
        </div>
      </div>

      {/* Modales separados */}
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
      <CategoriaProductoDetalleModal // Este modal ya existe
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
        title="Aviso de Categorías de Producto" // Título específico
        message={validationMessage}
      />
    </div>
  );
}
export default ListaCategoriasProductoPage;
