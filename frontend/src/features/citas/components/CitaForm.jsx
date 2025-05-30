// src/features/citas/components/CitaForm.jsx
import React from 'react';
import Select from 'react-select'; // Usas react-select para servicios
import moment from 'moment';

const CitaForm = ({
  formData,
  onInputChange,
  onServicioChange,
  onEmpleadoChange,
  empleadosDisponibles,
  serviciosDisponibles,
  isSlotSelection // Indica si el empleado y horario ya vienen del slot seleccionado
}) => {
  const servicioOptions = serviciosDisponibles.map(s => ({
    value: s.nombre, // Asumiendo que guardas el nombre del servicio
    label: `<span class="math-inline">\{s\.nombre\} \(</span>${s.precio?.toFixed(2)})`,
    duracion: s.duracion_estimada || 30 // Asumir duración si no está definida
  }));

  const selectedServicioValues = (formData.servicio || []).map(sName =>
    servicioOptions.find(opt => opt.value === sName)
  ).filter(Boolean); // Filtrar nulos si algún servicio no se encuentra

  return (
    <>
      <div className="form-group"> {/* Clase del CSS original */}
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
          name="empleado" // El backend espera empleadoId, pero el form podría manejar el nombre
          value={formData.empleado || ""} // El nombre del empleado
          onChange={onEmpleadoChange} // Esta función debe actualizar empleado y empleadoId
          disabled={isSlotSelection} // Si el slot ya define un empleado
          required
        >
          <option value="">Seleccione un empleado</option>
          {empleadosDisponibles.map((e) => (
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
          onChange={onServicioChange} // Esta función recibe las opciones seleccionadas
          placeholder="Seleccione servicios..."
          closeMenuOnSelect={false}
          classNamePrefix="react-select-citas" // Para estilos personalizados
          required
        />
      </div>

      <div className="form-group">
        <label>Fecha y Hora Seleccionada:</label>
        <div className="horario-seleccionado"> {/* Clase del CSS original */}
          {formData.start ? (
            <>
              <strong>Inicio:</strong> {moment(formData.start).format('DD/MM/YYYY hh:mm A')}
              <br />
              <strong>Fin:</strong> {formData.end ? moment(formData.end).format('DD/MM/YYYY hh:mm A') : 'Calculando...'}
            </>
          ) : "Seleccione un horario en el calendario."}
        </div>
      </div>
    </>
  );
};

export default CitaForm;