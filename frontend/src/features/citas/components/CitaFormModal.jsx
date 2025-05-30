// src/features/citas/components/CitaFormModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import CitaForm from './CitaForm';
import {
  fetchServiciosDisponiblesParaCitas,
  fetchEmpleadosDisponiblesParaCitas
} from '../services/citasService';
import moment from 'moment';

const CitaFormModal = ({ isOpen, onClose, onSubmit, initialSlotData, clientePreseleccionado }) => {
  const [formData, setFormData] = useState({
    cliente: '', empleado: '', empleadoId: null, servicio: [], start: null, end: null
  });
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Para el botón de guardar

  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setError('');
      setServiciosDisponibles(fetchServiciosDisponiblesParaCitas());
      setEmpleadosDisponibles(fetchEmpleadosDisponiblesParaCitas());

      const empleadoPorDefecto = initialSlotData?.resource?.empleadoId
        ? empleadosDisponibles.find(e => e.id === initialSlotData.resource.empleadoId)
        : null;

      setFormData({
        cliente: clientePreseleccionado || '',
        empleado: empleadoPorDefecto?.nombre || '',
        empleadoId: empleadoPorDefecto?.id || null,
        servicio: [],
        start: initialSlotData?.start || null,
        end: initialSlotData?.end || null, // Inicialmente es el slot de 30min
      });
    }
  }, [isOpen, initialSlotData, clientePreseleccionado, empleadosDisponibles]); // Añadir empleadosDisponibles como dependencia

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleEmpleadoChange = useCallback((e) => {
    const empleadoNombre = e.target.value;
    const empleadoSeleccionado = empleadosDisponibles.find(emp => emp.nombre === empleadoNombre);
    setFormData(prev => ({
      ...prev,
      empleado: empleadoNombre,
      empleadoId: empleadoSeleccionado?.id || null
    }));
  }, [empleadosDisponibles]);

  const handleServicioChange = useCallback((selectedOptions) => {
    const nombresServicios = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    let duracionTotal = 0;
    if (selectedOptions && formData.start) {
      duracionTotal = selectedOptions.reduce((total, opt) => {
        const servicio = serviciosDisponibles.find(s => s.nombre === opt.value);
        // En tu Citas.jsx original, la duración era servicio.duracion
        // Asegúrate que tus datos de servicio tengan `duracion_estimada` o ajusta el nombre aquí.
        return total + (parseInt(servicio?.duracion_estimada) || 30); // Usar duracion_estimada
      }, 0);
    }

    setFormData(prev => ({
      ...prev,
      servicio: nombresServicios,
      end: prev.start ? moment(prev.start).add(duracionTotal, 'minutes').toDate() : null
    }));
  }, [formData.start, serviciosDisponibles]);


  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await onSubmit(formData); // onSubmit ahora es una prop que llama a guardarCita en la página
      // onClose(); // La página se encargará de cerrar el modal tras el éxito
    } catch (submissionError) {
      setError(submissionError.message || "Error al guardar la cita.");
    } finally {
        setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-citas"> {/* Clase del CSS original */}
      <div className="modal-content-citas"> {/* Clase del CSS original */}
        <h3>Agendar Nueva Cita</h3>
        <button className="cerrar-modal" onClick={onClose}>&times;</button>
        <form onSubmit={handleSubmitForm}>
          <CitaForm
            formData={formData}
            onInputChange={handleInputChange}
            onServicioChange={handleServicioChange}
            onEmpleadoChange={handleEmpleadoChange}
            empleadosDisponibles={empleadosDisponibles}
            serviciosDisponibles={serviciosDisponibles}
            isSlotSelection={!!initialSlotData?.resource?.empleadoId}
          />
          {error && <div className="error-message" style={{color: 'red', marginTop: '10px'}}>{error}</div>} {/* Estilo básico */}
          <div className="botonesModalCitas"> {/* Clase del CSS original */}
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : "Guardar Cita"}
            </button>
            <button type="button" onClick={onClose} disabled={isLoading}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CitaFormModal;