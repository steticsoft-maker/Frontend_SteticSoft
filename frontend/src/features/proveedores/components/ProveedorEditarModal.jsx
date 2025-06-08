// src/features/proveedores/components/ProveedorEditarModal.jsx
import React, { useState, useEffect } from 'react';
import ProveedorForm from './ProveedorForm';

const ProveedorEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  // Función para generar un estado de formulario seguro y completo
  const getInitialFormState = (proveedor = {}) => ({
    idProveedor: proveedor.idProveedor || null,
    nombre: proveedor.nombre || '',
    tipo: proveedor.tipo || 'Natural',
    telefono: proveedor.telefono || '',
    correo: proveedor.correo || '',
    direccion: proveedor.direccion || '',
    tipoDocumento: proveedor.tipoDocumento || '',
    numeroDocumento: proveedor.numeroDocumento || '',
    nitEmpresa: proveedor.nitEmpresa || '',
    nombrePersonaEncargada: proveedor.nombrePersonaEncargada || '',
    telefonoPersonaEncargada: proveedor.telefonoPersonaEncargada || '',
    emailPersonaEncargada: proveedor.emailPersonaEncargada || '',
    // CORRECCIÓN: Aseguramos que el estado sea siempre un booleano.
    estado: typeof proveedor.estado === 'boolean' ? proveedor.estado : true
  });

  // CORRECCIÓN 1: El estado se inicializa SIEMPRE con un objeto vacío y seguro.
  const [formData, setFormData] = useState(getInitialFormState());
  const [errors, setErrors] = useState({});

  // CORRECCIÓN 2: `useEffect` es el ÚNICO responsable de poblar el formulario con 'initialData'.
  useEffect(() => {
    if (isOpen && initialData) {
      // Cuando el modal se abre con datos, poblamos el formulario.
      setFormData(getInitialFormState(initialData));
    } else if (!isOpen) {
      // Cuando el modal se cierra, lo reseteamos a su estado inicial vacío.
      setFormData(getInitialFormState());
      setErrors({});
    }
  }, [isOpen, initialData]); // Se ejecuta cada vez que 'isOpen' o 'initialData' cambian.

  const handleFormChange = (name, value, resetData = {}) => {
    setFormData(prev => ({
      ...prev,
      ...resetData,
      [name]: value
    }));
  };

  const validateForm = () => {
    // Tu lógica de validación se mantiene igual.
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido.';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido.';
    if (!formData.correo.trim()) newErrors.correo = 'El email es requerido.';
    if (!formData.direccion.trim()) newErrors.direccion = 'La dirección es requerida.';
    if (formData.tipo === 'Natural' && !formData.numeroDocumento?.trim()) {
      newErrors.numeroDocumento = 'El número de documento es requerido.';
    }
    if (formData.tipo === 'Jurídico' && !formData.nitEmpresa?.trim()) {
      newErrors.nitEmpresa = 'El NIT es requerido.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData); // `onSubmit` sigue siendo manejado por la página principal.
      onClose();
    }
  };

  // El guardián para no renderizar nada si el modal está cerrado. Esencial.
  if (!isOpen) return null;

  return (
    <div className="modal-Proveedores">
      <div className="modal-content-Proveedores formulario-modal">
        <span className="close-button-Proveedores" onClick={onClose}>&times;</span>
        <h2 className="proveedores-modal-title">Editar Proveedor</h2>
        <form onSubmit={handleSubmit} noValidate className="proveedores-form-grid">
          <ProveedorForm 
            formData={formData} 
            onFormChange={handleFormChange}
            errors={errors}
            isEditing={true}
          />
          <div className="proveedores-form-actions">
            <button type="submit" className="proveedores-form-button-guardar">Guardar Cambios</button>
            <button type="button" className="proveedores-form-button-cancelar" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProveedorEditarModal;