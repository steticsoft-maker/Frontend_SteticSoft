// src/features/productosAdmin/components/ProductoAdminEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ProductoAdminForm from './ProductoAdminForm';
import { productosAdminService } from '../services/productosAdminService';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

const ProductoAdminEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && initialData) {
      setIsLoading(true);
      setFormErrors({});

      const fetchCategorias = async () => {
        try {
          const categorias = await productosAdminService.getActiveCategorias();
          setCategoriasDisponibles(
            (categorias || []).map((cat) => ({
              idCategoriaProducto: cat.idCategoriaProducto,
              nombre: cat.nombre,
            }))
          );
        } catch (error) {
          console.error('Error al cargar categorías en el modal de edición:', error);
          setCategoriasDisponibles([]);
          setFormErrors((prev) => ({
            ...prev,
            _general: 'No se pudieron cargar las categorías.',
          }));
        } finally {
          setIsLoading(false);
        }
      };

      fetchCategorias();

      // Normaliza valores para el formulario
      setFormData({
        idProducto: initialData.idProducto,
        nombre: initialData.nombre || '',
        idCategoriaProducto:
          initialData.categoriaProductoId ?? initialData.idCategoriaProducto ?? '',
        precio:
          typeof initialData.precio === 'number'
            ? initialData.precio.toString()
            : (initialData.precio || '').toString(),
        existencia:
          typeof initialData.existencia === 'number'
            ? initialData.existencia.toString()
            : (initialData.existencia || '').toString(),
        stockMinimo:
          initialData.stockMinimo !== undefined && initialData.stockMinimo !== null
            ? initialData.stockMinimo.toString()
            : '',
        stockMaximo:
          initialData.stockMaximo !== undefined && initialData.stockMaximo !== null
            ? initialData.stockMaximo.toString()
            : '',
        descripcion: initialData.descripcion || '',
        imagen: initialData.imagen || null, // puede ser URL string
        imagenPreview: null,
        estado: initialData.estado !== undefined ? initialData.estado : true,
        tipoUso: initialData.tipoUso
          ? initialData.tipoUso.charAt(0).toUpperCase() +
            initialData.tipoUso.slice(1).toLowerCase()
          : 'Externo',
        vidaUtilDias:
          initialData.vidaUtilDias !== undefined && initialData.vidaUtilDias !== null
            ? initialData.vidaUtilDias.toString()
            : '',
      });
    } else if (isOpen && !initialData) {
      console.error('Modal de edición de producto abierto sin initialData. Cerrando.');
      onClose();
    }
  }, [isOpen, initialData, onClose]);

  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormErrors((prev) => ({ ...prev, imagen: '' }));

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFormErrors((prev) => ({
          ...prev,
          imagen: `La imagen debe ser menor a ${MAX_FILE_SIZE_MB}MB.`,
        }));
        setFormData((prev) => ({ ...prev, imagenPreview: null }));
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imagen: file, // objeto File
          imagenPreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      // si se limpia el input file, mantenemos la URL original (si existía)
      setFormData((prev) => ({
        ...prev,
        imagen: initialData?.imagen || null,
        imagenPreview: null,
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = 'El nombre es obligatorio.';
    if (!formData.idCategoriaProducto) errors.idCategoriaProducto = 'Debe seleccionar una categoría.';
    if (!formData.precio || isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) <= 0) {
      errors.precio = 'El precio debe ser un número positivo.';
    }
    if (
      formData.existencia === '' ||
      isNaN(parseInt(formData.existencia)) ||
      parseInt(formData.existencia) < 0
    ) {
      errors.existencia = 'La existencia debe ser un número igual o mayor a cero.';
    }
    if (
      formData.stockMinimo !== '' &&
      formData.stockMaximo !== '' &&
      Number(formData.stockMaximo) < Number(formData.stockMinimo)
    ) {
      errors.stockMaximo = 'El stock máximo no puede ser menor que el stock mínimo.';
    }
    // En edición, vidaUtilDias no es obligatoria, pero si viene, debe ser > 0
    if (
      formData.vidaUtilDias !== '' &&
      (isNaN(parseInt(formData.vidaUtilDias)) || parseInt(formData.vidaUtilDias) <= 0)
    ) {
      errors.vidaUtilDias = 'La vida útil debe ser un número mayor a cero.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  const dataToSubmit = {
    idProducto: formData.idProducto,
    nombre: formData.nombre,
    descripcion: formData.descripcion || null,
    existencia: Number(formData.existencia),
    precio: Number(formData.precio),
    stockMinimo: formData.stockMinimo === '' ? null : Number(formData.stockMinimo),
    stockMaximo: formData.stockMaximo === '' ? null : Number(formData.stockMaximo),
    idCategoriaProducto: formData.idCategoriaProducto,
    estado: formData.estado,
    tipoUso: formData.tipoUso,
    vidaUtilDias: formData.vidaUtilDias === '' ? null : Number(formData.vidaUtilDias),
  };

  // Solo incluimos imagen si el usuario subió un File nuevo
  if (formData.imagen && typeof formData.imagen !== 'string') {
    dataToSubmit.imagen = formData.imagen;
  }

  try {
    const errors = await onSubmit(dataToSubmit);

    if (errors && Array.isArray(errors) && errors.length > 0) {
      const mapped = {};
      errors.forEach((err) => {
        const key = err.path || err.param || '_general';
        mapped[key] = err.msg || 'Error de validación.';
      });

      setFormErrors(mapped);

      // 🧩 Mostrar errores en modal general también
      const mensaje = Object.entries(mapped)
        .map(([campo, msg]) => `${campo}: ${msg}`)
        .join('\n');

      setValidationMessage(mensaje);
      setIsValidationModalOpen(true);
      return;
    }

    onClose(); // actualizado correctamente
  } catch (error) {
    console.error('Error inesperado al actualizar el producto:', error);

    if (error?.response?.data?.errors) {
      const mapped = {};
      error.response.data.errors.forEach((err) => {
        const key = err.path || err.param || '_general';
        mapped[key] = err.msg || 'Error de validación.';
      });

      setFormErrors(mapped);

      const mensaje = Object.entries(mapped)
        .map(([campo, msg]) => `${campo}: ${msg}`)
        .join('\n');

      setValidationMessage(mensaje);
      setIsValidationModalOpen(true);
    } else {
      const fallbackMsg = 'Ocurrió un error inesperado al actualizar el producto.';
      setFormErrors((prev) => ({
        ...prev,
        _general: fallbackMsg,
      }));
      setValidationMessage(fallbackMsg);
      setIsValidationModalOpen(true);
    }
  }
};


  if (!isOpen || !initialData) return null;

  return (
    <div className="modalProductosAdministrador">
      <div className="modal-content-ProductosAdministrador">
        <h2>Editar Producto</h2>
        {isLoading ? (
          <p>Cargando categorías...</p>
        ) : (
          <form onSubmit={handleSubmitForm} noValidate>
            <ProductoAdminForm
              formData={formData}
              onFormChange={handleFormChange}
              onFileChange={handleFileChange}
              categoriasDisponibles={categoriasDisponibles}
              isEditing={true}
              formErrors={formErrors}
            />
            {formErrors._general && <p className="error-message">{formErrors._general}</p>}
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
