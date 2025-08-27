// src/features/clientes/components/ClienteCrearModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm';
import '../css/Clientes.css';

// INICIO DE MODIFICACIÓN: Aceptar 'errors' como prop y simplificar.
const ClienteCrearModal = ({ isOpen, onClose, onSubmit, errors }) => {
  // FIN DE MODIFICACIÓN

  const getInitialFormState = () => ({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    tipoDocumento: 'Cédula de Ciudadanía',
    numeroDocumento: '',
    fechaNacimiento: '',
    contrasena: '',
    estado: true,
  });

  const [formData, setFormData] = useState(getInitialFormState());

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // INICIO DE MODIFICACIÓN: Se elimina toda la validación del lado del cliente.
  // validateField, validateAllFormFields, etc. -> ELIMINADOS
  // FIN DE MODIFICACIÓN

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    // La validación ahora es manejada por el hook `useClientes` a través de la respuesta del backend.
    await onSubmit(formData);
  };

  if (!isOpen) return null;

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
          {/* INICIO DE MODIFICACIÓN: Pasar 'errors' al formulario. */}
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={false}
            formErrors={errors} // Se pasa el objeto de errores del hook
          />
          {/* FIN DE MODIFICACIÓN */}

          {/* El error general ahora se puede manejar si el hook lo provee. */}
          {errors.general && <p className="error-message general-error">{errors.general}</p>}

          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal">
              Guardar Cliente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteCrearModal;