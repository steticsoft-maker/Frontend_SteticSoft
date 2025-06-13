// src/features/productosAdmin/components/ProductoAdminEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ProductoAdminForm from './ProductoAdminForm';
// CAMBIO: Importamos el objeto del servicio
import { productosAdminService } from '../services/productosAdminService';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

const ProductoAdminEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  // CAMBIO: categoriasDisponibles ahora guardará objetos { idCategoriaProducto, nombre }
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
          // Usamos la nueva función del servicio que debería devolver {id, nombre}
          const categorias = await productosAdminService.getActiveCategorias();
          // Aseguramos que la estructura sea {idCategoriaProducto, nombre}
          setCategoriasDisponibles(categorias.map(cat => ({
            idCategoriaProducto: cat.idCategoriaProducto, // Asegúrate de que tu servicio de categorías devuelva esto
            nombre: cat.nombre
          })));
        } catch (error) {
          console.error("Error al cargar categorías en el modal de edición:", error);
          setCategoriasDisponibles([]);
          setFormErrors(prev => ({ ...prev, _general: "No se pudieron cargar las categorías." }));
        } finally {
          setIsLoading(false); // Termina la carga
        }
      };

      fetchCategorias();

      // CAMBIO: Carga de datos iniciales del producto
      // Ajustamos los nombres de los campos de 'initialData' para que coincidan con 'formData'
      setFormData({
        // CAMBIO: Usar idProducto para el ID
        idProducto: initialData.idProducto, 
        nombre: initialData.nombre || '',
        // CAMBIO: Usar idCategoriaProducto del initialData
        idCategoriaProducto: initialData.categoria ? initialData.categoria.idCategoriaProducto : '', 
        precio: initialData.precio?.toString() || '',
        // CAMBIO: Usar existencia en lugar de stock
        existencia: initialData.existencia?.toString() || '', 
        stockMinimo: initialData.stockMinimo?.toString() || '0', // Asegurarse de tener stockMinimo y Maximo
        stockMaximo: initialData.stockMaximo?.toString() || '0',
        descripcion: initialData.descripcion || '',
        // CAMBIO: Usar imagen y imagenPreview
        imagenPreview: initialData.imagen || null, // La imagen que ya viene del backend
        imagen: null, // Para la nueva imagen a subir
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
    // CAMBIO: Error para 'imagen'
    setFormErrors(prev => ({ ...prev, imagen: '' }));

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFormErrors(prev => ({ ...prev, imagen: `La imagen debe ser menor a ${MAX_FILE_SIZE_MB}MB.` }));
        // CAMBIO: Nombres de campo 'imagen' y 'imagenPreview'
        setFormData(prev => ({ ...prev, imagen: null, imagenPreview: initialData?.imagen || null }));
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagen: file, imagenPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      // CAMBIO: Nombres de campo 'imagen' y 'imagenPreview'
      setFormData(prev => ({ ...prev, imagen: null, imagenPreview: initialData?.imagen || null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio.";
    // CAMBIO: Validar 'idCategoriaProducto'
    if (!formData.idCategoriaProducto) errors.idCategoriaProducto = "Debe seleccionar una categoría.";
    if (!formData.precio || isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) <= 0) {
      errors.precio = "El precio debe ser un número positivo.";
    }
    // CAMBIO: Validar 'existencia'
    if (formData.existencia === '' || isNaN(parseInt(formData.existencia)) || parseInt(formData.existencia) < 0) {
      errors.existencia = "La existencia debe ser un número igual o mayor a cero.";
    }
    // Añadir validación para stockMinimo y stockMaximo si es necesario en el frontend
    if (
        formData.stockMinimo !== '' &&
        formData.stockMaximo !== '' &&
        parseInt(formData.stockMaximo) < parseInt(formData.stockMinimo)
    ) {
        errors.stockMaximo = "El stock máximo no puede ser menor que el stock mínimo.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // CAMBIO: Preparar los datos para la API con los nombres correctos
    const dataToSubmit = {
      // CAMBIO: ID del producto para actualizar
      idProducto: formData.idProducto, 
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      existencia: parseInt(formData.existencia), 
      precio: parseFloat(formData.precio),
      stockMinimo: parseInt(formData.stockMinimo),
      stockMaximo: parseInt(formData.stockMaximo),
      // CAMBIO: Enviar idCategoriaProducto al backend
      categoriaProductoId: formData.idCategoriaProducto, 
      // CAMBIO: Enviar imagenPreview (base64) como 'imagen'
      imagen: formData.imagenPreview, 
      estado: formData.estado,
    };
    // La función onSubmit en la página principal (ProductosAdminPage)
    // se encargará de llamar a productosAdminService.updateProducto con estos datos.
    onSubmit(dataToSubmit); 
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
              // CAMBIO: pasar la estructura de categorías correcta
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