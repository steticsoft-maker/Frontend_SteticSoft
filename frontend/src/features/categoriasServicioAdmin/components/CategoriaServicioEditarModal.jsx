// src/features/categoriasServicioAdmin/components/CategoriaServicioEditarModal.jsx
import React, { useState, useEffect } from 'react';
import CategoriaServicioForm from './CategoriaServicioForm';

const CategoriaServicioEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    id: '', // Incluir id
    nombre: '',
    descripcion: '',
    estado: 'Activo',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        id: initialData.id || '', // Asegurar que el ID se establece
        nombre: initialData.nombre || '',
        descripcion: initialData.descripcion || '',
        estado: initialData.estado || 'Activo',
      });
      setFormErrors({});
    } else if (isOpen && !initialData) {
      // Este caso no debería ocurrir si la lógica del padre es correcta
      console.error("Modal de edición abierto sin initialData!");
      onClose(); // Cerrar si no hay datos para editar
    }
  }, [isOpen, initialData]);

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

  if (!isOpen || !initialData) return null; // No renderizar si no está abierto o no hay datos iniciales

  return (
    <div className="modal-Categoria">
      <div className="modal-content-Categoria formulario">
        <h3>Editar Categoría de Servicio</h3>
        <form className="modal-Categoria-form-grid" onSubmit={handleSubmitForm}>
          <CategoriaServicioForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={true} // Siempre es true para editar
            formErrors={formErrors}
          />
          <div className="containerBotonesAgregarCategoria">
            <button className="botonEditarCategoria" type="submit">
              Actualizar Categoría
            </button>
            <button className="botonEliminarCategoria" type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CategoriaServicioEditarModal;