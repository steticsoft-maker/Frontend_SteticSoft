// src/features/usuarios/components/UsuarioCrearModal.jsx
import React, { useState, useEffect } from 'react';
import UsuarioForm from './UsuarioForm';
import { getAvailableRoles } from '../services/usuariosService'; // Para la lista de roles

const UsuarioCrearModal = ({ isOpen, onClose, onSubmit, allUsers }) => {
  // Define el estado inicial del formulario para un nuevo usuario
  const getInitialFormState = () => ({
    nombre: '',
    tipoDocumento: 'CC', // Valor por defecto
    documento: '',
    email: '',
    telefono: '',
    direccion: '',
    rol: '', // Se seleccionará
    // La contraseña se manejará dentro de UsuarioForm si es específica para creación
    anulado: false, // Nuevos usuarios no están anulados por defecto
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [availableRoles, setAvailableRoles] = useState([]);
  const [formErrors, setFormErrors] = useState({}); // Para validaciones futuras

  useEffect(() => {
    if (isOpen) {
      // Resetear formulario y cargar roles disponibles cada vez que el modal se abre para crear
      setFormData(getInitialFormState());
      setAvailableRoles(getAvailableRoles(allUsers, null)); // null para indicar que es creación
      setFormErrors({});
    }
  }, [isOpen, allUsers]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) { // Limpiar error si el campo cambia
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
  };

  const validateForm = () => { // Función de validación básica
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!formData.tipoDocumento) errors.tipoDocumento = "El tipo de documento es obligatorio.";
    if (!formData.documento.trim()) errors.documento = "El número de documento es obligatorio.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "El email no es válido.";
    if (!formData.telefono.trim()) errors.telefono = "El teléfono es obligatorio.";
    if (!formData.direccion.trim()) errors.direccion = "La dirección es obligatoria.";
    if (!formData.rol) errors.rol = "Debe seleccionar un rol.";
    // La contraseña se valida en el servicio saveUsuario si es necesario
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData); // Enviar datos a ListaUsuariosPage
  };

  if (!isOpen) return null;

  return (
    <div className="usuarios-modalOverlay"> {/* Clases de Usuarios.css */}
      <div className="usuarios-modalContent usuarios-modalContent-form">
        <h2>Crear Usuario</h2>
        <form onSubmit={handleSubmitForm}> {/* El CSS aplicará grid si la clase está en el form o en un div interno */}
          <UsuarioForm
            formData={formData}
            onFormChange={handleFormChange}
            availableRoles={availableRoles}
            isEditing={false} // Siempre false para el modal de creación
            isUserAdmin={false} // Un nuevo usuario no puede ser el Admin protegido por defecto
            formErrors={formErrors}
          />
          <div className="usuarios-form-actions">
            <button type="submit" className="usuarios-form-buttonGuardar">
              Crear Usuario
            </button>
            <button type="button" className="usuarios-form-buttonCancelar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioCrearModal;