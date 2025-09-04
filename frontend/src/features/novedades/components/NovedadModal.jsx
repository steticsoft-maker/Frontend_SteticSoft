import React, { useState } from 'react';
import NovedadForm from './NovedadForm';
import { crearNovedad, actualizarNovedad } from '../services/horariosService';
import { toast } from 'react-toastify';
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
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
    >
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Novedad' : 'Crear Nueva Novedad'}</h2>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✖
          </button>
        </div>

        <div className="modal-body">
          <NovedadForm
            onFormSubmit={handleFormSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            initialData={novedadToEdit}
            isEditing={isEditing}
          />
        </div>
        <div className="modal-footer"></div>
      </div>
    </div>
  );
};

export default NovedadModal;
