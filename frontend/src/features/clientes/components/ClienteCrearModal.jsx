// src/features/clientes/components/ClienteCrearModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm';
import '../css/Clientes.css'; // Asegúrate de que la importación de CSS esté aquí

const ClienteCrearModal = ({ isOpen, onClose, onSubmit, formErrors = {} }) => {
  const getInitialFormState = () => ({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    tipoDocumento: 'Cédula de Ciudadanía',
    numeroDocumento: '',
    fechaNacimiento: '',
    contrasena: '',
    confirmPassword: '',
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

  const handleSubmitForm = (e) => {
    e.preventDefault();
    const dataToSubmit = { ...formData };
    delete dataToSubmit.confirmPassword;
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-clientes"> {/* Usa las clases de Clientes.css */}
      <div className="modal-content-clientes formulario">
        {/* Nuevo div para el encabezado del modal con título y botón de cierre */}
        <div className="modal-header-clientes">
          <h2>Agregar Cliente</h2>
          <button type="button" className="modal-close-button" onClick={onClose}>
            &times; {/* Entidad HTML para el carácter 'X' */}
          </button>
        </div>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={false} // Siempre false para el modal de creación
            formErrors={formErrors}
          />
          {generalError && <p className="error-message general-error">{generalError}</p>} {/* Mensaje de error general */}
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal">
              Guardar Cliente
            </button>
            {/* El botón Cancelar ha sido eliminado */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteCrearModal;