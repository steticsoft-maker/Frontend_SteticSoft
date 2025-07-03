// src/features/categoriasProductoAdmin/components/CategoriaProductoEditarModal.jsx
import React, { useState, useEffect } from 'react';
import CategoriaProductoForm from './CategoriaProductoForm';
import '../css/CategoriasProducto.css'; // Asegúrate de que esta importación sea correcta

const CategoriaProductoEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [generalError, setGeneralError] = useState(''); // Nuevo estado para errores generales

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        idCategoriaProducto: initialData.idCategoriaProducto,
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        vidaUtilDias: initialData.vidaUtilDias !== undefined && initialData.vidaUtilDias !== null ? initialData.vidaUtilDias : '', // Asegurar que sea '' si es null/undefined
        tipoUso: initialData.tipoUso || '',
        estado: initialData.estado !== undefined ? initialData.estado : true,
        productos: initialData.productos || [], // Mantener si es necesario para el form
      });
      setFormErrors({}); // Limpiar errores al abrir
      setGeneralError(''); // Limpiar errores generales al abrir
    } else if (isOpen && !initialData) {
      console.error("Modal de edición de categoría de producto abierto sin initialData. Cerrando.");
      onClose();
    }
  }, [isOpen, initialData, onClose]); // `onClose` añadido a las dependencias por buenas prácticas

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar el error del campo específico y el error general cuando el usuario empieza a escribir
    if (formErrors?.[name]) { 
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
    
    // Validar en tiempo real: solo si el campo NO está vacío.
    // La lógica para vidaUtilDias debe permitir 0, pero no cadenas vacías si se intenta validar numéricamente
    if (value?.trim() !== '' || (name === 'vidaUtilDias' && value !== '')) { 
        validateField(name, value);
    } else {
        // Si el campo está vacío, asegúrate de que no tenga un mensaje de error activo.
        // Pero no añadas un mensaje de "obligatorio" aquí.
        setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
  };

  // Función para validar un campo específico y actualizar los errores en tiempo real
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
      case 'vidaUtilDias':
        const numValue = Number(value);
        if (value !== '' && (isNaN(numValue) || numValue < 0 || !Number.isInteger(numValue))) {
            error = "La vida útil debe ser un número entero no negativo de días.";
        }
        break;
      case 'tipoUso':
        if (trimmedValue?.length > 0 && !['Interno', 'Externo'].includes(trimmedValue)) error = "Tipo de uso no válido.";
        break;
      // El campo 'estado' se maneja con un switch, su validación es más sencilla y podría no necesitar mensaje de error aquí.
      default:
        break;
    }
    setFormErrors(prevErr => ({ ...prevErr, [name]: error }));
    return !error;
  };

  // Función que valida todos los campos del formulario, típicamente al enviar
  const validateAllFormFields = () => {
    const errors = {};
    let isValid = true;

    // Campos obligatorios para edición (todos menos 'productos')
    const requiredFields = ['nombre', 'descripcion', 'vidaUtilDias', 'tipoUso'];

    requiredFields.forEach(field => {
      const value = formData?.[field];
      const trimmedValue = (typeof value === 'string') ? value?.trim() : value;

      // Validación de campo obligatorio
      if (trimmedValue === '' || trimmedValue === null || trimmedValue === undefined) {
        if (field === 'vidaUtilDias') errors[field] = "La vida útil (días) es obligatoria.";
        else if (field === 'tipoUso') errors[field] = "El tipo de uso es obligatorio.";
        else if (field === 'descripcion') errors[field] = "La descripción es obligatoria."; 
        else errors[field] = `El campo ${field} es obligatorio.`;
        isValid = false;
      }
      
      // Aplicar validaciones de formato/longitud también
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
    setGeneralError(''); // Limpiar errores generales antes de intentar enviar

    const isFormValid = validateAllFormFields(); // Validar todos los campos antes de enviar
    if (!isFormValid) {
        setGeneralError("Por favor, corrige los errores en el formulario.");
        return;
    }

    try {
      await onSubmit(formData); // Enviar datos actualizados a ListaCategoriasProductoPage
      onClose(); // Cerrar el modal al guardar exitosamente
    } catch (error) {
      console.error("Error al actualizar categoría en CategoriaProductoEditarModal:", error);
      let apiErrorMessage = "Ocurrió un error inesperado al actualizar la categoría.";
      let fieldErrors = {};

      if (error.response?.data) {
        if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
          // Si el backend envía un array de errores (como express-validator)
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
          // Si el backend envía un mensaje general de error
          apiErrorMessage = error.response.data.message;
          // Intentar parsear mensajes comunes a campos específicos
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
        {/* Nuevo div para el encabezado del modal con título y botón de cierre */}
        <div className="modal-header-categorias-productos">
          <h2 className="modal-title">Editar Categoría de Producto</h2> {/* Título para el modal de edición */}
          <button type="button" className="modal-close-button" onClick={onClose}>
            &times; {/* Entidad HTML para el carácter 'X' */}
          </button>
        </div>
        <form onSubmit={handleSubmitForm}>
          <CategoriaProductoForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={true} // Siempre true para edición
            formErrors={formErrors}
          />
          {generalError && <p className="error-message general-error">{generalError}</p>}

          <div className="form-actions-categoria">
            <button type="submit" className="form-button-guardar-categoria">
              Guardar Cambios
            </button>
            {/* El botón Cancelar se ha eliminado */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaProductoEditarModal;