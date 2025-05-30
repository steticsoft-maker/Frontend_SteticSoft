// src/features/categoriasServicioAdmin/components/CategoriaServicioFormModal.jsx
import React, { useState, useEffect } from 'react';
import CategoriaServicioForm from './CategoriaServicioForm';

const CategoriaServicioFormModal = ({ isOpen, onClose, onSubmit, initialData, modalType }) => {
  const [formData, setFormData] = useState({});
  const isEditing = modalType === 'edit';

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else { // Creación
        setFormData({ nombre: '', descripcion: '', estado: 'Activo' });
      }
    }
  }, [initialData, isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-Categoria"> {/* Clase del CSS original */}
      <div className="modal-content-Categoria"> {/* Clase del CSS original */}
        <h3>{isEditing ? 'Editar Categoría de Servicio' : 'Agregar Categoría de Servicio'}</h3>
        <form className="modal-Categoria-form-grid" onSubmit={handleSubmitForm}> {/* Clase del CSS original */}
          <CategoriaServicioForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={isEditing}
          />
          <div className="containerBotonesAgregarCategoria"> {/* Clase del CSS original */}
            <button className="botonEditarCategoria" type="submit"> {/* Clase del CSS original */}
              {isEditing ? 'Guardar Cambios' : 'Guardar'}
            </button>
            <button className="botonEliminarCategoria" type="button" onClick={onClose}> {/* Clase del CSS original */}
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CategoriaServicioFormModal;