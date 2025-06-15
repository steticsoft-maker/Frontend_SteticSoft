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
  isSlotSelection, // true si se seleccionó un slot de un empleado específico en el calendario
  // isLoadingClientes, // Para el campo cliente si se carga de forma asíncrona - REMOVED
  clientesOptions // Opciones para el selector de clientes
}) => {

  const servicioOptions = (serviciosDisponibles || []).map(s => ({
    value: s.nombre, // Usar el nombre como valor para la selección
    label: `${s.nombre} ($${(s.precio || 0).toLocaleString('es-CO')}, ${s.duracion_estimada || 30} min)`,
    duracion: s.duracion_estimada || 30,
    precio: s.precio || 0,
    id: s.id // Guardar el ID del servicio original
  }));

  // Mapear los nombres de servicio en formData.servicio a los objetos option completos
  const selectedServicioValues = servicioOptions.filter(opt => 
    (formData.servicio || []).includes(opt.value)
  );

  return (
    <>
      <div className="form-group">
        <label htmlFor="cliente">Cliente: <span className="required-asterisk">*</span></label>
        {/* Podrías cambiar esto a un React-Select si tienes muchos clientes */}
        <input
          type="text"
          id="cliente"
          name="cliente"
          value={formData.cliente || ""}
          onChange={onInputChange}
          placeholder="Nombre del cliente"
          required
          list="clientes-list" // Para datalist si no usas Select
        />
        {/* Si tienes una lista de clientes y no usas un Select component: */}
        {clientesOptions && clientesOptions.length > 0 && (
            <datalist id="clientes-list">
                {clientesOptions.map(cliente => (
                    <option key={cliente.id || cliente.value} value={cliente.value} />
                ))}
            </datalist>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="empleado">Empleado: <span className="required-asterisk">*</span></label>
        <select
          id="empleado"
          name="empleado" // El name debería ser 'empleadoId' si quieres guardar el ID directamente
                         // o manejar la conversión en onEmpleadoChange
          value={formData.empleadoId || ""} // El valor del select debe ser el ID del empleado
          onChange={onEmpleadoChange} // Este handler debería setear empleadoId y opcionalmente el nombre
          disabled={isSlotSelection} // Deshabilitar si se seleccionó un slot de empleado específico
          required
        >
          <option value="">Seleccione un empleado</option>
          {(empleadosDisponibles || []).map((e) => (
            <option key={e.id} value={e.id}>{e.nombre}</option> // Usar e.id como value
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="servicio">Servicios: <span className="required-asterisk">*</span></label>
        <Select
          id="servicio"
          isMulti
          options={servicioOptions}
          value={selectedServicioValues} // Pasar los objetos option completos
          onChange={onServicioChange} // Este handler recibirá un array de objetos option
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