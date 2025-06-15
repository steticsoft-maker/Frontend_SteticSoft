// src/features/clientes/components/ClienteEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm'; // Reutilizaremos el ClienteForm

const ClienteEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({}); // Para validaciones futuras

  useEffect(() => {
    if (isOpen && initialData) {
      // Al editar, no incluimos la contraseña (contrasena) para que no se muestre ni se envíe directamente
      // Se manejaría por separado si se quiere permitir cambio de contraseña.
      // initialData ya debería venir con 'correo' y el estado booleano.
      const dataToEdit = { ...initialData };
      delete dataToEdit.contrasena; // Aseguramos que la contraseña no esté en el form para editar

      setFormData({
        ...dataToEdit,
        correo: initialData.correo,
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
    if (!formData.nombre?.trim()) errors.nombre = "El nombre es obligatorio."; // Uso de optional chaining para seguridad
    if (!formData.apellido?.trim()) errors.apellido = "El apellido es obligatorio.";
    // Usar formData.correo en lugar de formData.email
    if (!formData.correo?.trim() || !/\S+@\S+\.\S+/.test(formData.correo)) errors.correo = "El correo electrónico no es válido.";
    if (!formData.telefono?.trim()) errors.telefono = "El teléfono es obligatorio.";
    if (!formData.tipoDocumento) errors.tipoDocumento = "El tipo de documento es obligatorio.";
    if (!formData.numeroDocumento?.trim()) errors.numeroDocumento = "El número de documento es obligatorio.";
    if (!formData.fechaNacimiento) errors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
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