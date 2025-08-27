import React, { useState } from 'react';
import NovedadForm from './NovedadForm';
import { crearNovedad, actualizarNovedad } from '../services/horariosService';
import { toast } from 'react-toastify';
import '../css/ConfigHorarios.css'; // Un CSS genérico para modales

const NovedadModal = ({ onClose, onSuccess, novedadToEdit, isEditing }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    try {
      if (isEditing) {
        await actualizarNovedad(novedadToEdit.idNovedad, formData);
        toast.success('Novedad actualizada con éxito.');
      } else {
        await crearNovedad(formData);
        toast.success('Novedad creada con éxito.');
      }
      onSuccess(); // Llama a la función onSuccess que recarga y cierra
    } catch (error) {
      console.error('Error al guardar la novedad:', error);
      toast.error(error.message || 'Error al guardar la novedad.');
      setIsLoading(false); // Detiene la carga solo si hay error
    }
    // No es necesario setIsLoading(false) en caso de éxito porque el modal se cierra
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditing ? 'Editar Novedad' : 'Crear Nueva Novedad'}</h2>
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
      </div>
    </div>
  );
};

export default NovedadModal;