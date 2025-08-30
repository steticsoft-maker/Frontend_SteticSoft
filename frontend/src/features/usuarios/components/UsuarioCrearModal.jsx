// src/features/usuarios/components/UsuarioCrearModal.jsx
import React from 'react';
import UsuarioForm from './UsuarioForm';

const UsuarioCrearModal = ({
  isOpen,
  onClose,
  onSubmit,
  availableRoles,
  formData,
  formErrors,
  isFormValid,
  isVerifyingEmail,
  isSubmitting,
  handleInputChange,
  handleInputBlur,
  // --- INICIO DE LA CORRECCIÓN ---
  requiresProfile, // Recibimos el valor booleano directamente del hook
  // --- FIN DE LA CORRECCIÓN ---
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // La validación ya está controlada por el estado 'isFormValid' del hook
    if (isFormValid) {
      onSubmit();
    }
  };

  if (!isOpen) return null;

  // Determina si los campos de perfil son necesarios
  const selectedRole = availableRoles.find(r => r.idRol === parseInt(formData.idRol, 10));
  const isCliente = selectedRole?.tipoPerfil === 'CLIENTE';

  return (
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-form">
        <button
          type="button"
          className="modal-close-button-x"
          onClick={onClose}
        >
          &times;
        </button>
        <h2>Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit} noValidate>
          <UsuarioForm
            formData={formData}
            formErrors={formErrors}
            onInputChange={handleInputChange}
            onInputBlur={handleInputBlur}
            availableRoles={availableRoles}
            isEditing={false}
            isVerifyingEmail={isVerifyingEmail}
            requiresProfile={requiresProfile}
            isCliente={isCliente}
            isUserAdmin={false} // En creación, nunca es el admin
          />
          <div className="usuarios-form-actions">
            <button
              type="submit"
              className="usuarios-form-buttonGuardar"
              disabled={!isFormValid || isSubmitting || isVerifyingEmail}
            >
              {isSubmitting ? "Creando..." : "Crear Usuario"}
            </button>
            <button
              type="button"
              className="usuarios-form-buttonCancelar"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UsuarioCrearModal;