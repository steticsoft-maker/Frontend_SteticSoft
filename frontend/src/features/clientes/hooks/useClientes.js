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

  // INICIO DE MODIFICACIÓN: Añadir estado para errores de formulario.
  const [errors, setErrors] = useState({});
  // FIN DE MODIFICACIÓN

  // Estados para modales
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

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
      setError(err.message || "Error al cargar los clientes.");
      setClientes([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    // INICIO DE MODIFICACIÓN: Limpiar errores al cerrar modal.
    setErrors({});
    // FIN DE MODIFICACIÓN
  }, []);

  const handleOpenModal = useCallback((type, cliente = null) => {
    // INICIO DE MODIFICACIÓN: Limpiar errores al abrir modal.
    setErrors({});
    // FIN DE MODIFICACIÓN
    setCurrentCliente(cliente);
    if (type === "create") setIsCrearModalOpen(true);
    else if (type === "edit") setIsEditarModalOpen(true);
    else if (type === "details") setIsDetailsModalOpen(true);
    else if (type === "delete") setIsConfirmDeleteOpen(true);
  }, []);

  const handleSave = useCallback(
    async (clienteData) => {
      const isCreating = !currentCliente?.idCliente;
      // INICIO DE MODIFICACIÓN: Limpiar errores antes de enviar.
      setErrors({});
      // FIN DE MODIFICACIÓN
      try {
        await saveCliente(
          clienteData,
          isCreating,
          isCreating ? null : currentCliente.idCliente
        );
        await loadClientes(searchTerm);
        closeModal();
        setValidationMessage(
          `Cliente ${isCreating ? "creado" : "actualizado"} exitosamente.`
        );
        setIsValidationModalOpen(true);
      } catch (err) {
        // INICIO DE MODIFICACIÓN: Procesar errores de validación del backend.
        if (err.response && err.response.data && Array.isArray(err.response.data.errors)) {
          const backendErrors = err.response.data.errors.reduce((acc, error) => {
            const fieldName = error.param || error.path;
            acc[fieldName] = error.msg;
            return acc;
          }, {});
          setErrors(backendErrors);
        } else {
          // Error genérico si la respuesta no es de validación
          const errorMessage = err.response?.data?.message || err.message || "Ocurrió un error al guardar el cliente.";
          setValidationMessage(errorMessage);
          setIsValidationModalOpen(true);
        }
        // FIN DE MODIFICACIÓN
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
        setValidationMessage(err.message || "Ocurrió un error al eliminar el cliente.");
        setIsValidationModalOpen(true);
      }
    }
  }, [currentCliente, loadClientes, closeModal, searchTerm]);

  const handleToggleEstado = useCallback(
    async (clienteId) => {
      const clienteToToggle = clientes.find((c) => c.idCliente === clienteId);
      if (!clienteToToggle) return;
      const nuevoEstado = !clienteToToggle.estado;
      try {
        await toggleClienteEstado(clienteId, nuevoEstado);
        await loadClientes(searchTerm);
        setValidationMessage(`Estado del cliente cambiado a ${nuevoEstado ? "Activo" : "Inactivo"}.`);
        setIsValidationModalOpen(true);
      } catch (err) {
        setValidationMessage(err.message || "Ocurrió un error al cambiar el estado.");
        setIsValidationModalOpen(true);
      }
    },
    [clientes, loadClientes, searchTerm]
  );

  const processedClientes = useMemo(() => clientes, [clientes]);
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
    // INICIO DE MODIFICACIÓN: Exportar el objeto de errores.
    errors,
    // FIN DE MODIFICACIÓN
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
  };
};

export default useClientes;
