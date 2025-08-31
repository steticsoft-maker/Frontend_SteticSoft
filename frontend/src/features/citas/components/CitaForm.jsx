// src/features/citas/components/CitaForm.jsx
import React from 'react';
import Select from 'react-select';
import moment from 'moment';

const CitaForm = ({
  formData,
  onServicioChange,
  onEmpleadoChange,
  empleadosDisponibles,
  serviciosDisponibles,
  isSlotSelection // true si se seleccionó un slot de un empleado específico en el calendario
}) => {
  // Opciones de servicios en formato compatible con react-select
  const servicioOptions = (serviciosDisponibles || []).map(s => ({
    value: s.id, // usamos el ID como valor
    label: `${s.nombre} ($${(s.precio || 0).toLocaleString('es-CO')}, ${s.duracion_estimada || 30} min)`,
    duracion: s.duracion_estimada || 30,
    precio: s.precio || 0,
    id: s.id,
    nombre: s.nombre
  }));

  // Preseleccionar los servicios que están en formData.servicioIds
  const selectedServicioValues = servicioOptions.filter(opt =>
    (formData.servicioIds || []).includes(opt.id)
  );

  // Handler para cambio en servicios
  const handleServicioChange = (selectedOptions) => {
    const ids = selectedOptions ? selectedOptions.map(opt => opt.id) : [];
    const nombres = selectedOptions ? selectedOptions.map(opt => opt.nombre) : [];

    let duracionTotal = 0;
    if (selectedOptions && formData.start) {
      duracionTotal = selectedOptions.reduce((total, opt) => {
        const duracionServicio = parseInt(opt.duracion);
        return total + (isNaN(duracionServicio) ? 30 : duracionServicio);
      }, 0);
    }

    onServicioChange({
      servicioIds: ids,
      servicioNombres: nombres,
      end: formData.start ? moment(formData.start).add(duracionTotal, 'minutes').toDate() : null
    });
  };

  return (
    <>
      {/* Cliente se maneja en CitaFormModal con ItemSelectionModal */}

      <div className="form-group">
        <label htmlFor="empleado">Empleado: <span className="required-asterisk">*</span></label>
        <select
          id="empleado"
          name="empleadoId"
          value={formData.empleadoId || ""} 
          onChange={onEmpleadoChange}
          disabled={isSlotSelection}
          required
        >
          <option value="">Seleccione un empleado</option>
          {(empleadosDisponibles || []).map((e) => (
            <option key={e.id} value={e.id}>{e.nombre}</option>
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
          onChange={handleServicioChange}
          placeholder="Seleccione servicios..."
          closeMenuOnSelect={false}
          className="react-select-citas-container"
          classNamePrefix="react-select-citas"
          noOptionsMessage={() => 'No hay servicios disponibles'}
        />
      </div>

      <div className="form-group">
        <label>Fecha y Hora Programada:</label>
        <div className="horario-seleccionado">
          {formData.start ? (
            <>
              <strong>Inicio:</strong> {moment(formData.start).format('dddd, D [de] MMMM, YYYY hh:mm A')}
              <br />
              <strong>Fin Estimado:</strong> {formData.end ? moment(formData.end).format('dddd, D [de] MMMM, YYYY hh:mm A') : 'Calculando...'}
            </>
          ) : "Seleccione un horario en el calendario o la fecha será asignada."}
        </div>
      </div>
    </>
  );
};

export default CitaForm;
