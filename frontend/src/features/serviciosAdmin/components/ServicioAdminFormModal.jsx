// src/features/serviciosAdmin/components/ServicioAdminFormModal.jsx
import React, { useState, useEffect } from 'react';
import ServicioAdminForm from './ServicioAdminForm';
import { getActiveCategoriasServicioForSelect } from '../services/serviciosAdminService';

const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

const ServicioAdminFormModal = ({ isOpen, onClose, onSubmit, initialData, modalType }) => {
  const [formData, setFormData] = useState({ nombre: '', precio: '', categoria: '', descripcion: '', imagen: null, imagenURL: '', estado: 'Activo' });
  const [formErrors, setFormErrorsLocal] = useState({}); // Renombrado para evitar conflicto de props
  const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
  const isEditing = modalType === 'edit';

  useEffect(() => {
    if (isOpen) {
      setCategoriasDisponibles(getActiveCategoriasServicioForSelect());
      if (initialData) {
        setFormData({
          ...initialData,
          precio: initialData.precio?.toString() || '', // Asegurar que precio sea string para el input
          imagen: null, // El input file no se puede pre-llenar
          imagenURL: initialData.imagenURL || ''
        });
      } else { // Creación
        setFormData({ nombre: '', precio: '', categoria: '', descripcion: '', imagen: null, imagenURL: '', estado: 'Activo' });
      }
      setFormErrorsLocal({}); // Resetear errores al abrir
    }
  }, [initialData, isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) { // Limpiar error específico al cambiar el campo
        setFormErrorsLocal(prevErr => ({...prevErr, [name]: ''}));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormErrorsLocal(prevErr => ({...prevErr, imagen: ''})); // Limpiar error de imagen previo

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        setFormErrorsLocal(prevErr => ({ ...prevErr, imagen: `La imagen debe ser menor a ${MAX_FILE_SIZE_MB}MB` }));
        setFormData(prev => ({ ...prev, imagen: null, imagenURL: initialData?.imagenURL || '' })); // Revertir si hay error
        e.target.value = null; // Limpiar el input file
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imagen: file, imagenURL: reader.result }));
      };
      reader.readAsDataURL(file);
    } else { // Si se deselecciona el archivo
        setFormData(prev => ({ ...prev, imagen: null, imagenURL: initialData?.imagenURL || '' }));
    }
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    // Validaciones pueden ir aquí o en el servicio, por ahora se asume que el servicio las maneja al lanzar error
    const errors = {};
    if (!formData.nombre.trim()) errors.nombre = "El nombre es obligatorio";
    if (!formData.precio || isNaN(formData.precio) || parseFloat(formData.precio) <=0) errors.precio = "Precio inválido o no positivo";
    // Si hay un error de imagen ya seteado (tamaño), mantenerlo
    if (formErrors.imagen) errors.imagen = formErrors.imagen;

    if (Object.keys(errors).length > 0) {
        setFormErrorsLocal(errors);
        return;
    }
    onSubmit(formData); // La data de imagenURL se pasa, el servicio se encarga de cómo guardarla
  };

  if (!isOpen) return null;

  return (
    <div className="modalServicio"> {/* Clase del CSS original */}
      <div className="modal-content-Servicio"> {/* Clase del CSS original */}
        <h3>{isEditing ? 'Editar Servicio' : 'Agregar Servicio'}</h3>
        <form className="modal-Servicio-form-grid" onSubmit={handleSubmitForm}> {/* Clase del CSS original */}
          <ServicioAdminForm
            formData={formData}
            onFormChange={handleFormChange}
            onFileChange={handleFileChange}
            categoriasDisponibles={categoriasDisponibles}
            isEditing={isEditing}
            formErrors={formErrorsLocal}
          />
          <div className="CamposAgregarServicio"> {/* Div para los botones, como en el original */}
            <button className="botonEditarServicios" type="submit"> {/* Clase del CSS original */}
              Guardar
            </button>
            <button className="botonEliminarServicios" type="button" onClick={onClose}> {/* Clase del CSS original */}
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicioAdminFormModal;