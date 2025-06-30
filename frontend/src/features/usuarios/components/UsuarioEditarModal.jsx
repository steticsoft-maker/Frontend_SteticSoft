// src/features/usuarios/components/UsuarioEditarModal.jsx
import React from "react"; // Removidos useState, useEffect
import UsuarioForm from "./UsuarioForm";
// getRolesAPI ya no se importa aquí, availableRoles viene del hook useUsuarios

const UsuarioEditarModal = ({
  isOpen,
  onClose,
  onSubmit, // Esta será handleSaveUsuario del hook
  initialData, // Sigue siendo necesario para determinar isUserAdminProtected
  availableRoles, // Del hook
  isLoading, // isSubmitting del hook
  // Props del hook useUsuarios para el formulario
  formData,
  formErrors,
  isFormValid,
  isVerifyingEmail,
  handleInputChange,
  handleInputBlur
}) => {

  // El estado local de formData, formErrors, availableRoles, isLoadingRoles ya no es necesario.
  // El useEffect para cargar roles y setear formData se maneja en useUsuarios (handleOpenModal).

  // Determinar si el usuario es el admin protegido basándose en el initialData.
  // initialData es currentUsuario del hook cuando se abre el modal de edición.
  const isUserAdminProtected = initialData?.rol?.nombre === "Administrador";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isUserAdminProtected) {
      onClose();
      return;
    }
    // La validación ahora está centralizada en useUsuarios.
    // El botón de submit se deshabilita si !isFormValid.
    onSubmit();
  };

  if (!isOpen) return null;
  // No necesitamos !initialData aquí porque handleOpenModal en useUsuarios
  // ya se encarga de inicializar formData. Si initialData fuera null, formData estaría vacío
  // y el formulario se mostraría vacío o con errores de campos requeridos.

  return (
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-form">
        <button type="button" className="modal-close-button-x" onClick={onClose}>
          &times;
        </button>
        <h2>Editar Usuario</h2>
        {isUserAdminProtected && (
          <p className="usuarios-admin-protected-message">
            El usuario 'Administrador' tiene campos y acciones restringidas.
          </p>
        )}
        <form onSubmit={handleSubmit}>
          {/* Ya no se necesita isLoadingRoles */}
          <UsuarioForm
            formData={formData} // Del hook
            onInputChange={handleInputChange} // Del hook
            onInputBlur={handleInputBlur}     // Del hook
            availableRoles={availableRoles} // Del hook
            isEditing={true}
            isUserAdmin={isUserAdminProtected} // Determinado a partir de initialData (currentUsuario)
            formErrors={formErrors} // Del hook
            isVerifyingEmail={isVerifyingEmail} // Del hook
          />
          {/* {formErrors._general && ( // Errores generales podrían manejarse con el ValidationModal general
            <p className="auth-form-error" style={{ textAlign: "center" }}>
              {formErrors._general}
            </p>
          )} */}

          {!isUserAdminProtected ? (
            <div className="usuarios-form-actions">
              <button
                type="submit"
                className="usuarios-form-buttonGuardar"
                disabled={!isFormValid || isLoading || isVerifyingEmail}
              >
                {isLoading ? 'Actualizando...' : 'Actualizar Usuario'}
              </button>
              <button
                type="button"
                className="usuarios-form-buttonCancelar"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </button>
            </div>
          ) : (
            <div className="usuarios-form-actions">
              <button
                type="button"
                className="usuarios-modalButton-cerrar"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default UsuarioEditarModal;