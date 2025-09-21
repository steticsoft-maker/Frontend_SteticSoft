// src/features/usuarios/components/UsuarioEditarModal.jsx
import React from "react";
import UsuarioForm from "./UsuarioForm";

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
  checkRequiresProfile,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (isFormValid) {
      onSubmit();
    }
  };

  if (!isOpen) return null;

  const requiresProfile = checkRequiresProfile(formData.idRol);
  const selectedRole = availableRoles.find(
    (r) => r.idRol === parseInt(formData.idRol, 10)
  );
  const isCliente = selectedRole?.tipoPerfil === "CLIENTE";

  // Verifica si el usuario a editar es el 'Administrador'
  const isUserAdmin = formData.correo === "admin@steticsoft.com"; // O una comprobación más robusta si la tienes

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content large">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Editar Usuario</h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="admin-modal-body">
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
            </form>
          )}
        </div>
        <div className="admin-modal-footer">
          <button
            type="submit"
            className="admin-form-button"
            disabled={!isFormValid || isSubmitting || isVerifyingEmail}
            onClick={handleSubmit}
          >
            {isSubmitting ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button
            type="button"
            className="admin-form-button secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default UsuarioEditarModal;
