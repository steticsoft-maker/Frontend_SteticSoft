// src/features/proveedores/components/ProveedorEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ProveedorForm from './ProveedorForm';

const ProveedorEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        ...initialData,
        estado: initialData.estado === "Activo" || initialData.estado === true ? "Activo" : "Inactivo",
      });
      setFormErrors({});
    } else if (isOpen && !initialData) {
      console.error("Modal de edición de proveedor abierto sin initialData. Cerrando.");
      onClose();
    }
  }, [isOpen, initialData, onClose]);

  const handleFormChange = (name, value, resetData = null) => {
    setFormData(prev => ({
      ...prev,
      ...(resetData || {}),
      [name]: value
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (formData.tipoDocumento === "Natural") {
      if (!formData.nombre?.trim()) errors.nombre = "El nombre (Natural) es obligatorio.";
      if (!formData.numeroDocumento?.trim()) errors.numeroDocumento = "El número de documento es obligatorio.";
    } else { 
      if (!formData.nombreEmpresa?.trim()) errors.nombreEmpresa = "El nombre de la empresa es obligatorio.";
      if (!formData.nit?.trim()) errors.nit = "El NIT es obligatorio.";
    }
    if (!formData.telefono?.trim()) errors.telefono = "El teléfono es obligatorio.";
    if (!formData.email?.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errors.email = "El email principal no es válido.";
    if (!formData.direccion?.trim()) errors.direccion = "La dirección es obligatoria.";
    if (!formData.personaEncargadaNombre?.trim()) errors.personaEncargadaNombre = "El nombre del encargado es obligatorio.";
    if (!formData.personaEncargadaTelefono?.trim()) errors.personaEncargadaTelefono = "El teléfono del encargado es obligatorio.";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData);
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="modal-Proveedores">
      <div className="modal-content-Proveedores formulario-modal">
        <h2 className="proveedores-modal-title">Editar Proveedor</h2>
        <form className="proveedores-form-grid" onSubmit={handleSubmitForm}>
          <ProveedorForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={true}
            formErrors={formErrors}
          />
          <div className="proveedores-form-actions">
            <button type="submit" className="proveedores-form-button-guardar">
              Actualizar Proveedor
            </button>
            <button type="button" className="proveedores-form-button-cancelar" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProveedorEditarModal; // ASEGÚRATE DE ESTA LÍNEA