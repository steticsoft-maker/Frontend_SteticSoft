// src/features/categoriasProductoAdmin/components/CategoriaProductoCrearModal.jsx
import React, { useState, useEffect } from 'react';
import CategoriaProductoForm from './CategoriaProductoForm';

const CategoriaProductoCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: '',
    descripcion: '',
    vidaUtil: '', // Días
    tipoUso: '',  // 'Interno' o 'Externo'
    estado: true, // Nuevas categorías activas por defecto
    productos: [], // Si manejas productos asociados, inicialízalo vacío
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({}); // Para validaciones futuras

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState()); // Resetear al abrir
      setFormErrors({});
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!formData.descripcion.trim()) errors.descripcion = "La descripción es obligatoria.";
    if (!formData.vidaUtil || isNaN(parseInt(formData.vidaUtil)) || parseInt(formData.vidaUtil) <= 0) {
      errors.vidaUtil = "La vida útil debe ser un número positivo de días.";
    }
    if (!formData.tipoUso) errors.tipoUso = "Debe seleccionar un tipo de uso.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData); // Enviar datos a ListaCategoriasProductoPage
  };

  if (!isOpen) return null;

  return (
    // Usar las clases de CategoriasProducto.css para el overlay y contenido del modal
    <div className="categorias-container-modal-overlay"> 
      <div className="modal-content-categoria-form">
        <h2 className="modal-title">Agregar Nueva Categoría de Producto</h2>
        <form onSubmit={handleSubmitForm}>
          <CategoriaProductoForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={false} // Siempre false para el modal de creación
            formErrors={formErrors}
          />
          {/* Mostrar errores de validación del formulario si existen */}
          {formErrors.nombre && <p className="error-categoria-producto">{formErrors.nombre}</p>}
          {formErrors.descripcion && <p className="error-categoria-producto">{formErrors.descripcion}</p>}
          {formErrors.vidaUtil && <p className="error-categoria-producto">{formErrors.vidaUtil}</p>}
          {formErrors.tipoUso && <p className="error-categoria-producto">{formErrors.tipoUso}</p>}

          <div className="form-actions-categoria"> {/* Clase de CategoriasProducto.css */}
            <button type="submit" className="form-button-guardar-categoria">
              Guardar Categoría
            </button>
            <button type="button" className="form-button-cancelar-categoria" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaProductoCrearModal;