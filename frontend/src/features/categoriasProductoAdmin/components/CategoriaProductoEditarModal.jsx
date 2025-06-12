// src/features/categoriasProductoAdmin/components/CategoriaProductoEditarModal.jsx
import React, { useState, useEffect } from 'react';
import CategoriaProductoForm from './CategoriaProductoForm';

const CategoriaProductoEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        // CAMBIO: Consistentemente 'idCategoriaProducto' con el backend
        idCategoriaProducto: initialData.idCategoriaProducto, 
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        // CAMBIO: Consistentemente 'vidaUtilDias' con el backend
        vidaUtilDias: initialData.vidaUtilDias || '', 
        tipoUso: initialData.tipoUso || '',
        estado: initialData.estado !== undefined ? initialData.estado : true,
        productos: initialData.productos || [],
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
    // La descripción es opcional en el backend, pero obligatoria aquí. Considera ajustar.
    if (!formData.descripcion.trim()) errors.descripcion = "La descripción es obligatoria."; 
    
    // CAMBIO: Usar formData.vidaUtilDias y el mensaje de error
    const vidaUtilDias = parseInt(formData.vidaUtilDias, 10); 
    if (isNaN(vidaUtilDias) || vidaUtilDias <= 0) {
      errors.vidaUtilDias = "La vida útil debe ser un número positivo de días."; 
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
          {formErrors.nombre && <p className="error-categoria-producto">{formErrors.nombre}</p>}
          {formErrors.descripcion && <p className="error-categoria-producto">{formErrors.descripcion}</p>}
          {/* CAMBIO: Mostrar errores de vidaUtilDias */}
          {formErrors.vidaUtilDias && <p className="error-categoria-producto">{formErrors.vidaUtilDias}</p>} 
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