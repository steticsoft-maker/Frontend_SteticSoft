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
        idCategoriaProducto: initialData.categoriaProductoId || '',
        precio: initialData.precio?.toString() || '',
        existencia: initialData.existencia?.toString() || '',
        stockMinimo: initialData.stockMinimo?.toString() || '0',
        stockMaximo: initialData.stockMaximo?.toString() || '0',
        descripcion: initialData.descripcion || '',
        // Guardamos la URL de la imagen original. El componente ProductoAdminForm
        // usará esto si imagenPreview es null.
        imagen: initialData.imagen || null,
        // imagenPreview se inicializa como null. Se poblará si el usuario carga una nueva imagen.
        imagenPreview: null,
        // Este campo 'imagenFile' o similar no es estrictamente necesario en formData si 'imagen'
        // va a contener el File object cuando se carga una nueva imagen,
        // o la URL string si se mantiene la existente.
        // Para claridad, si 'imagen' va a ser polimórfico (File o string), está bien.
        // Si prefieres separar:
        // imagenUrl: initialData.imagen || null,
        // imagenFile: null,
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
        // Limpiar el input de archivo y la vista previa, pero mantener la imagen original en formData.imagen
        setFormData(prev => ({ ...prev, imagenPreview: null /*, imagenFile: null */})); // formData.imagen (URL) no se toca aquí
        e.target.value = null; // Limpiar el input de archivo
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        // Al cargar un nuevo archivo, imagenPreview obtiene el base64, y 'imagen' el File object
        // La URL original (initialData.imagen) se mantiene en formData.imagen si el usuario luego deselecciona el archivo
        setFormData(prev => ({ ...prev, imagen: file, imagenPreview: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      // Si el usuario deselecciona un archivo (o no selecciona ninguno),
      // limpiamos la vista previa y el archivo.
      // La imagen original (URL) se mantiene en formData.imagen si initialData.imagen existía.
      setFormData(prev => ({ ...prev, imagen: initialData?.imagen || null, imagenPreview: null /*, imagenFile: null */ }));
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
      
      // Lógica para determinar qué enviar para la imagen:
      // Si hay una imagenPreview (nueva imagen cargada), se envía esa (base64).
      // Si no hay imagenPreview pero formData.imagen es una string (URL de imagen existente), se envía esa.
      // Si no, se envía null (o lo que el backend espere para "sin imagen" o "eliminar imagen").
      imagen: formData.imagenPreview ? formData.imagenPreview : (typeof formData.imagen === 'string' ? formData.imagen : null),
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