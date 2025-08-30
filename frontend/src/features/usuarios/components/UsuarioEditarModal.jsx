// src/features/usuarios/components/UsuarioEditarModal.jsx
import React from 'react';
import UsuarioForm from './UsuarioForm';

const UsuarioEditarModal = ({
  isOpen,
  onClose,
  onSubmit,
  availableRoles,
  // Props que vienen del hook useUsuarios
  formData,
  formErrors,
  isFormValid,
  isVerifyingEmail,
  isSubmitting,
  isLoading, // Se puede usar para mostrar carga inicial de datos
  handleInputChange,
  handleInputBlur,
  checkRequiresProfile
}) => {

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit();
    }
  };

  if (!isOpen) return null;

  const requiresProfile = checkRequiresProfile(formData.idRol);
  const selectedRole = availableRoles.find(r => r.idRol === parseInt(formData.idRol, 10));
  const isCliente = selectedRole?.tipoPerfil === 'CLIENTE';

  // Verifica si el usuario a editar es el 'Administrador'
  const isUserAdmin = formData.correo === 'admin@steticsoft.com'; // O una comprobación más robusta si la tienes

  return (
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-form">
        <button type="button" className="modal-close-button-x" onClick={onClose}>&times;</button>
        <h2>Editar Usuario</h2>
        {isLoading ? (
          <p>Cargando datos del usuario...</p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <UsuarioForm
              formData={formData}
              formErrors={formErrors}
              onInputChange={handleInputChange}
              onInputBlur={handleInputBlur}
              availableRoles={availableRoles}
              isEditing={true} // <-- La principal diferencia
              isVerifyingEmail={isVerifyingEmail}
              requiresProfile={requiresProfile}
              isCliente={isCliente}
              isUserAdmin={isUserAdmin}
            />
            <div className="usuarios-form-actions">
              <button
                type="submit"
                className="usuarios-form-buttonGuardar"
                disabled={!isFormValid || isSubmitting || isVerifyingEmail}
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
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
        )}
      </div>
    </div>
  );
};

export default UsuarioEditarModal;