// src/features/usuarios/hooks/useUsuarios.js
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getUsuariosAPI,
  createUsuarioAPI,
  updateUsuarioAPI,
  toggleUsuarioEstadoAPI,
  getRolesAPI,
  verificarCorreoAPI,
} from "../services/usuariosService";

const CAMPOS_PERFIL = [
  "nombre",
  "apellido",
  "tipoDocumento",
  "numeroDocumento",
  "telefono",
  "fechaNacimiento",
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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});

  const getRoleById = useCallback((roleId) => {
    return availableRoles.find((r) => r.idRol === parseInt(roleId));
  }, [availableRoles]);

  const checkRequiresProfile = useCallback((roleId) => {
    const selectedRoleObj = getRoleById(roleId);
    return selectedRoleObj && (selectedRoleObj.tipoPerfil === "CLIENTE" || selectedRoleObj.tipoPerfil === "EMPLEADO");
  }, [getRoleById]);

  const validateField = useCallback(
    (name, value, currentData, formType = "create") => {
      let error = "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{7,15}$/;
      const docRegex = /^\d{5,20}$/;

      const requiresProfile = checkRequiresProfile(currentData.idRol);

      switch (name) {
        case "correo":
          if (!value) error = "El correo es requerido.";
          else if (!emailRegex.test(value)) error = "Formato de correo inválido.";
          break;
        case "idRol":
          if (!value) error = "El rol es requerido.";
          break;
        case "contrasena":
          if (formType === "create" && !value) error = "La contraseña es requerida.";
          else if (formType === "create" && value && value.length < 8) error = "La contraseña debe tener al menos 8 caracteres.";
          break;
        case "confirmarContrasena":
          if (formType === "create" && !value) error = "Debe confirmar la contraseña.";
          else if (formType === "create" && value !== currentData.contrasena) error = "Las contraseñas no coinciden.";
          break;
        case "nombre":
          if (requiresProfile && !value) error = "El nombre es requerido.";
          else if (requiresProfile && value && (value.length < 2 || value.length > 100)) error = "El nombre debe tener entre 2 y 100 caracteres.";
          break;
        case "apellido":
          if (requiresProfile && !value) error = "El apellido es requerido.";
          else if (requiresProfile && value && (value.length < 2 || value.length > 100)) error = "El apellido debe tener entre 2 y 100 caracteres.";
          break;
        case "tipoDocumento":
          if (requiresProfile && !value) error = "El tipo de documento es requerido.";
          // Adicional: Validar contra lista de tipos permitidos si es necesario
          const tiposValidos = ['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de Identidad'];
          if (requiresProfile && value && !tiposValidos.includes(value)) error = "Tipo de documento inválido.";
          break;
        case "numeroDocumento":
          if (requiresProfile && !value) error = "El número de documento es requerido.";
          else if (requiresProfile && value && !docRegex.test(value)) error = "Inválido (solo números, 5-20 dígitos).";
          break;
        case "telefono":
          if (requiresProfile && !value) error = "El teléfono es requerido.";
          else if (requiresProfile && value && !phoneRegex.test(value)) error = "Inválido (solo números, 7-15 dígitos).";
          break;
        case "fechaNacimiento":
          if (requiresProfile && !value) error = "La fecha de nacimiento es requerida.";
          else if (requiresProfile && value) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const inputDate = new Date(value);
            if (inputDate > today) error = "La fecha de nacimiento no puede ser futura.";
          }
          break;
        default:
          break;
      }
      return error;
    },
    [checkRequiresProfile]
  );

  const runValidations = useCallback(
    (dataToValidate, formType) => {
      const errors = {};
      let isValid = true;
      const fieldsToValidate = ["correo", "idRol"];
      if (formType === "create") {
        fieldsToValidate.push("contrasena", "confirmarContrasena");
      }

      const requiresProfile = checkRequiresProfile(dataToValidate.idRol);
      if (requiresProfile) {
        fieldsToValidate.push(...CAMPOS_PERFIL);
      }

      fieldsToValidate.forEach((field) => {
        // Solo validar campos que existen en dataToValidate o son siempre requeridos
        if (dataToValidate.hasOwnProperty(field) || ["correo", "idRol", "contrasena", "confirmarContrasena"].includes(field)) {
            const error = validateField(field, dataToValidate[field], dataToValidate, formType);
            if (error) {
                errors[field] = error;
                isValid = false;
            }
        }
      });

      // Mantener error de unicidad de correo si existe y no hay error de formato/requerido
      if (formErrors.correo === "Este correo ya está registrado." && !errors.correo) {
        errors.correo = formErrors.correo;
        isValid = false;
      }
      // Mantener error de unicidad de documento si existe y no hay error de formato/requerido
      if (formErrors.numeroDocumento === "Este número de documento ya está registrado." && !errors.numeroDocumento && requiresProfile) {
        errors.numeroDocumento = formErrors.numeroDocumento;
        isValid = false;
      }

      return { errors, isValid };
    },
    [validateField, checkRequiresProfile, formErrors.correo, formErrors.numeroDocumento]
  );

  useEffect(() => {
    if (Object.keys(formData).length === 0 && !isCrearModalOpen && !isEditarModalOpen) {
        setIsFormValid(false);
        setFormErrors({});
        return;
    }

    if (!isVerifyingEmail) {
        const formType = formData.idUsuario ? "edit" : "create";
        const { errors, isValid } = runValidations(formData, formType);

        // Si el rol no requiere perfil, limpiar errores de campos de perfil
        if (!checkRequiresProfile(formData.idRol)) {
            CAMPOS_PERFIL.forEach(field => {
                if (errors[field]) delete errors[field];
            });
            // Recalcular isValid después de limpiar errores de perfil,
            // pero también considerando errores de unicidad persistentes (correo/documento)
            // que no se limpian automáticamente al cambiar de rol.
            const newIsValid = Object.keys(errors).length === 0;
             setFormErrors(errors); // 'errors' ya tiene los campos de perfil eliminados
             setIsFormValid(newIsValid &&
                            (formErrors.correo !== "Este correo ya está registrado.") &&
                            (formErrors.numeroDocumento !== "Este número de documento ya está registrado."));

        } else {
            setFormErrors(errors);
            setIsFormValid(isValid);
        }
    }
  }, [formData, runValidations, isVerifyingEmail, checkRequiresProfile, isCrearModalOpen, isEditarModalOpen, formErrors.correo, formErrors.numeroDocumento]);


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
      setUsuarios([]);
      setAvailableRoles([]);
    } finally {
      setIsLoadingPage(false);
    }
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const closeModal = useCallback(() => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsValidationModalOpen(false);
    setCurrentUsuario(null);
    setValidationMessage("");
    setFormData({});
    setFormErrors({});
    setIsFormValid(false);
    setIsVerifyingEmail(false);
    setTouchedFields({});
  }, []);

  const handleOpenModal = useCallback(
    (type, usuario = null) => {
      const rolNombre = usuario?.rol?.nombre;
      if (rolNombre === "Administrador" && (type === "edit" || type === "delete")) {
        setValidationMessage(`El usuario 'Administrador' no puede ser ${type === "edit" ? "editado" : "eliminado/desactivado"}.`);
        setIsValidationModalOpen(true);
        return;
      }

      setFormErrors({});
      setIsVerifyingEmail(false);
      setTouchedFields({});
      setCurrentUsuario(usuario);

      let initialFormData = {};
      if (type === "create") {
        const defaultRole = availableRoles.find((r) => r.nombre === "Cliente") || (availableRoles.length > 0 ? availableRoles[0] : null);
        initialFormData = {
          estado: true,
          idRol: defaultRole ? defaultRole.idRol : "",
          nombre: "", apellido: "", tipoDocumento: "Cédula de Ciudadanía", numeroDocumento: "",
          correo: "", telefono: "", fechaNacimiento: "", contrasena: "", confirmarContrasena: "",
        };
        setIsCrearModalOpen(true);
      } else if (type === "edit" && usuario) {
        const perfil = usuario.clienteInfo || usuario.empleadoInfo || {};
        initialFormData = {
          idUsuario: usuario.idUsuario,
          correo: usuario.correo || "",
          idRol: usuario.rol?.idRol || "",
          nombre: perfil.nombre || "",
          apellido: perfil.apellido || "",
          tipoDocumento: perfil.tipoDocumento || "Cédula de Ciudadanía",
          numeroDocumento: perfil.numeroDocumento || "",
          telefono: perfil.telefono || "",
          fechaNacimiento: perfil.fechaNacimiento ? perfil.fechaNacimiento.split("T")[0] : "",
          estado: typeof usuario.estado === "boolean" ? usuario.estado : true,
        };
        setIsEditarModalOpen(true);
      } else if (type === "details") {
        setIsDetailsModalOpen(true);
      } else if (type === "delete") {
        setIsDeleteModalOpen(true);
      }

      setFormData(initialFormData);
      // La validez y errores iniciales se manejarán por el useEffect que observa formData
    },
    [availableRoles]
  );

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;

    setFormData((prev) => {
        const newFormData = { ...prev, [name]: val };
        // Si se cambia el rol, limpiar errores de campos de perfil si el nuevo rol no los requiere
        if (name === "idRol") {
            const requiresProfileNewRole = checkRequiresProfile(val);
            if (!requiresProfileNewRole) {
                const newErrors = { ...formErrors };
                CAMPOS_PERFIL.forEach(field => {
                    if (newErrors[field]) delete newErrors[field];
                });
                setFormErrors(newErrors); // Actualiza errores inmediatamente
            }
        }
        return newFormData;
    });
    // La validación general y de campo se actualiza en el useEffect y onBlur respectivamente
  }, [checkRequiresProfile, formErrors]);

  const handleInputBlur = useCallback(
    async (e) => {
      const { name, value } = e.target;
      setTouchedFields((prev) => ({ ...prev, [name]: true }));

      const formType = formData.idUsuario ? "edit" : "create";
      const error = validateField(name, value, formData, formType);
      setFormErrors((prevErrors) => ({ ...prevErrors, [name]: error }));

      if (name === "correo" && !error && value) {
        const originalEmail = formType === "edit" && currentUsuario ? currentUsuario.correo : null;
        if (value !== originalEmail) {
          setIsVerifyingEmail(true);
          try {
            const response = await verificarCorreoAPI(value);
            if (response.estaEnUso) {
              setFormErrors((prevErrors) => ({ ...prevErrors, correo: "Este correo ya está registrado." }));
            } else {
              setFormErrors((prevErrors) => ({ ...prevErrors, correo: error || "" }));
            }
          } catch (apiError) {
            console.error("Error verificando correo:", apiError);
            setFormErrors((prevErrors) => ({ ...prevErrors, correo: "No se pudo verificar el correo." }));
          } finally {
            setIsVerifyingEmail(false);
          }
        } else if (value === originalEmail && formErrors.correo === "Este correo ya está registrado.") {
          setFormErrors((prevErrors) => ({ ...prevErrors, correo: error || "" }));
        }
      }
      // TODO: Implementar verificación de unicidad para numeroDocumento si es necesario
      // Similar a la verificación de correo, pero considerando el tipo de perfil.
      // Esto requeriría un nuevo endpoint en el backend o modificar el existente.
    },
    [formData, validateField, currentUsuario, formErrors.correo]
  );

  const handleSaveUsuario = useCallback(async () => {
    const formType = formData.idUsuario ? "edit" : "create";
    const { errors: currentFormErrors, isValid: currentFormIsValid } = runValidations(formData, formType);

    // Actualizar errores y touchedFields para mostrar todos los errores si el form no es válido
    if (!currentFormIsValid) {
        setFormErrors(currentFormErrors);
        const allTouched = Object.keys(formData).reduce((acc, key) => {
            acc[key] = true; // Marcar todos los campos como tocados para mostrar errores
            return acc;
        }, {});
        setTouchedFields(allTouched);
        setValidationMessage("Por favor, corrija los errores en el formulario.");
        setIsValidationModalOpen(true);
        return;
    }

    setIsSubmitting(true);
    try {
      const dataParaAPI = { ...formData };
      if ("confirmarContrasena" in dataParaAPI) delete dataParaAPI.confirmarContrasena;

      const requiresProfile = checkRequiresProfile(dataParaAPI.idRol);
      if (!requiresProfile) {
        CAMPOS_PERFIL.forEach((field) => delete dataParaAPI[field]);
      }

      if (dataParaAPI.idUsuario) {
        await updateUsuarioAPI(dataParaAPI.idUsuario, dataParaAPI);
        setValidationMessage("Usuario actualizado exitosamente.");
      } else {
        await createUsuarioAPI(dataParaAPI);
        setValidationMessage("Usuario creado exitosamente.");
      }
      closeModal();
      await cargarDatos();
      setIsValidationModalOpen(true);
    } catch (err) {
      const apiErrorMessage = err.response?.data?.message || err.message || "Error al guardar el usuario.";
      // Si el error es de unicidad de correo o documento desde el backend, actualizar formErrors
      if (apiErrorMessage.toLowerCase().includes("correo") && apiErrorMessage.toLowerCase().includes("registrado")) {
          setFormErrors(prev => ({...prev, correo: "Este correo ya está registrado."}));
      } else if (apiErrorMessage.toLowerCase().includes("documento") && apiErrorMessage.toLowerCase().includes("registrado")) {
          setFormErrors(prev => ({...prev, numeroDocumento: "Este número de documento ya está registrado."}));
      }
      setValidationMessage(apiErrorMessage);
      setIsValidationModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, runValidations, closeModal, cargarDatos, checkRequiresProfile]);

  const handleConfirmDesactivarUsuario = useCallback(async () => {
    if (!currentUsuario?.idUsuario) return;
    if (currentUsuario.rol?.nombre === "Administrador") {
      setValidationMessage("El usuario 'Administrador' no puede ser desactivado.");
      setIsValidationModalOpen(true);
      closeModal();
      return;
    }
    setIsSubmitting(true);
    try {
      await toggleUsuarioEstadoAPI(currentUsuario.idUsuario, false);
      setValidationMessage(`Usuario "${currentUsuario?.clienteInfo?.nombre || currentUsuario?.empleadoInfo?.nombre || currentUsuario?.correo}" desactivado.`);
      closeModal();
      await cargarDatos();
      setIsValidationModalOpen(true);
    } catch (err) {
      setValidationMessage(err.message || "Error al desactivar el usuario.");
      setIsValidationModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentUsuario, cargarDatos, closeModal]);

  const handleToggleEstadoUsuario = useCallback(
    async (usuarioToToggle) => {
      if (!usuarioToToggle?.idUsuario) return;
      if (usuarioToToggle.rol?.nombre === "Administrador") {
        setValidationMessage("El estado del usuario 'Administrador' no puede ser modificado.");
        setIsValidationModalOpen(true);
        return;
      }
      try {
        const nuevoEstado = !usuarioToToggle.estado;
        await toggleUsuarioEstadoAPI(usuarioToToggle.idUsuario, nuevoEstado);
        await cargarDatos();
      } catch (err) {
        setValidationMessage(err.message || "Error al cambiar el estado del usuario.");
        setIsValidationModalOpen(true);
      }
    },
    [cargarDatos]
  );

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
        return (
          perfil.nombre?.toLowerCase().includes(lowerSearchTerm) ||
          perfil.apellido?.toLowerCase().includes(lowerSearchTerm) ||
          u.correo?.toLowerCase().includes(lowerSearchTerm) ||
          perfil.numeroDocumento?.includes(searchTerm) ||
          u.rol?.nombre?.toLowerCase().includes(lowerSearchTerm)
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
    availableRoles, isLoadingPage, isSubmitting, errorPage, currentUsuario,
    isCrearModalOpen, isEditarModalOpen, isDetailsModalOpen, isDeleteModalOpen,
    isValidationModalOpen, validationMessage,
    inputValue, setInputValue, filterEstado, setFilterEstado,
    currentPage, usersPerPage, paginate,
    closeModal, handleOpenModal, handleSaveUsuario, handleConfirmDesactivarUsuario, handleToggleEstadoUsuario,
    formData, formErrors, isFormValid, isVerifyingEmail,
    handleInputChange, handleInputBlur, touchedFields,
    // Exponer para que el formulario sepa si debe mostrar campos de perfil
    requiresProfile: checkRequiresProfile(formData.idRol)
  };
};

export default useUsuarios;
