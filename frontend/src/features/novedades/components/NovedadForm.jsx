// src/features/horarios/components/NovedadForm.jsx
import React, { useState, useEffect } from 'react';
import Select from 'react-select'; // <-- Importamos la nueva librería
import { getUsuariosAPI } from '../../usuarios/services/usuariosService'; // <-- Necesitamos un servicio para obtener los usuarios/empleados

// --- El Formulario ---
const NovedadForm = ({ onFormSubmit, onCancel, isLoading, initialData, isEditing }) => {
  
  // --- ESTADO: Adaptado a la nueva estructura ---
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
  });
  const [selectedEmpleados, setSelectedEmpleados] = useState([]);
  const [empleadoOptions, setEmpleadoOptions] = useState([]);
  const [error, setError] = useState('');

  // --- EFECTO: Cargar la lista de empleados para el selector ---
  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        // Asumiendo que tienes una función en un servicio que trae todos los usuarios/empleados
        const empleados = await getUsuariosAPI({ rol: 'Empleado', estado: true });
        // Transformamos los datos al formato que react-select necesita: { value, label }
        const options = empleados.map(emp => ({
          value: emp.idUsuario,
          label: emp.correo, // O emp.nombre, lo que prefieras mostrar
        }));
        setEmpleadoOptions(options);
      } catch (err) {
        console.error("Error al cargar empleados", err);
      }
    };
    cargarEmpleados();
  }, []);

  // --- EFECTO: Rellenar el formulario si estamos en modo edición ---
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        fechaInicio: initialData.fechaInicio || '',
        fechaFin: initialData.fechaFin || '',
        horaInicio: initialData.horaInicio || '',
        horaFin: initialData.horaFin || '',
      });
      // Pre-seleccionar los empleados que ya están asignados
      const empleadosAsignados = initialData.empleados.map(emp => ({
        value: emp.idUsuario,
        label: emp.correo,
      }));
      setSelectedEmpleados(empleadosAsignados);
    }
  }, [isEditing, initialData]);

  // --- MANEJADORES ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmpleadoChange = (selectedOptions) => {
    setSelectedEmpleados(selectedOptions || []);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Validación simple
    if (!formData.fechaInicio || !formData.fechaFin || !formData.horaInicio || !formData.horaFin || selectedEmpleados.length === 0) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Preparamos los datos para enviar a la API
    const datosParaEnviar = {
      ...formData,
      // Extraemos solo los IDs de los empleados seleccionados
      empleadosIds: selectedEmpleados.map(emp => emp.value),
    };

    onFormSubmit(datosParaEnviar);
  };

  return (
    <form onSubmit={handleSubmit} className="novedad-form">
      {error && <p className="error-message">{error}</p>}

      {/* --- CAMPOS DE FECHA Y HORA --- */}
      <div className="form-grid">
        <div className="form-group">
          <label>Fecha de Inicio</label>
          <input type="date" name="fechaInicio" value={formData.fechaInicio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Fecha de Fin</label>
          <input type="date" name="fechaFin" value={formData.fechaFin} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Hora de Inicio</label>
          <input type="time" name="horaInicio" value={formData.horaInicio} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Hora de Fin</label>
          <input type="time" name="horaFin" value={formData.horaFin} onChange={handleChange} required />
        </div>
      </div>
      
      {/* --- SELECTOR MÚLTIPLE DE EMPLEADOS --- */}
      <div className="form-group">
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
        />
      </div>

      {/* --- BOTONES DE ACCIÓN --- */}
      <div className="form-actions">
        <button type="submit" disabled={isLoading} className="button-primary">
          {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar Novedad' : 'Crear Novedad')}
        </button>
        <button type="button" onClick={onCancel} className="button-secondary" disabled={isLoading}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default NovedadForm;