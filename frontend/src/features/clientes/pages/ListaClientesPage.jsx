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
  fetchClientes,
  saveCliente,
  deleteClienteById,
  toggleClienteEstado,
} from "../services/clientesService";
import "../css/Clientes.css";

function ListaClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [busquedaDebounced, setBusquedaDebounced] = useState("");
  const [mostrarInactivos, setMostrarInactivos] = useState(false);

  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentCliente, setCurrentCliente] = useState(null);
  const [validationMessage, setValidationMessage] = useState("");

  // Debounce para la búsqueda
  useEffect(() => {
    const timerId = setTimeout(() => {
      setBusquedaDebounced(terminoBusqueda);
    }, 300);
    return () => clearTimeout(timerId);
  }, [terminoBusqueda]);

  const loadClientes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let params = { busqueda: busquedaDebounced };
      if (!mostrarInactivos) {
        params.estado = true; // Solo activos
      }
      // Si mostrarInactivos es true, no se pasa 'estado', API devuelve todos.
      const data = await fetchClientes(params);

      // fetchClientes ya devuelve un array o lanza error.
      setClientes(data);

    } catch (err) {
      setError(err.message || "Error al cargar los clientes. Inténtalo de nuevo más tarde.");
      console.error("Error al cargar clientes:", err);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, [busquedaDebounced, mostrarInactivos]);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  const handleOpenModal = (type, cliente = null) => {
    setCurrentCliente(cliente);
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

  const handleCrearModalClose = () => {
    setIsCrearModalOpen(false);
  };

  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentCliente(null);
  };

  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    // Solo resetea currentCliente si no estamos en un modal de crear/editar abierto
    // Esto es importante para que initialData en ClienteEditarModal funcione.
    if (!isCrearModalOpen && !isEditarModalOpen) {
      setCurrentCliente(null);
    }
  };

  const handleSave = async (clienteData) => {
    try {
      // isEditing es TRUE si estamos editando, FALSE si estamos creando
      const isEditing = !!currentCliente?.idCliente;
      
      // La variable 'isCreating' para saveCliente es lo opuesto a 'isEditing'
      const isCreating = !isEditing; 

      await saveCliente(
        clienteData,
        isCreating, // Pasa `true` para crear, `false` para editar
        isEditing ? currentCliente.idCliente : null // Pasa el ID solo si estamos editando
      );
      
      await loadClientes(); // Recargar todos los clientes
      if (isEditing) {
        handleEditarModalClose();
      } else {
        handleCrearModalClose();
      }
      setValidationMessage(`Cliente ${isEditing ? "actualizado" : "creado"} exitosamente.`);
      setIsValidationModalOpen(true);
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      // Extrae los mensajes de error del backend si están disponibles
      let errorMessage = "Ocurrió un error al guardar el cliente.";
      if (error.message) {
        errorMessage = error.message; // Mensaje genérico de clientesService
      }
      // Si el backend envió errores de validación específicos (como en tu JSON)
      if (error.response && error.response.data && error.response.data.errors) {
        const backendErrors = error.response.data.errors.map(err => err.msg).join(" | ");
        errorMessage = `Errores de validación: ${backendErrors}`;
      } else if (error.response && error.response.data && error.response.data.message) {
        // En caso de que el mensaje del backend no venga en 'errors' sino directamente en 'message'
        errorMessage = error.response.data.message;
      }
      
      setValidationMessage(errorMessage);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = async () => {
    if (currentCliente && currentCliente.idCliente) {
      try {
        await deleteClienteById(currentCliente.idCliente);
        await loadClientes(); // Recargar todos los clientes
        closeOtherModals();
        setValidationMessage("Cliente eliminado exitosamente.");
        setIsValidationModalOpen(true);
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
        setValidationMessage(error.message || "Ocurrió un error al eliminar el cliente.");
        setIsValidationModalOpen(true);
      }
    }
  };

  const handleToggleEstado = async (clienteId) => {
    try {
      const clienteToToggle = clientes.find(c => c.idCliente === clienteId);
      if (!clienteToToggle) {
        setValidationMessage("Cliente no encontrado para cambiar estado.");
        setIsValidationModalOpen(true);
        return;
      }
      const nuevoEstado = !clienteToToggle.estado;
      await toggleClienteEstado(clienteId, nuevoEstado);
      await loadClientes(); // Recargar todos los clientes
      setValidationMessage(`Estado del cliente cambiado a ${nuevoEstado ? 'Activo' : 'Inactivo'} exitosamente.`);
      setIsValidationModalOpen(true);
    } catch (error) {
      console.error("Error al cambiar estado del cliente:", error);
      setValidationMessage(error.message || "Ocurrió un error al cambiar el estado del cliente.");
      setIsValidationModalOpen(true);
    }
  };

  // Defensive check: Ensure `clientes` is an array before calling `.filter()`
  // const filteredClientes = Array.isArray(clientes) ? clientes.filter(...) : []; // ELIMINADO - Filtrado ahora en backend

  return (
    <div className="clientes-page-container">
      <NavbarAdmin />
      <div className="main-content-clientes">
        <h1>Gestión de Clientes</h1>
        <div className="containerAgregarbuscarClientes">
          <input
            type="text"
            placeholder="Buscar cliente (nombre, documento, correo)..."
            value={terminoBusqueda}
            onChange={(e) => setTerminoBusqueda(e.target.value)}
            className="barraBusquedaClientesInput"
            disabled={loading}
          />
          <div className="clientes-filtros"> {/* Contenedor para el switch */}
            <label htmlFor="mostrarInactivosClientesSwitch" className="clientes-switch-label">Mostrar Inactivos:</label>
            <label className="switch clientes-switch-control">
              <input
                id="mostrarInactivosClientesSwitch"
                type="checkbox"
                checked={mostrarInactivos}
                onChange={(e) => setMostrarInactivos(e.target.checked)}
                disabled={loading}
              />
              <span className="slider"></span>
            </label>
          </div>
          <button
            className="buttonAgregarcliente"
            onClick={() => handleOpenModal("create")}
            disabled={loading}
          >
            Agregar Cliente
          </button>
        </div>

        {loading && <p>Cargando clientes...</p>}
        {error && <p className="error-message">{error}</p>}

        {!loading && !error && (
          <ClientesTable
            clientes={clientes} // Usar 'clientes' directamente del estado
            onView={(cliente) => handleOpenModal("details", cliente)}
            onEdit={(cliente) => handleOpenModal("edit", cliente)}
            onDeleteConfirm={(cliente) => handleOpenModal("delete", cliente)}
            onToggleEstado={handleToggleEstado}
          />
        )}
      </div>

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
        onClose={closeOtherModals} // Usa closeOtherModales
        title="Aviso de Clientes"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaClientesPage;