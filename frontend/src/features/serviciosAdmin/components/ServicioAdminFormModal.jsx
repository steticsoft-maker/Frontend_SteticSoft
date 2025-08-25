// src/features/serviciosAdmin/components/ServicioAdminFormModal.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../css/ServiciosAdmin.css';

// --- Constantes de Validación ---
const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const NAME_REGEX = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s]*$/;
const URL_REGEX = /^https?:\/\/.+/; // Regex simple para validar que sea una URL http/https

const ServicioAdminFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode, categorias }) => {
  const [formData, setFormData] = useState({
  nombre: '',
  descripcion: '',
  precio: '',
  categoriaServicioId: '',
  imagenUrl: ''
});
  const [imagenFile, setImagenFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // --- NUEVO: Estado para controlar el tipo de fuente de la imagen ---
  const [sourceType, setSourceType] = useState('upload'); // 'upload' o 'url'

  // --- MODIFICADO: Efecto para inicializar/resetear el formulario ---
  useEffect(() => {
    if (isOpen) {
      const initialIsUrl = isEditMode && initialData?.imagen?.startsWith('http');
      const initialFormData = {
        nombre: isEditMode ? initialData.nombre || '' : '',
        descripcion: isEditMode ? initialData.descripcion || '' : '',
        precio: isEditMode ? initialData.precio || '' : '',
        categoriaServicioId: isEditMode ? (initialData.idCategoriaServicio || '') : '',
        // NUEVO: Campo para la URL de la imagen
        imagenUrl: initialIsUrl ? initialData.imagen : '',
      };
      
      setFormData(initialFormData);
      setFormErrors({});
      setIsSubmitting(false);
      setImagenFile(null);
      setSourceType(initialIsUrl ? 'url' : 'upload');

      if (isEditMode && initialData?.imagen) {
        const publicUrl = import.meta.env.VITE_PUBLIC_URL || '';
        const imageUrl = initialIsUrl ? initialData.imagen : `${publicUrl}/${initialData.imagen}`;
        setPreviewUrl(imageUrl);
      } else {
        setPreviewUrl('');
      }
    }
  }, [isOpen, isEditMode, initialData]);

  // --- MODIFICADO: Lógica de Validación Centralizada ---
  const validateField = (name, value, file = null) => {
    let error = "";
    switch (name) {
      case 'nombre': // Sin cambios
        if (!value) error = "El nombre es obligatorio.";
        else if (value.trim() !== value) error = "No debe tener espacios al inicio o al final.";
        else if (!NAME_REGEX.test(value)) error = "No se permiten caracteres especiales.";
        break;
      case 'precio': // Sin cambios
        if (!String(value)) error = "El precio es obligatorio.";
        else if (isNaN(value) || Number(value) < 0) error = "El precio debe ser un número válido y no negativo.";
        break;
      case 'categoriaServicioId': // Sin cambios
        if (!value) error = "Debe seleccionar una categoría.";
        break;
      // NUEVO: Lógica de validación condicional para la imagen
      case 'imagen':
        if (sourceType === 'upload') {
          if (file) {
            if (!ALLOWED_IMAGE_TYPES.includes(file.type)) error = "Formato de imagen no válido (solo JPG, PNG, WEBP).";
            else if (file.size > MAX_IMAGE_SIZE_BYTES) error = `La imagen no debe superar los 2MB.`;
          } else if (!isEditMode && !previewUrl) {
            error = "La imagen es obligatoria.";
          }
        } else { // sourceType === 'url'
          if (!value) {
            if (!isEditMode) error = "La URL de la imagen es obligatoria.";
          } else if (!URL_REGEX.test(value)) {
            error = "Debe ser una URL válida (ej: https://...).";
          }
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
    // NUEVO: Actualizar vista previa al cambiar la URL
    if (name === 'imagenUrl') {
      setPreviewUrl(value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const trimmedValue = value.trim();
    setFormData(prev => ({ ...prev, [name]: trimmedValue }));

    // MODIFICADO: Validar el campo correcto
    const fieldNameToValidate = name === 'imagenUrl' ? 'imagen' : name;
    const error = validateField(fieldNameToValidate, trimmedValue);
    setFormErrors(prev => ({ ...prev, [fieldNameToValidate]: error }));
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

  // --- NUEVO: Manejador para cambiar el tipo de fuente ---
  const handleSourceTypeChange = (e) => {
    setSourceType(e.target.value);
    // Limpiar errores y datos previos al cambiar de método
    setFormErrors(prev => ({ ...prev, imagen: '' }));
    setImagenFile(null);
    setPreviewUrl('');
    setFormData(prev => ({ ...prev, imagenUrl: '' }));
  };


  // --- MODIFICADO: Lógica de envío de formulario ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar todos los campos
    const validationErrors = {};
    Object.keys(formData).forEach(name => {
      const value = formData[name];
      const error = validateField(name, value);
      if (error) validationErrors[name] = error;
    });
    const imageError = validateField('imagen', formData.imagenUrl, imagenFile);
    if (imageError) validationErrors.imagen = imageError;

    setFormErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Por favor, corrige los errores del formulario.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Construir los datos a enviar
    const submissionData = new FormData();
    submissionData.append('nombre', formData.nombre);
    submissionData.append('descripcion', formData.descripcion);
    submissionData.append('precio', formData.precio);
    submissionData.append('categoriaServicioId', formData.categoriaServicioId);

    // Adjuntar la imagen según el tipo de fuente
    if (sourceType === 'upload' && imagenFile) {
      submissionData.append('imagen', imagenFile);
    } else if (sourceType === 'url' && formData.imagenUrl) {
      submissionData.append('imagenUrl', formData.imagenUrl);
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
              <input name="nombre" value={formData.nombre || ''} onChange={handleChange} onBlur={handleBlur} className={`form-control ${formErrors.nombre ? 'is-invalid' : ''}`} />
              {formErrors.nombre && <span className="field-error-message">{formErrors.nombre}</span>}
            </div>

            <div className="servicios-admin-form-group">
              <label>Descripción</label>
              <textarea name="descripcion" value={formData.descripcion || ''} onChange={handleChange} onBlur={handleBlur} className="form-control" />
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Precio <span className="required-asterisk">*</span></label>
              <input name="precio" type="number" step="any" value={formData.precio || ''} onChange={handleChange} onBlur={handleBlur} className={`form-control ${formErrors.precio ? 'is-invalid' : ''}`} />
              {formErrors.precio && <span className="field-error-message">{formErrors.precio}</span>}
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Categoría <span className="required-asterisk">*</span></label>
              <select name="categoriaServicioId" value={formData.categoriaServicioId || ''} onChange={handleChange} onBlur={handleBlur} className={`form-control ${formErrors.categoriaServicioId ? 'is-invalid' : ''}`}>
                <option value="">Seleccione una categoría...</option>
                {(categorias || []).map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {formErrors.categoriaServicioId && <span className="field-error-message">{formErrors.categoriaServicioId}</span>}
            </div>
            
            {/* --- NUEVO: Selector de tipo de imagen --- */}
            <div className="servicios-admin-form-group span-2">
              <label>Fuente de la Imagen {isEditMode ? '(Opcional)' : <span className="required-asterisk">*</span>}</label>
              <div className="image-source-selector">
                <label>
                  <input type="radio" value="upload" checked={sourceType === 'upload'} onChange={handleSourceTypeChange} />
                  Subir archivo
                </label>
                <label>
                  <input type="radio" value="url" checked={sourceType === 'url'} onChange={handleSourceTypeChange} />
                  Usar URL
                </label>
              </div>

              {sourceType === 'upload' ? (
                <input type="file" accept={ALLOWED_IMAGE_TYPES.join(', ')} onChange={handleFileChange} className={`form-control ${formErrors.imagen ? 'is-invalid' : ''}`} />
              ) : (
                <input type="url" name="imagenUrl" value={formData.imagenUrl || ''} onChange={handleChange} onBlur={handleBlur} placeholder="https://ejemplo.com/imagen.jpg" className={`form-control ${formErrors.imagen ? 'is-invalid' : ''}`} />
              )}
              
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