// src/features/proveedores/pages/ListaProveedoresPage.jsx
import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import ProveedoresTable from '../components/ProveedoresTable';
import ProveedorFormModal from '../components/ProveedorFormModal';
import ProveedorDetalleModal from '../components/ProveedorDetalleModal';
import ConfirmDeleteProveedorModal from '../components/ConfirmDeleteProveedorModal';
import ValidationModal from '../../../shared/components/common/ValidationModal'; // Reutilizar
import {
  fetchProveedores,
  saveProveedor,
  deleteProveedorById,
  toggleProveedorEstado,
} from '../services/proveedoresService';
import '../css/Proveedores.css';

function ListaProveedoresPage() {
  const [proveedores, setProveedores] = useState([]);
  const [search, setSearch] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  
  const [currentProveedor, setCurrentProveedor] = useState(null);
  const [formModalType, setFormModalType] = useState('agregar'); // 'agregar' o 'editar'
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    setProveedores(fetchProveedores());
  }, []);

  const handleOpenModal = (type, proveedor = null) => {
    setCurrentProveedor(proveedor);
    if (type === 'ver') {
      setIsDetailsModalOpen(true);
    } else if (type === 'delete') {
      setIsConfirmDeleteOpen(true);
    } else { // 'agregar' o 'editar'
      setFormModalType(type);
      setIsFormModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setCurrentProveedor(null);
    setValidationMessage('');
  };

  const handleSave = (proveedorData) => {
    try {
      const updatedProveedores = saveProveedor(proveedorData, proveedores, currentProveedor?.id);
      setProveedores(updatedProveedores);
      handleCloseModals();
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (currentProveedor) {
      const updatedProveedores = deleteProveedorById(currentProveedor.id, proveedores);
      setProveedores(updatedProveedores);
      handleCloseModals();
    }
  };

  const handleToggleEstado = (proveedorId) => {
    const updatedProveedores = toggleProveedorEstado(proveedorId, proveedores);
    setProveedores(updatedProveedores);
  };

  const filteredProveedores = proveedores.filter(p => {
    const displayName = p.tipoDocumento === "Natural" ? p.nombre : p.nombreEmpresa;
    const documentId = p.tipoDocumento === "Natural" ? p.numeroDocumento : p.nit;
    return (displayName && displayName.toLowerCase().includes(search.toLowerCase())) ||
           (documentId && documentId.toLowerCase().includes(search.toLowerCase()));
  });

  return (
    <div className="proveedores-container"> {/* Clase principal del CSS */}
      <NavbarAdmin />
      <div className="proveedoresContent">
        <h2 className="title-h2-Proveedores">Gestión de Proveedores</h2>
        <div className="barraBusquedaBotonAgregarProveedor">
          <input
            type="text"
            placeholder="Buscar por nombre o documento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="botonSuperiorAgregarProveedor" onClick={() => handleOpenModal('agregar')}>
            Agregar Proveedor
          </button>
        </div>
        <ProveedoresTable
          proveedores={filteredProveedores}
          onView={(prov) => handleOpenModal('ver', prov)}
          onEdit={(prov) => handleOpenModal('editar', prov)}
          onDeleteConfirm={(prov) => handleOpenModal('delete', prov)}
          onToggleEstado={handleToggleEstado}
        />
      </div>

      <ProveedorFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSave}
        initialData={currentProveedor}
        modalType={formModalType}
      />
      <ProveedorDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        proveedor={currentProveedor}
      />
      <ConfirmDeleteProveedorModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleDelete}
        proveedorName={currentProveedor ? (currentProveedor.tipoDocumento === 'Natural' ? currentProveedor.nombre : currentProveedor.nombreEmpresa) : ''}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={handleCloseModals}
        title="Aviso" // O "Error de Validación"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaProveedoresPage;