// src/features/roles/pages/ListaRolesPage.jsx
import React from "react"; // Removidos useState, useEffect, useCallback, useMemo
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import RolesTable from "../components/RolesTable";
import RolCrearModal from "../components/RolCrearModal";
import RolEditarModal from "../components/RolEditarModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import RolDetailsModal from "../components/RolDetailsModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import Pagination from "../../../shared/components/common/Pagination"; // Importar Pagination
import useRoles from "../hooks/useRoles"; // Importar el custom hook
import "../css/Rol.css";
// Los imports de servicios API ya no son necesarios aquí
// La función groupPermissionsByModule se ha movido al hook

function ListaRolesPage() {
  const {
    roles, // Ya filtrados y paginados por el hook
    totalRolesFiltrados, // Para el conteo en el título y el componente Pagination
    permisos, // Para pasar a los modales
    permisosAgrupados, // Para pasar a los modales
    isLoading,
    isSubmitting, // Para deshabilitar botones mientras se carga detalle de rol o se guarda/elimina
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
    // Paginación
    currentPage,
    itemsPerPage,
    paginate,
  } = useRoles();

  return (
    <div className="rol-container">
      <NavbarAdmin />
      <div className="rol-content">
        <h1>Gestión de Roles ({totalRolesFiltrados})</h1>{" "}
        {/* Muestra el conteo de roles filtrados */}
        <div className="rol-accionesTop">
          <input
            type="text"
            placeholder="Buscar rol por nombre o descripción..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="rol-barraBusqueda"
            disabled={isLoading} // Deshabilitar si está cargando datos iniciales
          />
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
            disabled={isLoading || isSubmitting} // Deshabilitar si carga o hay otra acción en curso
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
            roles={roles} // roles ya está procesado (filtrado) por el hook
            onView={(role) => handleOpenModal("details", role)}
            onEdit={(role) => handleOpenModal("edit", role)}
            onDeleteConfirm={(role) => handleOpenModal("delete", role)}
            onToggleAnular={handleToggleEstado}
            currentPage={currentPage}
            rowsPerPage={itemsPerPage}
          />
        )}
        { !isLoading && !error && totalRolesFiltrados > itemsPerPage && (
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
        permisosDisponibles={permisos} // Pasamos todos los permisos
        permisosAgrupados={permisosAgrupados} // Pasamos los permisos agrupados
        isLoading={isSubmitting} // Estado de carga para el formulario
      />
      <RolEditarModal
        isOpen={isEditarModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveRol}
        roleData={currentRole} // Pasamos el rol actual que podría tener ya los permisos (si getRoleDetailsAPI los trae)
        // o solo id, nombre, desc. El modal puede necesitar cargar detalles o usar lo que se le pasa.
        permisosDisponibles={permisos}
        permisosAgrupados={permisosAgrupados}
        isLoading={isSubmitting}
      />
      <RolDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        role={currentRole} // currentRole ya tiene los detalles cargados por handleOpenModal
        isLoading={isSubmitting} // Usar isSubmitting para el feedback de carga del detalle
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
