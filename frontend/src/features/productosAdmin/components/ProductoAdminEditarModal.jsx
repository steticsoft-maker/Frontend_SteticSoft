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
        idProducto: initialData.idProducto, 
        nombre: initialData.nombre || '',
        
        // ✅ 1. CORRECCIÓN EN LA CARGA DE DATOS:
        // Usamos el ID de la categoría directamente desde el producto.
        // Esto es más seguro que depender del objeto 'categoria' anidado.
        idCategoriaProducto: initialData.categoriaProductoId || '', 
        
        precio: initialData.precio?.toString() || '',
        existencia: initialData.existencia?.toString() || '', 
        stockMinimo: initialData.stockMinimo?.toString() || '0',
        stockMaximo: initialData.stockMaximo?.toString() || '0',
        descripcion: initialData.descripcion || '',
        imagenPreview: initialData.imagen || null,
        imagen: null,
        estado: initialData.estado !== undefined ? initialData.estado : true,
        tipoUso: initialData.tipoUso || 'Venta Directa',
        vidaUtilDias: initialData.vidaUtilDias || ''
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

    const dataToSubmit = {
      idProducto: formData.idProducto, 
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      existencia: parseInt(formData.existencia), 
      precio: parseFloat(formData.precio),
      stockMinimo: parseInt(formData.stockMinimo),
      stockMaximo: parseInt(formData.stockMaximo),
      
      // ✅ 2. CORRECCIÓN AL ENVIAR LOS DATOS:
      // Si no hay idCategoriaProducto, enviamos 'null' en lugar de un string vacío.
      categoriaProductoId: formData.idCategoriaProducto || null, 
      
      imagen: formData.imagenPreview, 
      estado: formData.estado,
      tipoUso: formData.tipoUso,
      vidaUtilDias: formData.vidaUtilDias ? Number(formData.vidaUtilDias) : null
    };
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