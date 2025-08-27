// src/features/usuarios/hooks/useUsuarios.js

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getUsuariosAPI,
  createUsuarioAPI,
  updateUsuarioAPI,
  toggleUsuarioEstadoAPI,
  getRolesAPI,
  // verificarCorreoAPI, // Ya no se usará en el blur
  eliminarUsuarioFisicoAPI,
} from "../services/usuariosService";

const CAMPOS_PERFIL = [
  "nombre",
  "apellido",
  "tipoDocumento",
  "numeroDocumento",
  "telefono",
  "fechaNacimiento",
  "direccion",
];

const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorPage, setErrorPage] = useState(null);
  const [currentUsuario, setCurrentUsuario] = useState(null);

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // INICIO DE MODIFICACIÓN: Se eliminan los estados y funciones de validación del lado del cliente.
  // const [isFormValid, setIsFormValid] = useState(false);
  // const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  // const [touchedFields, setTouchedFields] = useState({});
  // const validateField = useCallback(...) -> ELIMINADO
  // const runValidations = useCallback(...) -> ELIMINADO
  // El useEffect que llamaba a runValidations -> ELIMINADO
  // FIN DE MODIFICACIÓN

  const cargarDatos = useCallback(async () => {
    setIsLoadingPage(true);
    setErrorPage(null);
    try {
      const [usuariosData, rolesData] = await Promise.all([
        getUsuariosAPI(),
        getRolesAPI(),
      ]);
      const filteredRoles = (rolesData || []).filter(
        (rol) => rol.nombre !== "Administrador"
      );
      setUsuarios(usuariosData || []);
      setAvailableRoles(filteredRoles);
    } catch (err) {
      setErrorPage(err.message || "No se pudieron cargar los datos.");
    } finally {
      setIsLoadingPage(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const checkRequiresProfile = useCallback(
    (roleId) => {
      const selectedRoleObj = availableRoles.find((r) => r.idRol === parseInt(roleId));
      return (
        selectedRoleObj &&
        (selectedRoleObj.tipoPerfil === "CLIENTE" ||
          selectedRoleObj.tipoPerfil === "EMPLEADO")
      );
    },
    [availableRoles]
  );

  const closeModal = useCallback(() => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteModalOpen(false);
    setIsValidationModalOpen(false);
    setCurrentUsuario(null);
    setValidationMessage("");
    setFormData({});
    setFormErrors({});
  }, []);

  const handleOpenModal = useCallback(
    (type, usuario = null) => {
      const rolNombre = usuario?.rol?.nombre;
      if (
        rolNombre === "Administrador" &&
        (type === "edit" || type === "delete")
      ) {
        setValidationMessage(`El usuario 'Administrador' no puede ser modificado o eliminado.`);
        setIsValidationModalOpen(true);
        return;
      }

      setFormErrors({});
      setCurrentUsuario(usuario);

      if (type === "create") {
        const defaultRole = availableRoles.find((r) => r.nombre === "Cliente") || (availableRoles.length > 0 ? availableRoles[0] : null);
        setFormData({
          estado: true,
          idRol: defaultRole ? defaultRole.idRol : "",
          nombre: "",
          apellido: "",
          tipoDocumento: "Cédula de Ciudadanía",
          numeroDocumento: "",
          correo: "",
          telefono: "",
          fechaNacimiento: "",
          direccion: "",
          contrasena: "",
        });
        setIsCrearModalOpen(true);
      } else if (type === "edit" && usuario) {
        const perfil = usuario.clienteInfo || usuario.empleadoInfo || {};
        setFormData({
          idUsuario: usuario.idUsuario,
          correo: usuario.correo || "",
          idRol: usuario.rol?.idRol || "",
          nombre: perfil.nombre || "",
          apellido: perfil.apellido || "",
          tipoDocumento: perfil.tipoDocumento || "Cédula de Ciudadanía",
          numeroDocumento: perfil.numeroDocumento || "",
          telefono: perfil.telefono || "",
          fechaNacimiento: perfil.fechaNacimiento ? perfil.fechaNacimiento.split("T")[0] : "",
          direccion: perfil.direccion || "",
          estado: typeof usuario.estado === "boolean" ? usuario.estado : true,
        });
        setIsEditarModalOpen(true);
      } else if (type === "details") {
        setIsDetailsModalOpen(true);
      }
    },
    [availableRoles]
  );

  const showDeleteModal = useCallback((usuario) => {
    if (usuario.rol?.nombre === "Administrador") {
      setValidationMessage("El usuario 'Administrador' no puede ser eliminado.");
      setIsValidationModalOpen(true);
      return;
    }
    setUsuarioToDelete(usuario);
    setIsConfirmDeleteModalOpen(true);
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    // Limpiar el error del campo específico al escribir en él.
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  }, [formErrors]);

  // INICIO DE MODIFICACIÓN: Se elimina la validación en el blur.
  const handleInputBlur = useCallback((e) => {
    // Ya no se realiza validación en el onBlur para simplificar
    // y depender de la validación del backend al enviar.
  }, []);
  // FIN DE MODIFICACIÓN

  const handleSaveUsuario = useCallback(async () => {
    // INICIO DE MODIFICACIÓN: Se elimina la validación del lado del cliente antes de enviar.
    setIsSubmitting(true);
    setFormErrors({}); // Limpiar errores previos

    try {
      const dataParaAPI = { ...formData };

      const requiresProfile = checkRequiresProfile(dataParaAPI.idRol);
      if (!requiresProfile) {
        CAMPOS_PERFIL.forEach((field) => delete dataParaAPI[field]);
      }

      let successMessage = "";
      if (dataParaAPI.idUsuario) {
        await updateUsuarioAPI(dataParaAPI.idUsuario, dataParaAPI);
        successMessage = `El usuario ${dataParaAPI.correo} ha sido actualizado.`;
      } else {
        await createUsuarioAPI(dataParaAPI);
        successMessage = `El usuario ${dataParaAPI.correo} ha sido creado exitosamente.`;
      }

      closeModal();
      await cargarDatos();
      setValidationMessage(successMessage);
      setIsValidationModalOpen(true);
    } catch (err) {
      // Nueva lógica para manejar errores de validación del backend
      if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
        const backendErrors = err.response.data.errors.reduce((acc, error) => {
          const fieldName = error.param || error.path;
          acc[fieldName] = error.msg;
          return acc;
        }, {});
        setFormErrors(backendErrors);
      } else {
        // Error genérico si la respuesta no es de validación
        const apiErrorMessage = err.response?.data?.message || err.message || "Error al guardar el usuario.";
        setValidationMessage(apiErrorMessage);
        setIsValidationModalOpen(true);
      }
    } finally {
      setIsSubmitting(false);
    }
    // FIN DE MODIFICACIÓN
  }, [formData, closeModal, cargarDatos, checkRequiresProfile]);

  const handleConfirmDeleteUsuario = useCallback(async () => {
    if (!usuarioToDelete?.idUsuario) return;
    setIsSubmitting(true);
    try {
      await eliminarUsuarioFisicoAPI(usuarioToDelete.idUsuario);
      await cargarDatos();
      setIsConfirmDeleteModalOpen(false);
      setUsuarioToDelete(null);
      setValidationMessage(`El usuario "${usuarioToDelete.correo}" fue eliminado.`);
      setIsValidationModalOpen(true);
    } catch (err) {
      setValidationMessage(err.message || "Error al eliminar el usuario.");
      setIsValidationModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [usuarioToDelete, cargarDatos]);

  const handleToggleEstadoUsuario = useCallback(async (usuarioToToggle) => {
    if (!usuarioToToggle?.idUsuario) return;
    if (usuarioToToggle.rol?.nombre === "Administrador") {
      setValidationMessage("El estado del 'Administrador' no puede ser modificado.");
      setIsValidationModalOpen(true);
      return;
    }
    try {
      const nuevoEstado = !usuarioToToggle.estado;
      await toggleUsuarioEstadoAPI(usuarioToToggle.idUsuario, nuevoEstado);
      await cargarDatos();
      setValidationMessage(`El estado de "${usuarioToToggle.correo}" se cambió a ${nuevoEstado ? "Activo" : "Inactivo"}.`);
      setIsValidationModalOpen(true);
    } catch (err) {
      setValidationMessage(err.message || "Error al cambiar el estado del usuario.");
      setIsValidationModalOpen(true);
    }
  }, [cargarDatos]);

  useEffect(() => {
    const timerId = setTimeout(() => setSearchTerm(inputValue), 500);
    return () => clearTimeout(timerId);
  }, [inputValue]);

  const processedUsuarios = useMemo(() => {
    let filtered = usuarios;
    if (filterEstado !== "todos") {
      const isActive = filterEstado === "activos";
      filtered = filtered.filter((u) => u.estado === isActive);
    }
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((u) => {
        const perfil = u.clienteInfo || u.empleadoInfo || {};
        const estadoString = typeof u.estado === 'boolean' ? (u.estado ? "activo" : "inactivo") : "";
        return (
          perfil.nombre?.toLowerCase().includes(lowerSearchTerm) ||
          perfil.apellido?.toLowerCase().includes(lowerSearchTerm) ||
          u.correo?.toLowerCase().includes(lowerSearchTerm) ||
          perfil.tipoDocumento?.toLowerCase().includes(lowerSearchTerm) ||
          perfil.numeroDocumento?.toLowerCase().includes(lowerSearchTerm) ||
          perfil.telefono?.toLowerCase().includes(lowerSearchTerm) ||
          u.rol?.nombre?.toLowerCase().includes(lowerSearchTerm) ||
          estadoString.includes(lowerSearchTerm)
        );
      });
    }
    return filtered;
  }, [usuarios, searchTerm, filterEstado]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterEstado]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsersForTable = processedUsuarios.slice(indexOfFirstUser, indexOfLastUser);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return {
    usuarios: currentUsersForTable,
    totalUsuariosFiltrados: processedUsuarios.length,
    availableRoles,
    isLoadingPage,
    isSubmitting,
    errorPage,
    currentUsuario,
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    isValidationModalOpen,
    validationMessage,
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
    handleInputChange,
    handleInputBlur,
    isConfirmDeleteModalOpen,
    showDeleteModal,
    handleConfirmDeleteUsuario,
  };
};

export default useUsuarios;
