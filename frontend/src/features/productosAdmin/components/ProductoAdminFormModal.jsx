// src/features/productosAdmin/components/ProductoAdminFormModal.jsx
import React, { useState, useEffect } from 'react';
import ProductoAdminForm from './ProductoAdminForm';
import { getActiveCategoriasForSelect } from '../services/productosAdminService'; // Asume que existe

const ProductoAdminFormModal = ({ isOpen, onClose, onSubmit, initialData, modalType }) => {
  const [formData, setFormData] = useState({});
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const isEditing = modalType === 'edit';

  useEffect(() => {
    if (isOpen) {
      setCategoriasDisponibles(getActiveCategoriasForSelect());
      if (initialData) {
        setFormData({ ...initialData, fotoPreview: initialData.foto || null });
      } else { // Creación
        setFormData({
          nombre: '', categoria: '', precio: '', stock: '', descripcion: '', foto: null, fotoPreview: null, estado: true
        });
      }
    }
  }, [initialData, isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto: file, fotoPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
        setFormData(prev => ({ ...prev, foto: null, fotoPreview: initialData?.foto || null })); // Revertir a foto inicial o null
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // Crear un FormData para enviar si hay un archivo, o solo el objeto formData
    // Esta lógica se refinará cuando conectemos al backend. Por ahora, pasamos el objeto.
    // Para localStorage, guardamos la foto como base64 (fotoPreview).
    const dataToSubmit = { ...formData, foto: formData.fotoPreview }; // Guardar base64 en localStorage
    delete dataToSubmit.fotoPreview; // No necesitamos el preview como tal
    if (!isEditing && !dataToSubmit.foto) dataToSubmit.foto = null; // Asegurar que foto sea null si no se sube nada en creación

    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  return (
    <div className="modalProductosAdministrador">
      <div className="modal-content-ProductosAdministrador">
        <h2>{isEditing ? 'Editar Producto' : 'Agregar Producto'}</h2>
        <form onSubmit={handleSubmitForm}>
          <ProductoAdminForm
            formData={formData}
            onFormChange={handleFormChange}
            onFileChange={handleFileChange}
            categoriasDisponibles={categoriasDisponibles}
            isEditing={isEditing}
          />
          <div className="botonesGuardarCancelarProductoAdministrador"> {/* Clase del CSS original */}
            <button type="submit" className="botonGuardarProducto">Guardar</button>
            <button type="button" className="botonCancelarAgregarProducto" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoAdminFormModal;