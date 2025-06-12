// src/features/categoriasProductoAdmin/components/CategoriaProductoCrearModal.jsx
import React, { useState, useEffect } from 'react';
import CategoriaProductoForm from './CategoriaProductoForm';

const CategoriaProductoCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: '',
    descripcion: '',
    vidaUtilDias: '', // CAMBIO: Consistentemente 'vidaUtilDias' con el backend
    tipoUso: '',     // 'Interno' o 'Externo'
    estado: true,    // Nuevas categorías activas por defecto
    // 'productos' no es un campo que el backend espere en la creación.
    // Aunque se inicialice aquí, será ignorado por el servicio de backend al crear.
    // Si no tiene un propósito en el frontend para la creación, podría removerse.
    productos: [],
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});

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
    // La descripción es opcional en el modelo de backend, pero obligatoria aquí.
    // Decide si quieres que sea obligatoria en el frontend o no.
    // Si la quitas, el backend ya la maneja como opcional.
    if (!formData.descripcion.trim()) errors.descripcion = "La descripción es obligatoria."; 
    
    // CAMBIO: Usar formData.vidaUtilDias
    const vidaUtilDias = parseInt(formData.vidaUtilDias, 10); 
    if (isNaN(vidaUtilDias) || vidaUtilDias <= 0) {
      errors.vidaUtilDias = "La vida útil debe ser un número positivo de días."; // CAMBIO: Usar vidaUtilDias
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
          {formErrors.nombre && <p className="error-categoria-producto">{formErrors.nombre}</p>}
          {formErrors.descripcion && <p className="error-categoria-producto">{formErrors.descripcion}</p>}
          {/* CAMBIO: Mostrar errores de vidaUtilDias */}
          {formErrors.vidaUtilDias && <p className="error-categoria-producto">{formErrors.vidaUtilDias}</p>} 
          {formErrors.tipoUso && <p className="error-categoria-producto">{formErrors.tipoUso}</p>}

          <div className="form-actions-categoria">
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