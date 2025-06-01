// src/features/categoriasServicioAdmin/components/CategoriaServicioCrearModal.jsx
import React, { useState, useEffect } from 'react';
import CategoriaServicioForm from './CategoriaServicioForm';

const CategoriaServicioCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    nombre: '',
    descripcion: '',
    estado: 'Activo', // Por defecto "Activo"
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});

  // Resetear formulario si se reabre el modal (aunque debería montarse/desmontarse)
  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setFormErrors({});
    }
  }, [isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prevErr => ({ ...prevErr, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre de la categoría es obligatorio.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData); // Enviar datos al padre
  };

  if (!isOpen) return null;

  return (
    <div className="modal-Categoria">
      <div className="modal-content-Categoria formulario">
        <h3>Agregar Categoría de Servicio</h3>
        <form className="modal-Categoria-form-grid" onSubmit={handleSubmitForm}>
          <CategoriaServicioForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={false} // Siempre es false para crear
            formErrors={formErrors}
          />
          <div className="containerBotonesAgregarCategoria">
            <button className="botonEditarCategoria" type="submit"> {/* Usar clase consistente para "Guardar/Crear" */}
              Crear Categoría
            </button>
            <button className="botonEliminarCategoria" type="button" onClick={onClose}> {/* Usar clase consistente para "Cancelar" */}
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaServicioCrearModal;