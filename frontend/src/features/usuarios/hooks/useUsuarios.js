// src/features/usuarios/hooks/useUsuarios.js
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getUsuariosAPI,
  createUsuarioAPI,
  updateUsuarioAPI,
  toggleUsuarioEstadoAPI,
  getRolesAPI,
  verificarCorreoAPI,
  eliminarUsuarioFisicoAPI,
  getUsuarioByIdAPI
} from "../services/usuariosService";

// Expresiones regulares para validación en el frontend (COINCIDEN CON EL BACKEND)
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\d{7,15}$/;
const docRegex = /^[a-zA-Z0-9]{5,20}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const useUsuarios = () => {
  // --- Estados de la página y datos ---
  const [usuarios, setUsuarios] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errorPage, setErrorPage] = useState(null);
  const [currentUsuario, setCurrentUsuario] = useState(null);

  // --- Estados de Modales y Acciones ---
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [usuarioToDelete, setUsuarioToDelete] = useState(null);

  // --- Estados del Formulario (Centralizados) ---
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Estados de Filtro y Paginación ---
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const cargarDatos = useCallback(async () => {
    setIsLoadingPage(true);
    setErrorPage(null);
    try {
      const [usuariosData, rolesData] = await Promise.all([
        getUsuariosAPI(),
        getRolesAPI(),
      ]);
      setUsuarios(usuariosData || []);
      setAvailableRoles(
        rolesData.filter((r) => r.nombre !== "Administrador") || []
      );
    } catch (err) {
      setErrorPage(err.message || "No se pudieron cargar los datos.");
    } finally {
      setIsLoadingPage(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  // --- LÓGICA DE VALIDACIÓN DEL FORMULARIO ---
  const getRoleById = useCallback(
    (roleId) => {
      return availableRoles.find((r) => r.idRol === parseInt(roleId, 10));
    },
    [availableRoles]
  );

  const checkRequiresProfile = useCallback(
    (roleId) => {
      const selectedRole = getRoleById(roleId);
      return (
        selectedRole &&
        (selectedRole.tipoPerfil === "CLIENTE" ||
          selectedRole.tipoPerfil === "EMPLEADO")
      );
    },
    [getRoleById]
  );

  const validateField = useCallback(
    (name, value, currentData, formType = "create") => {
      let error = "";
      const requiresProfile = checkRequiresProfile(currentData.idRol);
      const selectedRole = getRoleById(currentData.idRol);

      switch (name) {
        case "correo":
          if (!value) error = "El correo es obligatorio.";
          else if (!emailRegex.test(value))
            error = "Formato de correo inválido.";
          break;
        case "idRol":
          if (!value) error = "El rol es requerido.";
          break;
        case "contrasena":
          if (formType === "create" && !value)
            error = "La contraseña es requerida.";
          else if (formType === "create" && value && !passwordRegex.test(value))
            error =
              "Contraseña insegura (mín 8 caract, 1 Mayús, 1 minús, 1 núm, 1 símb).";
          break;
        case "confirmarContrasena":
          if (formType === "create" && !value)
            error = "Debe confirmar la contraseña.";
          else if (formType === "create" && value !== currentData.contrasena)
            error = "Las contraseñas no coinciden.";
          break;
        case "nombre":
        case "apellido":
          if (requiresProfile && !value) error = `El ${name} es requerido.`;
          else if (value && (value.length < 2 || value.length > 100))
            error = `Debe tener entre 2 y 100 caracteres.`;
          break;
        case "numeroDocumento":
          if (requiresProfile && !value)
            error = "El número de documento es requerido.";
          else if (value && !docRegex.test(value))
            error = "Formato inválido (alfanumérico, 5-20 caracteres).";
          break;
        case "telefono":
          if (requiresProfile && !value) error = "El teléfono es requerido.";
          else if (value && !phoneRegex.test(value))
            error = "Inválido (solo números, 7-15 dígitos).";
          break;
        case "fechaNacimiento":
          if (requiresProfile && !value)
            error = "La fecha de nacimiento es requerida.";
          break;
        case "direccion":
          if (selectedRole && selectedRole.tipoPerfil === "CLIENTE" && !value) {
            error = "La dirección es requerida para clientes.";
          }
          break;
        default:
          break;
      }
      return error;
    },
    [checkRequiresProfile, getRoleById]
  );

  const runAllValidations = useCallback(
    (data, formType) => {
      const errors = {};
      const allFields = [
        "correo", "idRol", "nombre", "apellido", "tipoDocumento",
        "numeroDocumento", "telefono", "fechaNacimiento", "direccion",
      ];
      if (formType === "create")
        allFields.push("contrasena", "confirmarContrasena");

      allFields.forEach((field) => {
        const error = validateField(field, data[field], data, formType);
        if (error) errors[field] = error;
      });
      return errors;
    },
    [validateField]
  );

  useEffect(() => {
    if (!isCrearModalOpen && !isEditarModalOpen) return;
    const formType = formData.idUsuario ? "edit" : "create";
    const validationErrors = runAllValidations(formData, formType);
    const existingApiError =
      formErrors.correo === "Este correo ya está registrado."
        ? { correo: formErrors.correo }
        : {};
    const combinedErrors = { ...validationErrors, ...existingApiError };

    setFormErrors(combinedErrors);
    setIsFormValid(
      Object.keys(combinedErrors).length === 0 && !isVerifyingEmail
    );
  }, [
    formData,
    runAllValidations,
    isCrearModalOpen,
    isEditarModalOpen,
    isVerifyingEmail,
    formErrors.correo,
  ]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  }, []);

  const handleInputBlur = useCallback(async (e) => {
    const { name, value } = e.target;
    const formType = formData.idUsuario ? "edit" : "create";
    const error = validateField(name, value, formData, formType);
    setFormErrors((prev) => ({ ...prev, [name]: error }));

    if (name === "correo" && !error && value) {
      const originalEmail = isEditarModalOpen ? currentUsuario?.correo : null;
      if (value !== originalEmail) {
        setIsVerifyingEmail(true);
        try {
          const res = await verificarCorreoAPI(value);
          if (res.estaEnUso) {
            setFormErrors((prev) => ({
              ...prev,
              correo: "Este correo ya está registrado.",
            }));
          }
        } catch (apiError) {
          console.error("Error al verificar el correo:", apiError);
        } finally {
          setIsVerifyingEmail(false);
        }
      }
    }
  }, [formData, validateField, currentUsuario, isEditarModalOpen]);

  const closeModal = useCallback(() => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteModalOpen(false);
    setIsValidationModalOpen(false);
    setCurrentUsuario(null);
    setUsuarioToDelete(null);
    setValidationMessage("");
    setFormData({});
    setFormErrors({});
  }, []);

  const handleOpenModal = useCallback(async (type, usuario = null) => {
    setFormErrors({});
    if (type === "create") {
      const defaultRole = availableRoles.find(r => r.nombre === 'Cliente') || availableRoles[0] || null;
      setFormData({
        idRol: defaultRole ? defaultRole.idRol : '',
        tipoDocumento: 'Cédula de Ciudadanía',
        estado: true,
        nombre: '', apellido: '', correo: '', telefono: '',
        numeroDocumento: '', fechaNacimiento: '', direccion: '',
        contrasena: '', confirmarContrasena: ''
      });
      setIsCrearModalOpen(true);
    } else if (type === "edit" && usuario) {
      try {
        setIsLoadingPage(true);
        const fullUserData = await getUsuarioByIdAPI(usuario.idUsuario);
        setCurrentUsuario(fullUserData);
        setFormData({
          ...fullUserData,
          fechaNacimiento: fullUserData.fechaNacimiento
            ? fullUserData.fechaNacimiento.split("T")[0]
            : "",
        });
        setIsEditarModalOpen(true);
      } catch (err) {
        setErrorPage(err.message || "No se pudieron cargar los datos del usuario.");
      } finally {
        setIsLoadingPage(false);
      }
    } else if (type === "delete" && usuario) {
      setUsuarioToDelete(usuario);
      setIsConfirmDeleteModalOpen(true);
    }
  }, [availableRoles]);

  const handleSaveUsuario = useCallback(async () => {
    const formType = formData.idUsuario ? "edit" : "create";
    const validationErrors = runAllValidations(formData, formType);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    if (!isFormValid) return;

    setIsSubmitting(true);
    try {
      const dataParaAPI = { ...formData };
      delete dataParaAPI.confirmarContrasena;

      const successMessage = formData.idUsuario
        ? `El usuario ${dataParaAPI.correo} ha sido actualizado.`
        : `El usuario ${dataParaAPI.correo} ha sido creado exitosamente.`;

      if (formData.idUsuario) {
        await updateUsuarioAPI(formData.idUsuario, dataParaAPI);
      } else {
        await createUsuarioAPI(dataParaAPI);
      }
      await cargarDatos();
      closeModal();
      setValidationMessage(successMessage);
      setIsValidationModalOpen(true);
    } catch (err) {
      const apiErrorMessage = err.response?.data?.message || err.message || "Error al guardar el usuario.";
      setValidationMessage(apiErrorMessage);
      setIsValidationModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, isFormValid, runAllValidations, cargarDatos, closeModal]);

  const handleConfirmDeleteUsuario = useCallback(async () => {
    if (!usuarioToDelete?.idUsuario) return;
    setIsSubmitting(true);
    try {
      await eliminarUsuarioFisicoAPI(usuarioToDelete.idUsuario);
      closeModal();
      await cargarDatos();
      setValidationMessage(`El usuario "${usuarioToDelete.correo}" fue eliminado permanentemente.`);
      setIsValidationModalOpen(true);
    } catch (err) {
      setValidationMessage(err.message || "Error al eliminar permanentemente el usuario.");
      setIsValidationModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [usuarioToDelete, cargarDatos, closeModal]);

  const handleToggleEstadoUsuario = useCallback(async (usuarioToToggle) => {
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
    const timerId = setTimeout(() => setSearchTerm(inputValue.trim()), 500);
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
        const estadoString = typeof u.estado === "boolean" ? (u.estado ? "activo" : "inactivo") : "";
        return (
          perfil.nombre?.toLowerCase().includes(lowerSearchTerm) ||
          perfil.apellido?.toLowerCase().includes(lowerSearchTerm) ||
          u.correo?.toLowerCase().includes(lowerSearchTerm) ||
          perfil.numeroDocumento?.toLowerCase().includes(lowerSearchTerm) ||
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
    errorPage,
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    isConfirmDeleteModalOpen,
    isValidationModalOpen,
    validationMessage,
    formData,
    formErrors,
    isFormValid,
    isVerifyingEmail,
    isSubmitting,
    handleInputChange,
    handleInputBlur,
    handleSaveUsuario,
    handleConfirmDeleteUsuario,
    handleToggleEstadoUsuario,
    closeModal,
    handleOpenModal,
    inputValue,
    setInputValue,
    filterEstado,
    setFilterEstado,
    currentPage,
    usersPerPage,
    paginate,
    checkRequiresProfile,
    requiresProfile: checkRequiresProfile(formData.idRol),
  };
};

export default useUsuarios;