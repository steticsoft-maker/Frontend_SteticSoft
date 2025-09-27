// frontend/src/features/clientes/hooks/useClientes.js
import { useState, useEffect, useCallback, useMemo } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import {
  fetchClientes,
  saveCliente,
  deleteClienteById,
  toggleClienteEstado,
  verificarCorreoClienteAPI,
  getClienteById,
} from "../services/clientesService";

// --- CONSTANTES DE VALIDACIÓN ---
const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
const numericOnlyRegex = /^\d+$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const addressRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ\s.,#\-_]+$/;

const MySwal = withReactContent(Swal);

const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCliente, setCurrentCliente] = useState(null);

  // Estados para modales
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  // Estados para búsqueda y filtrado
  const [inputValue, setInputValue] = useState(""); // Para el input de búsqueda inmediato
  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda con debounce
  const [filtroEstado, setFiltroEstado] = useState("todos"); // Para el filtro de estado

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // O hacerlo configurable

  // --- ESTADOS DEL FORMULARIO ---
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadClientes = useCallback(async (term) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchClientes(term); // fetchClientes ya maneja el filtrado backend
      if (Array.isArray(response)) {
        setClientes(response);
      } else {
        console.error("fetchClientes no devolvió un array:", response);
        setClientes([]);
        setError("Formato de datos de clientes inesperado.");
      }
    } catch (err) {
      setError(
        err.message ||
          "Error al cargar los clientes. Inténtalo de nuevo más tarde."
      );
      setClientes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Efecto para debounce de búsqueda
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500); // 500ms de debounce
    return () => clearTimeout(timerId);
  }, [inputValue]);

  // Efecto para cargar clientes cuando searchTerm cambia
  useEffect(() => {
    loadClientes(searchTerm);
  }, [searchTerm, loadClientes]);

  const closeModal = useCallback(() => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setCurrentCliente(null);
    setFormData({});
    setFormErrors({});
  }, []);

  // --- VALIDACIÓN DE FORMULARIO ---
  const validateField = useCallback(
    (name, value, currentData, formType = "create") => {
      let error = "";

      switch (name) {
        case "correo":
          if (!value) error = "El correo es obligatorio.";
          else if (!emailRegex.test(value))
            error = "Formato de correo inválido.";
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
          if (!value) error = `El ${name} es requerido.`;
          else if (value && !nameRegex.test(value))
            error = `El ${name} solo puede contener letras y espacios.`;
          else if (value && (value.length < 2 || value.length > 100))
            error = `Debe tener entre 2 y 100 caracteres.`;
          break;
        case "numeroDocumento":
          if (!value) {
            error = "El número de documento es requerido.";
          } else {
            const docType = currentData.tipoDocumento;
            if (
              docType === "Cedula de Ciudadania" ||
              docType === "Cedula de Extranjeria"
            ) {
              if (!numericOnlyRegex.test(value)) {
                error = "Para este tipo de documento, ingrese solo números.";
              }
            }
            if (!error && (value.length < 5 || value.length > 20)) {
              error = "Debe tener entre 5 y 20 caracteres.";
            }
          }
          break;
        case "telefono":
          if (!value) error = "El teléfono es requerido.";
          else if (value && !numericOnlyRegex.test(value))
            error = "El teléfono solo debe contener números.";
          else if (value && (value.length < 7 || value.length > 15))
            error = "Debe tener entre 7 y 15 dígitos.";
          break;
        case "fechaNacimiento":
          if (!value) {
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
                error = "El cliente debe ser mayor de 18 años.";
              }
            }
          }
          break;
        case "direccion":
          if (!value) {
            error = "La dirección es requerida para clientes.";
          } else if (value && !addressRegex.test(value)) {
            error = "La dirección contiene caracteres no permitidos.";
          } else if (value && (value.length < 5 || value.length > 255)) {
            error = "La dirección debe tener entre 5 y 255 caracteres.";
          }
          break;
        case "tipoDocumento":
          if (!value) {
            error = "El tipo de documento es requerido.";
          }
          break;
        default:
          break;
      }
      return error;
    },
    []
  );

  const runAllValidations = useCallback(
    (data, formType) => {
      const errors = {};
      const allFields = [
        "correo",
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
    const formType = formData.idCliente ? "edit" : "create";
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
      const formType = formData.idCliente ? "edit" : "create";
      const error = validateField(name, value, formData, formType);
      setFormErrors((prev) => ({ ...prev, [name]: error }));

      if (name === "correo" && !error && value) {
        const originalEmail = isEditarModalOpen ? currentCliente?.correo : null;
        if (value !== originalEmail) {
          setIsVerifyingEmail(true);
          try {
            // Pasar el ID del cliente actual si se está editando
            // Asegurar que sea un número entero positivo
            const idClienteExcluir =
              isEditarModalOpen && currentCliente?.idCliente
                ? parseInt(currentCliente.idCliente, 10)
                : null;
            const res = await verificarCorreoClienteAPI(
              value,
              idClienteExcluir
            );
            if (res.estaEnUso) {
              setFormErrors((prev) => ({
                ...prev,
                correo: "Este correo ya está registrado.",
              }));
            }
          } catch (apiError) {
            console.error("Error al verificar el correo:", apiError);
            // Solo mostrar error si es un error de validación (correo duplicado)
            if (
              apiError.message &&
              apiError.message.includes("ya está registrado")
            ) {
              setFormErrors((prev) => ({
                ...prev,
                correo: "Este correo ya está registrado.",
              }));
            }
            // Para otros errores (red, servidor), no mostrar error al usuario
          } finally {
            setIsVerifyingEmail(false);
          }
        }
      }
    },
    [formData, validateField, currentCliente, isEditarModalOpen]
  );

  const handleOpenModal = useCallback(async (type, cliente = null) => {
    setFormErrors({});
    if (type === "create") {
      setFormData({
        tipoDocumento: "Cedula de Ciudadania",
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
    } else if (type === "edit" && cliente) {
      try {
        setIsLoading(true);
        const fullClientData = await getClienteById(cliente.idCliente);
        setCurrentCliente(fullClientData);

        const initialFormData = {
          idCliente: fullClientData.idCliente,
          correo: fullClientData.correo,
          estado: fullClientData.estado,
          nombre: fullClientData.nombre || "",
          apellido: fullClientData.apellido || "",
          tipoDocumento: fullClientData.tipoDocumento || "Cedula de Ciudadania",
          numeroDocumento: fullClientData.numeroDocumento || "",
          telefono: fullClientData.telefono || "",
          direccion: fullClientData.direccion || "",
          fechaNacimiento: fullClientData.fechaNacimiento
            ? fullClientData.fechaNacimiento.split("T")[0]
            : "",
        };

        setFormData(initialFormData);
        setIsEditarModalOpen(true);
      } catch (err) {
        setError(err.message || "No se pudieron cargar los datos del cliente.");
      } finally {
        setIsLoading(false);
      }
    } else if (type === "details" && cliente) {
      setIsSubmitting(true);
      try {
        const fullClientData = await getClienteById(cliente.idCliente);
        setCurrentCliente(fullClientData);
        setIsDetailsModalOpen(true);
      } catch (err) {
        setError(
          err.message || "No se pudieron cargar los detalles del cliente."
        );
      } finally {
        setIsSubmitting(false);
      }
    }
  }, []);

  const handleSave = useCallback(async () => {
    const formType = formData.idCliente ? "edit" : "create";
    const validationErrors = runAllValidations(formData, formType);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }
    if (!isFormValid) {
      return;
    }

    // Verificar correo antes de guardar
    if (formData.correo) {
      const originalEmail = isEditarModalOpen ? currentCliente?.correo : null;
      if (formData.correo !== originalEmail) {
        setIsVerifyingEmail(true);
        try {
          // Pasar el ID del cliente actual si se está editando
          // Asegurar que sea un número entero positivo
          const idClienteExcluir =
            isEditarModalOpen && currentCliente?.idCliente
              ? parseInt(currentCliente.idCliente, 10)
              : null;
          const res = await verificarCorreoClienteAPI(
            formData.correo,
            idClienteExcluir
          );
          if (res.estaEnUso) {
            setFormErrors((prev) => ({
              ...prev,
              correo: "Este correo ya está registrado.",
            }));
            setIsVerifyingEmail(false);
            return;
          }
        } catch (apiError) {
          console.error("Error al verificar el correo:", apiError);
          // Solo mostrar error si es un error de validación (correo duplicado)
          if (
            apiError.message &&
            apiError.message.includes("ya está registrado")
          ) {
            setFormErrors((prev) => ({
              ...prev,
              correo: "Este correo ya está registrado.",
            }));
          } else {
            // Para errores de red/servidor, mostrar mensaje genérico
            MySwal.fire(
              "Error",
              "Error al verificar el correo. Inténtalo de nuevo.",
              "error"
            );
          }
          setIsVerifyingEmail(false);
          return;
        } finally {
          setIsVerifyingEmail(false);
        }
      }
    }

    setIsSubmitting(true);
    try {
      const dataParaAPI = { ...formData };
      delete dataParaAPI.confirmarContrasena;

      const successMessage = formData.idCliente
        ? `El cliente ${dataParaAPI.correo} ha sido actualizado.`
        : `El cliente ${dataParaAPI.correo} ha sido creado exitosamente.`;

      await saveCliente(dataParaAPI, !formData.idCliente, formData.idCliente);

      await loadClientes(searchTerm); // Recargar con el término de búsqueda actual
      closeModal();
      MySwal.fire("¡Éxito!", successMessage, "success");
    } catch (err) {
      // Manejar errores de validación del backend
      if (err.errors && typeof err.errors === "object") {
        // Si hay errores específicos por campo, mostrarlos
        const errorMessages = Object.values(err.errors).flat();
        MySwal.fire({
          title: "Errores de validación",
          html: `<div style="text-align: left;">
            <ul style="margin: 0; padding-left: 20px;">
              ${errorMessages.map((msg) => `<li>${msg}</li>`).join("")}
            </ul>
          </div>`,
          icon: "error",
          confirmButtonText: "Entendido",
        });

        // También actualizar los errores de campo específicos
        const fieldErrors = {};
        Object.keys(err.errors).forEach((field) => {
          fieldErrors[field] = err.errors[field][0]; // Tomar el primer error de cada campo
        });
        setFormErrors(fieldErrors);
      } else {
        // Error general
        const apiErrorMessage = err.message || "Error al guardar el cliente.";
        MySwal.fire("Error", apiErrorMessage, "error");
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [
    formData,
    isFormValid,
    runAllValidations,
    loadClientes,
    closeModal,
    searchTerm,
    isEditarModalOpen,
    currentCliente,
  ]);

  const handleDelete = useCallback(
    (cliente) => {
      MySwal.fire({
        title: "¿Estás seguro?",
        text: `¿Deseas eliminar al cliente "${cliente.nombre} ${cliente.apellido}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Sí, ¡eliminar!",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await deleteClienteById(cliente.idCliente);
            await loadClientes(searchTerm);
            MySwal.fire(
              "¡Eliminado!",
              "El cliente ha sido eliminado.",
              "success"
            );
          } catch (err) {
            MySwal.fire(
              "Error",
              err.message || "Ocurrió un error al eliminar el cliente.",
              "error"
            );
          }
        }
      });
    },
    [loadClientes, searchTerm]
  );

  // Function to handle delete action that can be called from outside
  const handleDeleteAction = useCallback(
    (cliente) => {
      handleDelete(cliente);
    },
    [handleDelete]
  );

  const handleToggleEstado = useCallback(
    async (clienteId) => {
      const clienteToToggle = clientes.find((c) => c.idCliente === clienteId);
      if (!clienteToToggle) {
        MySwal.fire(
          "Error",
          "Cliente no encontrado para cambiar estado.",
          "error"
        );
        return;
      }
      const nuevoEstado = !clienteToToggle.estado;
      try {
        await toggleClienteEstado(clienteId, nuevoEstado);
        await loadClientes(searchTerm);
        MySwal.fire({
          toast: true,
          position: "top-end",
          icon: "success",
          title: `Estado cambiado a ${nuevoEstado ? "Activo" : "Inactivo"}`,
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
        });
      } catch (err) {
        MySwal.fire(
          "Error",
          err.message || "Ocurrió un error al cambiar el estado del cliente.",
          "error"
        );
      }
    },
    [clientes, loadClientes, searchTerm]
  );

  // Lógica de filtrado y paginación
  const processedClientes = useMemo(() => {
    let clientesFiltrados = [...clientes];

    // Aplicar filtro por estado
    if (filtroEstado !== "todos") {
      const esActivo = filtroEstado === "activos";
      clientesFiltrados = clientesFiltrados.filter(
        (cliente) => cliente.estado === esActivo
      );
    }

    return clientesFiltrados;
  }, [clientes, filtroEstado]);

  const totalClientesFiltrados = processedClientes.length;

  const currentClientesForTable = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return processedClientes.slice(indexOfFirstItem, indexOfLastItem);
  }, [processedClientes, currentPage, itemsPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (totalClientesFiltrados > 0 && itemsPerPage > 0) {
      const totalPages = Math.ceil(totalClientesFiltrados / itemsPerPage);
      if (currentPage > totalPages) {
        setCurrentPage(1);
      }
    }
  }, [totalClientesFiltrados, itemsPerPage, currentPage]);

  return {
    clientes: currentClientesForTable,
    totalClientesFiltrados,
    isLoading,
    error,
    currentCliente,
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    inputValue,
    setInputValue,
    filtroEstado,
    setFiltroEstado,
    currentPage,
    itemsPerPage,
    paginate,
    closeModal,
    handleOpenModal,
    handleSave,
    handleDelete: handleDeleteAction,
    handleToggleEstado,
    formData,
    formErrors,
    isFormValid,
    isSubmitting,
    isVerifyingEmail,
    handleInputChange,
    handleInputBlur,
  };
};

export default useClientes;
