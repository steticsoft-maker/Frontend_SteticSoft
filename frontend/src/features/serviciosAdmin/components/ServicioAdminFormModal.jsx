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
        // La URL de la imagen ahora viene directamente de Cloudinary
        setImagePreview(initialData.imagen || '');
      } else {
        // Modo creación: reseteamos todo
        setFormData({
          nombre: '',
          descripcion: '',
          precio: '',
          idCategoriaServicio: '',
        });
        setImagePreview('');
      }
      // Reseteamos los estados de imagen, errores y envío cada vez que se abre el modal
      setImageFile(null);
      setImageWasRemoved(false);
      setFormErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, isEditMode, initialData]);

  // --- Funciones de Validación ---
  const validateField = (name, value) => {
    let error = "";
    if (name === "nombre") {
      if (!value) error = "El nombre es obligatorio.";
      else if (value.trim() !== value) error = "No debe tener espacios al inicio o al final.";
      else if (value.length < 3 || value.length > 100) error = "El nombre debe tener entre 3 y 100 caracteres.";
      else if (!NAME_REGEX.test(value)) error = "No se permiten caracteres especiales.";
    }
    if (name === "precio") {
      const priceRegex = /^\d+(\.\d{1,2})?$/;
      if (!String(value)) error = "El precio es obligatorio.";
      else if (isNaN(value) || Number(value) < 0) error = "El precio debe ser un número válido y no negativo.";
      else if (!priceRegex.test(String(value))) error = "El precio debe tener como máximo dos decimales.";
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
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const trimmedValue = typeof value === "string" ? value.trim() : value;
    setFormData(prev => ({ ...prev, [name]: trimmedValue }));
    validateField(name, trimmedValue);
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
    <div className="admin-modal-overlay">
      <div className="admin-modal-content large">
        <div className="admin-modal-header">
          <h2 className="admin-modal-title">{isEditMode ? 'Editar Servicio' : 'Crear Servicio'}</h2>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
        <div className="admin-modal-body">
          <form onSubmit={handleSubmit} noValidate>
            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Información del Servicio</h3>
              <div className="admin-form-row-2">
                <div className="admin-form-group">
                  <label htmlFor="nombre" className="admin-form-label">
                    Nombre del Servicio: <span className="required-asterisk">*</span>
                  </label>
                  <input 
                    id="nombre"
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    onBlur={handleBlur} 
                    className={`admin-form-input ${formErrors.nombre ? 'error' : ''}`} 
                    required
                  />
                  {formErrors.nombre && (
                    <span className="admin-form-error">{formErrors.nombre}</span>
                  )}
                </div>

                <div className="admin-form-group">
                  <label htmlFor="precio" className="admin-form-label">
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
                    className={`admin-form-input ${formErrors.precio ? 'error' : ''}`} 
                    required
                  />
                  {formErrors.precio && (
                    <span className="admin-form-error">{formErrors.precio}</span>
                  )}
                </div>
              </div>

              <div className="admin-form-group">
                <label htmlFor="descripcion" className="admin-form-label">Descripción:</label>
                <textarea 
                  id="descripcion"
                  name="descripcion" 
                  value={formData.descripcion} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  className="admin-form-textarea"
                  rows="4"
                />
              </div>

              <div className="admin-form-group">
                <label htmlFor="idCategoriaServicio" className="admin-form-label">
                  Categoría: <span className="required-asterisk">*</span>
                </label>
                <select 
                  id="idCategoriaServicio"
                  name="idCategoriaServicio" 
                  value={formData.idCategoriaServicio} 
                  onChange={handleChange} 
                  onBlur={handleBlur} 
                  className={`admin-form-select ${formErrors.idCategoriaServicio ? 'error' : ''}`}
                  required
                >
                  <option value="">Seleccione una categoría...</option>
                  {(categorias || []).map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                {formErrors.idCategoriaServicio && (
                  <span className="admin-form-error">{formErrors.idCategoriaServicio}</span>
                )}
              </div>
            </div>

            <div className="admin-form-section">
              <h3 className="admin-form-section-title">Imagen del Servicio</h3>
              <div className="admin-form-group">
                <label className="admin-form-label">Imagen:</label>
                <div 
                  className={`image-upload-area ${isDragging ? 'dragging' : ''}`} 
                  onDragEnter={handleDragEvents}
                  onDragOver={handleDragEvents}
                  onDragLeave={handleDragEvents}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input-servicio')?.click()}
                  style={{
                    border: '2px dashed #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s ease',
                    backgroundColor: isDragging ? '#f0f0f0' : 'transparent'
                  }}
                >
                  <input type="file" id="file-input-servicio" accept={ALLOWED_FILE_TYPES.join(',')} onChange={handleFileSelect} style={{ display: 'none' }} />
                  
                  {imagePreview ? (
                    <div className="image-preview-container" style={{ position: 'relative', display: 'inline-block' }}>
                      <img 
                        src={imagePreview} 
                        alt="Vista previa del servicio" 
                        style={{ 
                          maxWidth: '200px', 
                          maxHeight: '200px', 
                          borderRadius: '8px',
                          objectFit: 'cover'
                        }} 
                      />
                      <button 
                        type="button" 
                        className="remove-image-btn" 
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(); }} 
                        title="Eliminar imagen"
                        style={{
                          position: 'absolute',
                          top: '5px',
                          right: '5px',
                          background: 'red',
                          color: 'white',
                          border: 'none',
                          borderRadius: '50%',
                          width: '25px',
                          height: '25px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <FaTrashAlt size={12} />
                      </button>
                    </div>
                  ) : (
                    <div className="upload-placeholder" style={{ color: '#666' }}>
                      <FaUpload size={48} style={{ marginBottom: '10px' }} />
                      <p>Arrastra una imagen aquí o haz clic para seleccionar</p>
                      <small>JPG, PNG, WEBP - Máx 2MB</small>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="admin-modal-footer">
          <button type="submit" className="admin-form-button" form="servicio-form" disabled={isSubmitting}>
            {isSubmitting ? 'Guardando...' : (isEditMode ? 'Actualizar Servicio' : 'Crear Servicio')}
          </button>
          <button 
            type="button" 
            className="admin-form-button secondary" 
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

