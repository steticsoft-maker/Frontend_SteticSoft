// src/features/abastecimiento/components/AbastecimientoEditarModal.jsx
import React, { useState, useEffect } from 'react';
import AbastecimientoForm from './AbastecimientoForm';
// En el modo edición, usualmente no se permite cambiar categoría, producto o empleado,
// solo la cantidad. Por lo tanto, no se necesitan los ItemSelectionModal aquí,
// a menos que la lógica de negocio permita estos cambios.
// Si se permiten, se necesitarían getCategorias, getProductosDisponibles, getEmpleados.

const AbastecimientoEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        id: initialData.id,
        nombre: initialData.nombre || '',
        category: initialData.category || '',
        empleado: initialData.empleado || '',
        cantidad: initialData.cantidad?.toString() || '',
        // Mantener campos no editables pero necesarios para el objeto
        fechaIngreso: initialData.fechaIngreso,
        isDepleted: initialData.isDepleted,
        depletionReason: initialData.depletionReason,
        depletionDate: initialData.depletionDate,
      });
      setFormErrors({});
    } else if (isOpen && !initialData) {
      console.error("Modal de edición de abastecimiento abierto sin initialData. Cerrando.");
      onClose(); // Forzar cierre si no hay datos iniciales
    }
  }, [isOpen, initialData, onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    if (!formData.cantidad || isNaN(parseInt(formData.cantidad)) || parseInt(formData.cantidad) <= 0) {
      errors.cantidad = "La cantidad debe ser un número positivo.";
    }
    // En edición, los campos producto, categoría, empleado usualmente no se validan porque están deshabilitados
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit(formData, false); // saveAndAddAnother es siempre false para edición
  };

  if (!isOpen || !initialData) return null;

  return (
    <div className="modal-abastecimiento-overlay">
      <div className="modal-abastecimiento-content formulario-modal">
        <h2 className="abastecimiento-modal-title">Editar Producto de Abastecimiento</h2>
        <form className="abastecimiento-form-grid" onSubmit={handleSubmitForm}>
          <AbastecimientoForm
            formData={formData}
            onInputChange={handleInputChange}
            // Las funciones para seleccionar no se usan activamente si los campos están deshabilitados
            onSelectCategory={() => {}} // No-op o deshabilitar botón en AbastecimientoForm
            onSelectProduct={() => {}}  // No-op o deshabilitar botón en AbastecimientoForm
            onSelectEmployee={() => {}} // No-op o deshabilitar botón en AbastecimientoForm
            isEditing={true} // Siempre true para edición
            formErrors={formErrors}
          />
          {formErrors.cantidad && <p className="error-abastecimiento">{formErrors.cantidad}</p>}
          <div className="form-actions-abastecimiento">
            <button 
              type="submit" 
              className="form-button-guardar-abastecimiento"
              disabled={!formData.cantidad || parseInt(formData.cantidad) <= 0}
            >
              Actualizar Producto
            </button>
            <button type="button" className="form-button-cancelar-abastecimiento" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AbastecimientoEditarModal;