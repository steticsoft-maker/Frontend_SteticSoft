// src/features/roles/pages/ListaRolesPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import RolesTable from "../components/RolesTable";
import RolCrearModal from "../components/RolCrearModal";
import RolEditarModal from "../components/RolEditarModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import RolDetailsModal from "../components/RolDetailsModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  fetchRolesAPI,
  saveRoleAPI,
  deleteRoleAPI,
  toggleRoleStatusAPI,
  getRoleDetailsAPI,
  getPermisosAPI,
} from "../services/rolesService";
import "../css/Rol.css";

const groupPermissionsByModule = (permissions) => {
  if (!permissions) return {};
  return permissions.reduce((acc, permiso) => {
    const parts = permiso.nombre.split("_");
    if (parts.length > 2 && parts[0] === "MODULO") {
      const moduleName = parts[1];
      const action = parts.slice(2).join("_");
      if (!acc[moduleName]) acc[moduleName] = [];
      acc[moduleName].push({ ...permiso, accion });
    }
    return acc;
  }, {});
};

function ListaRolesPage() {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);

  const [terminoBusqueda, setTerminoBusqueda] = useState(""); // Para el input
  const [busquedaDebounced, setBusquedaDebounced] = useState(""); // Para la API
  const [mostrarInactivos, setMostrarInactivos] = useState(false); // Switch state

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentRole, setCurrentRole] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  const permisosAgrupados = useMemo(() => groupPermissionsByModule(permisos), [permisos]);

  // Debounce para la búsqueda
  useEffect(() => {
    const timerId = setTimeout(() => {
      setBusquedaDebounced(terminoBusqueda);
    }, 300);
    return () => clearTimeout(timerId);
  }, [terminoBusqueda]);

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let params = { busqueda: busquedaDebounced };
      if (!mostrarInactivos) { // Si NO queremos mostrar inactivos, filtramos por estado ACTIVO
        params.estado = true;
      }
      // Si mostrarInactivos es true, no se añade 'estado', backend devuelve todos.

      const [rolesResponse, permisosResponse] = await Promise.all([
        fetchRolesAPI(params),
        getPermisosAPI(), // Los permisos se siguen cargando una vez
      ]);
      setRoles(rolesResponse.data || []); // Asumiendo que la API devuelve { data: [...] }
      setPermisos(permisosResponse || []);
    } catch (err) {
      setError(err.message || "Error al cargar los datos.");
      setRoles([]);
      // setPermisos([]); // Podríamos decidir no limpiar permisos si solo falla roles
    } finally {
      setIsLoading(false);
    }
  }, [busquedaDebounced, mostrarInactivos]); // Incluir dependencias que disparan la carga

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]); // useEffect principal que reacciona a cambios en cargarDatos (y sus deps)

  const closeModal = () => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsValidationModalOpen(false);
    setCurrentRole(null);
    setValidationMessage("");
  };

  const handleOpenModal = async (type, role = null) => {
    if (role?.nombre === "Administrador" && (type === "edit" || type === "delete")) {
      setValidationMessage(`El rol 'Administrador' no puede ser ${type === "edit" ? "editado" : "eliminado"}.`);
      setIsValidationModalOpen(true);
      return;
    }
    setCurrentRole(role);
    if (type === "details" && role) {
      setIsLoading(true);
      try {
        const roleDetails = await getRoleDetailsAPI(role.idRol);
        setCurrentRole(roleDetails); // roleDetails ya tiene los permisos del backend
        setIsDetailsModalOpen(true);
      } catch (err) {
        setValidationMessage(err.message || "No se pudieron cargar los detalles del rol.");
        setIsValidationModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    } else if (type === "edit") setIsEditarModalOpen(true);
    else if (type === "create") setIsCrearModalOpen(true);
    else if (type === "delete") setIsDeleteModalOpen(true);
  };

  const handleSaveRol = async (roleData) => {
    try {
      await saveRoleAPI(roleData);
      setValidationMessage(roleData.id ? "Rol actualizado exitosamente." : "Rol creado exitosamente.");
      setIsValidationModalOpen(true);
      closeModal();
      cargarDatos(); // Recargar datos
    } catch (err) {
      setValidationMessage(err.message || "Error al guardar el rol.");
      setIsValidationModalOpen(true);
    }
  };

  const handleDeleteRol = async () => {
    if (!currentRole?.idRol) return;
    try {
      await deleteRoleAPI(currentRole.idRol);
      setValidationMessage("Rol eliminado exitosamente.");
      setIsValidationModalOpen(true);
      closeModal();
      cargarDatos(); // Recargar datos
    } catch (err) {
      setValidationMessage(err.message || "Error al eliminar el rol.");
      setIsValidationModalOpen(true);
      closeModal();
    }
  };

  const handleToggleEstado = async (role) => {
    if (role.nombre === "Administrador") {
      setValidationMessage("El estado del rol 'Administrador' no se puede cambiar.");
      setIsValidationModalOpen(true);
      return;
    }
    try {
      await toggleRoleStatusAPI(role.idRol, !role.estado);
      cargarDatos(); // Recargar datos
    } catch (err) {
      setValidationMessage(err.message || "Error al cambiar el estado del rol.");
      setIsValidationModalOpen(true);
    }
  };

  // Ya no se necesita filteredRoles, la tabla usará 'roles' directamente.

  return (
    <div className="rol-container">
      <NavbarAdmin />
      <div className="rol-content">
        <h1>Gestión de Roles</h1>
        <div className="rol-accionesTop">
          <input
            type="text"
            placeholder="Buscar rol..."
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            className="rol-barraBusqueda"
          />
          <div className="rol-filtros">
            <label htmlFor="mostrarInactivosSwitch" className="rol-switch-label">Mostrar Inactivos:</label>
            <label className="switch rol-switch-control">
              <input
                id="mostrarInactivosSwitch"
                type="checkbox"
                checked={mostrarInactivos}
                onChange={(e) => setMostrarInactivos(e.target.checked)}
              />
              <span className="slider"></span>
            </label>
          </div>
          <button
            className="rol-botonAgregar"
            onClick={() => handleOpenModal("create")}
          >
            Crear Rol
          </button>
        </div>

        {isLoading ? (
          <p>Cargando roles...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <RolesTable
            roles={roles} // Usar roles directamente del estado
            onView={(role) => handleOpenModal("details", role)}
            onEdit={(role) => handleOpenModal("edit", role)}
            onDeleteConfirm={(role) => handleOpenModal("delete", role)}
            onToggleAnular={handleToggleEstado}
          />
        )}
      </div>

      <RolCrearModal
        isOpen={isCrearModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveRol}
        permisosDisponibles={permisos}
        permisosAgrupados={permisosAgrupados}
      />
      <RolEditarModal
        isOpen={isEditarModalOpen}
        onClose={closeModal}
        onSubmit={handleSaveRol}
        roleId={currentRole?.idRol} // Pasa roleId para cargar datos del rol en el modal
        permisosDisponibles={permisos}
        permisosAgrupados={permisosAgrupados}
      />
      <RolDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        role={currentRole} // currentRole ya tiene los permisos del backend
      />
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={closeModal}
        onConfirm={handleDeleteRol}
        title="Confirmar Eliminación de Rol"
        message={`¿Estás seguro de que deseas eliminar el rol "${currentRole?.nombre || ""}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
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
