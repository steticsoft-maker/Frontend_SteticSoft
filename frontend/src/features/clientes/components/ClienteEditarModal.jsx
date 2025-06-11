// src/features/clientes/components/ClienteEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm'; // Reutilizaremos el ClienteForm

const ClienteEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({}); // Para validaciones futuras

  useEffect(() => {
    if (isOpen && initialData) {
      // Al editar, no incluimos la contraseña para que no se muestre
      // Se manejaría por separado si se quiere permitir cambio de contraseña
      const { password, ...dataToEdit } = initialData;
      setFormData({
        ...dataToEdit,
        estado: initialData.estado !== undefined ? initialData.estado : true, // Asegurar que estado se cargue
      });
      setFormErrors({});
    } else if (isOpen && !initialData) {
      console.error("Modal de edición de cliente abierto sin initialData. Cerrando.");
      onClose(); // Cerrar si no hay datos para editar
    }
  }, [isOpen, initialData, onClose]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!formData.apellido.trim()) errors.apellido = "El apellido es obligatorio.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "El email no es válido.";
    if (!formData.telefono.trim()) errors.telefono = "El teléfono es obligatorio.";
    if (!formData.tipoDocumento) errors.tipoDocumento = "El tipo de documento es obligatorio.";
    if (!formData.numeroDocumento.trim()) errors.numeroDocumento = "El número de documento es obligatorio.";
    // La dirección y ciudad han sido eliminadas de las validaciones
    if (!formData.fechaNacimiento) errors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    // La contraseña no se valida aquí ya que no se edita en este formulario
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData); // Enviar datos al padre (ListaClientesPage)
  };

  if (!isOpen || !initialData) return null; // No renderizar si no está abierto o no hay datos

  return (
    <div className="modal-clientes"> {/* Usa las clases de Clientes.css */}
      <div className="modal-content-clientes formulario">
        <h2>Editar Cliente</h2>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={true} // Siempre true para el modal de edición
            formErrors={formErrors}
          />
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal">
              Actualizar Cliente
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

export default ClienteEditarModal;