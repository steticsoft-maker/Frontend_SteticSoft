import React from 'react'; // Removidos useState, useEffect
import UsuarioForm from './UsuarioForm';

const UsuarioCrearModal = ({
  isOpen,
  onClose,
  // onSubmit de useUsuarios ya no necesita formData como argumento
  // porque el hook ya gestiona formData internamente.
  onSubmit, // Esta será handleSaveUsuario del hook
  availableRoles,
  isLoading, // Este es isSubmitting del hook
  // Props del hook useUsuarios para el formulario
  formData,
  formErrors,
  isFormValid,
  isVerifyingEmail,
  handleInputChange, // Para el onChange del UsuarioForm
  handleInputBlur   // Para el onBlur del UsuarioForm
}) => {

  // Ya no se necesita estado local para formData, formErrors, ni funciones de validación.
  // El useEffect para resetear el form al abrir ya no es necesario aquí,
  // el hook useUsuarios resetea formData y formErrors en handleOpenModal y closeModal.

  const handleSubmit = (e) => {
    e.preventDefault();
    // La validación ahora está centralizada en useUsuarios y se verifica antes de llamar a onSubmit
    // El botón de submit se deshabilita si !isFormValid
    // Aquí simplemente llamamos a la función de guardado del hook.
    onSubmit();
  };

  if (!isOpen) return null;

  return (
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-form">
        <button type="button" className="modal-close-button-x" onClick={onClose}>
          &times;
        </button>
        <h2>Crear Nuevo Usuario</h2>
        <form onSubmit={handleSubmit}>
          <UsuarioForm
            formData={formData}
            // onFormChange se reemplaza por handleInputChange y handleInputBlur
            onInputChange={handleInputChange} // Nuevo prop esperado por UsuarioForm
            onInputBlur={handleInputBlur}   // Nuevo prop esperado por UsuarioForm
            availableRoles={availableRoles}
            isEditing={false}
            isUserAdmin={false} // En creación, nunca es el admin protegido
            formErrors={formErrors}
            isVerifyingEmail={isVerifyingEmail} // Para mostrar feedback en el campo de correo
          />
          {/* El manejo de errores generales (_general) podría moverse al hook o mantenerse aquí si es específico del modal */}
          {/* {formErrors._general && <p className="auth-form-error" style={{textAlign: 'center'}}>{formErrors._general}</p>} */}

          <div className="usuarios-form-actions">
            <button
              type="submit"
              className="usuarios-form-buttonGuardar"
              disabled={!isFormValid || isLoading || isVerifyingEmail}
            >
              {isLoading ? 'Creando...' : 'Crear Usuario'}
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
        </form>
      </div>
    </div>
  );
};

export default UsuarioCrearModal;