// src/features/abastecimiento/pages/ListaAbastecimientoPage.jsx
import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import AbastecimientoTable from '../components/AbastecimientoTable';
import AbastecimientoFormModal from '../components/AbastecimientoFormModal';
import AbastecimientoDetailsModal from '../components/AbastecimientoDetailsModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal'; // Usar el genérico
import DepleteProductModal from '../components/DepleteProductModal';
import {
  fetchAbastecimientoEntries,
  addAbastecimientoEntry,
  updateAbastecimientoEntry,
  deleteAbastecimientoEntryById,
  depleteEntry
} from '../services/abastecimientoService';
import '../css/Abastecimiento.css'; // Asegúrate que la ruta sea correcta

function ListaAbastecimientoPage() {
  const [entries, setEntries] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isDepleteModalOpen, setIsDepleteModalOpen] = useState(false);

  const [currentEntry, setCurrentEntry] = useState(null);
  const [isEditingForm, setIsEditingForm] = useState(false);

  useEffect(() => {
    setEntries(fetchAbastecimientoEntries());
  }, []);

  const handleOpenFormModal = (entryToEdit = null) => {
    setCurrentEntry(entryToEdit);
    setIsEditingForm(!!entryToEdit);
    setIsFormModalOpen(true);
  };

  const handleOpenDetailsModal = (entry) => {
    setCurrentEntry(entry);
    setIsDetailsModalOpen(true);
  };

  const handleOpenDeleteConfirm = (entry) => {
    setCurrentEntry(entry);
    setIsConfirmDeleteOpen(true);
  };

  const handleOpenDepleteModal = (entry) => {
    setCurrentEntry(entry);
    setIsDepleteModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsDepleteModalOpen(false);
    setCurrentEntry(null);
  };

  const handleSubmitForm = (formData, saveAndAddAnother) => {
    try {
      let updatedEntries;
      if (isEditingForm && currentEntry) {
        updatedEntries = updateAbastecimientoEntry({ ...currentEntry, ...formData }, entries);
      } else {
        updatedEntries = addAbastecimientoEntry(formData, entries);
      }
      setEntries(updatedEntries);
      if (!saveAndAddAnother) {
        handleCloseModals();
      } else {
        // Para "Guardar y agregar otro", reseteamos currentEntry para que el form se limpie
        // y mantenemos el modal abierto.
         setCurrentEntry(null); 
         setIsEditingForm(false); 
      }
    } catch (error) {
      alert(error.message); // O un modal de error más sofisticado
    }
  };

  const handleDeleteConfirmed = () => {
    if (currentEntry) {
      const updatedEntries = deleteAbastecimientoEntryById(currentEntry.id, entries);
      setEntries(updatedEntries);
      handleCloseModals();
    }
  };

  const handleDepleteConfirmed = (reason) => {
    if(currentEntry) {
        try {
            const updatedEntries = depleteEntry(currentEntry.id, reason, entries);
            setEntries(updatedEntries);
            handleCloseModals();
        } catch (error) {
            alert(error.message);
        }
    }
  };

  const filteredEntries = entries.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      (p.empleado && p.empleado.toLowerCase().includes(busqueda.toLowerCase())) ||
      p.fechaIngreso.includes(busqueda) ||
      (p.category && p.category.toLowerCase().includes(busqueda.toLowerCase()))
  );

  return (
    <div className="abastecimiento-page-container"> {/* Cambiar clase principal */}
      <NavbarAdmin />
      <div className="main-content-area abastecimiento-main-content"> {/* Clases para layout */}
        <div className="abastecimiento-content-wrapper">
          <h1>Gestión de Abastecimiento</h1>
          <div className="containerAgregarBuscarAbastecimiento">
            <input
              type="text"
              placeholder="Buscar producto, empleado, fecha o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="inputBuscarAbastecimiento"
            />
            <button
              className="botonAgregarAbastecimiento"
              onClick={() => handleOpenFormModal()}
            >
              Agregar Producto
            </button>
          </div>
          <AbastecimientoTable
            entries={filteredEntries}
            onView={handleOpenDetailsModal}
            onEdit={handleOpenFormModal}
            onDelete={handleOpenDeleteConfirm}
            onDeplete={handleOpenDepleteModal}
          />
        </div>
      </div>

      <AbastecimientoFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSubmitForm}
        initialData={currentEntry}
        isEditing={isEditingForm}
      />
      <AbastecimientoDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        item={currentEntry}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteConfirmed}
        title="¿Eliminar producto?"
        message={`¿Estás seguro de que deseas eliminar el producto "${currentEntry?.nombre || ''}"?`}
      />
      <DepleteProductModal
        isOpen={isDepleteModalOpen}
        onClose={handleCloseModals}
        onConfirm={handleDepleteConfirmed}
        productName={currentEntry?.nombre}
      />
    </div>
  );
}

export default ListaAbastecimientoPage;