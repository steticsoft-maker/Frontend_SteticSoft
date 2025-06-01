// src/features/productosAdmin/components/ProductoAdminEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ProductoAdminForm from './ProductoAdminForm';
import { getActiveCategoriasForSelect } from '../services/productosAdminService'; // Para las categorías

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB (Si es una constante global, impórtala)
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

const ProductoAdminEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setCategoriasDisponibles(getActiveCategoriasForSelect());
      setFormData({
        id: initialData.id, // Importante para que el servicio sepa qué producto actualizar
        nombre: initialData.nombre || '',
        categoria: initialData.categoria || '',
        precio: initialData.precio?.toString() || '', // Convertir a string para el input number
        stock: initialData.stock?.toString() || '',   // Convertir a string para el input number
        descripcion: initialData.descripcion || '',
        fotoPreview: initialData.foto || null, // 'foto' en initialData es la URL/base64 de la imagen guardada
        foto: null, // El objeto File para una nueva imagen se resetea
        estado: initialData.estado !== undefined ? initialData.estado : true, // Cargar estado
      });
      setFormErrors({});
    } else if (isOpen && !initialData) {
      // Este caso no debería ocurrir si la lógica en ListaProductosAdminPage es correcta
      console.error("Modal de edición de producto abierto sin initialData. Cerrando.");
      onClose(); // Cerrar si no hay datos para editar
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
    setFormErrors(prev => ({ ...prev, foto: '' })); // Limpiar error de foto previo

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFormErrors(prev => ({ ...prev, foto: `La imagen debe ser menor a ${MAX_FILE_SIZE_MB}MB.` }));
        setFormData(prev => ({
          ...prev,
          foto: null, // Limpiar el File object si hay error
          fotoPreview: initialData?.foto || null // Revertir al preview original
        }));
        e.target.value = null; // Limpiar el input file
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, foto: file, fotoPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    } else { // Si el usuario cancela la selección de archivo, mantener la imagen original
      setFormData(prev => ({
        ...prev,
        foto: null, // No hay nuevo objeto File
        fotoPreview: initialData?.foto || null // Mantener la previsualización de la imagen original
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    if (!formData.categoria) errors.categoria = "Debe seleccionar una categoría.";
    if (!formData.precio || isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) <= 0) {
      errors.precio = "El precio debe ser un número positivo.";
    }
     if (formData.stock === '' || isNaN(parseInt(formData.stock)) || parseInt(formData.stock) < 0) { // Permitir stock 0
        errors.stock = "El stock debe ser un número igual o mayor a cero.";
    }
    // La validación de foto (tamaño) ya se maneja en handleFileChange
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Si se seleccionó una nueva foto (objeto File en formData.foto), se usará su fotoPreview (base64).
    // Si no se seleccionó una nueva foto, formData.foto será null, pero formData.fotoPreview
    // mantendrá la URL/base64 de la imagen original gracias a la lógica en handleFileChange y useEffect.
    // El servicio 'saveProductoAdmin' espera que el campo 'foto' en dataToSubmit sea la URL/base64.
    const dataToSubmit = { ...formData, foto: formData.fotoPreview };
    delete dataToSubmit.fotoPreview; // No necesitamos el preview como tal en los datos guardados
                                     // ni el objeto 'File' si guardamos base64

    onSubmit(dataToSubmit);
  };

  if (!isOpen || !initialData) return null; // No renderizar si no está abierto o no hay datos iniciales

  return (
    <div className="modalProductosAdministrador"> {/* Clase de ProductosAdmin.css */}
      <div className="modal-content-ProductosAdministrador"> {/* Clase de ProductosAdmin.css */}
        <h2>Editar Producto</h2>
        <form onSubmit={handleSubmitForm}>
          <ProductoAdminForm
            formData={formData}
            onFormChange={handleFormChange}
            onFileChange={handleFileChange}
            categoriasDisponibles={categoriasDisponibles}
            isEditing={true} // Siempre true para edición
            formErrors={formErrors}
          />
          <div className="botonesGuardarCancelarProductoAdministrador"> {/* Clase de ProductosAdmin.css */}
            <button type="submit" className="botonGuardarProducto">
              Actualizar Producto
            </button>
            <button type="button" className="botonCancelarAgregarProducto" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductoAdminEditarModal;