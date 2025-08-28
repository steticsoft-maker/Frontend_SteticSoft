// src/features/roles/pages/ListaRolesPage.jsx
import React from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import RolesTable from "../components/RolesTable";
import RolCrearModal from "../components/RolCrearModal";
import RolEditarModal from "../components/RolEditarModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import RolDetailsModal from "../components/RolDetailsModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import Pagination from "../../../shared/components/common/Pagination";
import useRoles from "../hooks/useRoles";
import "../css/Rol.css";

function ListaRolesPage() {
  const {
    roles,
    totalRolesFiltrados,
    permisos,
    permisosAgrupados,
    isLoading,
    isSubmitting,
    error,
    currentRole,
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    isDeleteModalOpen,
    isValidationModalOpen,
    validationMessage,
    inputValue,
    setInputValue,
    filterEstado,
    setFilterEstado,
    closeModal,
    handleOpenModal,
    handleSaveRol,
    handleDeleteRol,
    handleToggleEstado,
    currentPage,
    itemsPerPage,
    paginate,
  } = useRoles();

  // INICIO DE MODIFICACIÓN: Lógica de validación de búsqueda
  const searchTerm = inputValue.trim();
  const isSearchInvalid = searchTerm.length > 0 && searchTerm.length < 3;
  // FIN DE MODIFICACIÓN

  return (
    <div className="rol-container">
      <NavbarAdmin />
      <div className="rol-content">
        <h1>Gestión de Roles ({totalRolesFiltrados})</h1>
        <div className="rol-accionesTop">
          {/* INICIO DE MODIFICACIÓN: Contenedor para búsqueda y error */}
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <input
              type="text"
              placeholder="Buscar por nombre, descripción, permiso o estado..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="rol-barraBusqueda"
              disabled={isLoading}
            />
            {isSearchInvalid && (
              <span className="error-message" style={{ marginTop: '5px' }}>
                La búsqueda debe tener al menos 3 caracteres.
              </span>
            )}
          </div>
          {/* FIN DE MODIFICACIÓN */}
          
          <div className="rol-filtro-estado">
            <span>Estado: </span>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              disabled={isLoading}
            >
              <option value="todos">Todos</option>
              <option value="activos">Activos</option>
              <option value="inactivos">Inactivos</option>
            </select>
          </div>
          <button
            className="rol-botonAgregar"
            onClick={() => handleOpenModal("create")}
            disabled={isLoading || isSubmitting}
          >
            Crear Rol
          </button>
        </div>
        {isLoading ? (
          <p style={{ textAlign: "center", margin: "20px 0" }}>
            Cargando roles...
          </p>
        ) : error ? (
          <p
            className="error-message"
            style={{ textAlign: "center", marginTop: "20px" }}
          >
            {error}
          </p>
        ) : (
          <RolesTable
            roles={roles}
            onView={(role) => handleOpenModal("details", role)}
            onEdit={(role) => handleOpenModal("edit", role)}
            onDeleteConfirm={(role) => handleOpenModal("delete", role)}
            onToggleAnular={handleToggleEstado}
            currentPage={currentPage}
            rowsPerPage={itemsPerPage}
          />
        )}
        {!isLoading && !error && totalRolesFiltrados > itemsPerPage && (
          <Pagination
            itemsPerPage={itemsPerPage}
            totalItems={totalRolesFiltrados}
            paginate={paginate}
            currentPage={currentPage}
          />
        )}
      </div>

      <RolCrearModal
        isOpen={isCrearModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveRol}
        permisosDisponibles={permisos}
        permisosAgrupados={permisosAgrupados}
        isLoading={isSubmitting}
      />
      <RolEditarModal
        isOpen={isEditarModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveRol}
        roleId={currentRole?.idRol}
        permisosDisponibles={permisos}
        permisosAgrupados={permisosAgrupados}
        isLoading={isSubmitting}
      />
      <RolDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        role={currentRole}
        isLoading={isSubmitting}
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteRol}
        title="Confirmar Eliminación de Rol"
        message={`¿Estás seguro de que deseas eliminar el rol "${
          currentRole?.nombre || ""
        }"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isSubmitting}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeModal}
        title="Aviso de Roles"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaRolesPage;