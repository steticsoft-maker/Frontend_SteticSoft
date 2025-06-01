// src/features/novedades/components/HorarioCrearModal.jsx
import React, { useState, useEffect } from 'react';
import HorarioForm from './HorarioForm';
import { getEmpleadosParaHorarios } from '../services/horariosService';

const HorarioCrearModal = ({ isOpen, onClose, onSubmit }) => {
  const getInitialFormState = () => ({
    empleadoId: '',
    fechaInicio: '',
    fechaFin: '',
    dias: [{ dia: '', horaInicio: '', horaFin: '' }],
    estado: true // Nuevos horarios activos por defecto
  });

  const [formData, setFormData] = useState(getInitialFormState());
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setEmpleadosDisponibles(getEmpleadosParaHorarios());
      setFormData(getInitialFormState()); // Resetear formulario al abrir
      setFormErrors({});
    }
  }, [isOpen]);

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
    // Limpiar error específico del campo día si existe
    if (formErrors[`dias[${index}].${field}`]) {
        setFormErrors(prev => ({ ...prev, [`dias[${index}].${field}`]: null }));
    }
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
        if (!d.dia) errors[`dias[${i}].dia`] = `Día ${i + 1} es requerido.`;
        if (!d.horaInicio) errors[`dias[${i}].horaInicio`] = `Hora inicio día ${i + 1} es requerida.`;
        if (!d.horaFin) errors[`dias[${i}].horaFin`] = `Hora fin día ${i + 1} es requerida.`;
        if (d.horaInicio && d.horaFin && d.horaInicio >= d.horaFin) {
            errors[`dias[${i}].horaFin`] = `Hora fin día ${i + 1} debe ser posterior a hora inicio.`;
        }
    });
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();
    if (validateForm()) {
        onSubmit(formData); // Enviar datos a ConfigHorariosPage
    }
  };

  if (!isOpen) return null;

  return (
    <div className="novedades-modal-overlay">
      <div className="novedades-modal-content">
        <h3>Agregar Horario (Novedad)</h3>
        <form onSubmit={handleSubmitForm}>
          <HorarioForm
            formData={formData}
            onFormChange={handleFormChange}
            onDiaChange={handleDiaChange}
            onAddDia={handleAddDia}
            onRemoveDia={handleRemoveDia}
            empleadosDisponibles={empleadosDisponibles}
            formErrors={formErrors}
            isEditing={false} // Siempre false para creación
          />
          <div className="botonesAgregarHorarioCitasGuardarCancelar">
            <button className="botonAgregar" type="submit">
              Guardar Horario
            </button>
            <button className="botonCerrar" type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HorarioCrearModal;