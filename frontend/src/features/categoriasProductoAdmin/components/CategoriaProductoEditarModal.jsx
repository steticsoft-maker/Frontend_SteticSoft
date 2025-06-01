// src/features/categoriasProductoAdmin/components/CategoriaProductoEditarModal.jsx
import React, { useState, useEffect } from 'react';
import CategoriaProductoForm from './CategoriaProductoForm';

const CategoriaProductoEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        id: initialData.id, // Mantener el ID
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        vidaUtil: initialData.vidaUtil || '',
        tipoUso: initialData.tipoUso || '',
        estado: initialData.estado !== undefined ? initialData.estado : true, // Cargar estado
        productos: initialData.productos || [], // Mantener productos asociados
      });
      setFormErrors({});
    } else if (isOpen && !initialData) {
      console.error("Modal de edición de categoría de producto abierto sin initialData. Cerrando.");
      onClose();
    }
  }, [isOpen, initialData, onClose]);

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
    onSubmit(formData); // Enviar datos actualizados a ListaCategoriasProductoPage
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="categorias-container-modal-overlay">
      <div className="modal-content-categoria-form">
        <h2 className="modal-title">Editar Categoría de Producto</h2>
        <form onSubmit={handleSubmitForm}>
          <CategoriaProductoForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={true} // Siempre true para edición
            formErrors={formErrors}
          />
          {/* Mostrar errores de validación del formulario si existen */}
          {formErrors.nombre && <p className="error-categoria-producto">{formErrors.nombre}</p>}
          {formErrors.descripcion && <p className="error-categoria-producto">{formErrors.descripcion}</p>}
          {formErrors.vidaUtil && <p className="error-categoria-producto">{formErrors.vidaUtil}</p>}
          {formErrors.tipoUso && <p className="error-categoria-producto">{formErrors.tipoUso}</p>}

          <div className="form-actions-categoria">
            <button type="submit" className="form-button-guardar-categoria">
              Guardar Cambios
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

export default CategoriaProductoEditarModal;