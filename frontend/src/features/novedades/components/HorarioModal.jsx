import React, { useState } from 'react';
import HorarioForm from './HorarioForm';
import { saveHorario, updateHorario } from '../services/horariosService';

const HorarioModal = ({ onClose, onSuccess, horarioToEdit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!horarioToEdit;

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing) {
        await updateHorario(horarioToEdit.id, formData);
      } else {
        await saveHorario(formData);
      }
      onSuccess();
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Ocurrió un error.`;
      setError(errorMessage);
      console.error("Error al guardar el horario:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="novedades-modal-overlay">
      <div className="novedades-modal-content form-modal">
        <div className="modal-header">
          <h3>{isEditing ? 'Editar Horario' : 'Agregar Nuevo Horario'}</h3>
          <button onClick={onClose} className="modal-close-button" disabled={isLoading}>&times;</button>
        </div>
        <div className="modal-body">
          {error && <p className="error-message" style={{ marginBottom: '15px' }}>{error}</p>}
          
          <HorarioForm
            onFormSubmit={handleFormSubmit}
            onCancel={onClose}
            isLoading={isLoading}
            initialData={horarioToEdit}
            isEditing={isEditing}
          />
        </div>
      </div>
    </div>
  );
};

export default HorarioModal;