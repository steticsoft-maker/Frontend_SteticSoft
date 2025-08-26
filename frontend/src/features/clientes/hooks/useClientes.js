// frontend/src/features/clientes/hooks/useClientes.js
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchClientes,
  saveCliente,
  deleteClienteById,
  toggleClienteEstado,
  verificarDatosUnicos, // Import new function
} from "../services/clientesService";

const useClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentCliente, setCurrentCliente] = useState(null);

  // Estados para modales
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  // Estados para búsqueda y filtrado
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form state
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);
  const [touchedFields, setTouchedFields] = useState({});
  const [isVerifying, setIsVerifying] = useState(false);

  const loadClientes = useCallback(async (term) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchClientes(term);
      if (Array.isArray(response)) {
        setClientes(response);
      } else {
        setClientes([]);
        setError("Formato de datos de clientes inesperado.");
      }
    } catch (err) {
      setError(
        err.message || "Error al cargar los clientes. Inténtalo de nuevo más tarde."
      );
      setClientes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const validateField = useCallback(
    (name, value) => {
      let error = "";
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^\d{7,15}$/;
      const docRegex = /^\d{5,20}$/;

      switch (name) {
        case "nombre":
          if (!value) error = "El nombre es requerido.";
          else if (value.length > 100) error = "El nombre no puede exceder los 100 caracteres.";
          break;
        case "apellido":
          if (!value) error = "El apellido es requerido.";
          else if (value.length > 100) error = "El apellido no puede exceder los 100 caracteres.";
          break;
        case "correo":
          if (!value) error = "El correo es requerido.";
          else if (value.length > 100) error = "El correo no puede exceder los 100 caracteres.";
          else if (!emailRegex.test(value)) error = "Formato de correo inválido.";
          break;
        case "telefono":
          if (!value) error = "El teléfono es requerido.";
          else if (!phoneRegex.test(value)) error = "Inválido (solo números, 7-15 dígitos).";
          break;
        case "tipoDocumento":
          if (!value) error = "El tipo de documento es requerido.";
          break;
        case "numeroDocumento":
          if (!value) error = "El número de documento es requerido.";
          else if (!docRegex.test(value)) error = "Inválido (solo números, 5-20 dígitos).";
          break;
        case "fechaNacimiento":
          if (!value) error = "La fecha de nacimiento es requerida.";
          else {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const inputDate = new Date(value);
            if (inputDate > today) error = "La fecha de nacimiento no puede ser futura.";
          }
          break;
        case "direccion":
          if (!value) error = "La dirección es requerida.";
          break;
        case "contrasena":
          if (!value) {
            error = "La contraseña es requerida.";
          } else if (value.length < 8) {
            error = "La contraseña debe tener al menos 8 caracteres.";
          }
          break;
        default:
          break;
      }
      return error;
    },
    []
  );

  const runValidations = useCallback(
    (dataToValidate) => {
      const errors = {};
      let isValid = true;
      const fieldsToValidate = [
        "nombre", "apellido", "correo", "telefono", "tipoDocumento",
        "numeroDocumento", "fechaNacimiento", "direccion"
      ];

      if (!dataToValidate.idCliente) { // only for creation
          fieldsToValidate.push("contrasena");
      }

      fieldsToValidate.forEach((field) => {
        const error = validateField(field, dataToValidate[field]);
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      });

      for (const field of ['correo', 'numeroDocumento']) {
          if (formErrors[field]?.includes("ya está registrado")) {
              errors[field] = formErrors[field];
              isValid = false;
          }
      }

      return { errors, isValid };
    },
    [validateField, formErrors]
  );

  useEffect(() => {
    if (Object.keys(formData).length === 0 && !isCrearModalOpen && !isEditarModalOpen) {
      setIsFormValid(false);
      setFormErrors({});
      return;
    }
    if (!isVerifying) {
        const { errors, isValid } = runValidations(formData);
        setFormErrors(errors);
        setIsFormValid(isValid);
    }
  }, [formData, runValidations, isVerifying, isCrearModalOpen, isEditarModalOpen]);


  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500);
    return () => clearTimeout(timerId);
  }, [inputValue]);

  useEffect(() => {
    loadClientes(searchTerm);
  }, [searchTerm, loadClientes]);

  const closeModal = useCallback(() => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setCurrentCliente(null);
    setValidationMessage("");
    setFormData({});
    setFormErrors({});
    setIsFormValid(false);
    setTouchedFields({});
  }, []);

  const handleOpenModal = useCallback((type, cliente = null) => {
    setCurrentCliente(cliente);
    setFormErrors({});
    setTouchedFields({});
    if (type === "create") {
        setFormData({
            nombre: "",
            apellido: "",
            correo: "",
            telefono: "",
            tipoDocumento: "Cédula de Ciudadanía",
            numeroDocumento: "",
            fechaNacimiento: "",
            direccion: "",
            contrasena: "",
            estado: true
        });
        setIsCrearModalOpen(true);
    }
    else if (type === "edit") {
        setFormData({
            ...cliente,
            fechaNacimiento: cliente.fechaNacimiento ? cliente.fechaNacimiento.split("T")[0] : "",
        });
        setIsEditarModalOpen(true);
    }
    else if (type === "details") setIsDetailsModalOpen(true);
    else if (type === "delete") setIsConfirmDeleteOpen(true);
  }, []);

  const handleInputChange = useCallback((e) => {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}));
  }, []);

  const handleInputBlur = useCallback(async (e) => {
    const { name, value } = e.target;
    setTouchedFields(prev => ({...prev, [name]: true}));

    const error = validateField(name, value);
    setFormErrors(prev => ({...prev, [name]: error}));

    if (!error && (name === 'correo' || name === 'numeroDocumento')) {
        const originalValue = currentCliente ? currentCliente[name] : null;
        if (value !== originalValue) {
            setIsVerifying(true);
            try {
                const response = await verificarDatosUnicos({ [name]: value });
                if (response[name]) {
                    setFormErrors(prev => ({...prev, [name]: response[name]}));
                }
            } catch (apiError) {
                setFormErrors(prev => ({...prev, [name]: `No se pudo verificar el ${name}.`}));
            } finally {
                setIsVerifying(false);
            }
        }
    }
  }, [validateField, currentCliente]);


  const handleSave = useCallback(
    async (clienteData) => {
      const { errors, isValid } = runValidations(clienteData);
      setFormErrors(errors);
      setTouchedFields(Object.keys(errors).reduce((acc, key) => ({...acc, [key]: true}), {}));

      if (!isValid) {
          setValidationMessage("Por favor, corrija los errores en el formulario.");
          setIsValidationModalOpen(true);
          return;
      }

      const isEditing = !!currentCliente?.idCliente;
      const isCreating = !isEditing;
      try {
        await saveCliente(
          clienteData,
          isCreating,
          isEditing ? currentCliente.idCliente : null
        );
        await loadClientes(searchTerm);
        closeModal();
        setValidationMessage(
          `Cliente ${isEditing ? "actualizado" : "creado"} exitosamente.`
        );
        setIsValidationModalOpen(true);
      } catch (err) {
        let errorMessage = "Ocurrió un error al guardar el cliente.";
        if (err.message) errorMessage = err.message;
        if (err.response?.data?.errors) {
          errorMessage = `Errores de validación: ${err.response.data.errors.map((e) => e.msg).join(" | ")}`;
        } else if (err.response?.data?.message) {
          errorMessage = err.response.data.message;
        }
        setValidationMessage(errorMessage);
        setIsValidationModalOpen(true);
      }
    },
    [currentCliente, loadClientes, closeModal, searchTerm, runValidations]
  );

  const handleDelete = useCallback(async () => {
    if (currentCliente?.idCliente) {
      try {
        await deleteClienteById(currentCliente.idCliente);
        await loadClientes(searchTerm);
        closeModal();
        setValidationMessage("Cliente eliminado exitosamente.");
        setIsValidationModalOpen(true);
      } catch (err) {
        setValidationMessage(
          err.message || "Ocurrió un error al eliminar el cliente."
        );
        setIsValidationModalOpen(true);
      }
    }
  }, [currentCliente, loadClientes, closeModal, searchTerm]);

  const handleToggleEstado = useCallback(
    async (clienteId) => {
      const clienteToToggle = clientes.find((c) => c.idCliente === clienteId);
      if (!clienteToToggle) {
        setValidationMessage("Cliente no encontrado para cambiar estado.");
        setIsValidationModalOpen(true);
        return;
      }
      const nuevoEstado = !clienteToToggle.estado;
      try {
        await toggleClienteEstado(clienteId, nuevoEstado);
        await loadClientes(searchTerm);
        setValidationMessage(
          `Estado del cliente cambiado a ${
            nuevoEstado ? "Activo" : "Inactivo"
          } exitosamente.`
        );
        setIsValidationModalOpen(true);
      } catch (err) {
        setValidationMessage(
          err.message || "Ocurrió un error al cambiar el estado del cliente."
        );
        setIsValidationModalOpen(true);
      }
    },
    [clientes, loadClientes, searchTerm]
  );

  const processedClientes = useMemo(() => {
    return clientes;
  }, [clientes]);

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
    isConfirmDeleteOpen,
    isValidationModalOpen,
    validationMessage,
    inputValue,
    setInputValue,
    currentPage,
    itemsPerPage,
    paginate,
    closeModal,
    handleOpenModal,
    handleSave,
    handleDelete,
    handleToggleEstado,
    // Form props
    formData,
    formErrors,
    isFormValid,
    touchedFields,
    handleInputChange,
    handleInputBlur,
    isVerifying,
  };
};

export default useClientes;
