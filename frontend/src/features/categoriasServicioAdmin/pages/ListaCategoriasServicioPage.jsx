// src/features/categoriasServicioAdmin/pages/ListaCategoriasServicioPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import CategoriasServicioTable from "../components/CategoriasServicioTable";
import CategoriaServicioCrearModal from "../components/CategoriaServicioCrearModal"; // NUEVO
import CategoriaServicioEditarModal from "../components/CategoriaServicioEditarModal"; // NUEVO
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

  // Nuevos estados para los modales de crear y editar
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  // Los otros estados de modal se mantienen
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentCategoria, setCurrentCategoria] = useState(null);
  // formModalType ya no es necesario si separamos los modales
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    setCategorias(fetchCategoriasServicio());
  }, []);

  const handleOpenModal = (type, categoria = null) => {
    // console.log(`[LCSPage] handleOpenModal - Tipo: ${type}`, categoria);
    setCurrentCategoria(categoria);
    if (type === "ver") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsConfirmDeleteOpen(true);
    } else if (type === "agregar") {
      setIsCrearModalOpen(true); // Abre el modal de CREAR
    } else if (type === "editar") {
      if (categoria) {
        // Asegurarse de que hay datos para editar
        setIsEditarModalOpen(true); // Abre el modal de EDITAR
      } else {
        console.error(
          "Se intentó abrir el modal de edición sin datos de categoría."
        );
      }
    }
  };

  // Cierre específico para el modal de CREAR
  const handleCrearModalClose = () => {
    setIsCrearModalOpen(false);
    // No es necesario resetear currentCategoria aquí si solo se usa para editar/ver/eliminar
  };

  // Cierre específico para el modal de EDITAR
  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentCategoria(null); // Limpiar la categoría actual después de editar o cancelar
  };

  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    // Solo limpiar currentCategoria si ninguno de los modales de formulario está abierto
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentCategoria(null);
    }
  };

  const handleSave = (categoriaData) => {
    try {
      // currentCategoria se usa para determinar si es edición o para pasar el ID original
      const updatedCategorias = saveCategoriaServicio(
        categoriaData,
        categorias,
        currentCategoria
      );
      setCategorias(updatedCategorias);
      // Cerrar el modal correspondiente
      if (isCrearModalOpen) handleCrearModalClose();
      if (isEditarModalOpen) handleEditarModalClose();
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (currentCategoria && currentCategoria.id) {
      try {
        const updatedCategorias = deleteCategoriaServicioById(
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
      const updatedCategorias = toggleCategoriaServicioEstado(
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
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (c.descripcion &&
        c.descripcion.toLowerCase().includes(search.toLowerCase()))
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
            onToggleEstado={handleToggleEstado}
          />
        </div>
      </div>

      {/* Renderizar los modales separados */}
      <CategoriaServicioCrearModal
        isOpen={isCrearModalOpen}
        onClose={handleCrearModalClose}
        onSubmit={handleSave}
      />
      <CategoriaServicioEditarModal
        isOpen={isEditarModalOpen}
        onClose={handleEditarModalClose}
        onSubmit={handleSave}
        initialData={currentCategoria} // Solo el modal de editar necesita initialData
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
