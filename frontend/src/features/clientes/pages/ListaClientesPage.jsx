// src/features/clientes/pages/ListaClientesPage.jsx
import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import ClientesTable from '../components/ClientesTable';
import ClienteFormModal from '../components/ClienteFormModal';
import ClienteDetalleModal from '../components/ClienteDetalleModal';
import ConfirmDeleteClienteModal from '../components/ConfirmDeleteClienteModal';
import ValidationModal from '../../../shared/components/common/ValidationModal'; // Asumiendo genérico
import {
  fetchClientes,
  saveCliente,
  deleteClienteById,
  toggleClienteEstado,
} from '../services/clientesService';
import '../css/Clientes.css';

function ListaClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  
  const [currentCliente, setCurrentCliente] = useState(null);
  const [formModalType, setFormModalType] = useState('create');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    setClientes(fetchClientes());
  }, []);

  const handleOpenModal = (type, cliente = null) => {
    setCurrentCliente(cliente);
    if (type === 'details') {
      setIsDetailsModalOpen(true);
    } else if (type === 'delete') {
      setIsConfirmDeleteOpen(true);
    } else { // 'create' or 'edit'
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
    setValidationMessage('');
  };

  const handleSave = (clienteData) => {
    try {
      const updatedClientes = saveCliente(clienteData, clientes, currentCliente?.id);
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

  const filteredClientes = clientes.filter(c =>
    `${c.nombre} ${c.apellido}`.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.numeroDocumento.toLowerCase().includes(busqueda.toLowerCase()) ||
    c.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="clientes-page-container"> {/* Nueva clase para la página */}
      <NavbarAdmin />
      <div className="main-content-clientes"> {/* Mantener clase original para el área de contenido */}
        <h1>Gestión de Clientes</h1>
        <div className="containerAgregarbuscarClientes">
          <input
            type="text"
            placeholder="Buscar cliente (nombre, documento, email)..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="barraBusquedaClientesInput"
          />
          <button className="buttonAgregarcliente" onClick={() => handleOpenModal('create')}>
            Agregar Cliente
          </button>
        </div>
        <ClientesTable
          clientes={filteredClientes}
          onView={(cliente) => handleOpenModal('details', cliente)}
          onEdit={(cliente) => handleOpenModal('edit', cliente)}
          onDeleteConfirm={(cliente) => handleOpenModal('delete', cliente)}
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
      <ConfirmDeleteClienteModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleDelete}
        clienteName={currentCliente ? `${currentCliente.nombre} ${currentCliente.apellido}` : ''}
      />
       <ValidationModal // Usar el genérico si se movió a shared
        isOpen={isValidationModalOpen}
        onClose={handleCloseModals}
        title="Error de Validación"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaClientesPage;