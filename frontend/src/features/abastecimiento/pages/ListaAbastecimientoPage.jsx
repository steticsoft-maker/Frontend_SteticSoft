// src/features/abastecimiento/pages/ListaAbastecimientoPage.jsx
import React from "react"; // Removidos useState, useEffect, useCallback, useMemo
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import AbastecimientoTable from "../components/AbastecimientoTable";
import AbastecimientoCrearModal from "../components/AbastecimientoCrearModal";
import AbastecimientoEditarModal from "../components/AbastecimientoEditarModal";
import AbastecimientoDetailsModal from "../components/AbastecimientoDetailsModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import DepleteProductModal from "../components/DepleteProductModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import useAbastecimiento from "../hooks/useAbastecimiento"; // Importar el custom hook
import "../css/Abastecimiento.css";
// El import de abastecimientoService ya no es necesario aquí

function ListaAbastecimientoPage() {
  const {
    entries, // Ya filtradas si la lógica está en el hook
    isLoading,
    isSubmitting,
    error,
    currentEntry,
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    isConfirmDeleteOpen,
    isDepleteModalOpen,
    isValidationModalOpen,
    validationMessage,
    inputValue, // Cambiado de searchTerm
    setInputValue, // Cambiado de setSearchTerm
    filterEstado,
    setFilterEstado,
    // Paginación si se añade:
    // currentPage,
    // itemsPerPage,
    // totalFilteredEntries,
    // paginate,
    closeModal,
    handleOpenModal,
    handleSubmitForm,
    handleDeleteConfirmed,
    handleDepleteConfirmed,
  } = useAbastecimiento();

  return (
    <div className="abastecimiento-page-container">
      <NavbarAdmin />
      <div className="abastecimiento-main-content">
        <div className="abastecimiento-content-wrapper">
          <h1>Gestión de Abastecimiento ({entries.length})</h1>
          <div className="abastecimiento-actions-bar">
            <div className="abastecimiento-search-bar">
              <input
                type="text"
                placeholder="Buscar por producto, categoría, empleado, fecha o cantidad..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="abastecimiento-filtro-estado">
              <span>Estado: </span>
              <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} disabled={isLoading}>
                <option value="todos">Todos</option>
                <option value="disponibles">Disponibles</option>
                <option value="agotados">Agotados</option>
              </select>
            </div>
            <button
              className="abastecimiento-add-button"
              onClick={() => handleOpenModal("create")}
              disabled={isLoading || isSubmitting}
            >
              Agregar Registro
            </button>
          </div>

          {isLoading ? (
            <p style={{ textAlign: 'center', margin: '20px 0' }}>Cargando datos...</p>
          ) : error ? (
            <p className="error-message" style={{ textAlign: 'center', marginTop: '20px' }}>{error}</p>
          ) : (
            <AbastecimientoTable
              entries={entries} // entries ya está procesado (filtrado) por el hook
              onView={(entry) => handleOpenModal("details", entry)}
              onEdit={(entry) => handleOpenModal("edit", entry)}
              onDelete={(entry) => handleOpenModal("delete", entry)}
              onDeplete={(entry) => handleOpenModal("deplete", entry)}
            />
          )}
          {/* Paginación si se implementa */}
        </div>
      </div>

      <AbastecimientoCrearModal
        isOpen={isCrearModalOpen}
        onClose={closeModal}
        onSubmit={(data) => handleSubmitForm(data, true)}
        isLoading={isSubmitting}
      />
      <AbastecimientoEditarModal
        isOpen={isEditarModalOpen}
        onClose={closeModal}
        onSubmit={(data) => handleSubmitForm(data, false)}
        initialData={currentEntry}
        isLoading={isSubmitting}
      />
      <AbastecimientoDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        item={currentEntry}
        // isLoading={isSubmitting} // Podría usarse si la carga de detalles es asíncrona en handleOpenModal
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeModal}
        onConfirm={handleDeleteConfirmed}
        title="Confirmar Eliminación"
        message={`¿Estás seguro de que deseas eliminar la entrada de "${
          currentEntry?.producto?.nombre || "este registro"
        }"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isSubmitting}
      />
      <DepleteProductModal
        isOpen={isDepleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDepleteConfirmed}
        productName={currentEntry?.producto?.nombre}
        isLoading={isSubmitting}
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