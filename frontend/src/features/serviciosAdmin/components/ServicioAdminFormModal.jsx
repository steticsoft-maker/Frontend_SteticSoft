// src/features/serviciosAdmin/components/ServicioAdminFormModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import { FaUpload, FaTrashAlt } from 'react-icons/fa';
import '../css/ServiciosAdmin.css';

const API_URL = import.meta.env.VITE_API_URL;

// --- Constantes de Validación ---
const NAME_REGEX = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s]*$/;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ServicioAdminFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode, categorias }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    idCategoriaServicio: '',
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const getFullImageUrl = useCallback((relativeUrl) => {
    if (!relativeUrl) return '';
    // Si la URL ya es absoluta, no la modificamos.
    if (relativeUrl.startsWith('http') || relativeUrl.startsWith('blob:')) {
      return relativeUrl;
    }
    // Para URLs relativas, construimos la URL completa.
    return `${API_URL}${relativeUrl}`;
  }, []);

  useEffect(() => {
    if (isOpen) {
      const initialFormData = {
        nombre: isEditMode && initialData ? initialData.nombre || '' : '',
        descripcion: isEditMode && initialData ? initialData.descripcion || '' : '',
        precio: isEditMode && initialData ? initialData.precio || '' : '',
        idCategoriaServicio: isEditMode && initialData ? initialData.idCategoriaServicio || '' : '',
      };
      
      setFormData(initialFormData);
      
      if (isEditMode && initialData?.imagenUrl) {
        setImagePreview(getFullImageUrl(initialData.imagenUrl));
      } else {
        setImagePreview('');
      }

      setImageFile(null);
      setFormErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, isEditMode, initialData, getFullImageUrl]);

  // --- Validaciones ---
  const validarCaracteres = (name, value) => {
    if (name === "nombre" && !NAME_REGEX.test(value)) {
      setFormErrors(prev => ({
        ...prev,
        [name]: "No se permiten caracteres especiales."
      }));
    } else {
      setFormErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validarObligatorioYEspacios = (name, value) => {
    let error = "";
    if (name === "nombre") {
      if (!value) error = "El nombre es obligatorio.";
      else if (value.trim() !== value) error = "No debe tener espacios al inicio o al final.";
    }

    if (name === "precio") {
      if (!String(value)) error = "El precio es obligatorio.";
      else if (isNaN(value) || Number(value) < 0) error = "El precio debe ser un número válido y no negativo.";
    }

    if (name === "idCategoriaServicio") {
      if (!value) error = "Debe seleccionar una categoría.";
    }

    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  // --- Handlers ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validación inmediata de caracteres especiales
    if (name === "nombre") {
      validarCaracteres(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    const trimmedValue = typeof value === "string" ? value.trim() : value;
    setFormData(prev => ({ ...prev, [name]: trimmedValue }));

    validarObligatorioYEspacios(name, trimmedValue);
  };

  const handleImageChange = (file) => {
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      toast.error("Tipo de archivo no permitido. Solo se aceptan .jpg, .png, .webp.");
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast.error("El archivo es demasiado grande. El máximo es 2MB.");
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    handleImageChange(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    // Si estamos en modo edición y había una imagen inicial, debemos conservarla en el estado
    // para no perderla si el usuario decide no subir una nueva.
    if (isEditMode && initialData?.imagenUrl) {
      setImagePreview(getFullImageUrl(initialData.imagenUrl));
    }
  };

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageChange(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validationErrors = {};
    let firstErrorField = null;

    Object.keys(formData).forEach(name => {
      const value = typeof formData[name] === "string" ? formData[name].trim() : formData[name];
      const error = validarObligatorioYEspacios(name, value);
      if (error) {
        validationErrors[name] = error;
        if (!firstErrorField) firstErrorField = name;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      toast.error("Por favor, corrige los errores del formulario.");
      setFormErrors(validationErrors);
      if (firstErrorField) {
        document.querySelector(`[name=${firstErrorField}]`)?.focus();
      }
      return;
    }
    
    setIsSubmitting(true);
    
    const dataToSend = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion,
      precio: formData.precio,
      idCategoriaServicio: formData.idCategoriaServicio,
    };
    
    if (imageFile) {
      dataToSend.imagen = imageFile;
    } else if (!imagePreview && isEditMode) {
      dataToSend.imagenUrl = '';
    }
    
    try {
        await onSubmit(dataToSend);
    } catch {
        // El error ya se maneja y se muestra en la página principal
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
          <div className="servicios-admin-form-grid-with-image">
            
            <div className="servicios-admin-form-fields">
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
                <select name="idCategoriaServicio" value={formData.idCategoriaServicio || ''} onChange={handleChange} onBlur={handleBlur} className={`form-control ${formErrors.idCategoriaServicio ? 'is-invalid' : ''}`}>
                  <option value="">Seleccione una categoría...</option>
                  {(categorias || []).map(cat => <option key={cat.value} value={cat.value}>{cat.label}</option>)}
                </select>
                {formErrors.idCategoriaServicio && <span className="field-error-message">{formErrors.idCategoriaServicio}</span>}
              </div>
            </div>

            <div className="servicios-admin-form-image-section">
              <label>Imagen del Servicio</label>
              <div 
                className={`image-upload-area ${isDragging ? 'dragging' : ''}`} 
                onDragEnter={handleDragEvents}
                onDragOver={handleDragEvents}
                onDragLeave={handleDragEvents}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input-servicio').click()}
              >
                <input type="file" id="file-input-servicio" accept={ALLOWED_FILE_TYPES.join(',')} onChange={handleFileSelect} style={{ display: 'none' }} />
                
                {imagePreview ? (
                  <div className="image-preview-container">
                    <img src={imagePreview} alt="Vista previa del servicio" className="image-preview" />
                    <button type="button" className="remove-image-btn" onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }} title="Eliminar imagen">
                      <FaTrashAlt />
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <FaUpload />
                    <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
                    <small>JPG, PNG, WEBP - Máx 2MB</small>
                  </div>
                )}
              </div>
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
