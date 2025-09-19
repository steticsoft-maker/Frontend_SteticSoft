// src/features/roles/pages/ListaRolesPage.jsx
import React from "react";
import RolesTable from "../components/RolesTable";
import RolCrearModal from "../components/RolCrearModal";
import RolEditarModal from "../components/RolEditarModal";
import RolDetailsModal from "../components/RolDetailsModal";
import HistorialRolModal from "../components/HistorialRolModal";
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
    inputValue,
    setInputValue,
    filterEstado,
    setFilterEstado,
    isHistoryModalOpen,
    roleHistory,
    historyError,
    closeModal,
    handleOpenModal,
    handleSaveRol,
    handleToggleEstado,
    currentPage,
    itemsPerPage,
    paginate,
  } = useRoles();

  return (
    <div className="rol-container">
      <div className="rol-content">
        <h1>Gestión de Roles ({totalRolesFiltrados})</h1>
        <div className="rol-accionesTop">
          <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o permiso..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="rol-barraBusqueda"
              disabled={isLoading}
            />
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
          <div className="table-container">
            <RolesTable
              roles={roles}
              onView={(role) => handleOpenModal("details", role)}
              onEdit={(role) => handleOpenModal("edit", role)}
              onDeleteConfirm={(role) => handleOpenModal("delete", role)}
              onHistory={(role) => handleOpenModal("history", role)}
              onToggleAnular={handleToggleEstado}
              currentPage={currentPage}
              rowsPerPage={itemsPerPage}
            />
          </div>
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

      <HistorialRolModal
        isOpen={isHistoryModalOpen}
        onClose={closeModal}
        history={roleHistory}
        roleName={currentRole?.nombre}
        isLoading={isSubmitting}
        error={historyError}
      />
    </div>
  );
}

export default ListaRolesPage;