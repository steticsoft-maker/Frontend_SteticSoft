import React, { useState } from 'react';
import NovedadForm from './NovedadForm';
import { crearNovedad, actualizarNovedad } from '../services/horariosService';
import { toast } from 'react-toastify';
import '../../../shared/styles/admin-layout.css';
import '../css/ConfigHorarios.css';

const NovedadModal = ({ onClose, onSuccess, novedadToEdit, isEditing }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        await actualizarNovedad(novedadToEdit.idNovedad, formData);
        toast.success('✅ Novedad actualizada con éxito.');
      } else {
        await crearNovedad(formData);
        toast.success('✅ Novedad creada con éxito.');
      }
      onSuccess(); // refresca y cierra el modal
    } catch (error) {
      console.error('Error al guardar la novedad:', error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          '❌ Error al guardar la novedad.'
      );
      setIsLoading(false); // solo detener loading en caso de error
    }
  };

  // Cierre si clickea fuera del modal
  const handleOverlayClick = (e) => {
    if (e.target.classList.contains('modal-overlay')) {
      onClose();
    }
  };

  return (
    <div
      className="admin-modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className="admin-modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">{isEditing ? 'Editar Novedad' : 'Crear Nueva Novedad'}</h2>
        </div>

        <div className="admin-modal-body">
          <NovedadForm
            onFormSubmit={handleFormSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            initialData={novedadToEdit}
            isEditing={isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default NovedadModal;
