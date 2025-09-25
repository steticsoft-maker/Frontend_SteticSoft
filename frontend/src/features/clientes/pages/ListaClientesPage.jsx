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
    filtroEstado,
    setFiltroEstado,
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
    <div className="lista-clientes-container">
      <div className="clientes-content-wrapper">
        <h1>Gestión de Clientes ({totalClientesFiltrados})</h1>
        <div className="clientes-actions-bar">
          <div className="clientes-filters">
            <div className="clientes-search-bar">
              <input
                type="text"
                placeholder="Busca por cualquier campo..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="clientes-filtro-estado-grupo">
              <select
                className="clientes-filtro-input"
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                disabled={isLoading}
              >
                <option value="todos">Todos los Estados</option>
                <option value="activos">Activos</option>
                <option value="inactivos">Inactivos</option>
              </select>
            </div>
          </div>
          <button
            className="clientes-add-button"
            onClick={() => handleOpenModal("create")}
            disabled={isLoading}
          >
            Agregar Cliente
          </button>
        </div>

        {isLoading && (
          <p style={{ textAlign: "center", margin: "20px 0" }}>
            Cargando clientes...
          </p>
        )}
        {error && (
          <p
            className="error-message"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <>
            <div className="table-container">
              <ClientesTable
                clientes={clientes} // Estos son los currentClientesForTable del hook
                onView={(cliente) => handleOpenModal("details", cliente)}
                onEdit={(cliente) => handleOpenModal("edit", cliente)}
                onDeleteConfirm={(cliente) => handleDelete(cliente)}
                onToggleEstado={handleToggleEstado}
                currentPage={currentPage}
                rowsPerPage={itemsPerPage}
              />
            </div>
            {totalClientesFiltrados > 0 &&
              itemsPerPage > 0 &&
              totalClientesFiltrados > itemsPerPage && (
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
    </div>
  );
}

export default ListaClientesPage;
