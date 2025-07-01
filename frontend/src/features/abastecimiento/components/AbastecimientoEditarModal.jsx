// src/features/abastecimiento/components/AbastecimientoEditarModal.jsx
import React, { useState, useEffect } from "react";
// import ReactDOM from 'react-dom'; // ELIMINADO
import AbastecimientoForm from "./AbastecimientoForm";

const AbastecimientoEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        idAbastecimiento: initialData.idAbastecimiento,
        cantidad: initialData.cantidad?.toString() || "",
        productoNombre: initialData.producto?.nombre || "N/A",
        empleadoNombre: initialData.empleado?.nombre || "N/A",
      });
      setFormErrors({});
    }
  }, [isOpen, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errors = {};
    if (
      !formData.cantidad ||
      isNaN(parseInt(formData.cantidad)) ||
      parseInt(formData.cantidad) <= 0
    ) {
      errors.cantidad = "La cantidad debe ser un número positivo.";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const dataToSubmit = {
      idAbastecimiento: formData.idAbastecimiento,
      cantidad: parseInt(formData.cantidad, 10),
    };
    onSubmit(dataToSubmit);
  };

  if (!isOpen) return null;

  // INICIO DE MODIFICACIÓN: Se retorna el JSX directamente sin el portal.
  return (
    <div className="modal-abastecimiento-overlay">
      <div className="modal-abastecimiento-content formulario-modal">
        <button type="button" className="modal-close-button-x" onClick={onClose}>
          &times;
        </button>
        <h2 className="abastecimiento-modal-title">
          Editar Cantidad de Abastecimiento
        </h2>
        <form className="abastecimiento-form-grid" onSubmit={handleSubmitForm}>
          <AbastecimientoForm
            formData={formData}
            onInputChange={handleInputChange}
            isEditing={true}
            formErrors={formErrors}
          />
          <div className="form-actions-abastecimiento">
            <button
              type="submit"
              className="form-button-guardar-abastecimiento"
            >
              Actualizar Registro
            </button>
            <button
              type="button"
              className="form-button-cancelar-abastecimiento"
              onClick={onClose}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
  // FIN DE MODIFICACIÓN
};

export default AbastecimientoEditarModal;