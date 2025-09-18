// src/features/usuarios/pages/ListaUsuariosPage.jsx
import React from "react";
import UsuariosTable from "../components/UsuariosTable";
import UsuarioCrearModal from "../components/UsuarioCrearModal";
import UsuarioEditarModal from "../components/UsuarioEditarModal";
import UsuarioDetalleModal from "../components/UsuarioDetalleModal";
import Pagination from "../../../shared/components/common/Pagination";
import useUsuarios from "../hooks/useUsuarios";
import "../css/Usuarios.css";

function ListaUsuariosPage() {
  const {
    usuarios,
    totalUsuariosFiltrados,
    availableRoles,
    isLoadingPage,
    isSubmitting,
    errorPage,
    currentUsuario,
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    inputValue,
    setInputValue,
    filterEstado,
    setFilterEstado,
    currentPage,
    usersPerPage,
    paginate,
    closeModal,
    handleOpenModal,
    handleSaveUsuario,
    handleToggleEstadoUsuario,
    formData,
    formErrors,
    isFormValid,
    isVerifyingEmail,
    handleInputChange,
    handleInputBlur,
    requiresProfile,
    checkRequiresProfile,
  } = useUsuarios();

  return (
    <div className="usuarios-container">
      <div className="usuarios-content">
        <h1>Gestión de Usuarios ({totalUsuariosFiltrados})</h1>
        <div className="usuarios-accionesTop">
          <input
            type="text"
            placeholder="Buscar por nombre, apellido, estado, correo, rol..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="usuarios-barraBusqueda"
            disabled={isLoadingPage}
          />
          <div className="usuarios-filtro-estado">
            <span>Estado: </span>
            <select value={filterEstado} onChange={(e) => setFilterEstado(e.target.value)} disabled={isLoadingPage}>
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
          <button
            className="usuarios-botonAgregar"
            onClick={() => handleOpenModal("create")}
            disabled={isLoadingPage || isSubmitting}
          >
            Crear Usuario
          </button>
        </div>

        {isLoadingPage && <p style={{ textAlign: 'center', margin: '20px 0' }}>Cargando datos...</p>}
        {errorPage && <p className="auth-form-error" style={{ textAlign: 'center', marginTop: '20px' }}>Error: {errorPage}</p>}
        
        {!isLoadingPage && !errorPage && (
          <>
            <div className="crud-table-container">
              <UsuariosTable
                usuarios={usuarios}
                onView={(usuario) => handleOpenModal("details", usuario)}
                onEdit={(usuario) => handleOpenModal("edit", usuario)}
                onDeleteConfirm={(usuario) => handleOpenModal('delete', usuario)}
                onToggleAnular={handleToggleEstadoUsuario}
              />
            </div>
            {totalUsuariosFiltrados > usersPerPage && (
              <Pagination
                itemsPerPage={usersPerPage}
                totalItems={totalUsuariosFiltrados}
                paginate={paginate}
                currentPage={currentPage}
              />
            )}
          </>
        )}
      </div>

      <UsuarioCrearModal
        isOpen={isCrearModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveUsuario}
        availableRoles={availableRoles}
        isLoading={isSubmitting}
        formData={formData}
        formErrors={formErrors}
        isFormValid={isFormValid}
        isVerifyingEmail={isVerifyingEmail}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        requiresProfile={requiresProfile}
        checkRequiresProfile={checkRequiresProfile}
      />
      <UsuarioEditarModal
        isOpen={isEditarModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveUsuario}
        availableRoles={availableRoles}
        isLoading={isSubmitting || isLoadingPage}
        formData={formData}
        formErrors={formErrors}
        isFormValid={isFormValid}
        isVerifyingEmail={isVerifyingEmail}
        handleInputChange={handleInputChange}
        handleInputBlur={handleInputBlur}
        requiresProfile={requiresProfile}
        checkRequiresProfile={checkRequiresProfile}
      />

      <UsuarioDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        usuario={currentUsuario}
      />
    </div>
  );
}

export default ListaUsuariosPage;