// src/features/clientes/components/ClienteEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm';
import '../css/Clientes.css';

// INICIO DE MODIFICACIÓN: Aceptar 'errors' como prop y simplificar.
const ClienteEditarModal = ({ isOpen, onClose, onSubmit, initialData, errors }) => {
  // FIN DE MODIFICACIÓN

  const [formData, setFormData] = useState({});

  // INICIO DE MODIFICACIÓN: Se elimina el estado de errores interno y la validación del lado del cliente.
  // const [formErrors, setFormErrors] = useState({});
  // const [generalError, setGeneralError] = useState('');
  // FIN DE MODIFICACIÓN

  useEffect(() => {
    if (isOpen && initialData) {
      const dataToEdit = { ...initialData };
      // La contraseña no se debe cargar en el formulario de edición.
      delete dataToEdit.contrasena;
      setFormData(dataToEdit);
    }
  }, [isOpen, initialData]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // INICIO DE MODIFICACIÓN: Se elimina toda la validación del lado del cliente.
  // validateField, validateAllFormFields, etc. -> ELIMINADOS
  // FIN DE MODIFICACIÓN

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    await onSubmit(formData);
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
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          {/* INICIO DE MODIFICACIÓN: Pasar 'errors' al formulario. */}
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={true}
            formErrors={errors} // Se pasa el objeto de errores del hook
          />
          {/* FIN DE MODIFICACIÓN */}

          {errors.general && <p className="error-message general-error">{errors.general}</p>}

          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal">
              Actualizar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteEditarModal;