import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { getUsuariosAPI } from '../../usuarios/services/usuariosService';

const NovedadForm = ({ onFormSubmit, onCancel, isLoading, initialData, isEditing }) => {
  
  // --- TODA LA LÓGICA DE ESTADO Y USEEFFECT SE MANTIENE IGUAL ---
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFin: '',
    horaInicio: '',
    horaFin: '',
  });
  const [selectedEmpleados, setSelectedEmpleados] = useState([]);
  const [empleadoOptions, setEmpleadoOptions] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const usuarios = await getUsuariosAPI({ rol: 'Empleado', estado: true });
        const options = usuarios.map(user => ({
          value: user.idUsuario,
          label: user.empleadoInfo ? `${user.empleadoInfo.nombre} ${user.empleadoInfo.apellido} (${user.correo})` : user.correo,
        }));
        setEmpleadoOptions(options);
      } catch (err) {
        console.error("Error al cargar empleados", err);
      }
    };
    cargarEmpleados();
  }, []);

  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        fechaInicio: initialData.fechaInicio?.split('T')[0] || '',
        fechaFin: initialData.fechaFin?.split('T')[0] || '',
        horaInicio: initialData.horaInicio || '',
        horaFin: initialData.horaFin || '',
      });
      const empleadosAsignados = initialData.empleados?.map(emp => ({
        value: emp.idUsuario,
        label: emp.correo,
      })) || [];
      setSelectedEmpleados(empleadosAsignados);
    }
  }, [isEditing, initialData]);

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

    if (!formData.fechaInicio || !formData.fechaFin || !formData.horaInicio || !formData.horaFin || selectedEmpleados.length === 0) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    
    if (new Date(formData.fechaFin) < new Date(formData.fechaInicio)) {
      setError("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }

    if (formData.horaFin <= formData.horaInicio) {
      setError("La hora de fin debe ser posterior a la hora de inicio.");
      return;
    }

    const datosParaEnviar = {
      ...formData,
      empleadosIds: selectedEmpleados.map(emp => emp.value),
    };

    onFormSubmit(datosParaEnviar);
  };

  return (
    // ✅ Se usa la clase 'novedad-form' para el contenedor principal
    <form onSubmit={handleSubmit} className="novedad-form">
      {error && <p className="error-message">{error}</p>}

      {/* ✅ Se envuelven los campos en un grid de 2 columnas */}
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
        
        {/* ✅ El selector ocupa el ancho completo del grid */}
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
            noOptionsMessage={() => 'No hay empleados para mostrar'}
          />
        </div>
      </div>
      
      {/* ✅ La sección de botones se mantiene igual */}
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