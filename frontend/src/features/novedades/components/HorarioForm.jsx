// src/features/novedades/components/HorarioForm.jsx
import React from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const DIAS_SEMANA = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

const HorarioForm = ({
  formData,
  onFormChange,
  onDiaChange,
  onAddDia,
  onRemoveDia,
  empleadosDisponibles,
  formErrors,
  isEditing
}) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFormChange(name, value);
  };

  const handleDiaFieldChange = (index, field, value) => {
    onDiaChange(index, field, value);
  };

  return (
    // Basado en modalHorariosCitas-form-grid del CSS original
    <div className="novedades-form-grid">
      <div className="form-encargado">
        <label htmlFor="empleadoId">
          Encargado <span className="requiredAsteriscoHorarioCitas">*</span>
        </label>
        <select
          id="empleadoId"
          name="empleadoId"
          value={formData.empleadoId || ""}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccionar encargado</option>
          {empleadosDisponibles.map((enc) => (
            <option key={enc.id} value={enc.id}>{enc.nombre}</option>
          ))}
        </select>
        {formErrors?.empleadoId && <span className="errorHorariocitas">{formErrors.empleadoId}</span>}
      </div>

      <div className="form-fechas">
        <div className="form-fechaHorarioCitas">
          <label htmlFor="fechaInicio">
            Fecha Inicio <span className="requiredAsteriscoHorarioCitas">*</span>
          </label>
          <input
            type="date"
            id="fechaInicio"
            name="fechaInicio"
            value={formData.fechaInicio || ""}
            onChange={handleInputChange}
            required
          />
          {formErrors?.fechaInicio && <span className="errorHorariocitas">{formErrors.fechaInicio}</span>}
        </div>
        <div className="form-fechaHorarioCitas">
          <label htmlFor="fechaFin">
            Fecha Fin <span className="requiredAsteriscoHorarioCitas">*</span>
          </label>
          <input
            type="date"
            id="fechaFin"
            name="fechaFin"
            value={formData.fechaFin || ""}
            onChange={handleInputChange}
            min={formData.fechaInicio}
            required
          />
          {formErrors?.fechaFin && <span className="errorHorariocitas">{formErrors.fechaFin}</span>}
        </div>
      </div>

      <div className="form-dias-horarios-container">
        <label className="asteriscoHorarioCitas">
          Días y Horarios <span className="requiredAsteriscoHorarioCitas">*</span>
        </label>
        <div className="dias-grid">
          {(formData.dias || []).map((diaHorario, index) => (
            <div key={index} className="dia-fields">
              <div className="containerAgregarHorarioCitas-inputs">
                <div>
                  <select
                    name="dia"
                    value={diaHorario.dia || ""}
                    onChange={(e) => handleDiaFieldChange(index, "dia", e.target.value)}
                    required
                  >
                    <option value="">Día</option>
                    {DIAS_SEMANA.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {formErrors && formErrors[`dias[${index}].dia`] && <span className="errorHorariocitas">{formErrors[`dias[${index}].dia`]}</span>}
                </div>
                <div>
                  <input
                    type="time"
                    name="horaInicio"
                    value={diaHorario.horaInicio || ""}
                    onChange={(e) => handleDiaFieldChange(index, "horaInicio", e.target.value)}
                    required
                  />
                   {formErrors && formErrors[`dias[${index}].horaInicio`] && <span className="errorHorariocitas">{formErrors[`dias[${index}].horaInicio`]}</span>}
                </div>
                <span>a</span>
                <div>
                  <input
                    type="time"
                    name="horaFin"
                    value={diaHorario.horaFin || ""}
                    onChange={(e) => handleDiaFieldChange(index, "horaFin", e.target.value)}
                    min={diaHorario.horaInicio}
                    required
                  />
                  {formErrors && formErrors[`dias[${index}].horaFin`] && <span className="errorHorariocitas">{formErrors[`dias[${index}].horaFin`]}</span>}
                </div>
                {index > 0 && ( // Solo mostrar botón de eliminar si hay más de un día
                  <button
                    type="button"
                    className="botonCerrar botonRemoverDia"
                    onClick={() => onRemoveDia(index)}
                  >
                    <FaMinus />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="botonAgregar botonAgregarDia"
          onClick={onAddDia}
        >
          <FaPlus /> Agregar otro día
        </button>
      </div>
      {isEditing && (
        <div className="form-group-novedades"> {/* Asegúrate de tener esta clase en tu CSS */}
            <label className="form-label-novedades">Estado (Activo):</label>
            <label className="switch">
                <input
                    type="checkbox"
                    name="estado"
                    checked={formData.estado}
                    onChange={(e) => onFormChange('estado', e.target.checked)}
                />
                <span className="slider round"></span>
            </label>
        </div>
      )}
    </div>
  );
};

export default HorarioForm;