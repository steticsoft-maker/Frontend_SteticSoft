// src/features/roles/hooks/useRoles.js

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchRolesAPI,
  createRoleAPI,
  updateRoleAPI,
  deleteRoleAPI,
  toggleRoleStatusAPI,
  getRoleDetailsAPI,
  getPermisosAPI,
} from "../services/rolesService";

// Función auxiliar para procesar la lista de permisos y agruparla por módulo.
const groupPermissionsByModule = (permissions) => {
  if (!permissions || permissions.length === 0) return {};
  return permissions.reduce((acc, permiso) => {
    const parts = permiso.nombre.split("_");
    if (parts.length > 2 && parts[0] === "MODULO") {
      const moduleName = parts[1];
      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }
      acc[moduleName].push(permiso);
    }
    return acc;
  }, {});
};

const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [currentRole, setCurrentRole] = useState(null);
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  // NUEVO ESTADO PARA ERRORES DE FORMULARIO
  const [formErrors, setFormErrors] = useState({});
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");

  const permisosAgrupados = useMemo(
    () => groupPermissionsByModule(permisos),
    [permisos]
  );

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [rolesResponse, permisosResponse] = await Promise.all([
        fetchRolesAPI(searchTerm),
        getPermisosAPI(),
      ]);
      setRoles(rolesResponse.data || []);
      setPermisos(permisosResponse || []);
    } catch (err) {
      setError(err.message || "Error al cargar los datos de roles o permisos.");
      setRoles([]);
      setPermisos([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const closeModal = useCallback(() => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsValidationModalOpen(false);
    setCurrentRole(null);
    setValidationMessage("");
    setFormErrors({}); // Limpiar errores de formulario al cerrar cualquier modal
  }, []);

  const handleOpenModal = useCallback(async (type, role = null) => {
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

    if (type === "details" && role?.idRol) {
      setIsSubmitting(true);
      try {
        const roleDetails = await getRoleDetailsAPI(role.idRol);
        setCurrentRole(roleDetails);
        setIsDetailsModalOpen(true);
      } catch (err) {
        setValidationMessage(
          err.message || "No se pudieron cargar los detalles del rol."
        );
        setIsValidationModalOpen(true);
        setCurrentRole(null);
      } finally {
        setIsSubmitting(false);
      }
    } else if (type === "edit" && role?.idRol) {
      setIsEditarModalOpen(true);
    } else if (type === "create") {
      // --- LÓGICA CORRECTA ---
      // Simplemente abre el modal de creación.
      // El modal (RolCrearModal) es responsable de gestionar su propio estado de formulario.
      // No es necesario setear un `formData` aquí.
      setCurrentRole(null);
      setIsCrearModalOpen(true);
    } else if (type === "delete") {
      setIsDeleteModalOpen(true);
    }
  }, []);

  const handleSaveRol = useCallback(
    async (roleData) => {
      setIsSubmitting(true);
      setFormErrors({}); // Limpiar errores previos

      try {
        let response;
        if (roleData.id) {
          const { id, ...dataToUpdate } = roleData;
          response = await updateRoleAPI(id, dataToUpdate);
        } else {
          response = await createRoleAPI(roleData);
        }

        setValidationMessage(
          response.message ||
            (roleData.id
              ? "Rol actualizado exitosamente."
              : "Rol creado exitosamente.")
        );
        setIsValidationModalOpen(true);
        closeModal();
        await cargarDatos();
      } catch (err) {
        // INICIO DE MODIFICACIÓN: Manejo de errores de validación
        if (err.response && (err.response.status === 400 || err.response.status === 422) && err.response.data.errors) {
          const backendErrors = err.response.data.errors;
          const newErrors = {};
          backendErrors.forEach(error => {
            // Mapeo del backend (nombre_rol) al frontend (nombre)
            const fieldName = error.param === 'nombre_rol' ? 'nombre' : error.param;
            newErrors[fieldName] = error.msg;
          });
          setFormErrors(newErrors);
        } else {
          // Manejo de otros tipos de errores (ej. 500, error de red)
          const apiErrorMessage = err.response?.data?.message || err.response?.data?.error;
          setValidationMessage(
            apiErrorMessage || err.message || "Error al guardar el rol."
          );
          setIsValidationModalOpen(true);
        }
        // FIN DE MODIFICACIÓN
      } finally {
        setIsSubmitting(false);
      }
    },
    [cargarDatos, closeModal]
  );

  const handleDeleteRol = useCallback(async () => {
    if (!currentRole?.idRol) return;
    if (currentRole.nombre === "Administrador") {
      setValidationMessage("El rol 'Administrador' no puede ser eliminado.");
      setIsValidationModalOpen(true);
      closeModal();
      return;
    }
    setIsSubmitting(true);
    try {
      await deleteRoleAPI(currentRole.idRol);
      setValidationMessage("Rol eliminado exitosamente.");
      setIsValidationModalOpen(true);
      closeModal();
      await cargarDatos();
    } catch (err) {
      setValidationMessage(err.message || "Error al eliminar el rol.");
      setIsValidationModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentRole, cargarDatos, closeModal]);

  const handleToggleEstado = useCallback(
    async (roleToToggle) => {
      if (roleToToggle.nombre === "Administrador") {
        setValidationMessage(
          "El estado del rol 'Administrador' no se puede cambiar."
        );
        setIsValidationModalOpen(true);
        return;
      }
      try {
        await toggleRoleStatusAPI(roleToToggle.idRol, !roleToToggle.estado);
        await cargarDatos();
      } catch (err) {
        setValidationMessage(
          err.message || "Error al cambiar el estado del rol."
        );
        setIsValidationModalOpen(true);
      }
    },
    [cargarDatos]
  );

  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);
    return () => clearTimeout(timerId);
  }, [inputValue]);

  const processedRoles = useMemo(() => {
    let filtered = roles;

    // Filtrar por estado
    if (filterEstado !== "todos") {
      const isActive = filterEstado === "activos";
      filtered = filtered.filter((r) => r.estado === isActive);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((r) => {
        const nombreMatch = r.nombre?.toLowerCase().includes(lowerSearchTerm);
        const descripcionMatch = r.descripcion?.toLowerCase().includes(lowerSearchTerm);
        const permisosMatch = r.permisos?.some(p => p.nombre?.toLowerCase().includes(lowerSearchTerm));
        const estadoString = typeof r.estado === 'boolean' ? (r.estado ? "activo" : "inactivo") : "";
        const estadoMatch = estadoString.includes(lowerSearchTerm);

        return nombreMatch || descripcionMatch || permisosMatch || estadoMatch;
      });
    }

    return filtered;
  }, [roles, filterEstado, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const currentRolesForTable = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return processedRoles.slice(indexOfFirstItem, indexOfLastItem);
  }, [processedRoles, currentPage, itemsPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterEstado]);

  return {
    roles: currentRolesForTable,
    totalRolesFiltrados: processedRoles.length,
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
    formErrors, // <--- EXPORTAR ESTADO DE ERRORES
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
  };
};

export default useRoles;