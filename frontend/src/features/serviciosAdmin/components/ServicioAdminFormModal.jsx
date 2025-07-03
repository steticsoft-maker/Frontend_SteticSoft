import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import '../css/ServiciosAdmin.css';

const ServicioAdminFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode, categorias }) => {
  
  const [formData, setFormData] = useState({});
  const [imagenFile, setImagenFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // La lógica de validación por campo permanece igual
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case 'nombre':
        if (!value.trim()) error = "El nombre es obligatorio.";
        else if (!/^[a-zA-Z0-9\sñÑáéíóúÁÉÍÓÚüÜ]+$/.test(value)) error = "El nombre solo puede contener letras, números y espacios.";
        break;
      case 'precio':
        if (!String(value).trim()) error = "El precio es obligatorio.";
        else if (isNaN(value) || Number(value) < 0) error = "El precio debe ser un número no negativo.";
        break;
      case 'categoriaServicioId':
        if (!value) error = "Debe seleccionar una categoría.";
        break;
      default:
        break;
    }
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  // La inicialización del formulario permanece igual
  useEffect(() => {
    if (isOpen) {
      setFormErrors({});
      setIsSubmitting(false);
      setImagenFile(null);
      
      const getInitialImageUrl = () => {
        if (isEditMode && initialData?.imagen) {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
          return `${backendUrl}/${initialData.imagen}`;
        }
        return '';
      };

      setFormData({
        nombre: isEditMode ? initialData.nombre || '' : '',
        descripcion: isEditMode ? initialData.descripcion || '' : '',
        precio: isEditMode ? initialData.precio || '' : '',
        duracionEstimada: isEditMode ? initialData.duracionEstimadaMin || '' : '',
        categoriaServicioId: isEditMode ? initialData.categoriaServicioId || '' : '',
      });
      setPreviewUrl(getInitialImageUrl());
    }
  }, [isOpen, isEditMode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // --- CAMBIO CLAVE: Lógica de envío de datos más robusta ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validar todos los campos antes de continuar
    const validationErrors = {};
    let firstErrorField = null;
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        validationErrors[key] = error;
        if (!firstErrorField) firstErrorField = key;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      toast.error("Por favor, corrige los errores del formulario.");
      return;
    }
    
    setIsSubmitting(true);
    
    // 2. Construir el FormData de forma precisa
    const submissionData = new FormData();
    
    // Añadir campos obligatorios
    submissionData.append('nombre', formData.nombre);
    submissionData.append('precio', formData.precio);
    submissionData.append('categoriaServicioId', formData.categoriaServicioId);
    
    // Añadir campos opcionales SOLO SI tienen un valor
    if (formData.descripcion) {
      submissionData.append('descripcion', formData.descripcion);
    }
    if (formData.duracionEstimada) {
      submissionData.append('duracionEstimada', formData.duracionEstimada);
    }
    if (imagenFile) {
      submissionData.append('imagen', imagenFile);
    }

    // 3. Enviar los datos
    try {
      await onSubmit(submissionData);
    } catch (err) {
      // El error de la API (400) será capturado aquí
      toast.error(err.response?.data?.message || err.message || 'Error al guardar.');
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
            {/* El JSX del formulario permanece igual */}
            <div className="servicios-admin-form-group">
              <label>Nombre del Servicio <span className="required-asterisk">*</span></label>
              <input name="nombre" value={formData.nombre || ''} onChange={handleChange} className="form-control" />
              {formErrors.nombre && <span className="field-error-message">{formErrors.nombre}</span>}
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Descripción</label>
              <textarea name="descripcion" value={formData.descripcion || ''} onChange={handleChange} className="form-control" />
            </div>

            <div className="servicios-admin-form-group">
              <label>Precio <span className="required-asterisk">*</span></label>
              <input name="precio" type="number" step="0.01" value={formData.precio || ''} onChange={handleChange} className="form-control" />
              {formErrors.precio && <span className="field-error-message">{formErrors.precio}</span>}
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Duración Estimada (minutos)</label>
              <input name="duracionEstimada" type="number" value={formData.duracionEstimada || ''} onChange={handleChange} className="form-control" />
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Categoría <span className="required-asterisk">*</span></label>
              <select name="categoriaServicioId" value={formData.categoriaServicioId || ''} onChange={handleChange} className="form-control">
                <option value="">Seleccione una categoría...</option>
                {(categorias || []).map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {formErrors.categoriaServicioId && <span className="field-error-message">{formErrors.categoriaServicioId}</span>}
            </div>
            
            <div className="servicios-admin-form-group">
              <label>Imagen</label>
              <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" />
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