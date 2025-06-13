// src/features/abastecimiento/pages/ListaAbastecimientoPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import AbastecimientoTable from "../components/AbastecimientoTable";
import AbastecimientoCrearModal from "../components/AbastecimientoCrearModal";
import AbastecimientoEditarModal from "../components/AbastecimientoEditarModal";
import AbastecimientoDetailsModal from "../components/AbastecimientoDetailsModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import DepleteProductModal from "../components/DepleteProductModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import { abastecimientoService } from "../services/abastecimientoService";
import "../css/Abastecimiento.css";

function ListaAbastecimientoPage() {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDepleteModalOpen, setIsDepleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentEntry, setCurrentEntry] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await abastecimientoService.getAbastecimientos();
      setEntries(data);
    } catch (err) {
      setError(
        err.message || "No se pudieron cargar los datos de abastecimiento."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const closeModal = () => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsDepleteModalOpen(false);
    setIsValidationModalOpen(false);
    setCurrentEntry(null);
    setValidationMessage("");
  };

  const handleOpenModal = (type, entry = null) => {
    setCurrentEntry(entry);
    if (type === "details") setIsDetailsModalOpen(true);
    else if (type === "delete") setIsConfirmDeleteOpen(true);
    else if (type === "deplete") setIsDepleteModalOpen(true);
    else if (type === "create") setIsCrearModalOpen(true);
    else if (type === "edit") setIsEditarModalOpen(true);
  };

  const handleSubmitForm = async (formData, isCreating = false) => {
    try {
      if (isCreating) {
        await abastecimientoService.createAbastecimiento(formData);
        setValidationMessage("Registro de abastecimiento creado exitosamente.");
      } else {
        const { idAbastecimiento, ...dataToUpdate } = formData;
        await abastecimientoService.updateAbastecimiento(
          idAbastecimiento,
          dataToUpdate
        );
        setValidationMessage(
          "Registro de abastecimiento actualizado exitosamente."
        );
      }
      await cargarDatos();
      closeModal();
      setIsValidationModalOpen(true);
    } catch (err) {
      setValidationMessage(err.message || "Error al guardar el registro.");
      setIsValidationModalOpen(true);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (currentEntry?.idAbastecimiento) {
      try {
        await abastecimientoService.deleteAbastecimiento(
          currentEntry.idAbastecimiento
        );
        setValidationMessage("Registro eliminado exitosamente.");
        await cargarDatos();
      } catch (err) {
        setValidationMessage(err.message || "Error al eliminar el registro.");
      } finally {
        closeModal();
        setIsValidationModalOpen(true);
      }
    }
  };

  const handleDepleteConfirmed = async (reason) => {
    if (currentEntry?.idAbastecimiento) {
      try {
        const dataToUpdate = {
          estaAgotado: true,
          razonAgotamiento: reason,
          fechaAgotamiento: new Date().toISOString().split("T")[0],
        };
        await abastecimientoService.updateAbastecimiento(
          currentEntry.idAbastecimiento,
          dataToUpdate
        );
        setValidationMessage("Producto marcado como agotado.");
        await cargarDatos();
      } catch (err) {
        setValidationMessage(err.message || "Error al marcar como agotado.");
      } finally {
        closeModal();
        setIsValidationModalOpen(true);
      }
    }
  };

  const filteredEntries = useMemo(
    () =>
      entries.filter((entry) => {
        const busquedaLower = busqueda.toLowerCase();
        const nombreProducto = entry.producto?.nombre?.toLowerCase() || "";
        const nombreEmpleado = entry.empleado?.nombre?.toLowerCase() || "";
        const fecha = entry.fechaIngreso || "";
        return (
          nombreProducto.includes(busquedaLower) ||
          nombreEmpleado.includes(busquedaLower) ||
          fecha.includes(busquedaLower)
        );
      }),
    [entries, busqueda]
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
                placeholder="Buscar por producto, empleado o fecha..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button
              className="abastecimiento-add-button"
              onClick={() => handleOpenModal("create")}
              disabled={isLoading}
            >
              Agregar Registro
            </button>
          </div>

          {isLoading ? (
            <p>Cargando datos...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <AbastecimientoTable
              entries={filteredEntries}
              onView={(entry) => handleOpenModal("details", entry)}
              onEdit={(entry) => handleOpenModal("edit", entry)}
              onDelete={(entry) => handleOpenModal("delete", entry)}
              onDeplete={(entry) => handleOpenModal("deplete", entry)}
            />
          )}
        </div>
      </div>

      <AbastecimientoCrearModal
        isOpen={isCrearModalOpen}
        onClose={closeModal}
        onSubmit={(data) => handleSubmitForm(data, true)}
      />
      <AbastecimientoEditarModal
        isOpen={isEditarModalOpen}
        onClose={closeModal}
        onSubmit={(data) => handleSubmitForm(data, false)}
        initialData={currentEntry}
      />
      <AbastecimientoDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        item={currentEntry}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirmed}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar la entrada de "${
          currentEntry?.producto?.nombre || ""
        }"?`}
      />
      <DepleteProductModal
        isOpen={isDepleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDepleteConfirmed}
        productName={currentEntry?.producto?.nombre}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeModal}
        title="Aviso de Abastecimiento"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaAbastecimientoPage;