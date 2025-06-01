// src/features/clientes/pages/ListaClientesPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import ClientesTable from "../components/ClientesTable";
import ClienteCrearModal from "../components/ClienteCrearModal"; // NUEVO
import ClienteEditarModal from "../components/ClienteEditarModal"; // NUEVO
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
  const [busqueda, setBusqueda] = useState("");

  // Estados separados para los modales de crear y editar
  const [isCrearModalOpen, setIsCrearModalOpen] = useState(false);
  const [isEditarModalOpen, setIsEditarModalOpen] = useState(false);
  // Otros estados de modal
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentCliente, setCurrentCliente] = useState(null);
  // formModalType ya no es necesario aquí, cada modal sabe su propósito
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    setClientes(fetchClientes());
  }, []);

  const handleOpenModal = (type, cliente = null) => {
    // console.log(`[ListaClientesPage] handleOpenModal - Type: ${type}`, cliente);
    setCurrentCliente(cliente); // Necesario para editar, ver, y eliminar
    if (type === "details") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsConfirmDeleteOpen(true);
    } else if (type === "create") {
      // Renombrado de 'agregar' para consistencia
      setIsCrearModalOpen(true);
    } else if (type === "edit") {
      if (cliente) {
        // Asegurarse que hay datos para editar
        setIsEditarModalOpen(true);
      } else {
        console.error(
          "Se intentó abrir modal de edición sin datos de cliente."
        );
      }
    }
  };

  // Cierre para el modal de CREAR
  const handleCrearModalClose = () => {
    setIsCrearModalOpen(false);
    // No es necesario setCurrentCliente(null) aquí si solo se usa para editar/ver/eliminar
  };

  // Cierre para el modal de EDITAR
  const handleEditarModalClose = () => {
    setIsEditarModalOpen(false);
    setCurrentCliente(null); // Limpiar cliente actual
  };

  // Cierre para otros modales
  const closeOtherModals = () => {
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setValidationMessage("");
    if (!isCrearModalOpen && !isEditarModalOpen) {
      // Solo si los modales de form no están abiertos
      setCurrentCliente(null);
    }
  };

  const handleSave = (clienteData) => {
    try {
      const isEditing = !!clienteData.id; // Determinar si es edición basado en la presencia de ID
      const updatedClientes = saveCliente(
        clienteData,
        clientes,
        isEditing ? clienteData.id : null // Pasar el ID del cliente si se está editando
      );
      setClientes(updatedClientes);
      if (isEditing) {
        handleEditarModalClose();
      } else {
        handleCrearModalClose();
      }
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
      // No cerrar el modal de formulario automáticamente en caso de error
    }
  };

  const handleDelete = () => {
    if (currentCliente && currentCliente.id) {
      const updatedClientes = deleteClienteById(currentCliente.id, clientes);
      setClientes(updatedClientes);
      closeOtherModals();
    }
  };

  const handleToggleEstado = (clienteId) => {
    const updatedClientes = toggleClienteEstado(clienteId, clientes);
    setClientes(updatedClientes);
  };

  const filteredClientes = clientes.filter(
    (c) =>
      `${c.nombre || ""} ${c.apellido || ""}` // Asegurar que nombre y apellido existan
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      (c.numeroDocumento &&
        c.numeroDocumento.toLowerCase().includes(busqueda.toLowerCase())) ||
      (c.email && c.email.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="clientes-page-container">
      <NavbarAdmin />
      <div className="main-content-clientes">
        <h1>Gestión de Clientes</h1>
        <div className="containerAgregarbuscarClientes">
          <input
            type="text"
            placeholder="Buscar cliente (nombre, documento, email)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="barraBusquedaClientesInput"
          />
          <button
            className="buttonAgregarcliente"
            onClick={() => handleOpenModal("create")} // Llamar con 'create'
          >
            Agregar Cliente
          </button>
        </div>
        <ClientesTable
          clientes={filteredClientes}
          onView={(cliente) => handleOpenModal("details", cliente)}
          onEdit={(cliente) => handleOpenModal("edit", cliente)}
          onDeleteConfirm={(cliente) => handleOpenModal("delete", cliente)}
          onToggleEstado={handleToggleEstado}
        />
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
        initialData={currentCliente} // Solo el modal de editar necesita initialData
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
