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

// Función auxiliar para procesar la lista de permisos y agruparla por módulo.
// Toma un nombre como 'MODULO_ROLES_GESTIONAR' y lo divide en Módulo 'ROLES' y Acción 'GESTIONAR'.
const groupPermissionsByModule = (permissions) => {
  if (!permissions) return {};
  return permissions.reduce((acc, permiso) => {
    const parts = permiso.nombre.split("_");
    if (parts.length > 2 && parts[0] === "MODULO") {
      const moduleName = parts[1];
      const action = parts.slice(2).join("_");

      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }

      acc[moduleName].push({
        ...permiso,
        accion: action, // Guardamos la acción para mostrarla en el UI (ej. 'GESTIONAR')
      });
    }
    return acc;
  }, {});
};

function ListaRolesPage() {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentRole, setCurrentRole] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  // Usamos useMemo para que la agrupación de permisos solo se recalcule cuando la lista de permisos cambie.
  // Esto mejora el rendimiento.
  const permisosAgrupados = useMemo(
    () => groupPermissionsByModule(permisos),
    [permisos]
  );

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Cargamos roles y permisos de forma paralela para mayor eficiencia.
      const [rolesResponse, permisosResponse] = await Promise.all([
        fetchRolesAPI(),
        getPermisosAPI(),
      ]);
      setRoles(rolesResponse.data || []);
      setPermisos(permisosResponse || []);
    } catch (err) {
      setError(err.message || "Error al cargar los datos.");
      setRoles([]);
      setPermisos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

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
    // Protección para no editar o eliminar el rol de Administrador.
    if (
      role?.nombre === "Administrador" &&
      (type === "edit" || type === "delete")
    ) {
      setValidationMessage(
        `El rol 'Administrador' no puede ser ${
          type === "edit" ? "editado" : "eliminado"
        }.`
      );
      setIsValidationModalOpen(true);
      return;
    }

    setCurrentRole(role);

    if (type === "details" && role) {
      setIsLoading(true);
      try {
        const roleDetails = await getRoleDetailsAPI(role.idRol);
        setCurrentRole(roleDetails);
        setIsDetailsModalOpen(true);
      } catch (err) {
        setValidationMessage(
          err.message || "No se pudieron cargar los detalles del rol."
        );
        setIsValidationModalOpen(true);
      } finally {
        setIsLoading(false);
      }
    } else if (type === "edit") {
      setIsEditarModalOpen(true);
    } else if (type === "create") {
      setIsCrearModalOpen(true);
    } else if (type === "delete") {
      setIsDeleteModalOpen(true);
    }
  };

  const handleSaveRol = async (roleData) => {
    try {
      // 1. Llama a la función del servicio para guardar en la API
      await saveRoleAPI(roleData);

      // 2. Muestra un mensaje de éxito
      setValidationMessage(
        roleData.id
          ? "Rol actualizado exitosamente."
          : "Rol creado exitosamente."
      );
      setIsValidationModalOpen(true);

      // 3. Cierra el modal y recarga la tabla para ver los cambios
      closeModal();
      await cargarDatos();
    } catch (err) {
      // 4. Si algo falla, muestra un mensaje de error
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
      await cargarDatos(); // Recargar datos.
    } catch (err) {
      setValidationMessage(err.message || "Error al eliminar el rol.");
      setIsValidationModalOpen(true);
      closeModal();
    }
  };

  const handleToggleEstado = async (role) => {
    if (role.nombre === "Administrador") {
      setValidationMessage(
        "El estado del rol 'Administrador' no se puede cambiar."
      );
      setIsValidationModalOpen(true);
      return;
    }
    try {
      await toggleRoleStatusAPI(role.idRol, !role.estado);
      await cargarDatos(); // Recargar para mostrar el nuevo estado.
    } catch (err) {
      setValidationMessage(
        err.message || "Error al cambiar el estado del rol."
      );
      setIsValidationModalOpen(true);
    }
  };

  // Filtrar roles según la barra de búsqueda.
  const filteredRoles = roles.filter(
    (r) =>
      (r.nombre && r.nombre.toLowerCase().includes(busqueda.toLowerCase())) ||
      (r.descripcion &&
        r.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="rol-container">
      <NavbarAdmin />
      <div className="rol-content">
        <h1>Gestión de Roles</h1>
        <div className="rol-accionesTop">
          <input
            type="text"
            placeholder="Buscar rol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="rol-barraBusqueda"
          />
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
            roles={filteredRoles}
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
        roleId={currentRole?.idRol}
        permisosDisponibles={permisos}
        permisosAgrupados={permisosAgrupados}
      />
      <RolDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeModal}
        role={currentRole}
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
