// src/features/roles/hooks/useRoles.js

import { useState, useEffect, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  fetchRolesAPI,
  createRoleAPI,
  updateRoleAPI,
  deleteRoleAPI,
  toggleRoleStatusAPI,
  getRoleDetailsAPI,
  getPermisosAPI,
  getRoleHistoryAPI,
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

const MySwal = withReactContent(Swal);

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
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [roleHistory, setRoleHistory] = useState([]);
  const [historyError, setHistoryError] = useState(null);

  const permisosAgrupados = useMemo(
    () => groupPermissionsByModule(permisos),
    [permisos]
  );

  // INICIO DE MODIFICACIÓN: Lógica de carga de datos
  const cargarDatos = useCallback(async () => {
    // 1. Condición de guarda: si el término de búsqueda es inválido, no hacemos nada.
    // Solo limpiamos los roles para que la tabla no muestre datos viejos y salimos.
    if (searchTerm && searchTerm.length > 0 && searchTerm.length < 3) {
      setRoles([]); // Limpiar resultados para que el usuario no vea datos incorrectos
      setIsLoading(false); // Detener el indicador de carga
      setError(null); // Limpiar cualquier error previo
      return; // Detener la ejecución aquí para no llamar a la API
    }

    setIsLoading(true);
    setError(null);
    try {
      // 2. Ahora, esta llamada solo se ejecuta con un término de búsqueda válido (vacío o >= 3 caracteres).
      const [rolesResponse, permisosResponse] = await Promise.all([
        fetchRolesAPI(searchTerm, filterEstado), // Pasamos también el filtro de estado
        getPermisosAPI(),
      ]);
      setRoles(rolesResponse.data || []);
      setPermisos(permisosResponse || []);
    } catch (err) {
      // 3. Mejoramos el manejo de errores para ser más específico.
      const apiError =
        err.response?.data?.message ||
        err.message ||
        "Error al cargar los datos.";
      setError(apiError);
      setRoles([]); // Limpiar en caso de error
      setPermisos([]);
    } finally {
      setIsLoading(false);
    }
    // 4. Se añade 'filterEstado' a las dependencias para que recargue al cambiar el filtro.
  }, [searchTerm, filterEstado]);
  // FIN DE MODIFICACIÓN

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const closeModal = useCallback(() => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsHistoryModalOpen(false);
    setCurrentRole(null);
    setRoleHistory([]);
    setHistoryError(null);
  }, []);

  const handleDeleteRol = useCallback(
    async (roleToDelete) => {
      if (!roleToDelete?.idRol) return;
      if (roleToDelete.nombre === "Administrador") {
        MySwal.fire({
          title: "Acción no permitida",
          text: "El rol 'Administrador' no puede ser eliminado.",
          icon: "error",
          confirmButtonText: "Ok",
        });
        return;
      }
      setIsSubmitting(true);
      try {
        await deleteRoleAPI(roleToDelete.idRol);
        MySwal.fire({
          title: "¡Eliminado!",
          text: "El rol ha sido eliminado exitosamente.",
          icon: "success",
        });
        closeModal();
        await cargarDatos();
      } catch (err) {
        MySwal.fire({
          title: "Error",
          text: err.message || "Error al eliminar el rol.",
          icon: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [cargarDatos, closeModal]
  );

  const handleOpenModal = useCallback(
    async (type, role = null) => {
      if (
        role?.nombre === "Administrador" &&
        (type === "edit" || type === "delete")
      ) {
        MySwal.fire({
          title: "Acción no permitida",
          text: `El rol 'Administrador' no puede ser ${
            type === "edit" ? "editado" : "eliminado"
          }.`,
          icon: "warning",
        });
        return;
      }

      if (type === "details" && role?.idRol) {
        setCurrentRole(role);
        setIsSubmitting(true);
        try {
          const roleDetails = await getRoleDetailsAPI(role.idRol);
          setCurrentRole(roleDetails);
          setIsDetailsModalOpen(true);
        } catch (err) {
          MySwal.fire({
            title: "Error",
            text:
              err.message || "No se pudieron cargar los detalles del rol.",
            icon: "error",
          });
          setCurrentRole(null);
        } finally {
          setIsSubmitting(false);
        }
      } else if (type === "edit" && role?.idRol) {
        setCurrentRole(role);
        setIsEditarModalOpen(true);
      } else if (type === "create") {
        setCurrentRole(null);
        setIsCrearModalOpen(true);
      } else if (type === "delete") {
        MySwal.fire({
          title: "¿Estás seguro?",
          text: `¿Deseas eliminar el rol "${role.nombre}"? No podrás revertir esto.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "Sí, ¡eliminar!",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            handleDeleteRol(role);
          }
        });
      } else if (type === "history" && role?.idRol) {
        handleOpenHistoryModal(role);
      }
    },
    [handleDeleteRol]
  );

  const handleOpenHistoryModal = async (role) => {
    setCurrentRole(role);
    setIsHistoryModalOpen(true);
    setIsSubmitting(true);
    setHistoryError(null);
    try {
      const historyData = await getRoleHistoryAPI(role.idRol);
      setRoleHistory(historyData);
    } catch (err) {
      setHistoryError(err.message || "No se pudo cargar el historial.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveRol = useCallback(
    async (roleData) => {
      setIsSubmitting(true);
      try {
        let response;
        if (roleData.id) {
          const { id, ...dataToUpdate } = roleData;
          response = await updateRoleAPI(id, dataToUpdate);
        } else {
          response = await createRoleAPI(roleData);
        }

        MySwal.fire({
          title: "¡Éxito!",
          text:
            response.message ||
            (roleData.id
              ? "Rol actualizado exitosamente."
              : "Rol creado exitosamente."),
          icon: "success",
        });

        closeModal();
        await cargarDatos();
      } catch (err) {
        const apiErrorMessage =
          err.response?.data?.message || err.response?.data?.error;
        MySwal.fire({
          title: "Error",
          text: apiErrorMessage || err.message || "Error al guardar el rol.",
          icon: "error",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [cargarDatos, closeModal]
  );

  const handleToggleEstado = useCallback(
    async (roleToToggle) => {
      if (roleToToggle.nombre === "Administrador") {
        MySwal.fire({
          title: "Acción no permitida",
          text: "El estado del rol 'Administrador' no se puede cambiar.",
          icon: "warning",
        });
        return;
      }
      try {
        const nuevoEstado = !roleToToggle.estado;
        await toggleRoleStatusAPI(roleToToggle.idRol, nuevoEstado);
        await cargarDatos();
        MySwal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `El estado se cambió a ${
            nuevoEstado ? "Activo" : "Inactivo"
          }`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } catch (err) {
        MySwal.fire({
          title: "Error",
          text: err.message || "Error al cambiar el estado del rol.",
          icon: "error",
        });
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
        const descripcionMatch = r.descripcion
          ?.toLowerCase()
          .includes(lowerSearchTerm);
        const permisosMatch = r.permisos?.some((p) =>
          p.nombre?.toLowerCase().includes(lowerSearchTerm)
        );
        const estadoString =
          typeof r.estado === "boolean"
            ? r.estado
              ? "activo"
              : "inactivo"
            : "";
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
  };
};

export default useRoles;