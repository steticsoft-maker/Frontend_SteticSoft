// src/features/clientes/components/ClienteEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm'; // Reutilizaremos el ClienteForm
import '../css/Clientes.css'; // Asegúrate de que la importación de CSS esté aquí

const ClienteEditarModal = ({ isOpen, onClose, onSubmit, initialData, formErrors = {} }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      const dataToEdit = { ...initialData };
      delete dataToEdit.contrasena;
      delete dataToEdit.confirmPassword;

      setFormData({
        ...dataToEdit,
        correo: initialData.correo,
        estado: initialData.estado !== undefined ? initialData.estado : true,
      });
    } else if (isOpen && !initialData) {
      onClose();
    }
  }, [isOpen, initialData, onClose]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen || !initialData) return null; // No renderizar si no está abierto o no hay datos

  return (
    <div className="modal-clientes">
      <div className="modal-content-clientes formulario">
        {/* Nuevo div para el encabezado del modal con título y botón de cierre */}
        <div className="modal-header-clientes">
          <h2>Editar Cliente</h2> {/* Título para el modal de edición */}
          <button type="button" className="modal-close-button" onClick={onClose}>
            &times; {/* Entidad HTML para el carácter 'X' */}
          </button>
        </div>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={true} 
            formErrors={formErrors}
          />
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal">
              Actualizar Cliente
            </button>
            {/* El botón Cancelar se ha eliminado */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteEditarModal;