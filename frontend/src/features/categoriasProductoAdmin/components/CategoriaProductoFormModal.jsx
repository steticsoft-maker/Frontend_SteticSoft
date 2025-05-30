// src/features/productosAdmin/components/CategoriaProductoFormModal.jsx
import React, { useState, useEffect } from 'react';
import CategoriaProductoForm from './CategoriaProductoForm';

const CategoriaProductoFormModal = ({ isOpen, onClose, onSubmit, initialData, modalType }) => {
  const [formData, setFormData] = useState({});
  const isEditing = modalType === 'edit';

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData });
      } else { // Creación
        setFormData({
          nombre: '', descripcion: '', tipoUso: '', vidaUtil: '', estado: true, productos: []
        });
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
    // Usar el overlay y content del CSS de CategoriaProducto.css
    // El original tiene centered-content-wrapper y modal-content-categoria-form
    <div className="categorias-container-modal-overlay"> {/* O una clase de modal genérica */}
        <div className="modal-content-categoria-form">
            <h2 className="modal-title">{isEditing ? 'Editar Categoría' : 'Agregar Nueva Categoría'}</h2>
            <form onSubmit={handleSubmitForm}>
                <CategoriaProductoForm
                    formData={formData}
                    onFormChange={handleFormChange}
                    isEditing={isEditing}
                />
                <div className="form-actions-categoria">
                    <button type="submit" className="form-button-guardar-categoria">
                        {isEditing ? 'Guardar Cambios' : 'Guardar Categoría'}
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

export default CategoriaProductoFormModal;