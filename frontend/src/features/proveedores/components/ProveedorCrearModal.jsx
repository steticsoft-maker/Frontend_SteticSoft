// src/features/proveedores/components/ProveedorCrearModal.jsx
import React, { useState, useEffect } from 'react';
import ProveedorForm from './ProveedorForm';

const ProveedorCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    tipo: "Natural", // Nombre de campo esperado por el backend
    // Campos para tipo Natural
    nombre: "",
    tipoDocumento: "CC", // Nombre de campo esperado por el backend
    numeroDocumento: "",
    // Campos para tipo Jurídico
    nitEmpresa: "", // Nombre de campo esperado por el backend
    // Campos comunes
    telefono: "",
    correo: "", // Nombre de campo esperado por el backend
    direccion: "",
    // Campos de persona encargada
    nombrePersonaEncargada: "", // Nombre de campo esperado por el backend
    telefonoPersonaEncargada: "", // Nombre de campo esperado por el backend
    emailPersonaEncargada: "", // Nombre de campo esperado por el backend
    estado: true, // Nuevos proveedores activos por defecto
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
    setFormData(prev => {
      const newState = { ...prev, ...(resetData || {}), [name]: value };
      // Limpiar campos no relevantes al cambiar de tipo
      if (name === 'tipo') {
        if (value === 'Natural') {
          newState.nitEmpresa = '';
        } else if (value === 'Jurídico') {
          newState.nombre = '';
          newState.tipoDocumento = '';
          newState.numeroDocumento = '';
        }
      }
      return newState;
    });

    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    // La validación ahora se delega principalmente al backend,
    // aquí podemos mantener validaciones simples del lado del cliente.
    const errors = {};
    if (formData.tipo === "Natural") {
      if (!formData.nombre?.trim()) errors.nombre = "El nombre es obligatorio.";
      if (!formData.numeroDocumento?.trim()) errors.numeroDocumento = "El número de documento es obligatorio.";
    } else { 
      if (!formData.nombre?.trim()) errors.nombre = "El nombre de la empresa es obligatorio.";
      if (!formData.nitEmpresa?.trim()) errors.nitEmpresa = "El NIT es obligatorio.";
    }
    if (!formData.telefono?.trim()) errors.telefono = "El teléfono es obligatorio.";
    if (!formData.correo?.trim() || !/\S+@\S+\.\S+/.test(formData.correo)) errors.correo = "El email principal no es válido.";
    // ... más validaciones si lo deseas ...
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    // CORRECCIÓN: Ensamblamos el objeto de datos que la API espera
    const dataToSubmit = {
      nombre: formData.nombre,
      tipo: formData.tipo,
      telefono: formData.telefono,
      correo: formData.correo,
      direccion: formData.direccion,
      tipoDocumento: formData.tipo === 'Natural' ? formData.tipoDocumento : null,
      numeroDocumento: formData.tipo === 'Natural' ? formData.numeroDocumento : null,
      nitEmpresa: formData.tipo === 'Jurídico' ? formData.nitEmpresa : null,
      nombrePersonaEncargada: formData.nombrePersonaEncargada,
      telefonoPersonaEncargada: formData.telefonoPersonaEncargada,
      emailPersonaEncargada: formData.emailPersonaEncargada,
      estado: formData.estado,
    };
    
    onSubmit(dataToSubmit);
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

export default ProveedorCrearModal;