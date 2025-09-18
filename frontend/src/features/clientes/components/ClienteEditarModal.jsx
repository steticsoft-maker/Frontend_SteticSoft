// src/features/clientes/components/ClienteEditarModal.jsx
import React from 'react';
import ClienteForm from './ClienteForm';
import '../../../shared/styles/admin-layout.css';

const ClienteEditarModal = ({
  isOpen,
  onClose,
  formData,
  formErrors,
  handleInputChange,
  handleInputBlur,
  handleSave,
  isSubmitting,
}) => {
  if (!isOpen) return null;

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    await handleSave();
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content large">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Editar Cliente</h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="admin-modal-body">
          <form onSubmit={handleSubmitForm} noValidate>
            <ClienteForm
              formData={formData}
              onFormChange={handleInputChange}
              onFormBlur={handleInputBlur}
              isEditing={true}
              formErrors={formErrors}
            />
          </form>
        </div>
        <div className="admin-modal-footer">
          <button type="submit" className="admin-form-button" form="cliente-form">
            {isSubmitting ? 'Actualizando...' : 'Actualizar Cliente'}
          </button>
          <button
            type="button"
            className="admin-form-button secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClienteEditarModal;