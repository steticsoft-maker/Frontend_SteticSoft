// src/features/serviciosAdmin/components/ServicioAdminFormModal.jsx
import React, { useState, useEffect } from 'react'; 
import ServicioAdminForm from './ServicioAdminForm';

import '../css/ServiciosAdmin.css';

const ServicioAdminFormModal = ({ isOpen, onClose, onSubmit, initialData, isEditMode, categorias }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracionEstimada: '',
    idCategoriaServicio: '',
    idEspecialidad: '',
    estado: true,
    imagenFile: null,
  });
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [especialidades, setEspecialidades] = useState([]);

  useEffect(() => {
    const fetchEspecialidades = async () => {
      try {
        const response = await getActiveEspecialidadesForSelect();
        setEspecialidades(response);
      } catch (err) {
        console.error("Error al cargar especialidades:", err);
      }
    };
    if (isOpen) {
      fetchEspecialidades();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (isEditMode && initialData) {
        setFormData({
          nombre: initialData.nombre || '',
          descripcion: initialData.descripcion || '',
          precio: initialData.precio || '',
          duracionEstimada: initialData.duracionEstimadaMin || '', // Mapeo de duracionEstimadaMin
          idCategoriaServicio: initialData.idCategoriaServicio || '',
          idEspecialidad: initialData.idEspecialidad || '',
          estado: typeof initialData.estado === 'boolean' ? initialData.estado : true, // Asegura el booleano
          imagenFile: null, // Siempre nulo al cargar
        });
        setCurrentImageUrl(initialData.imagen ? `http://localhost:3000/${initialData.imagen}` : '');
      } else {
        // Modo creación: Resetear todo
        setFormData({
          nombre: '',
          descripcion: '',
          precio: '',
          duracionEstimada: '',
          idCategoriaServicio: '',
          idEspecialidad: '',
          estado: true, // Valor por defecto para creación
          imagenFile: null,
        });
        setCurrentImageUrl('');
      }
    }
  }, [isOpen, isEditMode, initialData]);

  // Maneja cambios de los inputs de ServicioAdminForm
  const handleFormChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Maneja el input de tipo file
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData(prev => ({ ...prev, imagenFile: file })); // Guarda el File object en formData
    setCurrentImageUrl(''); // Si se selecciona un nuevo archivo, limpiar la URL de la imagen actual
  };

  // Maneja la eliminación de la imagen
  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, imagenFile: null })); // Quita el archivo seleccionado
    setCurrentImageUrl('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validaciones de frontend (repetidas del padre, pero importantes para feedback rápido)
    if (!formData.nombre.trim()) {
      setError('El nombre es obligatorio.');
      setIsSubmitting(false);
      return;
    }
    if (isNaN(parseFloat(formData.precio)) || parseFloat(formData.precio) < 0) {
      setError('El precio debe ser un número no negativo.');
      setIsSubmitting(false);
      return;
    }
    if (!formData.idCategoriaServicio) {
      setError('Debe seleccionar una categoría de servicio.');
      setIsSubmitting(false);
      return;
    }
    if (formData.duracionEstimada && (isNaN(parseInt(formData.duracionEstimada)) || parseInt(formData.duracionEstimada) < 0)) {
      setError('La duración estimada debe ser un número entero no negativo.');
      setIsSubmitting(false);
      return;
    }
    
    const submissionData = new FormData();
    for (const key in formData) {
        if (key === 'imagenFile') {
            if (formData.imagenFile) {
                submissionData.append('imagen', formData.imagenFile); // El nombre esperado por el backend
            }
        } else if (key === 'duracionEstimada' || key === 'precio' || key === 'idCategoriaServicio' || key === 'idEspecialidad') {
            const value = formData[key] === "" || formData[key] === null ? "" : String(formData[key]);
            submissionData.append(key, value);
        } else if (key === 'estado') {
            submissionData.append(key, String(formData[key]));
        }
        else {
            submissionData.append(key, formData[key]);
        }
    }

    try {
      await onSubmit(submissionData, initialData);
    } catch (err) {
      setError(err.message || 'Error al guardar. Por favor, revise los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modalServicio-overlay">
      <div className="modal-content-Servicio formulario">
        <h3>{isEditMode ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}</h3>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit} className="modal-Servicio-form-grid">
          <ServicioAdminForm
            formData={formData}
            onFormChange={handleFormChange}
            onFileChange={handleFileChange}
            onRemoveImage={handleRemoveImage} // Pasar la nueva prop
            categoriasDisponibles={categorias} // Pasar las categorías del padre
            especialidadesDisponibles={especialidades} // Pasar las especialidades del padre
            isEditing={isEditMode}
            formErrors={{}}
            currentImageUrl={currentImageUrl} 
          />

          <div className="servicios-admin-form-actions full-width">
            <button type="submit" className="servicios-admin-button-guardar" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
            <button type="button" className="servicios-admin-button-cancelar" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicioAdminFormModal;