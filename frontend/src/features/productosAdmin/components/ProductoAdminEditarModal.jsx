// src/features/productosAdmin/components/ProductoAdminEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ProductoAdminForm from './ProductoAdminForm';
// CAMBIO: Importamos el objeto del servicio, no la función suelta
import { productosAdminService } from '../services/productosAdminService';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

const ProductoAdminEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false); // NUEVO: Estado de carga

  useEffect(() => {
    if (isOpen && initialData) {
      setIsLoading(true); // Inicia la carga
      setFormErrors({});

      // CAMBIO: La carga de categorías ahora es asíncrona
      const fetchCategorias = async () => {
        try {
          // Usamos la nueva función del servicio real
          const categorias = await productosAdminService.getActiveCategorias();
          setCategoriasDisponibles(categorias);
        } catch (error) {
          console.error("Error al cargar categorías en el modal de edición:", error);
          setCategoriasDisponibles([]);
          setFormErrors(prev => ({...prev, _general: "No se pudieron cargar las categorías."}));
        } finally {
          setIsLoading(false); // Termina la carga
        }
      };

      fetchCategorias();

      // La carga de datos iniciales del producto se mantiene igual
      setFormData({
        id: initialData.id,
        nombre: initialData.nombre || '',
        categoria: initialData.categoria || '',
        precio: initialData.precio?.toString() || '',
        stock: initialData.stock?.toString() || '',
        descripcion: initialData.descripcion || '',
        fotoPreview: initialData.foto || null,
        foto: null,
        estado: initialData.estado !== undefined ? initialData.estado : true,
      });
      
    } else if (isOpen && !initialData) {
      console.error("Modal de edición de producto abierto sin initialData. Cerrando.");
      onClose();
    }
  }, [isOpen, initialData, onClose]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormErrors(prev => ({ ...prev, foto: '' }));

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFormErrors(prev => ({ ...prev, foto: `La imagen debe ser menor a ${MAX_FILE_SIZE_MB}MB.` }));
        setFormData(prev => ({ ...prev, foto: null, fotoPreview: initialData?.foto || null }));
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto: file, fotoPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, foto: null, fotoPreview: initialData?.foto || null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!formData.categoria) errors.categoria = "Debe seleccionar una categoría.";
    if (!formData.precio || isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) <= 0) {
      errors.precio = "El precio debe ser un número positivo.";
    }
     if (formData.stock === '' || isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) {
        errors.stock = "El stock debe ser un número igual o mayor a cero.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const dataToSubmit = { ...formData, foto: formData.fotoPreview };
    delete dataToSubmit.fotoPreview;
    onSubmit(dataToSubmit); // La página principal (ListaProductosAdminPage) manejará la llamada a la API
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="modalProductosAdministrador">
      <div className="modal-content-ProductosAdministrador">
        <h2>Editar Producto</h2>
        {isLoading ? (
          <p>Cargando categorías...</p>
        ) : (
          <form onSubmit={handleSubmitForm}>
            <ProductoAdminForm
              formData={formData}
              onFormChange={handleFormChange}
              onFileChange={handleFileChange}
              categoriasDisponibles={categoriasDisponibles}
              isEditing={true}
              formErrors={formErrors}
            />
            {formErrors._general && <p className="error">{formErrors._general}</p>}
            <div className="botonesGuardarCancelarProductoAdministrador">
              <button type="submit" className="botonGuardarProducto">
                Actualizar Producto
              </button>
              <button type="button" className="botonCancelarAgregarProducto" onClick={onClose}>
                Cancelar
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ProductoAdminEditarModal;