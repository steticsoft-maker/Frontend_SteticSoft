// src/features/usuarios/components/UsuarioCrearModal.jsx
import React from "react";
import UsuarioForm from "./UsuarioForm";

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
  const selectedRole = availableRoles.find(
    (r) => r.idRol === parseInt(formData.idRol, 10)
  );
  const isCliente = selectedRole?.tipoPerfil === "CLIENTE";

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content large">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Crear Nuevo Usuario</h2>
          <button type="button" className="admin-modal-close" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="admin-modal-body">
          <form id="usuario-form" onSubmit={handleSubmit} noValidate>
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
          </form>
        </div>
        <div className="admin-modal-footer">
          <button
            type="submit"
            className="admin-form-button"
            form="usuario-form"
            disabled={!isFormValid || isSubmitting || isVerifyingEmail}
          >
            {isSubmitting ? "Creando..." : "Crear Usuario"}
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

export default UsuarioCrearModal;
