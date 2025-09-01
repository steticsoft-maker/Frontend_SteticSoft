// src/features/clientes/components/ClienteCrearModal.jsx
import React from 'react';
import ClienteForm from './ClienteForm';
import '../css/Clientes.css';

const ClienteCrearModal = ({
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
    <div className="modal-clientes">
      <div className="modal-content-clientes formulario">
        <div className="modal-header-clientes">
          <h2>Agregar Cliente</h2>
          <button type="button" className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          <ClienteForm
            formData={formData}
            onFormChange={handleInputChange}
            onFormBlur={handleInputBlur}
            isEditing={false}
            formErrors={formErrors}
          />
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteCrearModal;