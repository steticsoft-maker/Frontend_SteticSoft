// src/features/clientes/components/ClienteEditarModal.jsx
import React from 'react';
import ClienteForm from './ClienteForm';
import '../css/Clientes.css';

const ClienteEditarModal = ({
    isOpen,
    onClose,
    onSubmit,
    formData,
    formErrors,
    isFormValid,
    touchedFields,
    handleInputChange,
    handleInputBlur,
    isVerifying
}) => {

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-clientes">
      <div className="modal-content-clientes formulario">
        <div className="modal-header-clientes">
          <h2>Editar Cliente</h2>
          <button type="button" className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm} noValidate>
          <ClienteForm
            formData={formData}
            onFormChange={handleInputChange}
            onBlur={handleInputBlur}
            isEditing={true}
            formErrors={formErrors}
            touchedFields={touchedFields}
            isVerifying={isVerifying}
          />
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal" disabled={!isFormValid || isVerifying}>
              {isVerifying ? 'Verificando...' : 'Actualizar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteEditarModal;