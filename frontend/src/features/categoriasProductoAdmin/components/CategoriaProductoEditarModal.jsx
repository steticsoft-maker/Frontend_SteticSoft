// src/features/categoriasProductoAdmin/components/CategoriaProductoEditarModal.jsx
import React, { useState, useEffect } from 'react';
import CategoriaProductoForm from './CategoriaProductoForm';
import '../css/CategoriasProducto.css';

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
        vidaUtilDias: initialData.vidaUtilDias !== undefined && initialData.vidaUtilDias !== null ? initialData.vidaUtilDias : '',
        tipoUso: initialData.tipoUso || '',
        estado: initialData.estado !== undefined ? initialData.estado : true,
        productos: initialData.productos || [],
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
    
    // Validar espacios al inicio y más de dos espacios seguidos
    const spaceValidationRegex = /^(?!\s)(?!.*\s{3,}).*$/;

    // Validar caracteres especiales y emojis
    const specialCharsOrEmojisRegex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/;
    
    if (name === 'nombre' || name === 'descripcion') {
        if (!spaceValidationRegex.test(value)) {
            if (value.startsWith(' ')) {
                error = "El campo no puede empezar con un espacio.";
            } else if (/\s{3,}/.test(value)) {
                error = "No se permiten más de dos espacios seguidos.";
            }
        } else if (!specialCharsOrEmojisRegex.test(value)) {
            error = "Solo se permiten letras, números y espacios.";
        }
    }
    
    // Si hay un error, lo establecemos y no actualizamos el estado del formulario.
    if (error) {
        setFormErrors(prev => ({ ...prev, [name]: error }));
        return;
    }

    // Si no hay errores, actualizamos el estado y limpiamos el error del campo
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    if (generalError) {
      setGeneralError('');
    }
  };

  const validateAllFormFields = () => {
    const errors = {};
    let isValid = true;
    const requiredFields = ['nombre', 'descripcion', 'vidaUtilDias', 'tipoUso'];

    requiredFields.forEach(field => {
        const value = formData?.[field];
        const trimmedValue = (typeof value === 'string') ? value?.trim() : value;

        // Validación de campo obligatorio
        if (trimmedValue === '' || trimmedValue === null || trimmedValue === undefined) {
            errors[field] = `El campo es obligatorio.`;
            isValid = false;
        } else {
            // Re-validación de formato de espacios y caracteres al enviar
            const spaceValidationRegex = /^(?!\s)(?!.*\s{3,}).*$/;
            const specialCharsOrEmojisRegex = /^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ]+$/;
            
            if (!spaceValidationRegex.test(value)) {
                if (value.startsWith(' ')) {
                    errors[field] = "El campo no puede empezar con un espacio.";
                } else {
                    errors[field] = "No se permiten más de dos espacios seguidos.";
                }
                isValid = false;
            } else if (!specialCharsOrEmojisRegex.test(value)) {
                errors[field] = "Solo se permiten letras, números y espacios.";
                isValid = false;
            }
        }

        // Aplicar validaciones de longitud y formato específicas de cada campo
        if (field === 'nombre') {
            if (trimmedValue?.length > 0 && (trimmedValue.length < 2 || trimmedValue.length > 100)) {
                errors[field] = "El nombre debe tener entre 2 y 100 caracteres.";
                isValid = false;
            }
        } else if (field === 'descripcion') {
            if (trimmedValue?.length > 0 && trimmedValue.length > 500) {
                errors[field] = "La descripción no debe exceder los 500 caracteres.";
                isValid = false;
            }
        } else if (field === 'vidaUtilDias') {
            const numValue = Number(value);
            if (value !== '' && (isNaN(numValue) || numValue < 0 || !Number.isInteger(numValue))) {
                errors[field] = "La vida útil debe ser un número entero no negativo de días.";
                isValid = false;
            }
        } else if (field === 'tipoUso') {
            if (trimmedValue?.length > 0 && !['Interno', 'Externo'].includes(trimmedValue)) {
                errors[field] = "Tipo de uso no válido.";
                isValid = false;
            }
        }
    });

    setFormErrors(prevErrors => ({ ...prevErrors, ...errors }));
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
          if (apiErrorMessage.includes("categoría de producto") && apiErrorMessage.includes("nombre") && apiErrorMessage.includes("ya existe")) {
            fieldErrors.nombre = apiErrorMessage;
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
    <div className="categorias-container-modal-overlay">
      <div className="modal-content-categoria-form">
        <div className="modal-header-categorias-productos">
          <h2 className="modal-title">Editar Categoría de Producto</h2>
          <button type="button" className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmitForm}>
          <CategoriaProductoForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={true}
            formErrors={formErrors}
          />
          {generalError && <p className="error-message general-error">{generalError}</p>}
          <div className="form-actions-categoria">
            <button type="submit" className="form-button-guardar-categoria">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaProductoEditarModal;