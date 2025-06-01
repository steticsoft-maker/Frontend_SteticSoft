// src/features/citas/components/CitaForm.jsx
import React from 'react';
import Select from 'react-select';
import moment from 'moment';

const CitaForm = ({
  formData,
  onInputChange,
  onServicioChange,
  onEmpleadoChange,
  empleadosDisponibles,
  serviciosDisponibles,
  isSlotSelection
}) => {

  const servicioOptions = (serviciosDisponibles || []).map(s => ({
    value: s.nombre,
    label: `${s.nombre} ($${(s.precio || 0).toLocaleString('es-CO')}, ${s.duracion_estimada || 30} min)`,
    duracion: s.duracion_estimada || 30,
    precio: s.precio || 0
  }));

  const selectedServicioValues = (formData.servicio || []).map(nombreServicio =>
    servicioOptions.find(opt => opt.value === nombreServicio)
  ).filter(Boolean);

  return (
    <>
      <div className="form-group">
        <label htmlFor="cliente">Cliente: <span className="required-asterisk">*</span></label>
        <input
          type="text"
          id="cliente"
          name="cliente"
          value={formData.cliente || ""}
          onChange={onInputChange}
          placeholder="Nombre del cliente"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="empleado">Empleado: <span className="required-asterisk">*</span></label>
        <select
          id="empleado"
          name="empleado"
          value={formData.empleado || ""}
          onChange={onEmpleadoChange}
          disabled={isSlotSelection}
          required
        >
          <option value="">Seleccione un empleado</option>
          {(empleadosDisponibles || []).map((e) => (
            <option key={e.id} value={e.nombre}>{e.nombre}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="servicio">Servicios: <span className="required-asterisk">*</span></label>
        <Select
          id="servicio"
          isMulti
          options={servicioOptions}
          value={selectedServicioValues}
          onChange={onServicioChange}
          placeholder="Seleccione servicios..."
          closeMenuOnSelect={false}
          classNamePrefix="react-select-citas"
        />
      </div>

      <div className="form-group">
        <label>Fecha y Hora Seleccionada:</label>
        <div className="horario-seleccionado">
          {formData.start ? (
            <>
              <strong>Inicio:</strong> {moment(formData.start).format('DD/MM/YYYY hh:mm A')}
              <br />
              <strong>Fin Calculado:</strong> {formData.end ? moment(formData.end).format('DD/MM/YYYY hh:mm A') : 'Calculando...'}
            </>
          ) : "Seleccione un horario en el calendario."}
        </div>
      </div>
    </>
  );
};

export default CitaForm;