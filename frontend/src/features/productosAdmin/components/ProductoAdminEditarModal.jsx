// src/features/productosAdmin/components/ProductoAdminEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ProductoAdminForm from './ProductoAdminForm';
import { productosAdminService } from '../services/productosAdminService';
import '../../../shared/styles/admin-layout.css';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024;
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

const ProductoAdminEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

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

  let error = '';

  switch (name) {
    case 'nombre':
  if (!value.trim()) {
    error = 'El nombre es obligatorio.';
  } else if (value.trim().length < 3) {
    error = 'El nombre debe tener al menos 3 caracteres.';
  } else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
    error = 'No se permiten símbolos especiales.';
  }
  break;

    case 'idCategoriaProducto':
      if (!value) {
        error = 'Debe seleccionar una categoría.';
      }
      break;

    case 'precio':
      if (!value || isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
        error = 'El precio debe ser un número positivo.';
      }
      break;

    case 'existencia':
      if (value === '' || isNaN(parseInt(value)) || parseInt(value) < 0) {
        error = 'La existencia debe ser un número igual o mayor a cero.';
      }
      break;

    case 'stockMinimo':
    case 'stockMaximo':
      const min = name === 'stockMinimo' ? Number(value) : Number(formData.stockMinimo);
      const max = name === 'stockMaximo' ? Number(value) : Number(formData.stockMaximo);
      
      if (name === 'stockMinimo' && min < 0) {
        error = 'El stock mínimo no puede ser negativo.';
      } else if (       
        formData.stockMinimo !== '' &&
        formData.stockMaximo !== '' &&
        !isNaN(min) &&
        !isNaN(max) &&
        max < min
      ) {
        error = 'El stock máximo no puede ser menor al mínimo.';
      }
      break;

    case 'vidaUtilDias':
      if (value !== '' && (isNaN(parseInt(value)) || parseInt(value) <= 0)) {
        error = 'La vida útil debe ser un número mayor a cero.';
      }
      break;

    case 'descripcion':
      if (!value || value.trim() === '') {
        error = 'La descripción es obligatoria.';
      } else if (value.length > 300) {
        error = 'La descripción no puede superar los 300 caracteres.';
      }
      break;
      
      case 'imagen':
        const file = value?.target?.files?.[0];
        const allowedTypes = ['image/jpeg', 'image/png'];
        if (file && !allowedTypes.includes(file.type)) {
          error = 'Formato no permitido. Solo se aceptan imágenes JPG o PNG.';
        }
        break;

    default:
      break;
  }

  setFormErrors((prev) => ({ ...prev, [name]: error }));
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
    if (!formData.nombre.trim()) {
  errors.nombre = 'El nombre es obligatorio.';
} else if (formData.nombre.trim().length < 3) {
  errors.nombre = 'El nombre debe tener al menos 3 caracteres.';
} else if (!/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.nombre)) {
  errors.nombre = 'El nombre no debe contener símbolos especiales.';
}

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

    // En edición, la imagen no es obligatoria
    // No validamos imagen aquí ya que es opcional en edición

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
    <div className="admin-modal-overlay">
      <div className="admin-modal-content large">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">Editar Producto</h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="admin-modal-body">
          {isLoading ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>Cargando categorías...</p>
          ) : (
            <form id="producto-form" onSubmit={handleSubmitForm} noValidate>
              <ProductoAdminForm
                formData={formData}
                onFormChange={handleFormChange}
                onFileChange={handleFileChange}
                categoriasDisponibles={categoriasDisponibles}
                isEditing={true}
                formErrors={formErrors}
              />
              {formErrors._general && (
                <p className="admin-form-error" style={{ width: '100%', textAlign: 'center' }}>
                  {formErrors._general}
                </p>
              )}
            </form>
          )}
        </div>
        <div className="admin-modal-footer">
          <button type="submit" className="admin-form-button" form="producto-form">
            Actualizar Producto
          </button>
          <button
            type="button"
            className="admin-form-button secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>

        {isValidationModalOpen && (
          <div className="admin-modal-overlay">
            <div className="admin-modal-content">
              <div className="admin-modal-header">
                <h3 className="admin-modal-title">Error de Validación</h3>
                <button
                  type="button"
                  className="admin-modal-close"
                  onClick={() => setIsValidationModalOpen(false)}
                >
                  &times;
                </button>
              </div>
              <div className="admin-modal-body">
                <p className="admin-form-error">{validationMessage}</p>
              </div>
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="admin-form-button secondary"
                  onClick={() => setIsValidationModalOpen(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductoAdminEditarModal;
