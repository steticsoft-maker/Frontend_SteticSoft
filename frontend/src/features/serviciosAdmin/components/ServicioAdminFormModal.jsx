import React, { useState, useEffect } from 'react';

const ServicioAdminFormModal = ({ isOpen, onClose, onSubmit, initialData, modalType }) => { // categorias removed
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    idCategoriaServicio: '',
  });
  const [selectedFile, setSelectedFile] = useState(null); // Estado para el archivo
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (modalType === 'edit' && initialData) {
        setFormData({
          nombre: initialData.nombre || '',
          descripcion: initialData.descripcion || '',
          precio: initialData.precio || '',
          idCategoriaServicio: initialData.idCategoriaServicio || '',
        });
      } else {
        setFormData({
          nombre: '',
          descripcion: '',
          precio: '',
          idCategoriaServicio: '',
        });
      }
      setSelectedFile(null); // Limpiar archivo seleccionado cada vez que se abre
      setError('');
    }
  }, [isOpen, modalType, initialData]);

  // handleChange removed as it's unused

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Se crea un objeto FormData para enviar archivos y texto juntos
    const submissionData = new FormData();
    Object.keys(formData).forEach(key => {
      submissionData.append(key, formData[key]);
    });

    if (selectedFile) {
      submissionData.append('imagen', selectedFile); // El backend buscará el archivo con el nombre 'imagen'
    }

    try {
      await onSubmit(submissionData); // Se envía el objeto FormData
      onClose();
    } catch (err) {
      setError(err.message || 'Error al guardar. Por favor, revise los datos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modalServicio">
      <div className="modal-content-Servicio formulario">
        <h3>{modalType === 'edit' ? 'Editar Servicio' : 'Agregar Nuevo Servicio'}</h3>
        <form onSubmit={handleSubmit} className="modal-Servicio-form-grid">
          {/* ... campos de nombre, precio, categoría, descripción ... */}
          
          <div className="CamposAgregarServicio">
            <label htmlFor="imagen">Imagen del Servicio (Opcional)</label>
            <input id="imagen" name="imagen" type="file" onChange={handleFileChange} disabled={isSubmitting} />
          </div>

          {error && <div className="CamposAgregarServicio"><p className="error">{error}</p></div>}
          
          <div className="servicios-admin-form-actions">
            <button type="button" className="servicios-admin-button-cancelar" onClick={onClose} disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className="servicios-admin-button-guardar" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServicioAdminFormModal;