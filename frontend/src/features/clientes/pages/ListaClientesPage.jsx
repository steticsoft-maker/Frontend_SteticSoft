// src/features/clientes/pages/ListaClientesPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import ClientesTable from "../components/ClientesTable";
import ClienteCrearModal from "../components/ClienteCrearModal";
import ClienteEditarModal from "../components/ClienteEditarModal";
import ClienteDetalleModal from "../components/ClienteDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal";
import ValidationModal from "../../../shared/components/common/ValidationModal";
import {
  fetchClientes, // Esta es la función que ahora acepta un searchTerm
  saveCliente,
  deleteClienteById,
  toggleClienteEstado,
} from "../services/clientesService";
import "../css/Clientes.css";

function ListaClientesPage() {
  // `clientes` ahora contendrá directamente la lista filtrada desde el backend
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState(""); // Término de búsqueda
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para el control de modales
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  // Estado para el cliente seleccionado en los modales
  const [currentCliente, setCurrentCliente] = useState(null);
  // Mensaje para el modal de validación/notificación
  const [validationMessage, setValidationMessage] = useState("");

  /**
   * Carga los clientes desde el backend, aplicando un término de búsqueda si se proporciona.
   * @param {string} [searchTerm=""] - El término de búsqueda a enviar al backend.
   */
  const loadClientes = async (searchTerm = "") => {
    try {
      setLoading(true);
      setError(null);
      // Llama al servicio, pasando el término de búsqueda
      const response = await fetchClientes(searchTerm);
      if (Array.isArray(response)) {
        setClientes(response); // `clientes` ahora se actualiza con los datos ya filtrados del backend
      } else {
        console.error(
          "fetchClientes no devolvió un array o un objeto con un array 'data':",
          response
        );
        setClientes([]); // Asegura que `clientes` sea un array para evitar errores en el renderizado
        setError("Formato de datos de clientes inesperado.");
      }
    } catch (err) {
      setError("Error al cargar los clientes. Inténtalo de nuevo más tarde.");
      console.error("Error al cargar clientes:", err);
    } finally {
      setLoading(false);
    }
  };

  // Efecto para cargar clientes inicialmente y cada vez que el término de búsqueda cambie
  useEffect(() => {
    // Implementación de "debounce" para evitar llamadas excesivas a la API mientras el usuario escribe
    const delayDebounceFn = setTimeout(() => {
      loadClientes(busqueda); // Llama a `loadClientes` con el término de búsqueda actual
    }, 300); // Espera 300ms después de que el usuario deja de escribir

    // Función de limpieza que se ejecuta si el componente se desmonta o si `busqueda` cambia de nuevo antes del timeout
    return () => clearTimeout(delayDebounceFn);
  }, [busqueda]); // Este efecto se re-ejecuta cada vez que `busqueda` cambia

  // Funciones para abrir modales
  const handleOpenModal = (type, cliente = null) => {
    setCurrentCliente(cliente); // Establece el cliente actual para modales de edición/detalle/eliminación
    if (type === "details") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsConfirmDeleteOpen(true);
    } else if (type === "create") {
      setIsCrearModalOpen(true);
    } else if (type === "edit") {
      if (cliente) {
        setIsEditarModalOpen(true);
      } else {
        console.error("Se intentó abrir modal de edición sin datos de cliente.");
      }
    }
  };

  // Funciones para cerrar modales específicos
  const handleCrearModalClose = () => {
    setIsCrearModalOpen(false);
  };

  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentCliente(null); // Limpia el cliente actual después de cerrar el modal de edición
  };

  // Función genérica para cerrar otros modales y limpiar mensajes/cliente actual
  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    // Solo resetea currentCliente si no estamos en un modal de crear/editar abierto
    // Esto es importante para que initialData en ClienteEditarModal funcione correctamente.
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentCliente(null);
    }
  };

  /**
   * Maneja el guardado de un cliente (creación o actualización).
   * @param {object} clienteData - Los datos del cliente a guardar.
   */
  const handleSave = async (clienteData) => {
    try {
      // Determina si es una operación de edición o creación
      const isEditing = !!currentCliente?.idCliente;
      const isCreating = !isEditing;

      await saveCliente(
        clienteData,
        isCreating,
        isEditing ? currentCliente.idCliente : null
      );

      await loadClientes(busqueda); // Recarga los clientes con el filtro actual después de guardar
      if (isEditing) {
        handleEditarModalClose();
      } else {
        handleCrearModalClose();
      }
      setValidationMessage(
        `Cliente ${isEditing ? "actualizado" : "creado"} exitosamente.`
      );
      setIsValidationModalOpen(true);
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      let errorMessage = "Ocurrió un error al guardar el cliente.";
      if (error.message) {
        errorMessage = error.message; // Mensaje genérico del servicio
      }
      // Si el backend envió errores de validación específicos
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = error.response.data.errors
          .map((err) => err.msg)
          .join(" | ");
        errorMessage = `Errores de validación: ${backendErrors}`;
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        // En caso de que el mensaje del backend no venga en 'errors' sino directamente en 'message'
        errorMessage = error.response.data.message;
      }

      setValidationMessage(errorMessage);
      setIsValidationModalOpen(true);
    }
  };

  /**
   * Maneja la eliminación de un cliente.
   */
  const handleDelete = async () => {
    if (currentCliente && currentCliente.idCliente) {
      try {
        await deleteClienteById(currentCliente.idCliente);
        await loadClientes(busqueda); // Recarga los clientes con el filtro actual después de eliminar
        closeOtherModals();
        setValidationMessage("Cliente eliminado exitosamente.");
        setIsValidationModalOpen(true);
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        setValidationMessage(
          error.message || "Ocurrió un error al eliminar el cliente."
        );
        setIsValidationModalOpen(true);
      }
    }
  };

  /**
   * Maneja el cambio de estado (activo/inactivo) de un cliente.
   * @param {number} clienteId - El ID del cliente a cambiar.
   */
  const handleToggleEstado = async (clienteId) => {
    try {
      // Necesitamos encontrar el estado actual del cliente en la lista `clientes` que estamos mostrando.
      const clienteToToggle = clientes.find((c) => c.idCliente === clienteId);
      if (!clienteToToggle) {
        setValidationMessage("Cliente no encontrado para cambiar estado.");
        setIsValidationModalOpen(true);
        return;
      }
      const nuevoEstado = !clienteToToggle.estado; // Invierte el estado actual
      await toggleClienteEstado(clienteId, nuevoEstado);
      await loadClientes(busqueda); // Recarga los clientes con el filtro actual después de cambiar el estado
      setValidationMessage(
        `Estado del cliente cambiado a ${
          nuevoEstado ? "Activo" : "Inactivo"
        } exitosamente.`
      );
      setIsValidationModalOpen(true);
    } catch (error) {
      console.error("Error al cambiar estado del cliente:", error);
      setValidationMessage(
        error.message || "Ocurrió un error al cambiar el estado del cliente."
      );
      setIsValidationModalOpen(true);
    }
  };

  return (
    <div className="clientes-page-container">
      <NavbarAdmin />
      <div className="main-content-clientes">
        <h1>Gestión de Clientes</h1>
        <div className="containerAgregarbuscarClientes">
          <input
            type="text"
            placeholder="Buscar por los campos de la tabla"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)} // Actualiza el estado `busqueda`
            className="barraBusquedaClientesInput"
          />
          <button
            className="buttonAgregarcliente"
            onClick={() => handleOpenModal("create")}
          >
            Agregar Cliente
          </button>
        </div>

        {/* Indicadores de carga y error */}
        {loading && <p>Cargando clientes...</p>}
        {error && <p className="error-message">{error}</p>}

        {/* Tabla de clientes (solo se muestra cuando no hay carga ni error) */}
        {!loading && !error && (
          <ClientesTable
            clientes={clientes} // Pasa directamente la lista `clientes` (que ya viene filtrada del backend)
            onView={(cliente) => handleOpenModal("details", cliente)}
            onEdit={(cliente) => handleOpenModal("edit", cliente)}
            onDeleteConfirm={(cliente) => handleOpenModal("delete", cliente)}
            onToggleEstado={handleToggleEstado}
          />
        )}
      </div>

      {/* Modales */}
      <ClienteCrearModal
        isOpen={isCrearModalOpen}
        onClose={handleCrearModalClose}
        onSubmit={handleSave}
      />
      <ClienteEditarModal
        isOpen={isEditarModalOpen}
        onClose={handleEditarModalClose}
        onSubmit={handleSave}
        initialData={currentCliente}
      />
      <ClienteDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={closeOtherModals}
        cliente={currentCliente}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={closeOtherModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación de Cliente"
        message={`¿Estás seguro de que deseas eliminar al cliente "${
          currentCliente
            ? `${currentCliente.nombre} ${currentCliente.apellido}`
            : ""
        }"?`}
        confirmText="Eliminar"
        cancelText="Cancelar"
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={closeOtherModals}
        title="Aviso de Clientes"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaClientesPage;