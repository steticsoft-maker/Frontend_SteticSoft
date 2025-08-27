// frontend/src/features/clientes/hooks/useClientes.js
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  fetchClientes,
  saveCliente,
  deleteClienteById,
  toggleClienteEstado,
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
  const [inputValue, setInputValue] = useState(""); // Para el input de búsqueda inmediato
  const [searchTerm, setSearchTerm] = useState(""); // Para la búsqueda con debounce
  const [formErrors, setFormErrors] = useState({}); // Para errores de validación del formulario

  // Estados para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // O hacerlo configurable

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
        err.message || "Error al cargar los clientes. Inténtalo de nuevo más tarde."
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
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setCurrentCliente(null);
    setValidationMessage("");
    setFormErrors({}); // Limpiar errores al cerrar
  }, []);

  const handleOpenModal = useCallback((type, cliente = null) => {
    setCurrentCliente(cliente);
    if (type === "create") setIsCrearModalOpen(true);
    else if (type === "edit") setIsEditarModalOpen(true);
    else if (type === "details") setIsDetailsModalOpen(true);
    else if (type === "delete") setIsConfirmDeleteOpen(true);
  }, []);

  const handleSave = useCallback(
    async (clienteData) => {
      const isEditing = !!currentCliente?.idCliente;
      const isCreating = !isEditing;
      setFormErrors({}); // Limpiar errores antes de enviar

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
        if (err.response && (err.response.status === 400 || err.response.status === 422) && err.response.data.errors) {
          const backendErrors = err.response.data.errors;
          const newErrors = {};
          backendErrors.forEach(error => {
            newErrors[error.param] = error.msg;
          });
          setFormErrors(newErrors);
        } else {
          const apiErrorMessage = err.response?.data?.message || err.response?.data?.error || err.message || "Error al guardar el cliente.";
          setValidationMessage(apiErrorMessage);
          setIsValidationModalOpen(true);
        }
      }
    },
    [currentCliente, loadClientes, closeModal, searchTerm]
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

  // Lógica de paginación
  // Como la búsqueda ya se hace en el backend, `processedClientes` es simplemente `clientes`.
  // Si se quisiera añadir filtrado por estado en el frontend, se modificaría aquí.
  const processedClientes = useMemo(() => {
    // Aquí se podría añadir más lógica de filtrado frontend si fuera necesario,
    // por ejemplo, un filtro de estado que no esté soportado por el backend.
    // Por ahora, como el backend ya filtra por `searchTerm`, `clientes` ya está "procesado" en ese aspecto.
    return clientes;
  }, [clientes]);

  const totalClientesFiltrados = processedClientes.length;

  const currentClientesForTable = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return processedClientes.slice(indexOfFirstItem, indexOfLastItem);
  }, [processedClientes, currentPage, itemsPerPage]);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Resetear a página 1 si el número total de páginas es menor que la actual
  // (por ejemplo, después de una búsqueda que reduce mucho los resultados)
  useEffect(() => {
    if (totalClientesFiltrados > 0 && itemsPerPage > 0) {
      const totalPages = Math.ceil(totalClientesFiltrados / itemsPerPage);
      if (currentPage > totalPages) {
        setCurrentPage(1);
      }
    }
  }, [totalClientesFiltrados, itemsPerPage, currentPage]);


  return {
    clientes: currentClientesForTable, // Para la tabla
    totalClientesFiltrados, // Para el componente de paginación y el título
    isLoading,
    error,
    currentCliente,
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    isConfirmDeleteOpen,
    isValidationModalOpen,
    validationMessage,
    formErrors,
    inputValue, // Para el input de búsqueda
    setInputValue, // Para actualizar el término de búsqueda inmediato
    currentPage,
    itemsPerPage,
    paginate,
    closeModal,
    handleOpenModal,
    handleSave,
    handleDelete,
    handleToggleEstado,
    // Podrías también exponer `loadClientes` si necesitas llamarlo manualmente desde la página por alguna razón,
    // aunque con los efectos actuales, debería ser automático.
  };
};

export default useClientes;
