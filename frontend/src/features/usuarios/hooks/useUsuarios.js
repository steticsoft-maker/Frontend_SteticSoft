// --- IMPORTS ---
import { useState, useEffect, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  getUsuariosAPI,
  createUsuarioAPI,
  updateUsuarioAPI,
  toggleUsuarioEstadoAPI,
  getRolesAPI,
  verificarCorreoAPI,
  eliminarUsuarioFisicoAPI,
  getUsuarioByIdAPI,
} from "../services/usuariosService";

// --- CONSTANTES DE VALIDACIÓN ---
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const numericOnlyRegex = /^\d+$/;
const alphanumericRegex = /^[a-zA-Z0-9]+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const addressRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.,#\-_]+$/;

const MySwal = withReactContent(Swal);

const useUsuarios = () => {
  // --- ESTADOS PRINCIPALES ---
  const [usuarios, setUsuarios] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [errorPage, setErrorPage] = useState(null);
  const [currentUsuario, setCurrentUsuario] = useState(null);

  // --- ESTADOS DE MODALES Y ACCIONES ---
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // --- ESTADOS DEL FORMULARIO ---
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- ESTADOS DE FILTRO Y PAGINACIÓN ---
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  // --- FUNCIONES DE CARGA DE DATOS ---
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

  // --- VALIDACIÓN DE FORMULARIO ---
  const getRoleById = useCallback(
    (roleId) => {
      const role = availableRoles.find((r) => r.idRol === parseInt(roleId, 10));
      return role;
    },
    [availableRoles]
  );

  const checkRequiresProfile = useCallback(
    (roleId) => {
      const selectedRole = getRoleById(roleId);
      const result =
        selectedRole &&
        (selectedRole.tipoPerfil === "CLIENTE" ||
          selectedRole.tipoPerfil === "EMPLEADO");
      return result;
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
          else if (value && !nameRegex.test(value))
            error = `El ${name} solo puede contener letras y espacios.`;
          else if (value && (value.length < 2 || value.length > 100))
            error = `Debe tener entre 2 y 100 caracteres.`;
          break;
        case "numeroDocumento":
          if (requiresProfile && !value) {
            error = "El número de documento es requerido.";
          } else if (value) {
            const docType = currentData.tipoDocumento;
            if (
              docType === "Cédula de Ciudadanía" ||
              docType === "Tarjeta de Identidad" ||
              docType === "Cédula de Extranjería"
            ) {
              if (!numericOnlyRegex.test(value)) {
                error = "Para este tipo de documento, ingrese solo números.";
              }
            } else if (docType === "Pasaporte") {
              if (!alphanumericRegex.test(value)) {
                error = "Para Pasaporte, ingrese solo letras y números.";
              }
            }
            if (!error && (value.length < 5 || value.length > 20)) {
              error = "Debe tener entre 5 y 20 caracteres.";
            }
          }
          break;
        case "telefono":
          if (requiresProfile && !value) error = "El teléfono es requerido.";
          else if (value && !numericOnlyRegex.test(value))
            error = "El teléfono solo debe contener números.";
          else if (value && (value.length < 7 || value.length > 15))
            error = "Debe tener entre 7 y 15 dígitos.";
          break;
        case "fechaNacimiento":
          if (requiresProfile && !value) {
            error = "La fecha de nacimiento es requerida.";
          } else if (value) {
            const birthDate = new Date(`${value}T00:00:00`);
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            if (isNaN(birthDate.getTime())) {
              error = "La fecha ingresada no es válida.";
            } else if (birthDate > today) {
              error = "La fecha de nacimiento no puede ser una fecha futura.";
            } else {
              let age = today.getFullYear() - birthDate.getFullYear();
              const m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
              }
              if (age < 18) {
                error = "El usuario debe ser mayor de 18 años.";
              }
            }
          }
          break;
        case "direccion":
          if (selectedRole && selectedRole.tipoPerfil === "CLIENTE" && !value) {
            error = "La dirección es requerida para clientes.";
          } else if (value && !addressRegex.test(value)) {
            error = "La dirección contiene caracteres no permitidos.";
          } else if (value && (value.length < 5 || value.length > 255)) {
            error = "La dirección debe tener entre 5 y 255 caracteres.";
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
        "correo",
        "idRol",
        "nombre",
        "apellido",
        "tipoDocumento",
        "numeroDocumento",
        "telefono",
        "fechaNacimiento",
        "direccion",
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
    const isValid =
      Object.keys(combinedErrors).length === 0 && !isVerifyingEmail;
    setIsFormValid(isValid);
  }, [
    formData,
    runAllValidations,
    isCrearModalOpen,
    isEditarModalOpen,
    isVerifyingEmail,
    formErrors.correo,
  ]);

  // --- HANDLERS DE FORMULARIO ---
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  }, []);

  const handleInputBlur = useCallback(
    async (e) => {
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
    },
    [formData, validateField, currentUsuario, isEditarModalOpen]
  );

  // --- HANDLERS DE MODALES ---
  const closeModal = useCallback(() => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setCurrentUsuario(null);
    setFormData({});
    setFormErrors({});
  }, []);

  const handleConfirmDeleteUsuario = useCallback(async (usuarioToDelete) => {
    if (!usuarioToDelete?.idUsuario) return;
    setIsSubmitting(true);
    try {
      await eliminarUsuarioFisicoAPI(usuarioToDelete.idUsuario);
      await cargarDatos();
      MySwal.fire(
        "¡Eliminado!",
        `El usuario "${usuarioToDelete.correo}" ha sido eliminado permanentemente.`,
        "success"
      );
    } catch (err) {
      MySwal.fire(
        "Error",
        err.message || "Error al eliminar permanentemente el usuario.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [cargarDatos]);

  const handleOpenModal = useCallback(
    async (type, usuario = null) => {
      setFormErrors({});
      if (type === "create") {
        const defaultRole =
          availableRoles.find((r) => r.nombre === "Cliente") ||
          availableRoles[0] ||
          null;
        setFormData({
          idRol: defaultRole ? defaultRole.idRol : "",
          tipoDocumento: "Cédula de Ciudadanía",
          estado: true,
          nombre: "",
          apellido: "",
          correo: "",
          telefono: "",
          numeroDocumento: "",
          fechaNacimiento: "",
          direccion: "",
          contrasena: "",
          confirmarContrasena: "",
        });
        setIsCrearModalOpen(true);
      } else if (type === "edit" && usuario) {
        try {
          setIsLoadingPage(true);
          const fullUserData = await getUsuarioByIdAPI(usuario.idUsuario);
          setCurrentUsuario(fullUserData);

          const perfil =
            fullUserData.clienteInfo || fullUserData.empleado || {};

          const initialFormData = {
            idUsuario: fullUserData.idUsuario,
            correo: fullUserData.correo,
            idRol: fullUserData.idRol,
            estado: fullUserData.estado,
            nombre: perfil.nombre || "",
            apellido: perfil.apellido || "",
            tipoDocumento: perfil.tipoDocumento || "Cédula de Ciudadanía",
            numeroDocumento: perfil.numeroDocumento || "",
            telefono: perfil.telefono || "",
            direccion: perfil.direccion || "",
            fechaNacimiento: perfil.fechaNacimiento
              ? perfil.fechaNacimiento.split("T")[0]
              : "",
          };

          setFormData(initialFormData);
          setIsEditarModalOpen(true);
        } catch (err) {
          setErrorPage(
            err.message || "No se pudieron cargar los datos del usuario."
          );
        } finally {
          setIsLoadingPage(false);
        }
      } else if (type === "details" && usuario) {
        // --- INICIO DE LA CORRECCIÓN ---
        // Se añade un indicador de carga mientras se obtienen los datos completos.
        setIsSubmitting(true); 
        try {
          // Se llama a la API para obtener todos los detalles del usuario por su ID.
          const fullUserData = await getUsuarioByIdAPI(usuario.idUsuario);
          // Se guardan los datos completos en el estado.
          setCurrentUsuario(fullUserData);
          // Ahora sí, se abre el modal.
          setIsDetailsModalOpen(true);
        } catch (err) {
          setErrorPage(
            err.message || "No se pudieron cargar los detalles del usuario."
          );
        } finally {
          // Se desactiva el indicador de carga.
          setIsSubmitting(false);
        }
        // --- FIN DE LA CORRECCIÓN ---
      } else if (type === "delete" && usuario) {
        MySwal.fire({
          title: "¿Estás seguro?",
          html: `Deseas eliminar permanentemente al usuario "<strong>${usuario.correo}</strong>"? <br/>¡Esta acción no se puede deshacer!`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "Sí, ¡eliminar permanentemente!",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            handleConfirmDeleteUsuario(usuario);
          }
        });
      }
    },
    [availableRoles, handleConfirmDeleteUsuario] // Dependencia para roles disponibles
  );

  // --- HANDLERS DE ACCIONES DE USUARIO ---
  const handleSaveUsuario = useCallback(async () => {
    console.log("--- Iniciando guardado de usuario ---");
    console.log("1. Datos crudos del formulario (formData):", formData);

    const formType = formData.idUsuario ? "edit" : "create";
    const validationErrors = runAllValidations(formData, formType);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      // --- INICIO DE LA CORRECCIÓN ---
      // Se reestructura el objeto que se enviará a la API
      const selectedRole = getRoleById(formData.idRol);
      console.log("2. Rol seleccionado:", selectedRole);

      const needsProfile =
        selectedRole &&
        (selectedRole.tipoPerfil === "CLIENTE" ||
          selectedRole.tipoPerfil === "EMPLEADO");
      console.log("3. ¿Necesita perfil? (needsProfile):", needsProfile);

      // 1. Datos base de la cuenta de usuario
      const dataParaAPI = {
        correo: formData.correo,
        idRol: formData.idRol,
        estado: formData.estado,
      };

      // 2. Añadir contraseña solo si es un usuario nuevo
      if (formType === "create") {
        dataParaAPI.contrasena = formData.contrasena;
      }

      // 3. Si se requiere perfil, se recopilan los datos y se anidan
      if (needsProfile) {
        const profileData = {
          nombre: formData.nombre,
          apellido: formData.apellido,
          tipoDocumento: formData.tipoDocumento,
          numeroDocumento: formData.numeroDocumento,
          telefono: formData.telefono,
          fechaNacimiento: formData.fechaNacimiento,
        };

        // El campo 'direccion' solo se añade si el rol es 'CLIENTE'
        if (selectedRole.tipoPerfil === "CLIENTE") {
          profileData.direccion = formData.direccion;
          dataParaAPI.cliente = profileData;
        } else if (selectedRole.tipoPerfil === "EMPLEADO") {
          // Si es empleado, se anida bajo la clave 'empleado'
          dataParaAPI.empleado = profileData;
        }
      }
      // --- FIN DE LA CORRECCIÓN ---

      console.log("4. Datos finales para la API (dataParaAPI):", dataParaAPI);

      const successMessage = formData.idUsuario
        ? `El usuario ${formData.correo} ha sido actualizado.`
        : `El usuario ${formData.correo} ha sido creado exitosamente.`;

      if (formData.idUsuario) {
        console.log("Enviando actualización a la API...");
        await updateUsuarioAPI(formData.idUsuario, dataParaAPI);
      } else {
        console.log("Enviando creación a la API...");
        await createUsuarioAPI(dataParaAPI);
      }
      console.log("¡Operación en API exitosa!");
      await cargarDatos();
      closeModal();
      MySwal.fire({
        title: "¡Éxito!",
        text: successMessage,
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (err) {
      console.error("--- ERROR al guardar el usuario ---", err);
      const apiErrorMessage =
        err.response?.data?.message ||
        err.message ||
        "Error al guardar el usuario.";
      closeModal(); // Cerrar modal también en caso de error
      MySwal.fire({
        title: "Error",
        text: apiErrorMessage,
        icon: "error",
        confirmButtonText: "Ok",
      });
    } finally {
      console.log("--- Finalizando proceso de guardado ---");
      setIsSubmitting(false);
    }
  }, [
    formData,
    isFormValid,
    runAllValidations,
    cargarDatos,
    closeModal,
    getRoleById,
  ]);

  const handleToggleEstadoUsuario = useCallback(
    async (usuarioToToggle) => {
      try {
        const nuevoEstado = !usuarioToToggle.estado;
        await toggleUsuarioEstadoAPI(usuarioToToggle.idUsuario, nuevoEstado);
        await cargarDatos();
        MySwal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `El estado de "${
            usuarioToToggle.correo
          }" se cambió a ${nuevoEstado ? "Activo" : "Inactivo"}.`,
          showConfirmButton: false,
          timer: 3500,
          timerProgressBar: true,
        });
      } catch (err) {
        MySwal.fire({
          title: "Error",
          text: err.message || "Error al cambiar el estado del usuario.",
          icon: "error",
          confirmButtonText: "Ok",
        });
      }
    },
    [cargarDatos]
  );

  // --- FILTRO Y PAGINACIÓN ---
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
        const estadoString =
          typeof u.estado === "boolean"
            ? u.estado
              ? "activo"
              : "inactivo"
            : "";
        return (
          u.nombre?.toLowerCase().includes(lowerSearchTerm) ||
          u.apellido?.toLowerCase().includes(lowerSearchTerm) ||
          u.correo?.toLowerCase().includes(lowerSearchTerm) ||
          u.numeroDocumento?.toLowerCase().includes(lowerSearchTerm) ||
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
  const currentUsersForTable = processedUsuarios.slice(
    indexOfFirstUser,
    indexOfLastUser
  );
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // --- RETORNO DEL HOOK ---
  return {
    usuarios: currentUsersForTable,
    totalUsuariosFiltrados: processedUsuarios.length,
    currentUsuario, // Asegúrate de retornar currentUsuario para el modal de detalles
    availableRoles,
    isLoadingPage,
    errorPage,
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    formData,
    formErrors,
    isFormValid,
    isVerifyingEmail,
    isSubmitting,
    handleInputChange,
    handleInputBlur,
    handleSaveUsuario,
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
