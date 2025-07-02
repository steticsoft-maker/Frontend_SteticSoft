// src/features/roles/hooks/useRoles.js
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchRolesAPI,
  saveRoleAPI,
  deleteRoleAPI,
  toggleRoleStatusAPI,
  getRoleDetailsAPI,
  getPermisosAPI,
} from "../services/rolesService";

// Función auxiliar para procesar la lista de permisos y agruparla por módulo.
const groupPermissionsByModule = (permissions) => {
  if (!permissions || permissions.length === 0) return {};
  return permissions.reduce((acc, permiso) => {
    const parts = permiso.nombre.split("_"); // Ej: MODULO_USUARIOS_CREAR
    if (parts.length > 2 && parts[0] === "MODULO") {
      const moduleName = parts[1]; // USUARIOS
      // const action = parts.slice(2).join("_"); // CREAR, GESTIONAR, LEER, etc.

      if (!acc[moduleName]) {
        acc[moduleName] = [];
      }
      // Guardamos el objeto permiso completo, ya que el PermisosSelector puede necesitar el idPermiso.
      acc[moduleName].push(permiso);
    }
    return acc;
  }, {});
};

const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [permisos, setPermisos] = useState([]); // Todos los permisos disponibles

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Para acciones de formulario
  const [error, setError] = useState(null);

  const [currentRole, setCurrentRole] = useState(null); // Para modales de edición/detalles/eliminación

  // --- Estados para Modales ---
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  // --- Estados para Búsqueda y Filtrado (Requerimiento 3) ---
  const [inputValue, setInputValue] = useState(""); // Para el input de búsqueda inmediato
  const [searchTerm, setSearchTerm] = useState(""); // Para el término de búsqueda "debounced"
  const [filterEstado, setFilterEstado] = useState("todos"); // 'todos', 'activos', 'inactivos'

  // Derivar permisos agrupados usando useMemo
  const permisosAgrupados = useMemo(
    () => groupPermissionsByModule(permisos),
    [permisos]
  );

  const cargarDatos = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Pasamos searchTerm a fetchRolesAPI
      const [rolesResponse, permisosResponse] = await Promise.all([
        fetchRolesAPI(searchTerm), // MODIFICADO: pasar searchTerm
        getPermisosAPI(),
      ]);
      setRoles(rolesResponse.data || []);
      setPermisos(permisosResponse || []); // Asumiendo que permisosResponse es el array directamente
    } catch (err) {
      setError(err.message || "Error al cargar los datos de roles o permisos.");
      setRoles([]);
      setPermisos([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]); // MODIFICADO: añadir searchTerm como dependencia

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
    // No resetear isSubmitting aquí, se maneja en las funciones de submit
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

    setCurrentRole(role); // Establecer currentRole para todos los tipos que lo necesiten

    if (type === "details" && role?.idRol) {
      setIsSubmitting(true); // Usar isSubmitting para feedback de carga de detalles
      try {
        const roleDetails = await getRoleDetailsAPI(role.idRol);
        setCurrentRole(roleDetails); // Actualizar currentRole con todos los detalles (incluyendo permisos del rol)
        setIsDetailsModalOpen(true);
      } catch (err) {
        setValidationMessage(
          err.message || "No se pudieron cargar los detalles del rol."
        );
        setIsValidationModalOpen(true);
        setCurrentRole(null); // Limpiar currentRole si falla la carga
      } finally {
        setIsSubmitting(false);
      }
    } else if (type === "edit" && role?.idRol) {
      // Para editar, el RolEditarModal usualmente carga sus propios datos por ID o recibe initialData.
      // Si RolEditarModal carga sus datos, solo necesitamos pasar el ID.
      // Si pasamos initialData, currentRole ya está seteado.
      // Aquí asumimos que RolEditarModal usará currentRole (que puede ser solo {idRol, nombre, descripcion})
      // y que el modal se encargará de buscar los permisos asociados a ese rol si es necesario,
      // o que saveRoleAPI maneja la asignación de permisos.
      // El `permisosAgrupados` y `permisos` se pasan al modal para la selección.
      setIsEditarModalOpen(true);
    } else if (type === "create") {
      setCurrentRole(null); // Asegurar que no hay datos previos para creación
      setIsCrearModalOpen(true);
    } else if (type === "delete") {
      setIsDeleteModalOpen(true);
    }
  }, []);

  const handleSaveRol = useCallback(
    async (roleData) => {
      setIsSubmitting(true);
      try {
        // El servicio saveRoleAPI debe manejar si es creación o edición basado en la presencia de roleData.idRol
        const response = await saveRoleAPI(roleData);
        setValidationMessage(
          response.message ||
            (roleData.idRol
              ? "Rol actualizado exitosamente."
              : "Rol creado exitosamente.")
        );
        setIsValidationModalOpen(true);
        closeModal();
        await cargarDatos();
      } catch (err) {
        setValidationMessage(
          err.response?.data?.message ||
            err.message ||
            "Error al guardar el rol."
        );
        setIsValidationModalOpen(true);
        // No cerrar modal en error para que el usuario pueda corregir
      } finally {
        setIsSubmitting(false);
      }
    },
    [cargarDatos, closeModal]
  );

  const handleDeleteRol = useCallback(async () => {
    if (!currentRole?.idRol) return;
    if (currentRole.nombre === "Administrador") {
      // Doble chequeo
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
      // closeModal(); // Considerar si cerrar el modal de confirmación en error
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
      // setIsSubmitting(true); // Opcional, para feedback visual en la tabla si se desea
      try {
        await toggleRoleStatusAPI(roleToToggle.idRol, !roleToToggle.estado);
        await cargarDatos(); // Recargar para mostrar el nuevo estado.
        // setValidationMessage("Estado del rol actualizado."); // Opcional
        // setIsValidationModalOpen(true);
      } catch (err) {
        setValidationMessage(
          err.message || "Error al cambiar el estado del rol."
        );
        setIsValidationModalOpen(true);
      } finally {
        // setIsSubmitting(false);
      }
    },
    [cargarDatos]
  );

  // Efecto para debounce de la búsqueda
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500); // 500ms de debounce

    return () => {
      clearTimeout(timerId);
    };
  }, [inputValue]);

  // Lógica de Búsqueda y Filtrado (Requerimiento 3)
  const processedRoles = useMemo(() => {
    let filtered = roles;

    if (filterEstado !== "todos") {
      const isActive = filterEstado === "activos";
      filtered = filtered.filter((r) => r.estado === isActive);
    }

    // El filtrado por searchTerm (nombre, descripción, permisos) ahora se espera que lo haga el backend.
    // Si searchTerm está vacío, el backend debería devolver todos los roles (o los filtrados por otros criterios si los hubiera).
    // La lógica de filtrado por nombre/descripción que estaba aquí se elimina.
    // if (searchTerm) {
    //   const lowerSearchTerm = searchTerm.toLowerCase();
    //   filtered = filtered.filter(r =>
    //     r.nombre?.toLowerCase().includes(lowerSearchTerm) ||
    //     r.descripcion?.toLowerCase().includes(lowerSearchTerm)
    //     // Si el backend NO buscara por permisos, la lógica podría ir aquí,
    //     // pero el objetivo es que el backend lo haga.
    //   );
    // }
    return filtered;
  }, [roles, filterEstado]); // MODIFICADO: searchTerm ya no es una dependencia directa aquí porque 'roles' ya viene filtrado.

  // (No hay paginación en la versión original de ListaRolesPage, se podría añadir si es necesario)

  return {
    roles: processedRoles, // Roles filtrados para la tabla
    permisos, // Todos los permisos para los modales de creación/edición
    permisosAgrupados, // Permisos agrupados por módulo para los modales
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
    inputValue, // Para el input de búsqueda
    setInputValue, // Para actualizar el valor del input inmediato
    filterEstado,
    setFilterEstado,
    closeModal,
    handleOpenModal,
    handleSaveRol,
    handleDeleteRol,
    handleToggleEstado,
  };
};

export default useRoles;
