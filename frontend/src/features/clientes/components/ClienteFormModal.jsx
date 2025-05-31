// src/features/clientes/components/ClienteFormModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm';

const ClienteFormModal = ({ isOpen, onClose, onSubmit, initialData, modalType }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (initialData) {
      // Si es edición, no incluir password a menos que se vaya a cambiar explícitamente
      const { password, ...restOfData } = initialData;
      setFormData({ ...restOfData, estado: initialData.estado !== undefined ? initialData.estado : true });
    } else { // Creación
      setFormData({
        nombre: '', apellido: '', email: '', telefono: '', tipoDocumento: '',
        numeroDocumento: '', direccion: '', ciudad: '', fechaNacimiento: '', password: '', estado: true
      });
    }
  }, [initialData, isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-clientes"> {/* Usar clases del CSS original por ahora */}
      <div className="modal-content-clientes formulario"> {/* Añadir clase "formulario" aquí */}
        <h2>{modalType === 'create' ? 'Agregar Cliente' : 'Editar Cliente'}</h2>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          {/* El div .formularioModalInputClientes estaba en el JSX original, 
              lo reemplazamos con el componente ClienteForm */}
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={modalType === 'edit'}
          />
          <div className="clientes-form-actions"> {/* CLASE CONSISTENTE */}
            <button type="submit" className="botonguardarClienteModal"> {/* Clases originales están bien si se estilizan abajo */}
              {modalType === 'create' ? 'Guardar' : 'Guardar Cambios'}
            </button>
            <button type="button" className="botonModalCancelar-Cerrar" onClick={onClose}> 
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClienteFormModal;