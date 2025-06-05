// src/features/categoriasServicioAdmin/pages/ListaCategoriasServicioPage.jsx

import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import CategoriasServicioTable from "../components/CategoriasServicioTable";
import CategoriaServicioCrearModal from "../components/CategoriaServicioCrearModal";
import CategoriaServicioEditarModal from "../components/CategoriaServicioEditarModal";
import CategoriaServicioDetalleModal from "../components/CategoriaServicioDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  fetchCategoriasServicio,
  saveCategoriaServicio,
  deleteCategoriaServicioById,
  toggleCategoriaServicioEstado,
} from "../services/categoriasServicioService";
import "../css/CategoriasServicio.css";

function ListaCategoriasServicioPage() {
  const [categorias, setCategorias] = useState([]);
  const [search, setSearch] = useState("");

  // Estados para los modales
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentCategoria, setCurrentCategoria] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  // Cargar categorías desde la API
  const cargarCategorias = async () => {
    try {
      const data = await fetchCategoriasServicio();
      setCategorias(data);
    } catch (error) {
      setValidationMessage("Error al cargar las categorías.");
      setIsValidationModalOpen(true);
    }
  };

  useEffect(() => {
    cargarCategorias();
  }, []);

  // Abrir modales
  const handleOpenModal = (type, categoria = null) => {
    setCurrentCategoria(categoria);
    if (type === "ver") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsConfirmDeleteOpen(true);
    } else if (type === "agregar") {
      setIsCrearModalOpen(true);
    } else if (type === "editar") {
      if (categoria) {
        setIsEditarModalOpen(true);
      } else {
        setValidationMessage("No hay datos de categoría para editar.");
        setIsValidationModalOpen(true);
      }
    }
  };

  // Cerrar modales
  const handleCrearModalClose = () => setIsCrearModalOpen(false);
  const handleEditarModalClose = () => setIsEditarModalOpen(false);
  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentCategoria(null);
    }
  };

  // Guardar (crear o editar)
  const handleSave = async (categoriaData) => {
    try {
      if (isEditarModalOpen && currentCategoria) {
        await saveCategoriaServicio(categoriaData, true, currentCategoria.id);
      } else {
        await saveCategoriaServicio(categoriaData, false);
      }
      await cargarCategorias();
      if (isCrearModalOpen) handleCrearModalClose();
      if (isEditarModalOpen) handleEditarModalClose();
    } catch (error) {
      setValidationMessage(error?.response?.data?.message || "Error al guardar la categoría.");
      setIsValidationModalOpen(true);
    }
  };

  // Eliminar
  const handleDelete = async () => {
    if (currentCategoria && currentCategoria.id) {
      try {
        await deleteCategoriaServicioById(currentCategoria.id);
        await cargarCategorias();
        closeOtherModals();
      } catch (error) {
        setValidationMessage(error?.response?.data?.message || "Error al eliminar la categoría.");
        setIsValidationModalOpen(true);
      }
    }
  };

  // Cambiar estado (activo/inactivo)
 // En ListaCategoriasServicioPage.jsx
  const handleToggleEstado = async (categoria) => {
    try {
      await toggleCategoriaServicioEstado(categoria.id, !categoria.activo);
      await cargarCategorias();
    } catch (error) {
      setValidationMessage(error?.response?.data?.message || "Error al cambiar el estado.");
      setIsValidationModalOpen(true);
    }
  };
  // Filtrar categorías por búsqueda
  const filteredCategorias = categorias.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (c.descripcion && c.descripcion.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="Categoria-container">
      <NavbarAdmin />
      <div className="Categoria-content">
        <div className="categorias-servicio-content-wrapper">
          <h1>Categorías de Servicios</h1>
          <div className="ContainerBotonAgregarCategoria">
            <div className="BusquedaBotonCategoria">
              <input
                type="text"
                placeholder="Buscar categoría..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              className="botonAgregarCategoria"
              onClick={() => handleOpenModal("agregar")}
            >
              Agregar Categoría
            </button>
          </div>
          <CategoriasServicioTable
            categorias={filteredCategorias}
            onView={(cat) => handleOpenModal("ver", cat)}
            onEdit={(cat) => handleOpenModal("editar", cat)}
            onDeleteConfirm={(cat) => handleOpenModal("delete", cat)}
            onToggleEstado={(cat) => handleToggleEstado(cat.id, cat.activo)}
          />
        </div>
      </div>

      {/* Modales */}
      <CategoriaServicioCrearModal
        isOpen={isCrearModalOpen}
        onClose={handleCrearModalClose}
        onSubmit={handleSave}
      />
      <CategoriaServicioEditarModal
        isOpen={isEditarModalOpen}
        onClose={handleEditarModalClose}
        onSubmit={handleSave}
        initialData={currentCategoria}
      />
      <CategoriaServicioDetalleModal
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
        title="Aviso de Categorías de Servicio"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaCategoriasServicioPage;