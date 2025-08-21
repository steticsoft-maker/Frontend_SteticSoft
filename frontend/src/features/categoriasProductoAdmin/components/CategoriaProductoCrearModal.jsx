import React, { useState, useEffect } from 'react';
import CategoriaProductoForm from './CategoriaProductoForm';
import '../css/CategoriasProducto.css';

const CategoriaProductoCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: '',
    descripcion: '',
    estado: true,
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setFormErrors({});
      setGeneralError('');
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors?.[name]) {
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
    if (value?.trim() !== '') {
      validateField(name, value);
    } else {
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
  };

  const validateField = (name, value) => {
    let error = '';
    const trimmedValue = (typeof value === 'string') ? value?.trim() : value;

    switch (name) {
      case 'nombre':
        if (trimmedValue?.length > 0 && (trimmedValue.length < 2 || trimmedValue.length > 100)) error = "El nombre debe tener entre 2 y 100 caracteres.";
        break;
      case 'descripcion':
        if (trimmedValue?.length > 0 && trimmedValue.length > 500) error = "La descripción no debe exceder los 500 caracteres.";
        break;
      default:
        break;
    }
    setFormErrors(prevErr => ({ ...prevErr, [name]: error }));
    return !error;
  };

  const validateAllFormFields = () => {
    const errors = {};
    let isValid = true;
    const requiredFields = ['nombre', 'descripcion'];

    requiredFields.forEach(field => {
      const value = formData?.[field];
      const trimmedValue = (typeof value === 'string') ? value?.trim() : value;

      if (trimmedValue === '' || trimmedValue === null || trimmedValue === undefined) {
        errors[field] = `El campo ${field} es obligatorio.`;
        isValid = false;
      }
      
      const fieldIsValid = validateField(field, value);
      if (!fieldIsValid) {
        isValid = false;
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
      console.error("Error al guardar categoría en CategoriaProductoCrearModal:", error);
      let apiErrorMessage = "Ocurrió un error inesperado al guardar la categoría.";
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
          if (apiErrorMessage === "Ocurrió un error inesperado al guardar la categoría." && Object.keys(fieldErrors).length > 0) {
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

  if (!isOpen) return null;

  return (
    <div className="categorias-container-modal-overlay">
      <div className="modal-content-categoria-form">
        <div className="modal-header-categorias-productos">
          <h2 className="modal-title">Agregar Nueva Categoría de Producto</h2>
          <button type="button" className="modal-close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmitForm}>
          <CategoriaProductoForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={false}
            formErrors={formErrors}
          />
          {generalError && <p className="error-message general-error">{generalError}</p>}
          <div className="form-actions-categoria">
            <button type="submit" className="form-button-guardar-categoria">
              Guardar Categoría
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaProductoCrearModal;