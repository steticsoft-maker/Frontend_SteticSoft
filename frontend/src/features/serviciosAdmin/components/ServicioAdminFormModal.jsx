import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaUpload, FaTrashAlt } from 'react-icons/fa';
import '../../../shared/styles/admin-layout.css';

// --- Constantes de Validación ---
const NAME_REGEX = /^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚüÜ\s]*$/;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const ServicioAdminFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode, categorias }) => {
  // --- Estados del Componente ---
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
  const [imageWasRemoved, setImageWasRemoved] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // --- Efecto para Inicializar el Formulario ---
  useEffect(() => {
    if (isOpen) {
      if (isEditMode && initialData) {
        setFormData({
          nombre: initialData.nombre || '',
          descripcion: initialData.descripcion || '',
          precio: initialData.precio || '',
          idCategoriaServicio: initialData.idCategoriaServicio || '',
        });
        setImagePreview(initialData.imagen || '');
      } else {
        setFormData({
          nombre: '',
          descripcion: '',
          precio: '',
          idCategoriaServicio: '',
        });
        setImagePreview('');
      }
      setImageFile(null);
      setImageWasRemoved(false);
      setFormErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, isEditMode, initialData]);

  const validateField = (name, value) => {
    let error = "";
    if (name === "nombre") {
      if (!value) error = "El nombre es obligatorio.";
      else if (value.trim() !== value) error = "No debe tener espacios al inicio o al final.";
      else if (value.trim().length < 3 || value.trim().length > 100) error = "El nombre debe tener entre 3 y 100 caracteres.";
      else if (!NAME_REGEX.test(value.trim())) error = "No se permiten caracteres especiales.";
    }
    if (name === "precio") {
      const priceRegex = /^\d+(\.\d{1,2})?$/;
      const stringValue = String(value).trim();
      if (!stringValue) error = "El precio es obligatorio.";
      else if (isNaN(stringValue) || Number(stringValue) < 0) error = "El precio debe ser un número válido, no negativo.";
      else if (!priceRegex.test(stringValue)) error = "El precio debe tener como máximo dos decimales.";
    }
    if (name === "idCategoriaServicio") {
      if (!value) error = "Debe seleccionar una categoría.";
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  // --- Manejadores de Eventos (Handlers) ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validar en tiempo real para campos requeridos
    const requiredFields = ['nombre', 'precio', 'idCategoriaServicio'];
    if (requiredFields.includes(name)) {
      validateField(name, value);
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const trimmedValue = typeof value === "string" ? value.trim() : value;
    
    // Actualizar el valor sin espacios al inicio y final
    setFormData(prev => ({ ...prev, [name]: trimmedValue }));
    
    // Validar el valor sin espacios
    validateField(name, trimmedValue);
    
    // Limpiar el error si el campo ahora es válido después de quitar espacios
    if (trimmedValue && !validateField(name, trimmedValue)) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFocus = (e) => {
    const { name, value } = e.target;
    // Asegurar que el campo esté limpio cuando el usuario vuelva a entrar
    if (typeof value === "string" && value !== value.trim()) {
      setFormData(prev => ({ ...prev, [name]: value.trim() }));
    }
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
    setImageWasRemoved(false);
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleImageChange(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview('');
    setImageWasRemoved(true);
  };

  const handleDragEvents = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageChange(e.dataTransfer.files[0]);
    }
  };

  // Función para verificar si el formulario es válido
  const isFormValid = () => {
    const requiredFields = ['nombre', 'precio', 'idCategoriaServicio'];
    return requiredFields.every(field => {
      const value = formData[field];
      return value && value.toString().trim() !== '';
    }) && !Object.values(formErrors).some(error => error !== '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    let hasErrors = false;
    const validationErrors = {};
    Object.keys(formData).forEach(name => {
      const error = validateField(name, formData[name]);
      if (error) hasErrors = true;
      validationErrors[name] = error;
    });

    if (hasErrors) {
      toast.error("Por favor, corrige los errores del formulario.");
      setFormErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    
    const dataToSend = {
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio).toFixed(2),
      idCategoriaServicio: parseInt(formData.idCategoriaServicio, 10),
    };

    if (imageFile) {
      dataToSend.imagen = imageFile;
    } else if (imageWasRemoved) {
      dataToSend.imagen = null;
    }

    try {
      await onSubmit(dataToSend);
    } catch {
      // El error ya es manejado por la página que lo llama.
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isOpen) return null;

  return (
    <div className="servicio-modal-overlay">
      <div className="servicio-modal-content">
        <div className="servicio-modal-header">
          <h2 className="servicio-modal-title">{isEditMode ? 'Editar Servicio' : 'Crear Servicio'}</h2>
        </div>
        <div className="servicio-modal-body">
          <form id="servicio-form" onSubmit={handleSubmit} noValidate className="servicio-form">
            <div className="servicio-form-layout">
              <div className="servicio-fields-section">
                <h3 className="servicio-section-title">Información del Servicio</h3>
                <div className="servicio-form-fields">
                  <div className="servicio-form-group">
                    <label htmlFor="nombre" className="servicio-form-label">
                      Nombre del Servicio: <span className="required-asterisk">*</span>
                    </label>
                    <input 
                      id="nombre"
                      name="nombre" 
                      value={formData.nombre} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                      className={`servicio-form-input ${formErrors.nombre ? 'error' : ''}`} 
                      required
                    />
                    {formErrors.nombre && (
                      <span className="servicio-form-error">{formErrors.nombre}</span>
                    )}
                  </div>

                  <div className="servicio-form-group">
                    <label htmlFor="precio" className="servicio-form-label">
                      Precio: <span className="required-asterisk">*</span>
                    </label>
                    <input 
                      id="precio"
                      name="precio" 
                      type="number" 
                      step="0.01" 
                      value={formData.precio} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                      className={`servicio-form-input ${formErrors.precio ? 'error' : ''}`} 
                      required
                    />
                    {formErrors.precio && (
                      <span className="servicio-form-error">{formErrors.precio}</span>
                    )}
                  </div>

                  <div className="servicio-form-group">
                    <label htmlFor="idCategoriaServicio" className="servicio-form-label">
                      Categoría: <span className="required-asterisk">*</span>
                    </label>
                    <select 
                      id="idCategoriaServicio"
                      name="idCategoriaServicio" 
                      value={formData.idCategoriaServicio} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                      className={`servicio-form-select ${formErrors.idCategoriaServicio ? 'error' : ''}`}
                      required
                    >
                      <option value="">Seleccione una categoría...</option>
                      {(categorias || []).map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                    {formErrors.idCategoriaServicio && (
                      <span className="servicio-form-error">{formErrors.idCategoriaServicio}</span>
                    )}
                  </div>

                  <div className="servicio-form-group">
                    <label htmlFor="descripcion" className="servicio-form-label">Descripción:</label>
                    <textarea 
                      id="descripcion"
                      name="descripcion" 
                      value={formData.descripcion} 
                      onChange={handleChange} 
                      onBlur={handleBlur}
                      onFocus={handleFocus}
                      className="servicio-form-textarea"
                      rows="4"
                      placeholder="Descripción opcional del servicio..."
                    />
                  </div>
                </div>
              </div>

              <div className="servicio-image-section">
                <h3 className="servicio-section-title">Imagen del Servicio</h3>
                <div 
                  className={`servicio-image-upload-area ${isDragging ? 'dragging' : ''}`} 
                  onDragEnter={handleDragEvents}
                  onDragOver={handleDragEvents}
                  onDragLeave={handleDragEvents}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input-servicio')?.click()}
                >
                  <input type="file" id="file-input-servicio" accept={ALLOWED_FILE_TYPES.join(',')} onChange={handleFileSelect} style={{ display: 'none' }} />
                  
                  {imagePreview ? (
                    <div className="servicio-image-preview-container">
                      <img 
                        src={imagePreview} 
                        alt="Vista previa del servicio" 
                        className="servicio-image-preview"
                      />
                      <button 
                        type="button" 
                        className="servicio-remove-image-btn" 
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }} 
                        title="Eliminar imagen"
                      >
                        <FaTrashAlt size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="servicio-upload-placeholder">
                      <FaUpload size={48} />
                      <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
                      <small>JPG, PNG, WEBP - Máx 2MB</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="servicio-modal-footer">
          <button 
            type="submit" 
            className="servicio-form-button primary" 
            form="servicio-form" 
            disabled={isSubmitting || !isFormValid()}
          >
            {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Servicio' : 'Crear Servicio')}
          </button>
          <button 
            type="button" 
            className="servicio-form-button secondary" 
            onClick={onClose} 
            disabled={isSubmitting}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServicioAdminFormModal;

