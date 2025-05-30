// src/features/citas/pages/CalendarioCitasPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Para idioma español en el calendario
import { useLocation } from 'react-router-dom'; // useNavigate no se usa aquí directamente
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import CitaFormModal from '../components/CitaFormModal';
import CitaDetalleModal from '../components/CitaDetalleModal'; 
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import {
  fetchCitasAgendadas,
  generarEventosDisponibles,
  saveCita,
  deleteCitaById
} from '../services/citasService';
import '../css/Citas.css';

moment.locale('es');
const localizer = momentLocalizer(moment);

function CalendarioCitasPage() {
  const [citasAgendadas, setCitasAgendadas] = useState([]);
  // const [eventosDisponibles, setEventosDisponibles] = useState([]); // Ya no es necesario como estado separado
  const [todosLosEventos, setTodosLosEventos] = useState([]);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false); // Estado para el modal de detalles
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);

  const [selectedSlotOrEvent, setSelectedSlotOrEvent] = useState(null); // Para el slot o evento seleccionado
  const [citaParaOperacion, setCitaParaOperacion] = useState(null); // Para detalles, edición o eliminación

  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  const location = useLocation();
  const clientePreseleccionado = location.state?.clientePreseleccionado;

  const cargarEventos = useCallback(() => {
    setIsLoading(true);
    try {
      const agendadas = fetchCitasAgendadas();
      const disponibles = generarEventosDisponibles(); // Esta función ya considera las agendadas
      
      setCitasAgendadas(agendadas);
      // setEventosDisponibles(disponibles); // Ya no es necesario como estado separado
      setTodosLosEventos([...agendadas.map(c => ({...c, tipo: 'cita'})), ...disponibles]);

    } catch (error) {
      console.error("Error al cargar eventos del calendario:", error);
      setValidationMessage("Error al cargar datos del calendario.");
      setIsValidationModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEventos();
  }, [cargarEventos]);

  const handleSelectSlotOrEvent = useCallback((slotInfo) => {
    setSelectedSlotOrEvent(slotInfo); // Guardar la info del slot/evento

    if (slotInfo.tipo === 'cita') { // Si es una cita existente
      setCitaParaOperacion(slotInfo);
      setIsDetailsModalOpen(true); // Abrir modal de detalles
    } else { // Si es un slot vacío o de disponibilidad (slotInfo.tipo === 'disponible' || !slotInfo.tipo)
      setCitaParaOperacion(null); // No hay cita existente para operar
      setIsFormModalOpen(true); // Abrir modal para crear nueva cita
    }
  }, []);

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setSelectedSlotOrEvent(null);
    setCitaParaOperacion(null);
    setValidationMessage('');
  };

  const handleOpenEditModal = (cita) => { // Llamada desde CitaDetalleModal
    handleCloseModals(); // Cerrar modal de detalles
    setSelectedSlotOrEvent(cita); // Pasar datos de la cita para pre-llenar el formulario
    setCitaParaOperacion(cita);   // Mantener la cita actual para la operación de guardado
    setIsFormModalOpen(true);   // Abrir modal de formulario
  };

  const handleOpenDeleteConfirm = (cita) => { // Llamada desde CitaDetalleModal
    handleCloseModals(); // Cerrar modal de detalles
    setCitaParaOperacion(cita);
    setIsConfirmDeleteOpen(true);
  };

  const handleSaveCita = async (formDataFromModal) => {
    setIsLoading(true);
    try {
      // Si estamos editando, necesitamos el ID de la cita original
      const dataToSave = citaParaOperacion?.id ? { ...formDataFromModal, id: citaParaOperacion.id } : formDataFromModal;
      
      const citasActuales = fetchCitasAgendadas();
      const updatedCitasAgendadas = saveCita(dataToSave, citasActuales);
      
      // Recargar todos los eventos
      cargarEventos(); // Esta función ya actualiza todosLosEventos y citasAgendadas
      
      handleCloseModals();
      // Opcional: mostrar mensaje de éxito
      // setValidationMessage("Cita guardada exitosamente.");
      // setIsValidationModalOpen(true);

    } catch (error) {
      console.error("Error al guardar cita:", error);
      setValidationMessage(error.message || "Error al procesar la cita.");
      setIsValidationModalOpen(true); // Mostrar modal de validación/error
      // No cerramos el FormModal aquí para que el usuario pueda corregir
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCitaConfirmada = () => {
    if (citaParaOperacion) {
      try {
        const citasActuales = fetchCitasAgendadas();
        const updatedCitas = deleteCitaById(citaParaOperacion.id, citasActuales);
        
        cargarEventos(); // Recargar todos los eventos
        
        handleCloseModals();
      } catch(error) {
        console.error("Error al eliminar cita:", error);
        setValidationMessage(error.message || "Error al eliminar la cita.");
        setIsValidationModalOpen(true);
      }
    }
  };

  const eventStyleGetter = (event) => {
    if (event.tipo === "disponible") {
      return { style: { backgroundColor: "var(--color-availability-slot, #e3f2fd)", border: "1px dashed var(--color-primary-light, #2196f3)", cursor: "pointer", opacity: 0.8, color: 'var(--color-text-dark)' } };
    }
    return { style: { backgroundColor: "var(--color-primary, #64b5f6)", color: "var(--color-text-light, white)", border: "1px solid var(--color-primary-dark, #1976d2)" }};
  };

  return (
    <div className="admin-layout">
      <NavbarAdmin />
      <div className="main-content">
        <div className="contenedor-citas">
          <h1>Gestión de Citas</h1>
          {isLoading && <div className="cargando"><div className="spinner"></div></div>}
          <Calendar
            localizer={localizer}
            events={todosLosEventos}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "calc(100vh - 170px)" }} // Ajustar altura un poco más
            selectable
            onSelectEvent={handleSelectSlotOrEvent}
            onSelectSlot={handleSelectSlotOrEvent}
            eventPropGetter={eventStyleGetter}
            defaultView="week"
            views={['month', 'week', 'day', 'agenda']} // Añadida vista agenda
            min={moment().set({ hour: 8, minute: 0 }).toDate()}
            max={moment().set({ hour: 20, minute: 0 }).toDate()}
            step={30}
            timeslots={2}
            messages={{
              today: "Hoy", previous: "Anterior", next: "Siguiente", month: "Mes",
              week: "Semana", day: "Día", agenda: "Agenda", date: "Fecha",
              time: "Hora", event: "Evento", noEventsInRange: "No hay eventos en este rango."
            }}
          />
        </div>
      </div>

      <CitaFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSaveCita}
        initialSlotData={selectedSlotOrEvent} // Para creación o para prellenar en edición
        // Si es edición, initialSlotData será la cita completa (tipo 'cita')
        // Si es creación, initialSlotData será la info del slot (tipo 'disponible' o slot vacío)
        clientePreseleccionado={clientePreseleccionado}
      />
      <CitaDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        cita={citaParaOperacion} // Usar citaParaOperacion
        onEdit={handleOpenEditModal} // Función para pasar a modo edición
        onDeleteConfirm={handleOpenDeleteConfirm} // Función para iniciar borrado
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteCitaConfirmada}
        title="Eliminar Cita"
        message={`¿Está seguro que desea eliminar la cita para "${citaParaOperacion?.cliente || ''}" con ${citaParaOperacion?.empleado || ''}?`}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={handleCloseModals}
        title="Aviso de Citas"
        message={validationMessage}
      />
    </div>
  );
}

export default CalendarioCitasPage;