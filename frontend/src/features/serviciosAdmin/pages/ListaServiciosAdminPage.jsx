// src/features/serviciosAdmin/pages/ListaServiciosAdminPage.jsx
import React, { useState, useEffect } from 'react';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import ServiciosAdminTable from '../components/ServiciosAdminTable';
import ServicioAdminFormModal from '../components/ServicioAdminFormModal';
import ServicioAdminDetalleModal from '../components/ServicioAdminDetalleModal';
import ConfirmModal from '../../../shared/components/common/ConfirmModal'; // Usar genérico
import ValidationModal from '../../../shared/components/common/ValidationModal'; // Usar genérico
import {
  fetchServiciosAdmin,
  saveServicioAdmin,
  deleteServicioAdminById,
  toggleServicioAdminEstado
} from '../services/serviciosAdminService';
import '../css/ServiciosAdmin.css'; // Nuevo CSS para esta feature

function ListaServiciosAdminPage() {
  const [servicios, setServicios] = useState([]);
  const [search, setSearch] = useState('');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  
  const [currentServicio, setCurrentServicio] = useState(null);
  const [formModalType, setFormModalType] = useState('agregar');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    setServicios(fetchServiciosAdmin());
  }, []);

  const handleOpenModal = (type, servicio = null) => {
    setCurrentServicio(servicio);
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
    setCurrentServicio(null);
    setValidationMessage('');
  };

  const handleSave = (servicioData) => {
    try {
      const updatedServicios = saveServicioAdmin(servicioData, servicios);
      setServicios(updatedServicios);
      handleCloseModals();
    } catch (error) {
      setValidationMessage(error.message);
      setIsValidationModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (currentServicio) {
      const updatedServicios = deleteServicioAdminById(currentServicio.id, servicios);
      setServicios(updatedServicios);
      handleCloseModals();
    }
  };

  const handleToggleEstado = (servicioId) => {
    const updatedServicios = toggleServicioAdminEstado(servicioId, servicios);
    setServicios(updatedServicios);
  };

  const filteredServicios = servicios.filter(s =>
    s.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (s.categoria && s.categoria.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="servicios-admin-page-container"> {/* Nueva clase para la página */}
      <NavbarAdmin />
      <div className="servicios-content"> {/* Clase del CSS original */}
        <h1 className="tituloServicios">Gestión de Servicios</h1>
        <div className="barraBusqueda-BotonSuperiorAgregarServicio"> {/* Clase del CSS original */}
          <div className="BarraBusquedaServicio"> {/* Clase del CSS original */}
            <input
              type="text"
              placeholder="Buscar servicio (nombre, categoría)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="botonAgregarServicio" onClick={() => handleOpenModal('agregar')}> {/* Clase del CSS original */}
            Agregar Servicio
          </button>
        </div>
        <ServiciosAdminTable
          servicios={filteredServicios}
          onView={(serv) => handleOpenModal('ver', serv)}
          onEdit={(serv) => handleOpenModal('agregar', serv)} // Debería ser 'editar'
          onDeleteConfirm={(serv) => handleOpenModal('delete', serv)}
          onToggleEstado={handleToggleEstado}
        />
      </div>

      <ServicioAdminFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSave}
        initialData={currentServicio}
        modalType={formModalType}
      />
      <ServicioAdminDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        servicio={currentServicio}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        message={`¿Está seguro de que desea eliminar el servicio "${currentServicio?.nombre || ''}"?`}
      />
       <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={handleCloseModals}
        title="Aviso"
        message={validationMessage}
      />
    </div>
  );
}

export default ListaServiciosAdminPage;