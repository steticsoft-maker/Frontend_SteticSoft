// src/features/abastecimiento/hooks/useAbastecimiento.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { abastecimientoService } from "../services/abastecimientoService";

const useAbastecimiento = () => {
  const [entries, setEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [currentEntry, setCurrentEntry] = useState(null);

  // --- Estados para Modales ---
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDepleteModalOpen, setIsDepleteModalOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  // --- Estados para Búsqueda y Filtrado (Requerimiento 3) ---
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState("todos"); // 'todos', 'disponibles', 'agotados'

  // --- INICIO: Nuevos estados para productos y empleados para el modal de creación ---
  const [productosInternos, setProductosInternos] = useState([]);
  const [empleadosActivos, setEmpleadosActivos] = useState([]);
  const [isLoadingModalDependencies, setIsLoadingModalDependencies] =
    useState(false);
  // --- FIN: Nuevos estados ---

  const cargarDatosPrincipales = useCallback(async () => {
    // Renombrado de cargarDatos a cargarDatosPrincipales
    setIsLoading(true);
    setError(null);
    try {
      const data = await abastecimientoService.getAbastecimientos();
      setEntries(data || []);
    } catch (err) {
      setError(
        err.message || "No se pudieron cargar los datos de abastecimiento."
      );
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- INICIO: Nueva función para cargar dependencias del modal ---
  const cargarModalCreacionDependencies = useCallback(async () => {
    setIsLoadingModalDependencies(true);
    try {
      const [prods, emps] = await Promise.all([
        abastecimientoService.getProductosActivosUsoInterno(),
        abastecimientoService.getEmpleadosActivos(),
      ]);
      // El filtro que había añadido antes en el modal ahora se asegura aquí o se confía en el servicio.
      // Por el bug report, se asume que getProductosActivosUsoInterno YA DEBERÍA devolver solo internos.
      // Reintroducimos el filtro como medida de seguridad en el frontend.
      const filteredProds = (prods || []).filter(
        (p) => p.tipo_uso === "Interno"
      );
      setProductosInternos(filteredProds);
      setEmpleadosActivos(emps || []);
    } catch (err) {
      // Manejar error de carga de dependencias del modal si es necesario,
      // por ejemplo, mostrando un mensaje en el modal de creación.
      // setError(err.message || "No se pudieron cargar datos para el formulario."); // Podría sobreescribir el error de la tabla
      console.error(
        "Error cargando dependencias para el modal de creación:",
        err
      );
      setProductosInternos([]);
      setEmpleadosActivos([]);
    } finally {
      setIsLoadingModalDependencies(false);
    }
  }, []);
  // --- FIN: Nueva función ---

  useEffect(() => {
    cargarDatosPrincipales();
    cargarModalCreacionDependencies(); // Cargar dependencias del modal una vez
  }, [cargarDatosPrincipales, cargarModalCreacionDependencies]);

  // Efecto para debounce de la búsqueda
  useEffect(() => {
    const timerId = setTimeout(() => {
      setSearchTerm(inputValue);
    }, 500); // 500ms de debounce

    return () => {
      clearTimeout(timerId);
    };
  }, [inputValue]);

  const closeModal = useCallback(() => {
    setIsCrearModalOpen(false);
    setIsEditarModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsDepleteModalOpen(false);
    setIsValidationModalOpen(false);
    setCurrentEntry(null);
    setValidationMessage("");
  }, []);

  const handleOpenModal = useCallback((type, entry = null) => {
    setCurrentEntry(entry);
    if (type === "details") setIsDetailsModalOpen(true);
    else if (type === "delete") setIsConfirmDeleteOpen(true);
    else if (type === "deplete") {
      if (entry?.estaAgotado) {
        setValidationMessage("Este producto ya está marcado como agotado.");
        setIsValidationModalOpen(true);
        return;
      }
      setIsDepleteModalOpen(true);
    } else if (type === "create") {
      setCurrentEntry(null);
      setIsCrearModalOpen(true);
    } else if (type === "edit") {
      if (entry?.estaAgotado) {
        setValidationMessage(
          "No se puede editar un registro de producto agotado."
        );
        setIsValidationModalOpen(true);
        return;
      }
      setIsEditarModalOpen(true);
    }
  }, []);

  const handleSubmitForm = useCallback(
    async (formData, isCreating = false) => {
      setIsSubmitting(true);
      try {
        if (isCreating) {
          await abastecimientoService.createAbastecimiento(formData);
          setValidationMessage(
            "Registro de abastecimiento creado exitosamente."
          );
        } else {
          const { idAbastecimiento, ...dataToUpdate } = formData;
          const entryId = idAbastecimiento || currentEntry?.idAbastecimiento;
          if (!entryId)
            throw new Error(
              "ID de abastecimiento no encontrado para la actualización."
            );
          await abastecimientoService.updateAbastecimiento(
            entryId,
            dataToUpdate
          );
          setValidationMessage(
            "Registro de abastecimiento actualizado exitosamente."
          );
        }
        await cargarDatosPrincipales();
        closeModal();
        setIsValidationModalOpen(true);
      } catch (err) {
        setValidationMessage(
          err.response?.data?.message ||
            err.message ||
            "Error al guardar el registro."
        );
        setIsValidationModalOpen(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [cargarDatosPrincipales, closeModal, currentEntry]
  );

  const handleDeleteConfirmed = useCallback(async () => {
    if (!currentEntry?.idAbastecimiento) return;
    setIsSubmitting(true);
    try {
      await abastecimientoService.deleteAbastecimiento(
        currentEntry.idAbastecimiento
      );
      setValidationMessage("Registro eliminado exitosamente.");
      await cargarDatosPrincipales();
      closeModal();
      setIsValidationModalOpen(true);
    } catch (err) {
      setValidationMessage(err.message || "Error al eliminar el registro.");
      setIsValidationModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [currentEntry, cargarDatosPrincipales, closeModal]);

  const handleDepleteConfirmed = useCallback(
    async (reason) => {
      if (!currentEntry?.idAbastecimiento) return;
      setIsSubmitting(true);
      try {
        const dataToUpdate = {
          estaAgotado: true,
          razonAgotamiento: reason,
        };
        await abastecimientoService.updateAbastecimiento(
          currentEntry.idAbastecimiento,
          dataToUpdate
        );
        setValidationMessage(
          `Producto "${
            currentEntry.producto?.nombre || ""
          }" marcado como agotado.`
        );
        await cargarDatosPrincipales();
        closeModal();
        setIsValidationModalOpen(true);
      } catch (err) {
        setValidationMessage(err.message || "Error al marcar como agotado.");
        setIsValidationModalOpen(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [currentEntry, cargarDatosPrincipales, closeModal]
  );

  const processedEntries = useMemo(() => {
    let filtered = entries;

    if (filterEstado !== "todos") {
      const isDepleted = filterEstado === "agotados";
      filtered = filtered.filter((entry) => entry.estaAgotado === isDepleted);
    }

    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filtered = filtered.filter((entry) => {
        const nombreProducto = entry.producto?.nombre?.toLowerCase() || "";
        const nombreCategoria =
          entry.producto?.categoria?.nombre?.toLowerCase() || "";
        const nombreEmpleado = entry.empleado?.nombre?.toLowerCase() || "";
        // Corregir búsqueda de fecha para que coincida con el formato de la tabla y sea más robusta.
        const fechaIngreso = entry.fechaIngreso
          ? new Date(entry.fechaIngreso).toLocaleDateString("es-ES", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            })
          : "";
        return (
          nombreProducto.includes(lowerSearchTerm) ||
          nombreCategoria.includes(lowerSearchTerm) ||
          nombreEmpleado.includes(lowerSearchTerm) ||
          fechaIngreso.includes(lowerSearchTerm) ||
          (entry.cantidad?.toString() ?? "").includes(lowerSearchTerm)
        );
      });
    }
    return filtered;
  }, [entries, searchTerm, filterEstado]);

  // --- Estados para Paginación ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Fijo en 10

  // Calcular entries para la página actual
  const currentEntriesForTable = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return processedEntries.slice(indexOfFirstItem, indexOfLastItem);
  }, [processedEntries, currentPage, itemsPerPage]);

  // Función para cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Resetear a la página 1 cuando los filtros o término de búsqueda cambian
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterEstado]);

  return {
    entries: currentEntriesForTable, // Entries filtrados Y PAGINADOS para la tabla
    totalEntriesFiltrados: processedEntries.length, // Total para el componente de paginación
    isLoading,
    isSubmitting,
    error,
    currentEntry,
    isCrearModalOpen,
    isEditarModalOpen,
    isDetailsModalOpen,
    isConfirmDeleteOpen,
    isDepleteModalOpen,
    isValidationModalOpen,
    validationMessage,
    inputValue, // Para el input
    setInputValue, // Para el input
    filterEstado, // Para el select de filtro
    setFilterEstado, // Para el select de filtro
    closeModal,
    handleOpenModal,
    handleSubmitForm,
    handleDeleteConfirmed,
    handleDepleteConfirmed,
    // Paginación
    currentPage,
    itemsPerPage,
    paginate,
    // --- INICIO: Devolver nuevos estados ---
    productosInternos,
    empleadosActivos,
    isLoadingModalDependencies,
    // --- FIN: Devolver nuevos estados ---
  };
};

export default useAbastecimiento;
