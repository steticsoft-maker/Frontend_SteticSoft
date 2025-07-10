// src/features/abastecimiento/pages/ListaAbastecimientoPage.jsx
import React from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import AbastecimientoTable from "../components/AbastecimientoTable";
import AbastecimientoCrearModal from "../components/AbastecimientoCrearModal";
import AbastecimientoEditarModal from "../components/AbastecimientoEditarModal";
import AbastecimientoDetailsModal from "../components/AbastecimientoDetailsModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import DepleteProductModal from "../components/DepleteProductModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import Pagination from "../../../shared/components/common/Pagination"; // Importar Pagination
import useAbastecimiento from "../hooks/useAbastecimiento";
import "../css/Abastecimiento.css";

function ListaAbastecimientoPage() {
  const {
    entries, // Ya filtrados y paginados por el hook
    totalEntriesFiltrados, // Para el conteo en el título y el componente Pagination
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
    inputValue,
    setInputValue,
    filterEstado,
    setFilterEstado,
    closeModal,
    handleOpenModal,
    handleSubmitForm,
    handleDeleteConfirmed,
    handleDepleteConfirmed,
    // Paginación
    currentPage,
    itemsPerPage,
    paginate,
    // --- INICIO: Obtener productos y empleados del hook ---
    productosInternos,
    empleadosActivos,
    isLoadingModalDependencies,
    // --- FIN: Obtener productos y empleados del hook ---
  } = useAbastecimiento();

  return (
    <div className="abastecimiento-page-container">
      <NavbarAdmin />
      
      {/* Contenedor principal del contenido de la página */}
      <div className="abastecimiento-main-content">
        <div className="abastecimiento-content-wrapper">
          <h1>Gestión de Abastecimiento ({totalEntriesFiltrados})</h1>
          <div className="abastecimiento-actions-bar">
            <div className="abastecimiento-search-bar">
              <input
                type="text"
                placeholder="Buscar por producto, categoría, empleado..."
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
              onClick={() => handleOpenModal("create")} // handleOpenModal se encarga de setIsCrearModalOpen(true)
              disabled={isLoading || isSubmitting || isLoadingModalDependencies} // Deshabilitar si las dependencias del modal están cargando
            >
              Agregar Registro
            </button>
          </div>

          {isLoading ? (
            <p style={{ textAlign: 'center', margin: '20px 0' }}>Cargando datos de abastecimiento...</p>
          ) : error ? (
            <p className="error-message" style={{ textAlign: 'center', marginTop: '20px' }}>{error}</p>
          ) : (
            <AbastecimientoTable
              entries={entries} // Estos serán los entries de la página actual más adelante
              onView={(entry) => handleOpenModal("details", entry)}
              onEdit={(entry) => handleOpenModal("edit", entry)}
              onDelete={(entry) => handleOpenModal("delete", entry)}
              onDeplete={(entry) => handleOpenModal("deplete", entry)}
              currentPage={currentPage}
              rowsPerPage={itemsPerPage}
            />
          )}
          { !isLoading && !error && totalEntriesFiltrados > itemsPerPage && (
            <Pagination
              itemsPerPage={itemsPerPage}
              totalItems={totalEntriesFiltrados}
              paginate={paginate}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
      
      {/* Los modales ahora son hermanos de .abastecimiento-main-content */}
      {/* y ya no usan Portals, por lo que su posicionamiento será relativo 
          al viewport gracias a la clase .modal-abastecimiento-overlay */}
      
      <AbastecimientoCrearModal
        isOpen={isCrearModalOpen}
        onClose={closeModal}
        onSubmit={(data) => handleSubmitForm(data, true)}
        isSubmitting={isSubmitting} // Prop renombrada para claridad
        // --- INICIO: Pasar props al modal de creación ---
        productosInternos={productosInternos}
        empleadosActivos={empleadosActivos}
        isLoadingProductos={isLoadingModalDependencies} // Usar el estado de carga de dependencias del modal
        // --- FIN: Pasar props al modal de creación ---
      />
      <AbastecimientoEditarModal
        isOpen={isEditarModalOpen}
        onClose={closeModal}
        onSubmit={(data) => handleSubmitForm(data, false)}
        initialData={currentEntry}
        isSubmitting={isSubmitting}
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
          currentEntry?.producto?.nombre || "este registro"
        }"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isSubmitting={isSubmitting}
      />
      <DepleteProductModal
        isOpen={isDepleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDepleteConfirmed}
        productName={currentEntry?.producto?.nombre}
        isSubmitting={isSubmitting}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeModal}
        title="Aviso de Abastecimiento"
        message={validationMessage}
      />
    </div>
  );
  // FIN DE MODIFICACIÓN
}

export default ListaAbastecimientoPage;