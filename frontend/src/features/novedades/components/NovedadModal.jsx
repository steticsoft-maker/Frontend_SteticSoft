// src/features/horarios/components/NovedadModal.jsx
import React, { useState } from 'react';

// --- MODIFICADO: Se importa el formulario con el nuevo nombre ---
import NovedadForm from './NovedadForm'; 

// --- MODIFICADO: Se importan las funciones del servicio correcto ---
import { crearNovedad, actualizarNovedad } from '../services/horariosService'; // Asegúrate que la ruta sea correcta

// --- MODIFICADO: Componente y props renombrados para consistencia ---
const NovedadModal = ({ onClose, onSuccess, novedadToEdit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = !!novedadToEdit;

  const handleFormSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (isEditing) {
        // --- MODIFICADO: Se llama a la nueva función de actualización ---
        // Se usa 'idNovedad' que es la propiedad correcta del objeto
        await actualizarNovedad(novedadToEdit.idNovedad, formData);
      } else {
        // --- MODIFICADO: Se llama a la nueva función de creación ---
        await crearNovedad(formData);
      }
      onSuccess(); // Llama a la función de éxito para recargar la tabla y cerrar el modal
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Ocurrió un error.`;
      setError(errorMessage);
      console.error("Error al guardar la novedad:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay"> {/* Puedes usar nombres de clase genéricos */}
      <div className="modal-content form-modal">
        <div className="modal-header">
          <h3>{isEditing ? 'Editar Novedad de Horario' : 'Agregar Novedad de Horario'}</h3>
          <button onClick={onClose} className="modal-close-button" disabled={isLoading}>&times;</button>
        </div>
        <div className="modal-body">
          {error && <p className="error-message">{error}</p>}
          
          {/* --- MODIFICADO: Se renderiza el nuevo componente de formulario --- */}
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