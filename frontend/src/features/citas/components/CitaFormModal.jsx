// src/features/citas/components/CitaFormModal.jsx
import React, { useState, useEffect, useCallback } from 'react';
import CitaForm from './CitaForm';
import {
  fetchServiciosDisponiblesParaCitas,
  fetchEmpleadosDisponiblesParaCitas,
  fetchClientesParaCitas // Asumiendo que la creaste en citasService
} from '../services/citasService';
import moment from 'moment';

const CitaFormModal = ({ isOpen, onClose, onSubmit, initialSlotData, clientePreseleccionado }) => {
  const [formData, setFormData] = useState({});
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState([]);
  const [clientesOptions, setClientesOptions] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingDependencies, setIsLoadingDependencies] = useState(false);

  const resetFormState = () => {
    setFormData({});
    setError('');
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoadingDependencies(true);
      setError(''); // Limpiar errores previos al abrir

      // Cargar dependencias (servicios, empleados, clientes)
      Promise.all([
        fetchServiciosDisponiblesParaCitas(),
        fetchEmpleadosDisponiblesParaCitas(),
        fetchClientesParaCitas() // Opcional, si tienes una lista de clientes
      ]).then(([servicios, empleados, clientes]) => {
        setServiciosDisponibles(servicios);
        setEmpleadosDisponibles(empleados);
        setClientesOptions(clientes || []); // Manejar si clientes es undefined
        
        // Inicializar formData después de cargar dependencias
        let idInit = null;
        let clienteInit = clientePreseleccionado || ''; // Si viene un cliente preseleccionado (ej: desde perfil de cliente)
        let empleadoNombreInit = ''; // Nombre del empleado
        let empleadoIdInit = null;   // ID del empleado
        let serviciosCitaInit = []; // Array de nombres de servicio
        let estadoCitaInit = 'Programada';
        let startTimeInit = initialSlotData?.start || null;
        let endTimeInit = null;

        // Lógica para editar una cita existente (initialSlotData.tipo === 'cita')
        if (initialSlotData && initialSlotData.tipo === 'cita') {
          idInit = initialSlotData.id;
          clienteInit = initialSlotData.cliente;
          empleadoIdInit = initialSlotData.empleadoId;
          const emp = empleados.find(e => e.id === empleadoIdInit);
          empleadoNombreInit = emp ? emp.nombre : (initialSlotData.empleado || '');
          // Asegurarse que serviciosCitaInit sea un array de nombres de servicio
          serviciosCitaInit = initialSlotData.servicios?.map(s => s.nombre) || [];
          estadoCitaInit = initialSlotData.estadoCita || 'Programada';
          startTimeInit = initialSlotData.start; // Ya debería ser un objeto Date
          endTimeInit = initialSlotData.end; // Ya debería ser un objeto Date

        // Lógica para crear desde un slot de empleado en el calendario
        } else if (initialSlotData && initialSlotData.resource?.empleadoId) {
          const empEncontrado = empleados.find(e => e.id === initialSlotData.resource.empleadoId);
          if (empEncontrado) {
            empleadoNombreInit = empEncontrado.nombre;
            empleadoIdInit = empEncontrado.id;
          }
          // Duración por defecto para un nuevo slot, se recalculará al seleccionar servicios
          endTimeInit = startTimeInit ? moment(startTimeInit).add(30, 'minutes').toDate() : null;
        
        // Lógica para crear desde un slot genérico o selección de rango
        } else if (startTimeInit) {
          endTimeInit = moment(startTimeInit).add(30, 'minutes').toDate();
        }

        setFormData({
          id: idInit,
          cliente: clienteInit,
          empleado: empleadoNombreInit, // Nombre del empleado (para UI, no se guarda directamente)
          empleadoId: empleadoIdInit,   // ID del empleado (se guarda)
          servicio: serviciosCitaInit,  // Array de nombres de servicios
          start: startTimeInit,
          end: endTimeInit,
          estadoCita: estadoCitaInit,
        });
        setIsLoadingDependencies(false);
      }).catch(err => {
        console.error("Error cargando dependencias para el formulario de cita:", err);
        setError("Error al cargar datos necesarios para el formulario. " + err.message);
        setIsLoadingDependencies(false);
      });
    } else {
      resetFormState(); // Limpiar el estado cuando el modal se cierra
    }
  }, [isOpen, initialSlotData, clientePreseleccionado]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (error && name === 'cliente') setError(''); // Limpiar error si se modifica el campo cliente
  }, [error]);

  const handleEmpleadoChange = useCallback((e) => {
    const selectedEmpleadoId = parseInt(e.target.value);
    const empleadoSeleccionado = empleadosDisponibles.find(emp => emp.id === selectedEmpleadoId);
    setFormData(prev => ({
      ...prev,
      empleadoId: selectedEmpleadoId || null,
      empleado: empleadoSeleccionado?.nombre || '' // Guardar nombre para UI, opcional
    }));
    if (error && selectedEmpleadoId) setError(''); // Limpiar error si se selecciona un empleado
  }, [empleadosDisponibles, error]);

  const handleServicioChange = useCallback((selectedOptions) => {
    // selectedOptions es un array de objetos { value, label, duracion, id }
    const nombresServicios = selectedOptions ? selectedOptions.map(opt => opt.value) : [];
    let duracionTotal = 0;
    if (selectedOptions && formData.start) {
      duracionTotal = selectedOptions.reduce((total, opt) => {
        // Asegurarse que opt.duracion exista y sea un número
        const duracionServicio = parseInt(opt.duracion);
        return total + (isNaN(duracionServicio) ? 30 : duracionServicio); // Sumar duración o fallback
      }, 0);
    }
    setFormData(prev => ({
      ...prev,
      servicio: nombresServicios, // Guardar array de nombres de servicio
      end: prev.start ? moment(prev.start).add(duracionTotal, 'minutes').toDate() : null
    }));
    if (error && nombresServicios.length > 0) setError(''); // Limpiar error si se seleccionan servicios
  }, [formData.start, error]);

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    // Validaciones
    if (!formData.cliente?.trim()) { setError("El nombre del cliente es obligatorio."); return; }
    if (!formData.empleadoId) { setError("Debe seleccionar un empleado."); return; }
    if (!formData.servicio || formData.servicio.length === 0) { setError("Debe seleccionar al menos un servicio."); return; }
    if (!formData.start) { setError("No se ha definido una hora de inicio para la cita."); return; }

    setError('');
    setIsLoading(true);
    try {
      // El servicio onSubmit espera el objeto formData completo
      await onSubmit({ ...formData }); 
      // No se cierra el modal aquí, se maneja desde CalendarioCitasPage tras éxito
    } catch (submissionError) {
      setError(submissionError.message || "Error al guardar la cita. Intente de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-citas">
      <div className="modal-content-citas">
        <button className="cerrar-modal" onClick={onClose} disabled={isLoading}>&times;</button>
        <h3>{formData.id ? 'Editar Cita' : 'Agendar Nueva Cita'}</h3>
        
        {isLoadingDependencies ? (
          <div className="cargando-modal">Cargando datos del formulario...</div>
        ) : (
          <form onSubmit={handleSubmitForm}>
            <CitaForm
              formData={formData}
              onInputChange={handleInputChange}
              onServicioChange={handleServicioChange}
              onEmpleadoChange={handleEmpleadoChange}
              empleadosDisponibles={empleadosDisponibles}
              serviciosDisponibles={serviciosDisponibles}
              isSlotSelection={!!(initialSlotData && initialSlotData.resource?.empleadoId && !initialSlotData.tipo)}
              clientesOptions={clientesOptions} // Pasar clientes si los tienes
              // isLoadingClientes={false} // Manejar si es asíncrono
            />
            {error && <div className="error-message">{error}</div>}
            <div className="botonesModalCitas">
              <button type="submit" disabled={isLoading || isLoadingDependencies}>
                  {isLoading ? "Guardando..." : (formData.id ? "Actualizar Cita" : "Guardar Cita")}
              </button>
              <button type="button" onClick={onClose} disabled={isLoading}>Cancelar</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
export default CitaFormModal;