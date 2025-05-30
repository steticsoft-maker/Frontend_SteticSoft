// src/features/novedades/components/HorarioFormModal.jsx
import React, { useState, useEffect } from 'react';
import HorarioForm from './HorarioForm';
import { getEmpleadosParaHorarios } from '../services/horariosService'; // Asumiendo que los empleados se obtienen aquí

const HorarioFormModal = ({ isOpen, onClose, onSubmit, initialData, modalType }) => {
  const [formData, setFormData] = useState({
    empleadoId: '', fechaInicio: '', fechaFin: '', dias: [{ dia: '', horaInicio: '', horaFin: '' }], estado: true
  });
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const isEditing = modalType === 'edit';

  useEffect(() => {
    if (isOpen) {
      setEmpleadosDisponibles(getEmpleadosParaHorarios());
      if (initialData) {
        setFormData({ ...initialData, dias: initialData.dias && initialData.dias.length > 0 ? initialData.dias : [{ dia: '', horaInicio: '', horaFin: '' }] });
      } else { // Creación
        setFormData({
          empleadoId: '', fechaInicio: '', fechaFin: '', dias: [{ dia: '', horaInicio: '', horaFin: '' }], estado: true
        });
      }
      setFormErrors({});
    }
  }, [initialData, isOpen]);

  const handleFormChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleDiaChange = (index, field, value) => {
    setFormData(prev => {
      const newDias = [...prev.dias];
      newDias[index] = { ...newDias[index], [field]: value };
      return { ...prev, dias: newDias };
    });
     if (formErrors[`dias[<span class="math-inline">\{index\}\]\.</span>{field}`]) setFormErrors(prev => ({ ...prev, [`dias[<span class="math-inline">\{index\}\]\.</span>{field}`]: null }));
  };

  const handleAddDia = () => {
    setFormData(prev => ({
      ...prev,
      dias: [...prev.dias, { dia: '', horaInicio: '', horaFin: '' }]
    }));
  };

  const handleRemoveDia = (index) => {
    if (formData.dias.length > 1) {
      setFormData(prev => ({
        ...prev,
        dias: prev.dias.filter((_, i) => i !== index)
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.empleadoId) errors.empleadoId = "Seleccione un encargado.";
    if (!formData.fechaInicio) errors.fechaInicio = "Fecha de inicio es requerida.";
    if (!formData.fechaFin) errors.fechaFin = "Fecha de fin es requerida.";
    if (formData.fechaInicio && formData.fechaFin && new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
        errors.fechaFin = "La fecha de fin no puede ser anterior a la fecha de inicio.";
    }
    formData.dias.forEach((d, i) => {
        if (!d.dia) errors[`dias[${i}].dia`] = "Día requerido.";
        if (!d.horaInicio) errors[`dias[${i}].horaInicio`] = "Hora inicio requerida.";
        if (!d.horaFin) errors[`dias[${i}].horaFin`] = "Hora fin requerida.";
        if (d.horaInicio && d.horaFin && d.horaInicio >= d.horaFin) {
            errors[`dias[${i}].horaFin`] = "Hora fin debe ser posterior a hora inicio.";
        }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (validateForm()) {
        onSubmit(formData);
    }
  };

  if (!isOpen) return null;

  return (
    // Clases del CSS original: modalHorariosCitas, modal-content-HorariosCitas
    <div className="novedades-modal-overlay">
      <div className="novedades-modal-content">
        <h3>{isEditing ? 'Editar Horario (Novedad)' : 'Agregar Horario (Novedad)'}</h3>
        <form onSubmit={handleSubmitForm}>
          <HorarioForm
            formData={formData}
            onFormChange={handleFormChange}
            onDiaChange={handleDiaChange}
            onAddDia={handleAddDia}
            onRemoveDia={handleRemoveDia}
            empleadosDisponibles={empleadosDisponibles}
            formErrors={formErrors}
            isEditing={isEditing}
          />
          <div className="botonesAgregarHorarioCitasGuardarCancelar"> {/* Clase del CSS original */}
            <button className="botonAgregar" type="submit"> {/* Clase del CSS original */}
              {isEditing ? 'Actualizar Horario' : 'Guardar Horario'}
            </button>
            <button className="botonCerrar" type="button" onClick={onClose}> {/* Clase del CSS original */}
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HorarioFormModal;