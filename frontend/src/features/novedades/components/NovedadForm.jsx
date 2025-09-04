import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getUsuariosAPI } from '../../usuarios/services/usuariosService';

const DIAS_DE_LA_SEMANA = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo'
];


const NovedadForm = ({ onFormSubmit, onCancel, isLoading, initialData, isEditing }) => {
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
  });
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [selectedEmpleados, setSelectedEmpleados] = useState([]);
  const [empleadoOptions, setEmpleadoOptions] = useState([]);
  const [error, setError] = useState('');

  // Cargar empleados
  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const usuarios = await getUsuariosAPI({ rol: 'Empleado', estado: true });
        const options = usuarios.map((user) => ({
          value: user.idUsuario,
          label: user.empleadoInfo
            ? `${user.empleadoInfo.nombre} ${user.empleadoInfo.apellido} (${user.correo})`
            : user.correo,
        }));
        setEmpleadoOptions(options);
      } catch (err) {
        console.error('Error al cargar empleados:', err);
      }
    };
    cargarEmpleados();
  }, []);

  // Prellenar datos si es edición
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        fechaInicio: initialData.fechaInicio?.split('T')[0] || '',
        fechaFin: initialData.fechaFin?.split('T')[0] || '',
        horaInicio: initialData.horaInicio || '',
        horaFin: initialData.horaFin || '',
      });
      setDiasSeleccionados(initialData.dias || []);
      const empleadosAsignados =
        initialData.empleados?.map((emp) => ({
          value: emp.idUsuario,
          label: emp.empleadoInfo
            ? `${emp.empleadoInfo.nombre} ${emp.empleadoInfo.apellido} (${emp.correo})`
            : emp.correo,
        })) || [];
      setSelectedEmpleados(empleadosAsignados);
    }
  }, [isEditing, initialData]);

  // Manejadores
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ ASEGÚRATE DE QUE ESTA FUNCIÓN ESTÉ ASÍ
  const handleDiaChange = (e) => {
    const { value, checked } = e.target;
    setDiasSeleccionados(prev =>
      checked
        ? [...prev, value] // Añade el string (ej: "lunes")
        : prev.filter(dia => dia !== value) // Quita el string
    );
  };

  const handleEmpleadoChange = (selectedOptions) => {
    setSelectedEmpleados(selectedOptions || []);
  };

  // Validación y envío
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (
      !formData.fechaInicio || !formData.fechaFin || !formData.horaInicio ||
      !formData.horaFin || diasSeleccionados.length === 0 || selectedEmpleados.length === 0
    ) {
      setError('⚠️ Todos los campos son obligatorios.');
      return;
    }
    if (new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
      setError('⚠️ La fecha de fin no puede ser anterior a la fecha de inicio.');
      return;
    }
    if (formData.horaFin <= formData.horaInicio) {
      setError('⚠️ La hora de fin debe ser posterior a la hora de inicio.');
      return;
    }

    // ✅ ASEGÚRATE DE QUE EL OBJETO SE CONSTRUYA ASÍ
    const datosParaEnviar = {
      ...formData,
      dias: diasSeleccionados, // Envía el array de strings
      empleadosIds: selectedEmpleados.map((emp) => emp.value),
    };

    onFormSubmit(datosParaEnviar);
  };

  return (
    <form onSubmit={handleSubmit} className="novedad-form">
      {error && <p className="error-message">{error}</p>}
      <div className="form-grid">
        {/* Inputs de fecha y hora */}
        <div className="form-group">
          <label htmlFor="fechaInicio">Fecha de Inicio</label>
          <input type="date" id="fechaInicio" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="fechaFin">Fecha de Fin</label>
          <input type="date" id="fechaFin" name="fechaFin" value={formData.fechaFin} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="horaInicio">Hora de Inicio</label>
          <input type="time" id="horaInicio" name="horaInicio" value={formData.horaInicio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="horaFin">Hora de Fin</label>
          <input type="time" id="horaFin" name="horaFin" value={formData.horaFin} onChange={handleChange} required />
        </div>
        <div className="form-group full-width">
          <label>Días de la Semana Aplicables</label>
          <div className="dias-checkbox-group">
            {DIAS_DE_LA_SEMANA.map(dia => (
              <label key={dia} className="checkbox-label">
                <input
                  type="checkbox"
                  value={dia}
                  checked={diasSeleccionados.includes(dia)}
                  onChange={handleDiaChange}
                />
                {dia}
              </label>
            ))}

          </div>
        </div>
        <div className="form-group full-width">
          <label>Asignar a Empleado(s)</label>
          <Select
            isMulti
            name="empleados"
            options={empleadoOptions}
            className="react-select-container"
            classNamePrefix="react-select"
            placeholder="Seleccione uno o más empleados..."
            value={selectedEmpleados}
            onChange={handleEmpleadoChange}
            isLoading={!empleadoOptions.length}
            isDisabled={isLoading}
            noOptionsMessage={() => 'No hay empleados disponibles'}
          />
        </div>
      </div>
      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="button-primary">
          {isLoading ? 'Guardando...' : isEditing ? 'Actualizar Novedad' : 'Crear Novedad'}
        </button>
        <button type="button" onClick={onCancel} className="button-secondary" disabled={isLoading}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default NovedadForm;