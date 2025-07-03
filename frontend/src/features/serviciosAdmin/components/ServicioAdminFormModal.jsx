import React, { useState, useEffect } from 'react';
import '../css/ServiciosAdmin.css';
import { toast } from 'react-toastify';

const ServicioAdminFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode, categorias }) => {
  
  const [formData, setFormData] = useState({});
  const [imagenFile, setImagenFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  // CAMBIO: Se usa un objeto para los errores de cada campo
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Lógica de Validación en Tiempo Real ---
  const validateField = (name, value) => {
    let error = "";
    switch (name) {
      case 'nombre':
        if (!value.trim()) {
          error = "El nombre es obligatorio.";
        } else if (!/^[a-zA-Z0-9\sñÑáéíóúÁÉÍÓÚüÜ]+$/.test(value)) {
          error = "El nombre solo puede contener letras, números y espacios.";
        }
        break;
      case 'precio':
        if (!String(value).trim()) {
          error = "El precio es obligatorio.";
        } else if (isNaN(value) || Number(value) < 0) {
          error = "El precio debe ser un número no negativo.";
        }
        break;
      case 'idCategoriaServicio':
        if (!value) {
          error = "Debe seleccionar una categoría.";
        }
        break;
      default:
        break;
    }
    // Actualiza el estado de errores para el campo específico
    setFormErrors(prev => ({ ...prev, [name]: error }));
    return error;
  };

  useEffect(() => {
    if (isOpen) {
      setIsSubmitting(false);
      setImagenFile(null);
      setFormErrors({}); // Limpia los errores al abrir el modal

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
        idCategoriaServicio: isEditMode ? initialData.idCategoriaServicio || '' : '',
      });
      setPreviewUrl(getInitialImageUrl());
    }
  }, [isOpen, isEditMode, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Valida el campo cada vez que cambia
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagenFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Valida todos los campos antes de enviar
    const validationErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        validationErrors[key] = error;
      }
    });

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      toast.error("Por favor, corrige los errores en el formulario.");
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
    } catch (err) {
      toast.error(err.message || 'Error al guardar.');
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
              <select name="idCategoriaServicio" value={formData.idCategoriaServicio || ''} onChange={handleChange} className="form-control">
                <option value="">Seleccione una categoría...</option>
                {categorias.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              {formErrors.idCategoriaServicio && <span className="field-error-message">{formErrors.idCategoriaServicio}</span>}
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