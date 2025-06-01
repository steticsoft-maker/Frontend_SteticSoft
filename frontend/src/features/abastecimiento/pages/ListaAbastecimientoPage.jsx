// src/features/abastecimiento/pages/ListaAbastecimientoPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import AbastecimientoTable from "../components/AbastecimientoTable";
import AbastecimientoCrearModal from "../components/AbastecimientoCrearModal";
import AbastecimientoEditarModal from "../components/AbastecimientoEditarModal";
import AbastecimientoDetailsModal from "../components/AbastecimientoDetailsModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import DepleteProductModal from "../components/DepleteProductModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  fetchAbastecimientoEntries,
  addAbastecimientoEntry,
  updateAbastecimientoEntry,
  deleteAbastecimientoEntryById,
  depleteEntry,
} from "../services/abastecimientoService";
import "../css/Abastecimiento.css";

function ListaAbastecimientoPage() {
  const [entries, setEntries] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDepleteModalOpen, setIsDepleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentEntry, setCurrentEntry] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    setEntries(fetchAbastecimientoEntries());
  }, []);

  // Definición correcta de la función para abrir el modal de detalles
  const handleOpenDetails = (entry) => {
    setCurrentEntry(entry);
    setIsDetailsModalOpen(true);
  };

  const handleOpenModal = (type, entry = null) => {
    setCurrentEntry(entry);
    if (type === "details") {
      // Llamará a la función específica de detalles
      handleOpenDetails(entry);
    } else if (type === "delete") {
      setIsConfirmDeleteOpen(true);
    } else if (type === "deplete") {
      setIsDepleteModalOpen(true);
    } else if (type === "create") {
      setIsCrearModalOpen(true);
    } else if (type === "edit") {
      if (entry) {
        setIsEditarModalOpen(true);
      } else {
        console.error(
          "Intento de abrir modal de edición sin datos de entrada."
        );
      }
    }
  };

  const handleCrearModalClose = () => {
    setIsCrearModalOpen(false);
  };

  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentEntry(null);
  };

  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsDepleteModalOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentEntry(null);
    }
  };

  const handleSubmitForm = (formData, saveAndAddAnother = false) => {
    try {
      const isEditing = !!formData.id;
      let updatedEntries;
      if (isEditing) {
        updatedEntries = updateAbastecimientoEntry(formData, entries);
      } else {
        updatedEntries = addAbastecimientoEntry(formData, entries);
      }
      setEntries(updatedEntries);

      if (!saveAndAddAnother) {
        if (isEditing) handleEditarModalClose();
        else handleCrearModalClose();
      } else {
        // Si es "Guardar y Agregar Otro" (solo en creación), el modal de creación maneja el reseteo.
      }
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDeleteConfirmed = () => {
    if (currentEntry) {
      const updatedEntries = deleteAbastecimientoEntryById(
        currentEntry.id,
        entries
      );
      setEntries(updatedEntries);
      closeOtherModals();
    }
  };

  const handleDepleteConfirmed = (reason) => {
    if (currentEntry) {
      try {
        const updatedEntries = depleteEntry(currentEntry.id, reason, entries);
        setEntries(updatedEntries);
        closeOtherModals();
      } catch (error) {
        setValidationMessage(error.message);
        setIsValidationModalOpen(true);
      }
    }
  };

  const filteredEntries = entries.filter(
    (p) =>
      (p.nombre && p.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (p.empleado &&
        p.empleado.toLowerCase().includes(busqueda.toLowerCase())) ||
      (p.fechaIngreso && p.fechaIngreso.includes(busqueda)) ||
      (p.category && p.category.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="abastecimiento-page-container">
      <NavbarAdmin />
      <div className="abastecimiento-main-content">
        <div className="abastecimiento-content-wrapper">
          <h1>Gestión de Abastecimiento</h1>
          <div className="abastecimiento-actions-bar">
            <div className="abastecimiento-search-bar">
              <input
                type="text"
                placeholder="Buscar producto, empleado, fecha o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </div>
            <button
              className="abastecimiento-add-button"
              onClick={() => handleOpenModal("create")}
            >
              Agregar Producto
            </button>
          </div>
          <AbastecimientoTable
            entries={filteredEntries}
            onView={(entry) => handleOpenModal("details", entry)} // Correcto: llama a handleOpenModal
            onEdit={(entry) => handleOpenModal("edit", entry)} // Correcto: llama a handleOpenModal
            onDelete={(entry) => handleOpenModal("delete", entry)} // Correcto: llama a handleOpenModal
            onDeplete={(entry) => handleOpenModal("deplete", entry)} // Correcto: llama a handleOpenModal
          />
        </div>
      </div>

      <AbastecimientoCrearModal
        isOpen={isCrearModalOpen}
        onClose={handleCrearModalClose}
        onSubmit={handleSubmitForm}
      />
      <AbastecimientoEditarModal
        isOpen={isEditarModalOpen}
        onClose={handleEditarModalClose}
        onSubmit={handleSubmitForm}
        initialData={currentEntry}
      />
      <AbastecimientoDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeOtherModals} // Usa closeOtherModals para el modal de detalles
        item={currentEntry}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeOtherModals}
        onConfirm={handleDeleteConfirmed}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar la entrada de "${
          currentEntry?.nombre || ""
        }"?`}
      />
      <DepleteProductModal
        isOpen={isDepleteModalOpen}
        onClose={closeOtherModals}
        onConfirm={handleDepleteConfirmed}
        productName={currentEntry?.nombre}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeOtherModals}
        title="Aviso de Abastecimiento"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaAbastecimientoPage;
