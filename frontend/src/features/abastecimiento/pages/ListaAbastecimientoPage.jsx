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

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [busquedaDebounced, setBusquedaDebounced] = useState("");
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDepleteModalOpen, setIsDepleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentEntry, setCurrentEntry] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  // Debounce para la búsqueda
  useEffect(() => {
    const timerId = setTimeout(() => {
      setBusquedaDebounced(terminoBusqueda);
    }, 300);
    return () => clearTimeout(timerId);
  }, [terminoBusqueda]);

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let params = { busqueda: busquedaDebounced };
      if (!mostrarInactivos) {
        params.estado = true; // Solo activos
      }
      // Si mostrarInactivos es true, la API devuelve todos (activos e inactivos)

      const data = await abastecimientoService.getAbastecimientos(params);
      setEntries(data);
    } catch (err) {
      setError(err.message || "No se pudieron cargar los datos de abastecimiento.");
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, [busquedaDebounced, mostrarInactivos]);

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

  // const filteredEntries = useMemo(...); // ELIMINADO - Filtrado ahora en backend

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
                placeholder="Buscar por producto, empleado, razón..."
                value={terminoBusqueda}
                onChange={(e) => setTerminoBusqueda(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="abastecimiento-filtros">
              <label htmlFor="mostrarInactivosAbastecimientoSwitch" className="abastecimiento-switch-label">Mostrar Inactivos:</label>
              <label className="switch abastecimiento-switch-control">
                <input
                  id="mostrarInactivosAbastecimientoSwitch"
                  type="checkbox"
                  checked={mostrarInactivos}
                  onChange={(e) => setMostrarInactivos(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="slider"></span>
              </label>
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
              entries={entries} // Usar 'entries' directamente del estado
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