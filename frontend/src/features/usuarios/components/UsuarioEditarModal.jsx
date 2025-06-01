// src/features/usuarios/components/UsuarioEditarModal.jsx
import React, { useState, useEffect } from "react";
import UsuarioForm from "./UsuarioForm";
import { getAvailableRoles } from "../services/usuariosService"; // Para la lista de roles

const UsuarioEditarModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  allUsers,
}) => {
  const [formData, setFormData] = useState({});
  const [availableRoles, setAvailableRoles] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  // Determinar si el usuario que se está editando es el "Administrador" protegido
  const isUserAdminProtected = initialData?.rol === "Administrador";

  useEffect(() => {
    if (isOpen && initialData) {
      // Al editar, no incluimos la contraseña para que no se muestre ni se modifique aquí.
      // Se manejaría por separado si se quiere permitir cambio de contraseña.
      const { password, ...dataToEdit } = initialData;
      setFormData({
        ...dataToEdit,
        anulado: initialData.anulado || false, // Asegurar que 'anulado' se cargue
      });
      setAvailableRoles(getAvailableRoles(allUsers, initialData.id));
      setFormErrors({});
    } else if (isOpen && !initialData) {
      // Este caso no debería ocurrir si la lógica del padre es correcta
      console.error(
        "Modal de edición de usuario abierto sin initialData. Cerrando."
      );
      onClose();
    }
  }, [isOpen, initialData, allUsers, onClose]);

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prevErr) => ({ ...prevErr, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!formData.tipoDocumento)
      errors.tipoDocumento = "El tipo de documento es obligatorio.";
    if (!formData.documento.trim())
      errors.documento = "El número de documento es obligatorio.";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "El email no es válido.";
    if (!formData.telefono.trim())
      errors.telefono = "El teléfono es obligatorio.";
    if (!formData.direccion.trim())
      errors.direccion = "La dirección es obligatoria.";
    if (!formData.rol) errors.rol = "Debe seleccionar un rol.";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (isUserAdminProtected) {
      // No permitir submit si es el admin protegido
      onClose(); // Simplemente cerrar el modal
      return;
    }
    if (!validateForm()) return;
    onSubmit(formData); // Enviar datos a ListaUsuariosPage
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="usuarios-modalOverlay">
      {" "}
      {/* Clases de Usuarios.css */}
      <div className="usuarios-modalContent usuarios-modalContent-form">
        <h2>Editar Usuario</h2>
        {isUserAdminProtected && (
          <p className="usuarios-admin-protected-message">
            {" "}
            {/* Necesitarás estilo para esta clase */}
            El usuario 'Administrador' tiene campos y acciones restringidas.
            Solo se puede anular/activar desde la tabla.
          </p>
        )}
        <form onSubmit={handleSubmitForm}>
          <UsuarioForm
            formData={formData}
            onFormChange={handleFormChange}
            availableRoles={availableRoles}
            isEditing={true} // Siempre true para el modal de edición
            isUserAdmin={isUserAdminProtected} // Pasar si es el admin protegido
            formErrors={formErrors}
          />
          {/* Botones condicionales basados en si es el admin protegido */}
          {!isUserAdminProtected ? (
            <div className="usuarios-form-actions">
              <button type="submit" className="usuarios-form-buttonGuardar">
                Actualizar Usuario
              </button>
              <button
                type="button"
                className="usuarios-form-buttonCancelar"
                onClick={onClose}
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
                {" "}
                {/* Botón genérico de cerrar modal */}
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
