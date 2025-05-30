// src/features/clientes/pages/ListaClientesPage.jsx
import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../../shared/components/layout/NavbarAdmin";
import ClientesTable from "../components/ClientesTable";
import ClienteFormModal from "../components/ClienteFormModal";
import ClienteDetalleModal from "../components/ClienteDetalleModal";
import ConfirmModal from "../../../shared/components/common/ConfirmModal"; // Se importa el modal genérico
import ValidationModal from "../../../shared/components/common/ValidationModal"; // Ya estaba usando el genérico
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

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [currentCliente, setCurrentCliente] = useState(null);
  const [formModalType, setFormModalType] = useState("create");
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    setClientes(fetchClientes());
  }, []);

  const handleOpenModal = (type, cliente = null) => {
    setCurrentCliente(cliente);
    if (type === "details") {
      setIsDetailsModalOpen(true);
    } else if (type === "delete") {
      setIsConfirmDeleteOpen(true);
    } else {
      // 'create' or 'edit'
      setFormModalType(type);
      setIsFormModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setCurrentCliente(null);
    setValidationMessage("");
  };

  const handleSave = (clienteData) => {
    try {
      const updatedClientes = saveCliente(
        clienteData,
        clientes,
        currentCliente?.id
      );
      setClientes(updatedClientes);
      handleCloseModals();
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (currentCliente) {
      const updatedClientes = deleteClienteById(currentCliente.id, clientes);
      setClientes(updatedClientes);
      handleCloseModals();
    }
  };

  const handleToggleEstado = (clienteId) => {
    const updatedClientes = toggleClienteEstado(clienteId, clientes);
    setClientes(updatedClientes);
  };

  const filteredClientes = clientes.filter(
    (c) =>
      `${c.nombre} ${c.apellido}`
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      (c.numeroDocumento &&
        c.numeroDocumento.toLowerCase().includes(busqueda.toLowerCase())) || // Añadida verificación para numeroDocumento
      (c.email && c.email.toLowerCase().includes(busqueda.toLowerCase())) // Añadida verificación para email
  );

  return (
    <div className="clientes-page-container">
      {" "}
      {/* Nueva clase para la página */}
      <NavbarAdmin />
      <div className="main-content-clientes">
        {" "}
        {/* Mantener clase original para el área de contenido */}
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
            onClick={() => handleOpenModal("create")}
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
      <ClienteFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSave}
        initialData={currentCliente}
        modalType={formModalType}
      />
      <ClienteDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        cliente={currentCliente}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseModals}
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
        onClose={handleCloseModals}
        title="Aviso de Clientes" // Título ajustado para el contexto
        message={validationMessage}
      />
    </div>
  );
}

export default ListaClientesPage;
