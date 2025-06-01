// src/features/citas/components/CitaFormModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import CitaForm from './CitaForm';
import {
  fetchServiciosDisponiblesParaCitas,
  fetchEmpleadosDisponiblesParaCitas
} from '../services/citasService';
import moment from 'moment';

const CitaFormModal = ({ isOpen, onClose, onSubmit, initialSlotData, clientePreseleccionado }) => {
  const [formData, setFormData] = useState({});
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
      setError('');

      const serviciosDisp = fetchServiciosDisponiblesParaCitas();
      const empleadosDisp = fetchEmpleadosDisponiblesParaCitas();
      setServiciosDisponibles(serviciosDisp);
      setEmpleadosDisponibles(empleadosDisp);

      let idInit = null;
      let clienteInit = clientePreseleccionado || '';
      let empleadoNombreInit = '';
      let empleadoIdInit = null;
      let serviciosCitaInit = [];
      let estadoCitaInit = 'Programada';
      let startTimeInit = initialSlotData?.start || null;
      let endTimeInit = null;

      if (initialSlotData?.tipo === 'cita') { // Editando
        idInit = initialSlotData.id;
        clienteInit = initialSlotData.cliente;
        empleadoNombreInit = initialSlotData.empleado;
        empleadoIdInit = initialSlotData.empleadoId;
        serviciosCitaInit = initialSlotData.servicios?.map(s => s.nombre) || [];
        estadoCitaInit = initialSlotData.estadoCita || 'Programada';
        
        if (initialSlotData.start && initialSlotData.servicios?.length > 0) {
          const duracionTotalEdicion = initialSlotData.servicios.reduce((total, s) => total + (parseInt(s.duracion_estimada) || 30), 0);
          endTimeInit = moment(initialSlotData.start).add(duracionTotalEdicion, 'minutes').toDate();
        } else {
          endTimeInit = initialSlotData.end;
        }
      } else if (initialSlotData?.resource?.empleadoId) { // Creando desde slot de empleado
        const empEncontrado = empleadosDisp.find(e => e.id === initialSlotData.resource.empleadoId);
        if (empEncontrado) {
          empleadoNombreInit = empEncontrado.nombre;
          empleadoIdInit = empEncontrado.id;
        }
        endTimeInit = startTimeInit ? moment(startTimeInit).add(30, 'minutes').toDate() : null;
      } else if (startTimeInit) { // Creando desde slot genérico
         endTimeInit = moment(startTimeInit).add(30, 'minutes').toDate();
      }

      setFormData({
        id: idInit,
        cliente: clienteInit,
        empleado: empleadoNombreInit,
        empleadoId: empleadoIdInit,
        servicio: serviciosCitaInit,
        start: startTimeInit,
        end: endTimeInit,
        estadoCita: estadoCitaInit,
      });
    }
  }, [isOpen, initialSlotData, clientePreseleccionado]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error && name === 'cliente') setError('');
  }, [error]);

  const handleEmpleadoChange = useCallback((e) => {
    const empleadoNombre = e.target.value;
    const empleadoSeleccionado = empleadosDisponibles.find(emp => emp.nombre === empleadoNombre);
    setFormData(prev => ({
      ...prev,
      empleado: empleadoNombre,
      empleadoId: empleadoSeleccionado?.id || null
    }));
    if (error && formData.empleadoId) setError('');
  }, [empleadosDisponibles, error, formData.empleadoId]);

  const handleServicioChange = useCallback((selectedOptions) => {
    const nombresServicios = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    let duracionTotal = 0;
    if (selectedOptions && formData.start) {
      duracionTotal = selectedOptions.reduce((total, opt) => total + (parseInt(opt.duracion) || 30), 0);
    }
    setFormData(prev => ({
      ...prev,
      servicio: nombresServicios,
      end: prev.start ? moment(prev.start).add(duracionTotal, 'minutes').toDate() : null
    }));
    if (error && nombresServicios.length > 0) setError('');
  }, [formData.start, error]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.cliente?.trim()) { setError("El nombre del cliente es obligatorio."); return; }
    if (!formData.empleadoId) { setError("Debe seleccionar un empleado."); return; }
    if (!formData.servicio || formData.servicio.length === 0) { setError("Debe seleccionar al menos un servicio."); return; }
    if (!formData.start) { setError("No se ha definido una hora de inicio para la cita."); return; }

    setError('');
    setIsLoading(true);
    try {
      await onSubmit({ ...formData });
    } catch (submissionError) {
      setError(submissionError.message || "Error al guardar la cita.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-citas">
      <div className="modal-content-citas">
        <h3>{formData.id ? 'Editar Cita' : 'Agendar Nueva Cita'}</h3>
        <button className="cerrar-modal" onClick={onClose}>&times;</button>
        <form onSubmit={handleSubmitForm}>
          <CitaForm
            formData={formData}
            onInputChange={handleInputChange}
            onServicioChange={handleServicioChange}
            onEmpleadoChange={handleEmpleadoChange}
            empleadosDisponibles={empleadosDisponibles}
            serviciosDisponibles={serviciosDisponibles}
            isSlotSelection={!!(initialSlotData && initialSlotData.resource?.empleadoId && !initialSlotData.tipo)}
          />
          {error && <div className="error-message">{error}</div>}
          <div className="botonesModalCitas">
            <button type="submit" disabled={isLoading}>
                {isLoading ? "Guardando..." : (formData.id ? "Actualizar Cita" : "Guardar Cita")}
            </button>
            <button type="button" onClick={onClose} disabled={isLoading}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CitaFormModal;