// src/features/categoriasProductoAdmin/components/CategoriaProductoEditarModal.jsx
import React, { useState, useEffect } from 'react';
import CategoriaProductoForm from './CategoriaProductoForm';
import '../../../shared/styles/admin-layout.css';

const CategoriaProductoEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        idCategoriaProducto: initialData.idCategoriaProducto,
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        estado: initialData.estado !== undefined ? initialData.estado : true,
      });
      setFormErrors({});
      setGeneralError('');
    } else if (isOpen && !initialData) {
      console.error("Modal de edición de categoría de producto abierto sin initialData. Cerrando.");
      onClose();
    }
  }, [isOpen, initialData, onClose]);

  const handleFormChange = (name, value) => {
    let error = '';

    // 1. Prevenir el espacio al inicio
    if (value.startsWith(' ')) {
      error = "El campo no puede empezar con un espacio.";
      setFormErrors(prev => ({ ...prev, [name]: error }));
      return; // No actualizar el estado si hay un espacio al inicio
    }
    // 2. Prevenir más de dos espacios seguidos
    if (/\s{3,}/.test(value)) {
      error = "No se permiten más de dos espacios seguidos.";
      setFormErrors(prev => ({ ...prev, [name]: error }));
      return; // No actualizar el estado si hay más de dos espacios
    }

    // 3. Prevenir caracteres especiales y emojis
    const specialCharsOrEmojisRegex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/;
    if (value.length > 0 && !specialCharsOrEmojisRegex.test(value)) {
      error = "Solo se permiten letras, números y espacios.";
      setFormErrors(prev => ({ ...prev, [name]: error }));
      return; // No actualizar el estado si hay caracteres no válidos
    }

    // Si todas las validaciones pasan, actualizamos el estado
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateAllFormFields = () => {
    const errors = {};
    let isValid = true;
    const requiredFields = ['nombre', 'descripcion'];

    requiredFields.forEach(field => {
      const value = formData?.[field];

      if (!value || value.trim() === '') {
        errors[field] = `El campo es obligatorio.`;
        isValid = false;
      } else {
        const trimmedValue = value.trim();

        // **Validación: mínimo 3 caracteres**
        if (trimmedValue.length < 3) {
          errors[field] = `El campo debe tener al menos 3 caracteres.`;
          isValid = false;
        }
        // Validaciones de longitud máxima
        else if (field === 'nombre' && trimmedValue.length > 100) {
          errors[field] = "El nombre no debe exceder los 100 caracteres.";
          isValid = false;
        } else if (field === 'descripcion' && trimmedValue.length > 500) {
          errors[field] = "La descripción no debe exceder los 500 caracteres.";
          isValid = false;
        }
      }
    });

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setGeneralError('');

    const isFormValid = validateAllFormFields();
    if (!isFormValid) {
      setGeneralError("Por favor, corrige los errores en el formulario.");
      return;
    }

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error al actualizar categoría en CategoriaProductoEditarModal:", error);
      let apiErrorMessage = "Ocurrió un error inesperado al actualizar la categoría.";
      let fieldErrors = {};

      if (error.response?.data) {
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          error.response.data.errors.forEach(err => {
            if (err.path) {
              fieldErrors[err.path] = err.msg;
            } else {
              apiErrorMessage += ` | ${err.msg}`;
            }
          });
          if (Object.keys(fieldErrors).length > 0) {
            setFormErrors(prev => ({ ...prev, ...fieldErrors }));
          }
          if (apiErrorMessage === "Ocurrió un error inesperado al actualizar la categoría." && Object.keys(fieldErrors).length > 0) {
            apiErrorMessage = "Por favor, revisa los errores específicos en los campos.";
          }
        } else if (error.response.data.message) {
          apiErrorMessage = error.response.data.message;
          // Validar si el nombre es el mismo que el original para evitar error de duplicidad
          if (error.response.data.message.includes("categoría de producto") && error.response.data.message.includes("nombre") && error.response.data.message.includes("ya existe") && formData.nombre !== initialData.nombre) {
            fieldErrors.nombre = apiErrorMessage;
          } else if (formData.nombre === initialData.nombre) {
            // No hacer nada si el nombre no ha cambiado y la API retorna un error de duplicidad.
          } else {
            fieldErrors.nombre = "El nombre de la categoría ya existe.";
          }

          if (Object.keys(fieldErrors).length > 0) {
            setFormErrors(prev => ({ ...prev, ...fieldErrors }));
            apiErrorMessage = "Por favor, revisa los errores específicos en los campos.";
          }
        }
      }
      setGeneralError(apiErrorMessage);
    }
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Editar Categoría de Producto</h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="admin-modal-body">
          <form id="categoria-form" onSubmit={handleSubmitForm} noValidate>
            <CategoriaProductoForm
              formData={formData}
              onFormChange={handleFormChange}
              isEditing={true}
              formErrors={formErrors}
            />
            {generalError && (
              <p className="admin-form-error" style={{ width: '100%', textAlign: 'center' }}>
                {generalError}
              </p>
            )}
          </form>
        </div>
        <div className="admin-modal-footer">
          <button type="submit" className="admin-form-button" form="categoria-form">
            Actualizar Categoría
          </button>
          <button
            type="button"
            className="admin-form-button secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriaProductoEditarModal;