// src/features/clientes/pages/ListaClientesPage.jsx
import React from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import ClientesTable from "../components/ClientesTable";
import ClienteCrearModal from "../components/ClienteCrearModal";
import ClienteEditarModal from "../components/ClienteEditarModal";
import ClienteDetalleModal from "../components/ClienteDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import Pagination from "../../../shared/components/common/Pagination"; // Importar Pagination
import useClientes from "../hooks/useClientes"; // Importar el custom hook
import "../css/Clientes.css";

function ListaClientesPage() {
  const {
    clientes, // Ya paginados y listos para la tabla
    totalClientesFiltrados, // Para el título y el componente Pagination
    isLoading,
    error,
    currentCliente,
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    isConfirmDeleteOpen,
    isValidationModalOpen,
    validationMessage,
    inputValue,
    setInputValue,
    currentPage,
    itemsPerPage,
    paginate,
    closeModal,
    handleOpenModal,
    handleSave,
    handleDelete,
    handleToggleEstado,
    formData,
    formErrors,
    isSubmitting,
    handleInputChange,
    handleInputBlur,
  } = useClientes();

  return (
    <div className="clientes-page-container">
      <NavbarAdmin />
      <div className="main-content-clientes">
        <h1>Gestión de Clientes ({totalClientesFiltrados})</h1>
        <div className="containerAgregarbuscarClientes">
          <input
            type="text"
            placeholder="Buscar por cualquier campo..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="barraBusquedaClientesInput"
            disabled={isLoading}
          />
          <button
            className="buttonAgregarcliente"
            onClick={() => handleOpenModal("create")}
            disabled={isLoading}
          >
            Agregar Cliente
          </button>
        </div>

        {isLoading && <p style={{ textAlign: 'center', margin: '20px 0' }}>Cargando clientes...</p>}
        {error && <p className="error-message" style={{ textAlign: 'center', marginTop: '20px' }}>{error}</p>}

        {!isLoading && !error && (
          <>
            <ClientesTable
              clientes={clientes} // Estos son los currentClientesForTable del hook
              onView={(cliente) => handleOpenModal("details", cliente)}
              onEdit={(cliente) => handleOpenModal("edit", cliente)}
              onDeleteConfirm={(cliente) => handleOpenModal("delete", cliente)}
              onToggleEstado={handleToggleEstado}
              currentPage={currentPage}
              rowsPerPage={itemsPerPage}
            />
            {totalClientesFiltrados > 0 && itemsPerPage > 0 && totalClientesFiltrados > itemsPerPage && (
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={totalClientesFiltrados}
                paginate={paginate}
                currentPage={currentPage}
              />
            )}
          </>
        )}
      </div>

      <ClienteCrearModal
        isOpen={isCrearModalOpen}
        onClose={closeModal}
        formData={formData}
        formErrors={formErrors}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        handleSave={handleSave}
        isSubmitting={isSubmitting}
      />
      <ClienteEditarModal
        isOpen={isEditarModalOpen}
        onClose={closeModal}
        formData={formData}
        formErrors={formErrors}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        handleSave={handleSave}
        isSubmitting={isSubmitting}
      />
      <ClienteDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal} // Usar closeModal del hook
        cliente={currentCliente}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeModal} // Usar closeModal del hook
        onConfirm={handleDelete}
        title="Confirmar Eliminación de Cliente"
        message={`¿Estás seguro de que deseas eliminar al cliente "${
          currentCliente
            ? `${currentCliente.nombre} ${currentCliente.apellido}`
            : ""
        }"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        // Podrías añadir un isLoading al ConfirmModal si handleDelete es largo,
        // pero por ahora el hook useClientes no expone un isSubmitting específico para delete.
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeModal} // Usar closeModal del hook
        title="Aviso de Clientes"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaClientesPage;