// src/features/clientes/pages/ListaClientesPage.jsx
import React from "react";
import ClientesTable from "../components/ClientesTable";
import ClienteCrearModal from "../components/ClienteCrearModal";
import ClienteEditarModal from "../components/ClienteEditarModal";
import ClienteDetalleModal from "../components/ClienteDetalleModal";
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
    <div className="admin-page-container">
      <div className="admin-main-content">
        <div className="admin-content-wrapper">
          <h1>Gestión de Clientes ({totalClientesFiltrados})</h1>
        <div className="admin-actions-bar">
          <input
            type="text"
            placeholder="Buscar por cualquier campo..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="admin-search-input"
            disabled={isLoading}
          />
          <button
            className="admin-add-button"
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
            <div className="table-container">
              <ClientesTable
                clientes={clientes} // Estos son los currentClientesForTable del hook
                onView={(cliente) => handleOpenModal("details", cliente)}
                onEdit={(cliente) => handleOpenModal("edit", cliente)}
                onDeleteConfirm={(cliente) => handleOpenModal("delete", cliente)}
                onToggleEstado={handleToggleEstado}
                currentPage={currentPage}
                rowsPerPage={itemsPerPage}
              />
            </div>
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
    </div>
  );
}

export default ListaClientesPage;