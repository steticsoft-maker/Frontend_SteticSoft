// src/features/novedades/components/HorarioEditarModal.jsx
import React, { useState, useEffect } from 'react';
import HorarioForm from './HorarioForm';
import { getEmpleadosParaHorarios } from '../services/horariosService';

const HorarioEditarModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    empleadoId: '', fechaInicio: '', fechaFin: '', dias: [{ dia: '', horaInicio: '', horaFin: '' }], estado: true
  });
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]);
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setEmpleadosDisponibles(getEmpleadosParaHorarios());
      if (initialData) {
        // Asegurar que initialData.dias sea un array y no esté vacío para evitar errores.
        // También asegurar que initialData.estado se cargue correctamente.
        setFormData({
          ...initialData,
          dias: (initialData.dias && initialData.dias.length > 0)
                ? initialData.dias
                : [{ dia: '', horaInicio: '', horaFin: '' }],
          estado: initialData.estado !== undefined ? initialData.estado : true,
        });
      } else {
        // Este caso no debería ocurrir si se llama correctamente desde la página.
        // Pero por seguridad, reseteamos o cerramos.
        console.warn("HorarioEditarModal abierto sin initialData. Considera cerrar el modal.");
        // onClose(); // Opcionalmente, cerrar si no hay datos para editar.
        setFormData({empleadoId: '', fechaInicio: '', fechaFin: '', dias: [{ dia: '', horaInicio: '', horaFin: '' }], estado: true});
      }
      setFormErrors({});
    }
  }, [isOpen, initialData]); // Quitar 'onClose' de las dependencias si causa re-renders innecesarios al cambiar props.

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
        onSubmit(formData); // Enviar datos actualizados a ConfigHorariosPage
    }
  };

  if (!isOpen || !initialData) return null; // No renderizar si no está abierto o no hay datos iniciales

  return (
    <div className="novedades-modal-overlay">
      <div className="novedades-modal-content">
        <h3>Editar Horario (Novedad)</h3>
        <form onSubmit={handleSubmitForm}>
          <HorarioForm
            formData={formData}
            onFormChange={handleFormChange}
            onDiaChange={handleDiaChange}
            onAddDia={handleAddDia}
            onRemoveDia={handleRemoveDia}
            empleadosDisponibles={empleadosDisponibles}
            formErrors={formErrors}
            isEditing={true} // Siempre true para edición
          />
          <div className="botonesAgregarHorarioCitasGuardarCancelar">
            <button className="botonAgregar" type="submit">
              Actualizar Horario
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

export default HorarioEditarModal;