import React, { useState, useEffect, useRef } from 'react';
import { getEmpleadosParaHorarios } from '../services/horariosService';

const diasSemanaOpciones = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

const HorarioForm = ({ onFormSubmit, onCancel, isLoading, initialData, isEditing }) => {
  const [id_empleado, setIdEmpleado] = useState(initialData?.id_empleado || '');
  
  const nextId = useRef(0);
  const crearNuevoDia = () => ({
    id: `new_${nextId.current++}`, 
    dia: '', 
    hora_inicio: '', 
    hora_fin: '' 
  });

  const [dias, setDias] = useState(
    initialData?.dias?.length > 0
      ? initialData.dias.map(dia => ({ ...dia, id: dia.idNovedad || `db_${dia.idNovedad}` }))
      : [crearNuevoDia()]
  );
  
  const [listaEmpleados, setListaEmpleados] = useState([]);

  useEffect(() => {
    const cargarEmpleados = async () => {
      try {
        const empleados = await getEmpleadosParaHorarios();
        setListaEmpleados(Array.isArray(empleados) ? empleados : []);
      } catch (error) {
        console.error("Error al cargar empleados", error);
        setListaEmpleados([]);
      }
    };
    cargarEmpleados();
  }, []);

  const handleChangeDia = (id, event) => {
    const { name, value } = event.target;
    setDias(dias.map(item => (item.id === id ? { ...item, [name]: value } : item)));
  };

  const handleAddDia = () => {
    setDias([...dias, crearNuevoDia()]);
  };

  const handleRemoveDia = (id) => {
    if (dias.length > 1) {
      setDias(dias.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    
    if (dias.some(d => !d.dia || !d.hora_inicio || !d.hora_fin)) {
      alert("Error: Por favor, completa todos los campos (Día, Inicio, Fin) para cada fila.");
      return;
    }

   const formData = {
      idEmpleado: id_empleado, 
      dias: dias.map(d => ({
        diaSemana: d.dia,
        horaInicio: d.hora_inicio,
        horaFin: d.hora_fin,
      })),
    };
    onFormSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="novedades-form">
      <div className="form-encargado">
        <label>Encargado (Empleado) <span className="requiredAsteriscoHorarioCitas">*</span></label>
        <select value={id_empleado} onChange={(e) => setIdEmpleado(e.target.value)} required disabled={isEditing}>
          <option value="" disabled>Seleccione un empleado...</option>
          {listaEmpleados.map(emp => (
            <option key={emp.idEmpleado} value={emp.idEmpleado}>{emp.nombre} {emp.apellido}</option>
          ))}
        </select>
      </div>
      <div className="form-dias-horarios-container">
        <label>Días y Horarios <span className="requiredAsteriscoHorarioCitas">*</span></label>
        <div className="dias-grid">
          {dias.map((item, index) => (
            <div key={item.id} className="dia-fields">
              <div className="dia-fields-header">
                <strong>Día {index + 1}</strong>
                {dias.length > 1 && (
                  <button type="button" onClick={() => handleRemoveDia(item.id)} className="botonRemoverDia">
                    &times;
                  </button>
                )}
              </div>
              <div className="containerAgregarHorarioCitas-inputs">
                <div>
                  <label>Día</label>
                  <select name="dia" value={item.dia} onChange={(e) => handleChangeDia(item.id, e)} required>
                    <option value="" disabled>Seleccionar...</option>
                    {diasSemanaOpciones.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label>Inicio</label>
                  <input type="time" name="hora_inicio" value={item.hora_inicio} onChange={(e) => handleChangeDia(item.id, e)} required />
                </div>
                <div>
                  <label>Fin</label>
                  <input type="time" name="hora_fin" value={item.hora_fin} onChange={(e) => handleChangeDia(item.id, e)} required />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={handleAddDia} className="botonAgregarDia">
          Añadir otro día
        </button>
      </div>

      <div className="botonesAgregarHorarioCitasGuardarCancelar">
        <button type="submit" disabled={isLoading} className="botonAgregar">
          {isLoading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Guardar')}
        </button>
        <button type="button" onClick={onCancel} className="botonAgregar botonCerrar" disabled={isLoading}>
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default HorarioForm;