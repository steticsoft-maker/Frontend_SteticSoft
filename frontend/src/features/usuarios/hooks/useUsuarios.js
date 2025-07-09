// src/features/usuarios/hooks/useUsuarios.js
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  getUsuariosAPI,
  createUsuarioAPI,
  updateUsuarioAPI,
  toggleUsuarioEstadoAPI,
  getRolesAPI,
  verificarCorreoAPI // Importar para validación de unicidad
} from '../services/usuariosService';

const useUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [isLoadingPage, setIsLoadingPage] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorPage, setErrorPage] = useState(null);
  const [currentUsuario, setCurrentUsuario] = useState(null);

  // --- Estados para Modales ---
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // Para confirmar desactivación
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  // --- Estados para Búsqueda y Filtrado (Requerimiento 3) ---
  const [inputValue, setInputValue] = useState(""); // Para el input de búsqueda inmediato
  const [searchTerm, setSearchTerm] = useState(""); // Para el término de búsqueda "debounced"
  const [filterEstado, setFilterEstado] = useState("todos"); // 'todos', 'activos', 'inactivos'

  // --- Estados para la Paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10); // Podría ser configurable

  // --- Estados para Validaciones de Formulario (Requerimiento 4) ---
  const [formData, setFormData] = useState({}); // Datos del formulario de creación/edición
  const [formErrors, setFormErrors] = useState({}); // Errores de validación del formulario
  const [isFormValid, setIsFormValid] = useState(false); // Estado general de validez del formulario
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false); // Para la validación de unicidad del correo
  const [touchedFields, setTouchedFields] = useState({}); // Para controlar qué campos han sido "tocados" (onBlur)

  // --- Funciones de Validación (Requerimiento 4) ---
  const validateField = useCallback((name, value, currentFormData, formType = 'create') => { // eslint-disable-line no-unused-vars
    let error = '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d{7,15}$/; // Teléfono entre 7 y 15 dígitos
    const docRegex = /^\d{5,20}$/; // Documento entre 5 y 20 dígitos

    // Campos de perfil según el rol
    const selectedRoleObj = availableRoles.find(r => r.idRol === parseInt(currentFormData.idRol));
    // Usar tipoPerfil para determinar si se requieren campos de perfil
    const requiresProfile = selectedRoleObj && (selectedRoleObj.tipoPerfil === 'CLIENTE' || selectedRoleObj.tipoPerfil === 'EMPLEADO');

    switch (name) {
      case 'correo':
        if (!value) error = 'El correo es requerido.';
        else if (!emailRegex.test(value)) error = 'Formato de correo inválido.';
        break;
      case 'idRol':
        if (!value) error = 'El rol es requerido.';
        break;
      case 'contrasena':
        if (formType === 'create' && !value) error = 'La contraseña es requerida.';
        else if (formType === 'create' && value && value.length < 8) error = 'La contraseña debe tener al menos 8 caracteres.';
        break;
      case 'confirmarContrasena':
        if (formType === 'create' && !value) error = 'Debe confirmar la contraseña.';
        else if (formType === 'create' && value !== currentFormData.contrasena) error = 'Las contraseñas no coinciden.';
        break;
      case 'nombre':
        if (requiresProfile && !value) error = 'El nombre es requerido.';
        break;
      case 'apellido':
        if (requiresProfile && !value) error = 'El apellido es requerido.';
        break;
      case 'tipoDocumento':
        if (requiresProfile && !value) error = 'El tipo de documento es requerido.';
        break;
      case 'numeroDocumento':
        if (requiresProfile && !value) error = 'El número de documento es requerido.';
        else if (requiresProfile && value && !docRegex.test(value)) error = 'Inválido (solo números, 5-20 dígitos).';
        break;
      case 'telefono':
        if (requiresProfile && !value) error = 'El teléfono es requerido.';
        else if (requiresProfile && value && !phoneRegex.test(value)) error = 'Inválido (solo números, 7-15 dígitos).';
        break;
      case 'fechaNacimiento':
        if (requiresProfile && !value) error = 'La fecha de nacimiento es requerida.';
        else if (requiresProfile && value) {
            const today = new Date();
            today.setHours(0,0,0,0); // Para comparar solo fechas
            const inputDate = new Date(value);
            if (inputDate > today) error = 'La fecha de nacimiento no puede ser futura.';
            // Podríamos añadir validación de edad mínima si fuera necesario.
        }
        break;
      default:
        break;
    }
    return error;
  }, [availableRoles]);

  const runValidations = useCallback((dataToValidate, formType) => {
    const errors = {};
    let isValid = true;
    const fieldsToValidate = ['correo', 'idRol'];
    if (formType === 'create') {
      fieldsToValidate.push('contrasena', 'confirmarContrasena');
    }

    const selectedRoleObj = availableRoles.find(r => r.idRol === parseInt(dataToValidate.idRol));
    // Usar tipoPerfil para determinar si se requieren campos de perfil
    const requiresProfile = selectedRoleObj && (selectedRoleObj.tipoPerfil === 'CLIENTE' || selectedRoleObj.tipoPerfil === 'EMPLEADO');

    if (requiresProfile) {
      fieldsToValidate.push('nombre', 'apellido', 'tipoDocumento', 'numeroDocumento', 'telefono', 'fechaNacimiento');
    }

    fieldsToValidate.forEach(field => {
      const error = validateField(field, dataToValidate[field], dataToValidate, formType);
      if (error) {
        errors[field] = error;
        isValid = false;
      }
    });

    // Mantener error de unicidad de correo si existe y no hay error de formato
    if (formErrors.correo === 'Este correo ya está registrado.' && !errors.correo) {
        errors.correo = formErrors.correo; // Mantener error de unicidad
        isValid = false;
    }


    return { errors, isValid };
  }, [validateField, availableRoles, formErrors.correo]); // Depender de formErrors.correo

   // Efecto para actualizar isFormValid cuando formErrors o formData cambian
   useEffect(() => {
    if (Object.keys(formData).length > 0 && !isVerifyingEmail) {
        const { errors, isValid: currentFieldsValid } = runValidations(formData, formData.idUsuario ? 'edit' : 'create');

        let finalIsValid = currentFieldsValid;
        let finalErrors = errors;

        // Si hay un error de unicidad de correo pendiente y no hay error de formato, mantenerlo.
        if (formErrors.correo === 'Este correo ya está registrado.' && !errors.correo) {
            finalErrors = { ...errors, correo: formErrors.correo };
            finalIsValid = false;
        }

        setFormErrors(finalErrors); // Actualizar errores con la última validación
        setIsFormValid(finalIsValid);
    } else if (Object.keys(formData).length === 0) {
        setIsFormValid(false);
        setFormErrors({});
    }
    // No depender de formErrors directamente aquí para evitar bucles si runValidations depende de formErrors.
    // La dependencia de formErrors.correo en runValidations ya maneja el caso de unicidad.
  }, [formData, runValidations, isVerifyingEmail, formErrors.correo]);


  const cargarDatos = useCallback(async () => {
    setIsLoadingPage(true);
    setErrorPage(null);
    try {
      const [usuariosData, rolesData] = await Promise.all([getUsuariosAPI(), getRolesAPI()]);
      // Con los cambios en el servicio, usuariosData y rolesData son directamente los arrays
      const filteredRoles = (rolesData || []).filter(rol => rol.nombre !== 'Administrador');

      setUsuarios(usuariosData || []);
      setAvailableRoles(filteredRoles);
    } catch (err) {
      setErrorPage(err.message || "No se pudieron cargar los datos de usuarios o roles.");
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
    setTouchedFields({}); // Resetear touchedFields al cerrar modal
  }, []);

  const handleOpenModal = useCallback((type, usuario = null) => {
    const rolNombre = usuario?.rol?.nombre;
    if (rolNombre === "Administrador" && (type === "edit" || type === "delete")) {
      setValidationMessage(`El usuario 'Administrador' no puede ser ${type === "edit" ? "editado" : "eliminado/desactivado"}.`);
      setIsValidationModalOpen(true);
      return;
    }

    setFormErrors({});
    setIsVerifyingEmail(false);
    setCurrentUsuario(usuario);

    let initialFormData = {};
    if (type === "create") {
      const defaultRole = availableRoles.find(r => r.nombre === 'Cliente') || (availableRoles.length > 0 ? availableRoles[0] : null);
      initialFormData = {
        estado: true,
        idRol: defaultRole ? defaultRole.idRol : '',
        nombre: '', apellido: '', tipoDocumento: 'Cédula de Ciudadanía', numeroDocumento: '',
        correo: '', telefono: '', fechaNacimiento: '', contrasena: '', confirmarContrasena: ''
      };
      setIsCrearModalOpen(true);
    } else if (type === "edit" && usuario) {
      const perfil = usuario.clienteInfo || usuario.empleadoInfo || {};
      initialFormData = {
        idUsuario: usuario.idUsuario,
        correo: usuario.correo || '',
        idRol: usuario.rol?.idRol || '',
        nombre: perfil.nombre || '',
        apellido: perfil.apellido || '',
        tipoDocumento: perfil.tipoDocumento || 'Cédula de Ciudadanía',
        numeroDocumento: perfil.numeroDocumento || '',
        telefono: perfil.telefono || '',
        fechaNacimiento: perfil.fechaNacimiento ? perfil.fechaNacimiento.split('T')[0] : '',
        estado: typeof usuario.estado === 'boolean' ? usuario.estado : true,
      };
      setIsEditarModalOpen(true);
    } else if (type === "details") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsDeleteModalOpen(true);
    }

    setFormData(initialFormData);
    // Inicializar touchedFields para todos los campos del formulario a false
    const initialTouched = Object.keys(initialFormData).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {});
    setTouchedFields(initialTouched);
    // La validez inicial la manejará el useEffect que observa formData y formErrors.
    // Al abrir, formErrors está vacío y touchedFields todo en false, por lo que no se mostrarán errores.
  }, [availableRoles]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;

    setFormData(prev => ({ ...prev, [name]: val }));

    // La validación del campo individual se hará en handleInputBlur o por el useEffect general.
    // Si se quiere validación onChange, se podría llamar a validateField aquí y actualizar formErrors.
    // Por ahora, nos enfocamos en onBlur para cumplir el requerimiento.
    // const error = validateField(name, val, { ...formData, [name]: val }, formData.idUsuario ? 'edit' : 'create');
    // setFormErrors(prevErrors => ({ ...prevErrors, [name]: error }));
  }, []); // No depender de formData aquí para evitar re-creaciones innecesarias de la función

  const handleInputBlur = useCallback(async (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({ ...prev, [name]: true })); // Marcar el campo como "tocado"

    const formType = formData.idUsuario ? 'edit' : 'create';
    const error = validateField(name, value, formData, formType);

    setFormErrors(prevErrors => ({ ...prevErrors, [name]: error }));

    if (name === 'correo' && !error && value) {
      const originalEmail = formType === 'edit' && currentUsuario ? currentUsuario.correo : null;
      if (value !== originalEmail) {
        setIsVerifyingEmail(true);
        try {
          const response = await verificarCorreoAPI(value); // response es { success: true, estaEnUso: boolean, message: "..." }
          if (response.estaEnUso) {
            setFormErrors(prevErrors => ({ ...prevErrors, correo: 'Este correo ya está registrado.' }));
          } else {
            // Correo disponible, solo mantener error de formato síncrono (variable 'error') si existe, sino limpiar.
            setFormErrors(prevErrors => ({ ...prevErrors, correo: error || '' }));
          }
        } catch (apiError) {
          console.error("Error verificando correo:", apiError);
          setFormErrors(prevErrors => ({ ...prevErrors, correo: 'No se pudo verificar el correo.' }));
        } finally {
          setIsVerifyingEmail(false);
        }
      } else if (value === originalEmail && formErrors.correo === 'Este correo ya está registrado.'){
        // Si el correo es el original y había un error de unicidad (quizás de un intento anterior de cambio), limpiarlo.
        setFormErrors(prevErrors => ({ ...prevErrors, correo: error || '' })); // También considerar el error de formato síncrono
      }
    }
  }, [formData, validateField, currentUsuario, formErrors.correo]);


  const handleSaveUsuario = useCallback(async () => {
    const formType = formData.idUsuario ? 'edit' : 'create';
    // Re-ejecutar todas las validaciones síncronas para asegurar el estado más reciente de los errores.
    // runValidations ya considera el formErrors.correo para la unicidad.
    const { errors: currentFormErrors, isValid: currentFormIsValid } = runValidations(formData, formType);

    setFormErrors(currentFormErrors); // Actualizar los errores con el resultado de runValidations

    // isFormValid se actualizará por el useEffect que depende de formErrors.
    // Sin embargo, para la lógica inmediata de esta función, usamos currentFormIsValid.
    if (!currentFormIsValid) {
      setValidationMessage("Por favor, corrija los errores en el formulario.");
      setIsValidationModalOpen(true);
      // Marcar todos los campos como tocados para mostrar todos los errores
      const allTouched = Object.keys(formData).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouchedFields(allTouched);
      return;
    }

    setIsSubmitting(true);
    try {
      const dataParaAPI = { ...formData };
      if ('confirmarContrasena' in dataParaAPI) {
        delete dataParaAPI.confirmarContrasena;
      }

      const selectedRoleObj = availableRoles.find(r => r.idRol === parseInt(dataParaAPI.idRol));
      // Usar tipoPerfil para determinar si se deben enviar/borrar campos de perfil
      const shouldHaveProfile = selectedRoleObj &&
                                (selectedRoleObj.tipoPerfil === 'CLIENTE' || selectedRoleObj.tipoPerfil === 'EMPLEADO');

      if (!shouldHaveProfile) {
        // Si el rol, según tipoPerfil, no requiere perfil, eliminar los campos de perfil.
        ['nombre', 'apellido', 'tipoDocumento', 'numeroDocumento', 'telefono', 'fechaNacimiento'].forEach(field => delete dataParaAPI[field]);
      }
      // Si shouldHaveProfile es true, los campos se envían tal como están en formData.
      // El backend (servicio crearUsuario) validará si los campos requeridos para ese perfil están presentes.

      if (dataParaAPI.idUsuario) {
        await updateUsuarioAPI(dataParaAPI.idUsuario, dataParaAPI);
        setValidationMessage("Usuario actualizado exitosamente.");
      } else {
        await createUsuarioAPI(dataParaAPI);
        setValidationMessage("Usuario creado exitosamente.");
      }
      closeModal(); // Esto resetea formData, formErrors, isFormValid
      await cargarDatos();
      setIsValidationModalOpen(true);
    } catch (err) {
      setValidationMessage(err.response?.data?.message || err.message || "Error al guardar el usuario.");
      setIsValidationModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [cargarDatos, closeModal, formData, runValidations, availableRoles, formErrors.correo]);

  const handleConfirmDesactivarUsuario = useCallback(async () => {
    if (!currentUsuario?.idUsuario) return;

    // Doble chequeo para el Admin, aunque handleOpenModal ya lo hace.
    if (currentUsuario.rol?.nombre === "Administrador") {
        setValidationMessage("El usuario 'Administrador' no puede ser desactivado.");
        setIsValidationModalOpen(true);
        closeModal(); // Cierra el modal de confirmación
        return;
    }

    setIsSubmitting(true);
    try {
      await toggleUsuarioEstadoAPI(currentUsuario.idUsuario, false); // false para desactivar
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

  const handleToggleEstadoUsuario = useCallback(async (usuarioToToggle) => {
    if (!usuarioToToggle?.idUsuario) return;
    if (usuarioToToggle.rol?.nombre === "Administrador") {
      setValidationMessage("El estado del usuario 'Administrador' no puede ser modificado.");
      setIsValidationModalOpen(true);
      return;
    }
    //setIsSubmitting(true); // Podría ser útil si hay feedback visual directo en la tabla
    try {
      const nuevoEstado = !usuarioToToggle.estado;
      await toggleUsuarioEstadoAPI(usuarioToToggle.idUsuario, nuevoEstado);
      // Optimista: actualizar UI localmente primero o simplemente recargar
      await cargarDatos();
      // setValidationMessage(`Estado de "${usuarioToToggle?.clienteInfo?.nombre || usuarioToToggle?.empleadoInfo?.nombre}" cambiado.`);
      // setIsValidationModalOpen(true); // Opcional: notificar cambio de estado
    } catch (err) {
      setValidationMessage(err.message || "Error al cambiar el estado del usuario.");
      setIsValidationModalOpen(true);
    } finally {
      // setIsSubmitting(false);
    }
  }, [cargarDatos]);

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
  const processedUsuarios = useMemo(() => {
    let filtered = usuarios;

    // Filtrado por estado (activo/inactivo)
    if (filterEstado !== "todos") {
      const isActive = filterEstado === "activos";
      filtered = filtered.filter(u => u.estado === isActive);
    }

    // Filtrado por término de búsqueda
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter(u => {
        const perfil = u.clienteInfo || u.empleadoInfo || {};
        return (
          perfil.nombre?.toLowerCase().includes(lowerSearchTerm) ||
          perfil.apellido?.toLowerCase().includes(lowerSearchTerm) ||
          u.correo?.toLowerCase().includes(lowerSearchTerm) ||
          perfil.numeroDocumento?.includes(searchTerm) || // Documento es sensible a mayúsculas? Asumamos que no.
          u.rol?.nombre?.toLowerCase().includes(lowerSearchTerm)
        );
      });
    }
    return filtered;
  }, [usuarios, searchTerm, filterEstado]);

  // Efecto para paginación cuando cambia el término de búsqueda o el filtro de estado
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterEstado]);

  // Lógica de Paginación
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsersForTable = processedUsuarios.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return {
    usuarios: currentUsersForTable, // Usuarios para la tabla (paginados y filtrados)
    totalUsuariosFiltrados: processedUsuarios.length, // Para el componente de paginación
    availableRoles,
    isLoadingPage,
    isSubmitting,
    errorPage,
    currentUsuario,
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    isDeleteModalOpen,
    isValidationModalOpen,
    validationMessage,
    inputValue, // Para el input de búsqueda
    setInputValue, // Para actualizar el valor del input inmediato
    filterEstado,
    setFilterEstado, // Exponer para el control de filtro
    currentPage,
    usersPerPage,
    paginate,
    closeModal,
    handleOpenModal,
    handleSaveUsuario,
    handleConfirmDesactivarUsuario,
    handleToggleEstadoUsuario,
    // Nuevos para el formulario y sus validaciones
    formData,
    // setFormData, // No exponer directamente, se maneja con handleInputChange
    formErrors,
    isFormValid,
    isVerifyingEmail,
    handleInputChange,
    handleInputBlur,
    touchedFields, // Exponer para que el formulario pueda decidir si muestra errores
  };
};

export default useUsuarios;
