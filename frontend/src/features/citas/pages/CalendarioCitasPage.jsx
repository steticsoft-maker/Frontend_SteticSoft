// src/features/citas/pages/CalendarioCitasPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import { useLocation } from 'react-router-dom';
import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import CitaFormModal from '../components/CitaFormModal';
import CitaDetalleModal from '../components/CitaDetalleModal';
import CitasTable from '../components/CitasTable'; // Importar la tabla
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import {
  fetchCitasAgendadas,
  generarEventosDisponibles,
  saveCita,
  deleteCitaById,
  cambiarEstadoCita
} from '../services/citasService';
import '../css/Citas.css';

moment.locale('es');
const localizer = momentLocalizer(moment);

function CalendarioCitasPage() {
  const [citasAgendadas, setCitasAgendadas] = useState([]);
  const [todosLosEventos, setTodosLosEventos] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [selectedSlotOrEvent, setSelectedSlotOrEvent] = useState(null);
  const [citaParaOperacion, setCitaParaOperacion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const location = useLocation();
  const clientePreseleccionado = location.state?.clientePreseleccionado;
  const [showCancelConfirmModal, setShowCancelConfirmModal] = useState(false);
  const [citaParaCancelar, setCitaParaCancelar] = useState(null);

  const cargarEventosYActualizarTabla = useCallback(() => {
    setIsLoading(true);
    try {
      const agendadas = fetchCitasAgendadas();
      const disponibles = generarEventosDisponibles();
      
      // Ordenar citas para la tabla (más recientes primero)
      setCitasAgendadas(agendadas.sort((a, b) => new Date(b.start) - new Date(a.start)));
      
      const eventosCombinados = [
        ...agendadas.map(c => ({
            ...c, 
            tipo: 'cita', 
            title: c.title || `${c.cliente} - ${c.servicios?.map(s=>s.nombre).join(', ') || 'Servicios'}`
        })),
        ...disponibles
      ];
      setTodosLosEventos(eventosCombinados);

    } catch (error) {
      console.error("Error al cargar eventos del calendario:", error);
      setValidationMessage("Error al cargar datos del calendario: " + error.message);
      setIsValidationModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarEventosYActualizarTabla();
  }, [cargarEventosYActualizarTabla]);

  const handleSelectSlotOrEvent = useCallback((slotInfo) => {
    setSelectedSlotOrEvent(slotInfo);
    if (slotInfo.tipo === 'cita') { // Si se hace clic en una cita existente en el calendario
      setCitaParaOperacion(slotInfo);
      setIsDetailsModalOpen(true); // Abrir modal de detalles
    } else { // Si se hace clic en un slot disponible o se selecciona un rango de tiempo
      setCitaParaOperacion(null); // No hay cita para operar (es creación)
      setIsFormModalOpen(true);   // Abrir modal para crear nueva cita
    }
  }, []);

  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsValidationModalOpen(false);
    setShowCancelConfirmModal(false);
    setSelectedSlotOrEvent(null);
    setCitaParaOperacion(null);
    setCitaParaCancelar(null);
    setValidationMessage('');
  };

  const handleOpenEditModal = (cita) => { // Llamado desde CitaDetalleModal o CitasTable
    setIsDetailsModalOpen(false); // Cerrar detalles si estaba abierto
    setSelectedSlotOrEvent(cita); 
    setCitaParaOperacion(cita);   
    setIsFormModalOpen(true);   
  };

  const handleOpenDeleteConfirm = (cita) => { // Llamado desde CitaDetalleModal o CitasTable (si se añade botón)
    setIsDetailsModalOpen(false); 
    setCitaParaOperacion(cita);
    setIsConfirmDeleteOpen(true);
  };

  const handleSaveCita = async (formDataFromModal) => {
    setIsLoading(true);
    try {
      const citasActuales = fetchCitasAgendadas(); // Cargar las más recientes antes de guardar
      const dataToSave = citaParaOperacion?.id 
        ? { ...formDataFromModal, id: citaParaOperacion.id, estadoCita: citaParaOperacion.estadoCita } // Mantener estado si se edita
        : formDataFromModal;
      saveCita(dataToSave, citasActuales);
      cargarEventosYActualizarTabla(); 
      handleCloseModals();
      setValidationMessage("Cita guardada exitosamente.");
      setIsValidationModalOpen(true);
    } catch (error) {
      console.error("Error al guardar cita:", error);
      setValidationMessage(error.message || "Error al procesar la cita.");
      setIsValidationModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCitaConfirmada = () => { // Para el modal de confirmación de borrado
    if (citaParaOperacion) {
      try {
        deleteCitaById(citaParaOperacion.id, fetchCitasAgendadas());
        cargarEventosYActualizarTabla();
        handleCloseModals();
        setValidationMessage("Cita eliminada exitosamente.");
        setIsValidationModalOpen(true);
      } catch(error) {
        console.error("Error al eliminar cita:", error);
        setValidationMessage(error.message || "Error al eliminar la cita.");
        setIsValidationModalOpen(true);
      }
    }
  };
  
  const handleMarkAsCompletedFromTable = (citaId) => {
    try {
        cambiarEstadoCita(citaId, "Completada");
        cargarEventosYActualizarTabla();
        setValidationMessage(`Cita #${citaId} marcada como Completada.`);
        setIsValidationModalOpen(true);
    } catch(error) {
        setValidationMessage(error.message);
        setIsValidationModalOpen(true);
    }
  };

  const handleCancelFromTable = (citaId) => { // Abre el modal de confirmación para cancelar
    const cita = citasAgendadas.find(c => c.id === citaId);
    if (cita) {
        setCitaParaCancelar(cita);
        setShowCancelConfirmModal(true);
    }
  };

  const confirmCancelarCita = () => { // Se ejecuta al confirmar la cancelación
    if (citaParaCancelar) {
        try {
            cambiarEstadoCita(citaParaCancelar.id, "Cancelada", "Cancelada por Administrador"); // Puedes añadir un campo para el motivo
            cargarEventosYActualizarTabla();
            setValidationMessage(`Cita #${citaParaCancelar.id} ha sido Cancelada.`);
            setIsValidationModalOpen(true);
        } catch(error) {
            setValidationMessage(error.message);
            setIsValidationModalOpen(true);
        }
    }
    setShowCancelConfirmModal(false);
    setCitaParaCancelar(null);
  };

  const eventStyleGetter = (event, start, end, isSelected) => {
    let style = {
      borderRadius: '4px', opacity: 0.95, color: 'white',
      border: '1px solid rgba(0,0,0,0.1)', display: 'block',
      fontSize: '0.80em', padding: '3px 5px', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
      overflowWrap: 'break-word', whiteSpace: 'normal', 
    };
    if (event.tipo === "disponible") {
      style.backgroundColor = '#e9f5e9'; style.color = '#38761d';
      style.border = '1px dashed #6aa84f'; style.cursor = 'pointer'; style.opacity = 0.75;
      style.boxShadow = 'none';
    } else {
      switch (event.estadoCita) {
        case "Completada": style.backgroundColor = 'var(--color-success, #28a745)'; break;
        case "Cancelada": style.backgroundColor = 'var(--color-danger, #dc3545)'; style.textDecoration = 'line-through'; break;
        case "En proceso": style.backgroundColor = 'var(--color-warning, #ffc107)'; style.color = 'var(--color-text-dark, #212529)'; break;
        case "Programada": default: style.backgroundColor = 'var(--color-info, #0dcaf0)'; break;
      }
    }
    if (isSelected) { style.border = '2px solid var(--color-primary-darker, #6d0b58)'; style.opacity = 1; }
    return { style };
  };

  return (
    <div className="admin-layout">
      <NavbarAdmin />
      <div className="main-content">
        <div className="citas-page-content-wrapper">
          <h1>Gestión de Citas</h1>
          {isLoading && <div className="cargando"><div className="spinner"></div></div>}
          <div className="calendario-container-citas">
            <Calendar
              localizer={localizer}
              events={todosLosEventos}
              startAccessor="start"
              endAccessor="end"
              style={{ height: "75vh", width: "100%" }}
              selectable
              onSelectEvent={handleSelectSlotOrEvent}
              onSelectSlot={handleSelectSlotOrEvent}
              eventPropGetter={eventStyleGetter}
              defaultView="week"
              views={['month', 'week', 'day', 'agenda']}
              min={moment().set({ hour: 7, minute: 0 }).toDate()}
              max={moment().set({ hour: 21, minute: 0 }).toDate()}
              step={30}
              timeslots={1}
              messages={{
                today: "Hoy", previous: "Ant.", next: "Sig.", month: "Mes",
                week: "Semana", day: "Día", agenda: "Agenda", date: "Fecha",
                time: "Hora", event: "Evento", noEventsInRange: "No hay citas en este rango."
              }}
              formats={{
                  timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'h A', culture), 
                  eventTimeRangeFormat: ({ start, end }, culture, localizer) => localizer.format(start, 'h:mmA', culture) + '-' + localizer.format(end, 'h:mmA', culture),
                  agendaTimeRangeFormat: ({ start, end }, culture, localizer) => localizer.format(start, 'h:mmA', culture) + ' - ' + localizer.format(end, 'h:mmA', culture),
                  dayFormat: (date, culture, localizer) => localizer.format(date, 'ddd D', culture), 
                  dateFormat: (date, culture, localizer) => localizer.format(date, 'D', culture),
              }}
              popup
              showMultiDayTimes
            />
          </div>
          <CitasTable
            citas={citasAgendadas}
            onViewDetails={(cita) => {
                setSelectedSlotOrEvent(cita); // Para que el modal de detalle sepa qué mostrar
                setCitaParaOperacion(cita);
                setIsDetailsModalOpen(true);
            }}
            onEdit={handleOpenEditModal} // Pasa la función de edición
            onMarkAsCompleted={handleMarkAsCompletedFromTable}
            onCancel={handleCancelFromTable}
          />
        </div>
      </div>
      <CitaFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSaveCita}
        initialSlotData={selectedSlotOrEvent}
        clientePreseleccionado={clientePreseleccionado}
      />
      <CitaDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        cita={citaParaOperacion}
        onEdit={handleOpenEditModal}
        onDeleteConfirm={handleOpenDeleteConfirm}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteCitaConfirmada}
        title="Eliminar Cita"
        message={`¿Está seguro que desea eliminar la cita para "${citaParaOperacion?.cliente || ''}" con ${citaParaOperacion?.empleado || ''}?`}
      />
       <ConfirmModal
        isOpen={showCancelConfirmModal}
        onClose={() => { setShowCancelConfirmModal(false); setCitaParaCancelar(null); }}
        onConfirm={confirmCancelarCita}
        title="Confirmar Cancelación de Cita"
        message={`¿Está seguro de que desea cancelar la cita #${citaParaCancelar?.id || ''} para "${citaParaCancelar?.cliente || ''}"?`}
        confirmText="Sí, Cancelar Cita"
        cancelText="No, Mantener"
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