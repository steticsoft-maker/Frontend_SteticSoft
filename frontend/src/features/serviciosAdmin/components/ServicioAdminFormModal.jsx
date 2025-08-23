// src/features/serviciosAdmin/components/ServicioAdminFormModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../css/ServiciosAdmin.css';

// --- Constantes de Validación ---
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
// Regex estricta: solo letras (con acentos y ñ), números y espacios internos.
const NAME_REGEX = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s]*$/;

const ServicioAdminFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode, categorias }) => {
  const [formData, setFormData] = useState({});
  const [imagenFile, setImagenFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Efecto para inicializar/resetear el formulario ---
  useEffect(() => {
    if (isOpen) {
      const initialFormData = {
        nombre: isEditMode ? initialData.nombre || '' : '',
        descripcion: isEditMode ? initialData.descripcion || '' : '',
        precio: isEditMode ? initialData.precio || '' : '',
        id_categoria_servicio: isEditMode ? (initialData.idCategoriaServicio || '') : '',
      };
      setFormData(initialFormData);
      setFormErrors({});
      setIsSubmitting(false);
      setImagenFile(null);

      if (isEditMode && initialData?.imagen) {
        const backendUrl = import.meta.env.VITE_API_BASE_URL || '';
        const imageUrl = initialData.imagen.startsWith('http') ? initialData.imagen : `${backendUrl}${initialData.imagen}`;
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl('');
      }
    }
  }, [isOpen, isEditMode, initialData]);

  // --- Lógica de Validación Centralizada ---
  const validateField = (name, value, file = null) => {
    let error = "";
    switch (name) {
      case 'nombre':
        if (!value) {
          error = "El nombre es obligatorio.";
        } else if (value.trim() !== value) {
          error = "No debe tener espacios al inicio o al final.";
        } else if (!NAME_REGEX.test(value)) {
          error = "No se permiten caracteres especiales.";
        }
        break;
      case 'precio':
        if (!String(value)) {
          error = "El precio es obligatorio.";
        } else if (isNaN(value) || Number(value) < 0) {
          error = "El precio debe ser un número válido y no negativo.";
        }
        break;
      case 'id_categoria_servicio':
        if (!value) error = "Debe seleccionar una categoría.";
        break;
      case 'imagen':
        if (file) {
          if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            error = "Formato de imagen no válido (solo JPG, PNG, WEBP).";
          } else if (file.size > MAX_IMAGE_SIZE_BYTES) {
            error = `La imagen no debe superar los 2MB.`;
          }
        } else if (!isEditMode) {
          error = "La imagen es obligatoria.";
        }
        break;
      default: break;
    }
    return error;
  };
  
  // --- Manejadores de Eventos ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setFormData(prev => ({ ...prev, [name]: trimmedValue }));
    const error = validateField(name, trimmedValue);
    setFormErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const error = validateField('imagen', null, file);

    setFormErrors(prev => ({ ...prev, imagen: error }));
    if (!error && file) {
      setImagenFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setImagenFile(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = {};
    Object.keys(formData).forEach(name => {
      const trimmedValue = typeof formData[name] === 'string' ? formData[name].trim() : formData[name];
      const error = validateField(name, trimmedValue);
      if (error) validationErrors[name] = error;
    });
    const imageError = validateField('imagen', null, imagenFile);
    if (imageError) validationErrors.imagen = imageError;

    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Por favor, corrige los errores del formulario.");
      return;
    }
    
    setIsSubmitting(true);
    
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
        submissionData.append(key, formData[key]);
    });
    if (imagenFile) {
        submissionData.append('imagen', imagenFile);
    }
    
    try {
        await onSubmit(submissionData);
    } catch {
        // El error ya se maneja en la página principal
    } finally {
        setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="servicios-admin-modal-overlay">
      <div className="servicios-admin-modal-content">
        <h3>{isEditMode ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}</h3>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="servicios-admin-form-grid">
            
            <div className="servicios-admin-form-group">
              <label>Nombre del Servicio <span className="required-asterisk">*</span></label>
              <input 
                name="nombre" 
                value={formData.nombre || ''} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`}
              />
              {formErrors.nombre && <span className="field-error-message">{formErrors.nombre}</span>}
            </div>

            <div className="servicios-admin-form-group">
              <label>Descripción</label>
              <textarea 
                name="descripcion" 
                value={formData.descripcion || ''} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className="form-control" 
              />
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Precio <span className="required-asterisk">*</span></label>
              <input 
                name="precio" 
                type="number" 
                step="any" 
                value={formData.precio || ''} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className={`form-control ${formErrors.precio ? 'is-invalid' : ''}`}
              />
              {formErrors.precio && <span className="field-error-message">{formErrors.precio}</span>}
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Categoría <span className="required-asterisk">*</span></label>
              <select 
                name="id_categoria_servicio" 
                value={formData.id_categoria_servicio || ''} 
                onChange={handleChange} 
                onBlur={handleBlur}
                className={`form-control ${formErrors.id_categoria_servicio ? 'is-invalid' : ''}`}
              >
                <option value="">Seleccione una categoría...</option>
                {(categorias || []).map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {formErrors.id_categoria_servicio && <span className="field-error-message">{formErrors.id_categoria_servicio}</span>}
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Imagen {isEditMode ? '(Opcional)' : <span className="required-asterisk">*</span>}</label>
              <input 
                type="file" 
                accept={ALLOWED_IMAGE_TYPES.join(', ')} 
                onChange={handleFileChange} 
                className={`form-control ${formErrors.imagen ? 'is-invalid' : ''}`}
              />
              {formErrors.imagen && <span className="field-error-message">{formErrors.imagen}</span>}
              
              {previewUrl && (
                <div className="image-preview">
                  <img src={previewUrl} alt="Vista previa" />
                </div>
              )}
            </div>

          </div>

          <div className="servicios-admin-form-actions">
            <button type="submit" className="guardar" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="cancelar" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicioAdminFormModal;