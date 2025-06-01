// src/features/citas/pages/CalendarioCitasPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import { useLocation, useNavigate } from 'react-router-dom'; // useNavigate para redirección

import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin'; // Ajusta la ruta si es necesario
import { CitaFormModal, CitaDetalleModal, CitasTable } from '../components';
import ConfirmModal from '../../../shared/components/common/ConfirmModal'; // Ajusta la ruta
import ValidationModal from '../../../shared/components/common/ValidationModal'; // Ajusta la ruta

import {
  fetchCitasAgendadas,
  generarEventosDisponibles,
  saveCita,
  deleteCitaById as serviceDeleteCitaById, // Renombrar para evitar conflicto de nombres
  cambiarEstadoCita
} from '../services/citasService';
import '../css/Citas.css'; // Estilos de Big Calendar y Citas
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Estilos base de Big Calendar

moment.locale('es');
const localizer = momentLocalizer(moment);

function CalendarioCitasPage() {
  const [citasAgendadas, setCitasAgendadas] = useState([]);
  const [eventosDisponibles, setEventosDisponibles] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  
  const [selectedSlotOrEvent, setSelectedSlotOrEvent] = useState(null); // Para datos del slot/evento seleccionado
  const [citaParaOperacion, setCitaParaOperacion] = useState(null); // Cita específica para editar/eliminar/cancelar
  
  const [isLoading, setIsLoading] = useState(false); // Para carga general de datos o acciones largas
  const [validationMessage, setValidationMessage] = useState('');
  const [validationTitle, setValidationTitle] = useState('Aviso');

  const location = useLocation();
  const navigate = useNavigate();
  // Cliente preseleccionado si se navega desde otra página (ej: perfil de cliente)
  const clientePreseleccionado = location.state?.clientePreseleccionado || null;

  const cargarDatosCompletos = useCallback(async () => {
    setIsLoading(true);
    try {
      const agendadas = await fetchCitasAgendadas(); // Asumir que puede ser asíncrono en el futuro
      const disponibles = await generarEventosDisponibles(); // Idem
      
      setCitasAgendadas(agendadas.sort((a, b) => moment(b.start).valueOf() - moment(a.start).valueOf()));
      setEventosDisponibles(disponibles);

    } catch (error) {
      console.error("Error al cargar datos para el calendario de citas:", error);
      setValidationTitle("Error de Carga");
      setValidationMessage("No se pudieron cargar los datos de citas: " + error.message);
      setIsValidationModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarDatosCompletos();
    // Si hay un cliente preseleccionado y se quiere abrir el modal directamente
    if (clientePreseleccionado) {
        // Podrías querer abrir el modal de creación con este cliente
        // handleSelectSlotOrEvent({}); // Simular selección de slot vacío
        // setIsFormModalOpen(true); // y abrir modal
        // Pero initialSlotData necesitaría el cliente preseleccionado
        // Esto es más complejo, por ahora solo lo tenemos disponible
    }
  }, [cargarDatosCompletos, clientePreseleccionado]);

  // Combina citas agendadas y slots disponibles para el calendario
  const todosLosEventosDelCalendario = useMemo(() => {
    const citasMapeadas = citasAgendadas.map(c => ({
        ...c, 
        tipo: 'cita', // Marcar como tipo 'cita'
        title: c.title || `${c.cliente} - ${c.servicios?.map(s=>s.nombre).join(', ') || 'Servicios'}`
    }));
    return [...citasMapeadas, ...eventosDisponibles];
  }, [citasAgendadas, eventosDisponibles]);


  const handleCloseModals = () => {
    setIsFormModalOpen(false);
    setIsDetailsModalOpen(false);
    setIsConfirmDeleteOpen(false);
    setIsConfirmCancelOpen(false);
    setIsValidationModalOpen(false);
    setSelectedSlotOrEvent(null); // Limpiar selección
    setCitaParaOperacion(null);   // Limpiar cita en operación
    setValidationMessage('');
    setValidationTitle('Aviso');
    // Si se usó clientePreseleccionado, limpiarlo para que no afecte futuras aperturas de modal
    if (location.state?.clientePreseleccionado) {
        navigate(location.pathname, { replace: true, state: {} });
    }
  };

  const handleSelectSlotOrEvent = useCallback((slotOrEventInfo) => {
    setSelectedSlotOrEvent(slotOrEventInfo); // Guardar toda la info del slot/evento

    if (slotOrEventInfo.tipo === 'cita') { // Clic en una cita existente
      setCitaParaOperacion(slotOrEventInfo);
      setIsDetailsModalOpen(true);
    } else { // Clic en un slot disponible o selección de rango de tiempo para nueva cita
      // `slotOrEventInfo` aquí podría ser un slot de 'disponible' o un rango de selección
      // Si es un slot 'disponible', ya tiene empleadoId en `resource`.
      // Si es un rango, no tendrá empleadoId predefinido.
      setCitaParaOperacion(null); // Es creación, no hay cita existente
      setIsFormModalOpen(true);
    }
  }, []);

  const handleOpenEditModal = (citaAEditar) => {
    handleCloseModals(); // Cerrar otros modales primero
    setSelectedSlotOrEvent(citaAEditar); // Para que CitaFormModal sepa que es edición y tenga datos
    setCitaParaOperacion(citaAEditar);   // Guardar referencia a la cita que se está editando
    setIsFormModalOpen(true);   
  };

  const handleOpenDeleteConfirm = (citaAEliminar) => {
    handleCloseModals();
    setCitaParaOperacion(citaAEliminar); // Guardar cita para la operación de borrado
    setIsConfirmDeleteOpen(true);
  };
  
  const handleOpenCancelConfirm = (citaACancelarId) => {
    handleCloseModals();
    const cita = citasAgendadas.find(c => c.id === citaACancelarId);
    if (cita) {
        setCitaParaOperacion(cita); // Guardar cita para la operación de cancelación
        setIsConfirmCancelOpen(true);
    } else {
        setValidationTitle("Error");
        setValidationMessage("No se encontró la cita para cancelar.");
        setIsValidationModalOpen(true);
    }
  };


  const handleSaveCitaSubmit = async (formDataFromModal) => {
    // No es necesario setIsLoading aquí, CitaFormModal ya lo maneja internamente.
    // El setIsLoading de esta página es para carga de datos iniciales.
    try {
      const citasActuales = fetchCitasAgendadas(); // Cargar las más recientes antes de guardar
      const citaGuardada = saveCita(formDataFromModal, citasActuales); // saveCita ahora devuelve la cita
      
      cargarDatosCompletos(); // Recargar todos los eventos y citas
      handleCloseModals();    // Cerrar modal de formulario
      
      setValidationTitle("Éxito");
      setValidationMessage(formDataFromModal.id ? "Cita actualizada exitosamente." : "Cita guardada exitosamente.");
      setIsValidationModalOpen(true);

    } catch (error) {
      console.error("Error al procesar guardado de cita:", error);
      // No cerramos el modal de formulario en caso de error, para que el usuario pueda corregir.
      // El error se mostrará dentro de CitaFormModal.
      // Pero si el error viene de saveCita y no se maneja en CitaFormModal, lo mostramos aquí.
      // Es mejor que CitaFormModal maneje sus propios errores de validación/submit.
      // Si este catch se activa, es probable que sea un error que CitaFormModal no pudo mostrar.
      setValidationTitle("Error al Guardar");
      setValidationMessage(error.message || "Error desconocido al procesar la cita.");
      setIsValidationModalOpen(true); // Usar el ValidationModal general de la página
    }
  };

  const handleDeleteCitaConfirmada = async () => {
    if (citaParaOperacion) {
      try {
        serviceDeleteCitaById(citaParaOperacion.id); // Usar el servicio renombrado
        cargarDatosCompletos();
        handleCloseModals();
        setValidationTitle("Éxito");
        setValidationMessage(`Cita para "${citaParaOperacion.cliente}" eliminada exitosamente.`);
        setIsValidationModalOpen(true);
      } catch(error) {
        console.error("Error al eliminar cita:", error);
        handleCloseModals(); // Cerrar modal de confirmación
        setValidationTitle("Error al Eliminar");
        setValidationMessage(error.message || "No se pudo eliminar la cita.");
        setIsValidationModalOpen(true);
      }
    }
  };
  
  const handleMarkAsCompleted = async (citaId) => {
    try {
        cambiarEstadoCita(citaId, "Completada");
        cargarDatosCompletos(); // Recargar para reflejar el cambio de estado
        setValidationMessage(`Cita #${citaId} marcada como Completada.`);
        setIsValidationModalOpen(true);
    } catch(error) {
        setValidationTitle("Error");
        setValidationMessage(error.message);
        setIsValidationModalOpen(true);
    }
  };

  const handleConfirmCancelCita = async () => { // Al confirmar la cancelación
    if (citaParaOperacion) {
        try {
            // Aquí podrías añadir un input para el motivo de cancelación si quieres
            const motivo = "Cancelada por Administrador"; 
            cambiarEstadoCita(citaParaOperacion.id, "Cancelada", motivo);
            cargarDatosCompletos();
            setValidationMessage(`Cita #${citaParaOperacion.id} para "${citaParaOperacion.cliente}" ha sido Cancelada.`);
        } catch(error) {
            setValidationTitle("Error al Cancelar");
            setValidationMessage(error.message);
        } finally {
            setIsValidationModalOpen(true);
            handleCloseModals(); // Cierra el modal de confirmación de cancelación
        }
    }
  };

  // Estilo para los eventos en el calendario
  const eventStyleGetter = useCallback((event, start, end, isSelected) => {
    let style = {
      borderRadius: '4px', 
      opacity: 0.90, 
      color: 'white',
      border: '1px solid rgba(0,0,0,0.1)', 
      display: 'block',
      fontSize: '0.80em', 
      padding: '3px 5px', 
      boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
      overflowWrap: 'break-word', 
      whiteSpace: 'normal', 
    };

    if (event.tipo === "disponible") {
      style.backgroundColor = 'var(--color-available-slot-bg, #d4edda)'; // Verde claro para disponibles
      style.color = 'var(--color-available-slot-text, #155724)';
      style.border = '1px dashed var(--color-available-slot-border, #c3e6cb)';
      style.cursor = 'pointer';
      style.opacity = 0.75;
      style.boxShadow = 'none';
    } else { // Es una cita
      switch (event.estadoCita) {
        case "Completada": style.backgroundColor = 'var(--color-success, #28a745)'; break;
        case "Cancelada": 
          style.backgroundColor = 'var(--color-danger-light, #f8d7da)'; 
          style.color = 'var(--color-danger-dark, #721c24)';
          style.textDecoration = 'line-through'; 
          style.opacity = 0.6;
          break;
        case "En proceso": 
          style.backgroundColor = 'var(--color-warning, #ffc107)'; 
          style.color = 'var(--color-text-dark, #212529)'; 
          break;
        case "Programada": 
        default: 
          style.backgroundColor = 'var(--color-info, #17a2b8)'; // Azul para programadas
          break;
      }
    }
    if (isSelected) { 
      style.border = '2px solid var(--color-primary-darker, #6d0b58)'; 
      style.opacity = 1; 
      style.boxShadow = '0 0 5px var(--color-primary-darker, #6d0b58)';
    }
    return { style };
  }, []);

  const calendarMessages = {
      today: "Hoy", previous: "Ant.", next: "Sig.", month: "Mes",
      week: "Semana", day: "Día", agenda: "Agenda", date: "Fecha",
      time: "Hora", event: "Evento", noEventsInRange: "No hay citas en este rango.",
      showMore: total => `+${total} más`
  };

  return (
    <div className="admin-layout">
      <NavbarAdmin />
      <div className="main-content">
        <div className="citas-page-content-wrapper">
          <h1>Gestión de Citas</h1>
          {isLoading && <div className="cargando-pagina"><span>Cargando datos de citas...</span><div className="spinner"></div></div>}
          
          <div className="calendario-container-citas">
            <Calendar
              localizer={localizer}
              events={todosLosEventosDelCalendario}
              startAccessor="start"
              endAccessor="end"
              style={{ minHeight: "75vh", width: "100%" }} // minHeight para asegurar tamaño
              selectable
              onSelectEvent={handleSelectSlotOrEvent} // Para clic en evento existente
              onSelectSlot={handleSelectSlotOrEvent}  // Para clic en slot vacío o selección de rango
              eventPropGetter={eventStyleGetter}
              defaultView={Views.WEEK} // Vista por defecto: semana
              views={[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA]}
              // Horario visible en el calendario (vista semana y día)
              min={moment().set({ hour: 7, minute: 0, second: 0 }).toDate()} 
              max={moment().set({ hour: 21, minute: 0, second: 0 }).toDate()}
              step={30} // Intervalos de 30 minutos en la rejilla de tiempo
              timeslots={1} // 1 slot por cada 'step' (ej: 1 slot de 30 min)
              messages={calendarMessages}
              formats={{ // Formatos de fecha y hora
                  timeGutterFormat: (date, culture, localizer) => localizer.format(date, 'h A', culture), 
                  eventTimeRangeFormat: ({ start, end }, culture, localizer) => 
                      localizer.format(start, 'h:mmA', culture) + ' - ' + localizer.format(end, 'h:mmA', culture),
                  agendaTimeRangeFormat: ({ start, end }, culture, localizer) =>
                      localizer.format(start, 'h:mmA', culture) + ' - ' + localizer.format(end, 'h:mmA', culture),
                  dayFormat: (date, culture, localizer) => localizer.format(date, 'ddd D', culture), // ej: Mar 23
                  dateFormat: (date, culture, localizer) => localizer.format(date, 'D', culture), // ej: 23
              }}
              popup // Para mostrar eventos que no caben en un slot
              showMultiDayTimes // Para eventos que duran varios días (aunque no es común para citas)
              culture='es'
            />
          </div>

          <CitasTable
            citas={citasAgendadas}
            onViewDetails={(cita) => {
                setSelectedSlotOrEvent(cita); 
                setCitaParaOperacion(cita);
                setIsDetailsModalOpen(true);
            }}
            onEdit={handleOpenEditModal}
            onMarkAsCompleted={handleMarkAsCompleted}
            onCancel={handleOpenCancelConfirm} // Para abrir confirmación de cancelar
            onDelete={handleOpenDeleteConfirm} // Para abrir confirmación de eliminar
          />
        </div>
      </div>

      {/* Modales */}
      <CitaFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleSaveCitaSubmit}
        initialSlotData={selectedSlotOrEvent} // Contiene datos si se seleccionó slot/evento
        clientePreseleccionado={clientePreseleccionado}
      />
      <CitaDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseModals}
        cita={citaParaOperacion} // Cita que se está viendo/editando
        onEdit={handleOpenEditModal} // Reutilizar la función para abrir el form modal en modo edición
        onDeleteConfirm={handleOpenDeleteConfirm} // Para abrir el modal de confirmación de borrado
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={handleCloseModals}
        onConfirm={handleDeleteCitaConfirmada}
        title="Confirmar Eliminación"
        message={`¿Está seguro que desea eliminar la cita para "${citaParaOperacion?.cliente || ''}" con ${citaParaOperacion?.empleado || ''} el ${citaParaOperacion?.start ? moment(citaParaOperacion.start).format("DD/MM/YY HH:mm") : ''}? Esta acción no se puede deshacer.`}
        confirmText="Sí, Eliminar"
        cancelText="No, Conservar"
      />
       <ConfirmModal
        isOpen={isConfirmCancelOpen}
        onClose={handleCloseModals}
        onConfirm={handleConfirmCancelCita}
        title="Confirmar Cancelación de Cita"
        message={`¿Está seguro de que desea cancelar la cita #${citaParaOperacion?.id || ''} para "${citaParaOperacion?.cliente || ''}"?`}
        confirmText="Sí, Cancelar Cita"
        cancelText="No, Mantener Cita"
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={handleCloseModals}
        title={validationTitle}
        message={validationMessage}
      />
    </div>
  );
}
export default CalendarioCitasPage;