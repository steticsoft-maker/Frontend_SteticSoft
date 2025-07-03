// src/features/categoriasProductoAdmin/components/CategoriaProductoCrearModal.jsx
import React, { useState, useEffect } from 'react';
import CategoriaProductoForm from './CategoriaProductoForm';
import '../css/CategoriasProducto.css'; // Asegúrate de que esta importación sea correcta

const CategoriaProductoCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: '',
    descripcion: '',
    vidaUtilDias: '',
    tipoUso: '',
    estado: true,
    // 'productos' no es un campo que el backend espere en la creación.
    // Si no tiene un propósito en el frontend para la creación, podría removerse.
    // Lo mantengo aquí por si acaso lo usas internamente en el formulario.
    productos: [],
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});
  const [generalError, setGeneralError] = useState(''); // Nuevo estado para errores generales

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState()); // Resetear al abrir
      setFormErrors({}); // Limpiar errores al abrir
      setGeneralError(''); // Limpiar errores generales al abrir
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar el error del campo específico y el error general cuando el usuario empieza a escribir
    if (formErrors?.[name]) {
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
    // Validar en tiempo real: solo si el campo NO está vacío
    if (value?.trim() !== '' || (name === 'vidaUtilDias' && value !== '')) { // vidaUtilDias puede ser 0
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
    const trimmedValue = (typeof value === 'string') ? value?.trim() : value; // Solo trim si es string

    switch (name) {
      case 'nombre':
        if (trimmedValue?.length > 0 && (trimmedValue.length < 2 || trimmedValue.length > 100)) error = "El nombre debe tener entre 2 y 100 caracteres.";
        break;
      case 'descripcion':
        // Si la descripción es opcional en el backend, aquí solo validas si se provee
        if (trimmedValue?.length > 0 && trimmedValue.length > 500) error = "La descripción no debe exceder los 500 caracteres.";
        break;
      case 'vidaUtilDias':
        const numValue = Number(value);
        if (value !== '' && (isNaN(numValue) || numValue < 0 || !Number.isInteger(numValue))) { // Permite vacío, pero si tiene valor, debe ser un entero no negativo
            error = "La vida útil debe ser un número entero no negativo de días.";
        }
        break;
      case 'tipoUso':
        // Asumo que tu select no tiene una opción vacía y que siempre tendrá un valor válido
        // Si tienes un valor por defecto que significa 'no seleccionado', deberías validarlo aquí.
        if (trimmedValue?.length > 0 && !['Interno', 'Externo'].includes(trimmedValue)) error = "Tipo de uso no válido.";
        break;
      default:
        break;
    }
    setFormErrors(prevErr => ({ ...prevErr, [name]: error }));
    return !error; // Retorna true si no hay error
  };

  // Función que valida todos los campos del formulario, típicamente al enviar
  const validateAllFormFields = () => {
    const errors = {};
    let isValid = true;

    // Campos obligatorios
    const requiredFields = ['nombre', 'descripcion', 'vidaUtilDias', 'tipoUso']; // Incluye todos los que son obligatorios

    requiredFields.forEach(field => {
      const value = formData?.[field];
      const trimmedValue = (typeof value === 'string') ? value?.trim() : value;

      // Validación de campo obligatorio
      if (trimmedValue === '' || trimmedValue === null || trimmedValue === undefined) {
        if (field === 'vidaUtilDias') errors[field] = "La vida útil (días) es obligatoria.";
        else if (field === 'tipoUso') errors[field] = "El tipo de uso es obligatorio.";
        else errors[field] = `El campo ${field} es obligatorio.`; // Mensaje genérico
        isValid = false;
      }
      
      // Aplicar validaciones de formato/longitud también
      const fieldIsValid = validateField(field, value);
      if (!fieldIsValid) {
          isValid = false; // Si un campo no cumple con el formato, el formulario es inválido
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
      await onSubmit(formData); // Enviar datos al padre (ListaCategoriasProductoPage)
      onClose(); // Cerrar el modal al guardar exitosamente
      // El mensaje de éxito se maneja en ListaCategoriasProductoPage.jsx
    } catch (error) {
      console.error("Error al guardar categoría en CategoriaProductoCrearModal:", error);
      let apiErrorMessage = "Ocurrió un error inesperado al guardar la categoría.";
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
          if (apiErrorMessage === "Ocurrió un error inesperado al guardar la categoría." && Object.keys(fieldErrors).length > 0) {
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
      setGeneralError(apiErrorMessage); // Mostrar el mensaje general de error
    }
  };

  if (!isOpen) return null;

  return (
    <div className="categorias-container-modal-overlay"> 
      <div className="modal-content-categoria-form">
        {/* Nuevo div para el encabezado del modal con título y botón de cierre */}
        <div className="modal-header-categorias-productos">
          <h2 className="modal-title">Agregar Nueva Categoría de Producto</h2>
          <button type="button" className="modal-close-button" onClick={onClose}>
            &times; {/* Entidad HTML para el carácter 'X' */}
          </button>
        </div>
        <form onSubmit={handleSubmitForm}>
          <CategoriaProductoForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={false} // Siempre false para el modal de creación
            formErrors={formErrors}
          />
          {generalError && <p className="error-message general-error">{generalError}</p>} {/* Mensaje de error general */}

          <div className="form-actions-categoria">
            <button type="submit" className="form-button-guardar-categoria">
              Guardar Categoría
            </button>
            {/* El botón Cancelar se ha eliminado */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaProductoCrearModal;