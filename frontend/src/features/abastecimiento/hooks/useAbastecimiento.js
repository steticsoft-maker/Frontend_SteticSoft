// src/features/abastecimiento/hooks/useAbastecimiento.js
import { useState, useEffect, useCallback } from "react";
import {
  getAbastecimientos,
  createAbastecimiento,
  updateAbastecimiento,
  deleteAbastecimiento,
  getProductosActivosUsoInterno,
  getEmpleadosActivos,
} from "../services/abastecimientoService";
import { toast } from "react-toastify";

const useAbastecimiento = () => {
  const [abastecimientos, setAbastecimientos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productos, setProductos] = useState([]);
  const [empleados, setEmpleados] = useState([]); // Nuevo estado para empleados
  const [dependenciasCargadas, setDependenciasCargadas] = useState(false);

  // --- NUEVOS ESTADOS PARA MANEJO DE MODALES ---
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDepleteModalOpen, setIsDepleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [currentEntry, setCurrentEntry] = useState(null);

  const rowsPerPage = 10;

  const fetchAbastecimientos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getAbastecimientos({
        ...filters,
        page: currentPage,
        limit: rowsPerPage,
      });
      setAbastecimientos(response.data);
      setTotalPages(response.totalPages);
    } catch (err) {
      console.error("Error al cargar abastecimientos:", err);
      setError("Error al cargar los datos. Inténtalo de nuevo más tarde.");
      setAbastecimientos([]);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, rowsPerPage]);

  const fetchDependencias = useCallback(async () => {
    try {
      setLoading(true);
      const [productosData, empleadosData] = await Promise.all([
        getProductosActivosUsoInterno(),
        getEmpleadosActivos(),
      ]);
      setProductos(productosData.data);
      setEmpleados(empleadosData.data);
      setDependenciasCargadas(true);
    } catch (err) {
      console.error(
        "Error cargando dependencias para el modal de creación:",
        err
      );
      setError("Error al cargar datos necesarios. Intenta recargar la página.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbastecimientos();
  }, [fetchAbastecimientos]);

  useEffect(() => {
    fetchDependencias();
  }, [fetchDependencias]);

  const handleCreateAbastecimiento = async (data) => {
    setIsSubmitting(true);
    try {
      await createAbastecimiento(data);
      toast.success("Abastecimiento registrado con éxito!");
      fetchAbastecimientos();
      return true;
    } catch (err) {
      console.error("Error al crear abastecimiento:", err);
      toast.error(
        `Error al registrar: ${err.message || "Error desconocido"}`
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateAbastecimiento = async (id, data) => {
    setIsSubmitting(true);
    try {
      await updateAbastecimiento(id, data);
      toast.success("Abastecimiento actualizado con éxito!");
      fetchAbastecimientos();
      return true;
    } catch (err) {
      console.error("Error al actualizar abastecimiento:", err);
      toast.error(
        `Error al actualizar: ${err.message || "Error desconocido"}`
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAbastecimiento = async (id) => {
    setLoading(true);
    try {
      await deleteAbastecimiento(id);
      toast.success("Registro eliminado correctamente.");
      fetchAbastecimientos();
    } catch (err) {
      console.error("Error al eliminar abastecimiento:", err);
      toast.error(
        `Error al eliminar: ${err.message || "Error desconocido"}`
      );
    } finally {
      setLoading(false);
    }
  };

  // --- NUEVAS FUNCIONES PARA MANEJO DE MODALES ---
  const handleOpenModal = (modalType, entry = null) => {
    setCurrentEntry(entry);
    switch (modalType) {
      case "create":
        setIsCrearModalOpen(true);
        break;
      case "edit":
        setIsEditarModalOpen(true);
        break;
      case "details":
        setIsDetailsModalOpen(true);
        break;
      case "delete":
        setIsConfirmDeleteOpen(true);
        break;
      case "deplete":
        setIsDepleteModalOpen(true);
        break;
      default:
        break;
    }
  };

  const closeModal = () => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsDepleteModalOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    setCurrentEntry(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    setFilters({});
    setCurrentPage(1);
  };

  return {
    abastecimientos,
    loading,
    error,
    currentPage,
    totalPages,
    rowsPerPage,
    isSubmitting,
    productos,
    empleados, // Retornar empleados también
    dependenciasCargadas,

    // --- NUEVOS RETORNOS ---
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    isConfirmDeleteOpen,
    isDepleteModalOpen,
    isValidationModalOpen,
    validationMessage,
    currentEntry,

    handleCreateAbastecimiento,
    handleUpdateAbastecimiento,
    handleDeleteAbastecimiento,
    handleOpenModal, // Retornar la función
    closeModal, // Retornar la función

    handlePageChange,
    handleFilterChange,
    handleRefresh,
  };
};

export default useAbastecimiento;