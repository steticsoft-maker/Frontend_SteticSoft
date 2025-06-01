// src/features/proveedores/components/ProveedorCrearModal.jsx
import React, { useState, useEffect } from 'react';
import ProveedorForm from './ProveedorForm';

const ProveedorCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    tipoDocumento: "Natural",
    tipoDocumentoNatural: "CC",
    estado: "Activo", 
    nombre: "",
    nombreEmpresa: "",
    numeroDocumento: "",
    nit: "",
    telefono: "",
    email: "",
    direccion: "",
    personaEncargadaNombre: "",
    personaEncargadaTelefono: "",
    personaEncargadaEmail: "",
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormState());
      setFormErrors({});
    }
  }, [isOpen]);

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

  if (!isOpen) return null;

  return (
    <div className="modal-Proveedores">
      <div className="modal-content-Proveedores formulario-modal">
        <h2 className="proveedores-modal-title">Agregar Proveedor</h2>
        <form className="proveedores-form-grid" onSubmit={handleSubmitForm}>
          <ProveedorForm
            formData={formData}
            onFormChange={handleFormChange}
            isEditing={false}
            formErrors={formErrors}
          />
          <div className="proveedores-form-actions">
            <button type="submit" className="proveedores-form-button-guardar">
              Guardar Proveedor
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

export default ProveedorCrearModal; // ASEGÚRATE DE ESTA LÍNEA