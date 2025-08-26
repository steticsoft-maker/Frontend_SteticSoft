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
    clientes,
    totalClientesFiltrados,
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
    isFormValid,
    touchedFields,
    handleInputChange,
    handleInputBlur,
    isVerifying,
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
              clientes={clientes}
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
        onSubmit={handleSave}
        formData={formData}
        formErrors={formErrors}
        isFormValid={isFormValid}
        touchedFields={touchedFields}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        isVerifying={isVerifying}
      />
      <ClienteEditarModal
        isOpen={isEditarModalOpen}
        onClose={closeModal}
        onSubmit={handleSave}
        initialData={currentCliente}
        formData={formData}
        formErrors={formErrors}
        isFormValid={isFormValid}
        touchedFields={touchedFields}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        isVerifying={isVerifying}
      />
      <ClienteDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        cliente={currentCliente}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeModal}
        onConfirm={handleDelete}
        title="Confirmar Eliminación de Cliente"
        message={`¿Estás seguro de que deseas eliminar al cliente "${
          currentCliente
            ? `${currentCliente.nombre} ${currentCliente.apellido}`
            : ""
        }"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeModal}
        title="Aviso de Clientes"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaClientesPage;