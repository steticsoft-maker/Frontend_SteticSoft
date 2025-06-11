// src/features/clientes/components/ClienteCrearModal.jsx
import React, { useState, useEffect } from 'react';
import ClienteForm from './ClienteForm'; // Reutilizaremos el ClienteForm

const ClienteCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    tipoDocumento: 'CC', // Valor por defecto para el select
    numeroDocumento: '',
    // direccion: '', // Eliminado
    // ciudad: '',    // Eliminado
    fechaNacimiento: '',
    password: '', // Campo de contraseña para nuevos clientes
    estado: true, // Nuevos clientes activos por defecto
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({}); // Para validaciones futuras

  // Resetear formulario cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setFormErrors({});
    }
  }, [isOpen]);

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
    // if (!formData.direccion.trim()) errors.direccion = "La dirección es obligatoria."; // Eliminado
    if (!formData.fechaNacimiento) errors.fechaNacimiento = "La fecha de nacimiento es obligatoria.";
    if (!formData.password.trim()) errors.password = "La contraseña es obligatoria para nuevos clientes.";
    // Puedes añadir más validaciones (ej. formato de teléfono, documento, etc.)
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData); // Enviar datos al padre (ListaClientesPage)
  };

  if (!isOpen) return null;

  return (
    <div className="modal-clientes"> {/* Usa las clases de Clientes.css */}
      <div className="modal-content-clientes formulario">
        <h2>Agregar Cliente</h2>
        <form className="formularioModalClientes" onSubmit={handleSubmitForm}>
          <ClienteForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={false} // Siempre false para el modal de creación
            formErrors={formErrors}
            // No necesita availableRoles como en Usuarios
          />
          <div className="clientes-form-actions">
            <button type="submit" className="botonguardarClienteModal">
              Guardar Cliente
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

export default ClienteCrearModal;