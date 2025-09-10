// src/features/citas/pages/CalendarioCitasPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import 'moment/locale/es';
import Select from 'react-select';

// ✅ IMPORTACIONES ACTUALIZADAS
import { CitasTable, CitaDetalleModal } from '../components';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import ConfirmAgendarModal from '../components/ConfirmAgendarModal'; // ✅ Nuevo modal
import {
  fetchCitas,
  crearCita,
  actualizarCita, // ✅ Importado
  deleteCitaById,
  fetchNovedadesAgendables,
  fetchDiasDisponibles,
  fetchHorasDisponibles,
  fetchEmpleadosPorNovedad,
  fetchServiciosDisponibles,
  buscarClientes,
  fetchEstadosCita, // ✅ Importado
} from '../services/citasService';
import '../css/Citas.css';

moment.locale('es');

function CalendarioCitasPage() {
  // --- Estados de UI y Modales ---
  const [viewMode, setViewMode] = useState('lista'); // 'lista' o 'agendar'
  const [isLoading, setIsLoading] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [isConfirmAgendarOpen, setIsConfirmAgendarOpen] = useState(false); // ✅ Nuevo estado

  // --- Estados de Datos ---
  const [citas, setCitas] = useState([]);
  const [novedades, setNovedades] =useState([]);
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [estadosCita, setEstadosCita] = useState([]); // ✅ Nuevo estado
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // --- Estados del Formulario de Agendamiento ---
  const [selectedNovedad, setSelectedNovedad] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [selectedServicios, setSelectedServicios] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [editingCitaId, setEditingCitaId] = useState(null); // ✅ Nuevo estado para modo edición

  // --- Estados para Operaciones ---
  const [citaParaOperacion, setCitaParaOperacion] = useState(null);
  const [citaParaConfirmar, setCitaParaConfirmar] = useState(null); // ✅ Nuevo estado
  const [validationMessage, setValidationMessage] = useState('');
  const [validationTitle, setValidationTitle] = useState('Aviso');

  // --- Carga de Datos ---
  const cargarDatosPrincipales = useCallback(async () => {
    setIsLoading(true);
    try {
      const [citasRes, estadosRes] = await Promise.all([fetchCitas(), fetchEstadosCita()]);
      const citasAPI = citasRes.data?.data || [];
      const normalizadas = citasAPI.map(c => ({
        ...c,
        id: c.idCita,
        clienteNombre: c.cliente ? `${c.cliente.nombre} ${c.cliente.apellido || ''}`.trim() : "N/A",
        empleadoNombre: c.empleado?.nombre || "N/A",
        serviciosNombres: c.serviciosProgramados?.map(s => s.nombre).join(", ") || "N/A",
        estadoCita: c.estadoDetalle?.nombreEstado || "Desconocido",
        estadoCitaId: c.estadoDetalle?.idEstadoCita,
        start: c.fechaHora,
        precioTotal: c.serviciosProgramados?.reduce((sum, s) => sum + Number(s.precio || 0), 0),
      }));
      setCitas(normalizadas);
      setEstadosCita(estadosRes.data?.data || []);
    } catch (error) {
      setValidationMessage("No se pudieron cargar los datos: " + (error.response?.data?.message || error.message));
      setValidationTitle("Error de Carga");
      setIsValidationModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const cargarDatosAgendamiento = useCallback(() => {
    // Cargar Novedades con manejo de errores
    fetchNovedadesAgendables()
      .then(res => {
        setNovedades(res.data?.data || []);
      })
      .catch(error => {
        console.error("Error detallado al cargar novedades:", error.response || error);
        setValidationMessage(`No se pudieron cargar las novedades para agendar. Motivo: ${error.response?.data?.message || 'Error desconocido'}. Por favor, contacte a soporte.`);
        setValidationTitle("Error de Carga");
        setIsValidationModalOpen(true);
        setNovedades([]); // Asegurarse de que el selector esté vacío si hay un error
      });

    // Cargar Servicios con manejo de errores
    fetchServiciosDisponibles()
      .then(res => {
        setServicios(res.data?.data || []);
      })
      .catch(error => {
        console.error("Error detallado al cargar servicios:", error.response || error);
        setValidationMessage(`No se pudieron cargar los servicios disponibles. Motivo: ${error.response?.data?.message || 'Error desconocido'}.`);
        setValidationTitle("Error de Carga");
        setIsValidationModalOpen(true);
        setServicios([]); // Asegurarse de que el selector esté vacío
      });
  }, [setNovedades, setServicios, setIsValidationModalOpen, setValidationMessage, setValidationTitle]);

  useEffect(() => {
    if (viewMode === 'agendar') {
      cargarDatosAgendamiento();
    } else {
      cargarDatosPrincipales();
    }
  }, [viewMode, cargarDatosPrincipales, cargarDatosAgendamiento]);

  // --- Lógica de Efectos para el Formulario ---
  useEffect(() => {
    if (selectedNovedad && selectedNovedad.value && viewMode === 'agendar') {
      const anio = moment(currentMonth).year();
      const mes = moment(currentMonth).month() + 1;
      if (!editingCitaId) { // No resetees si estás editando
        setSelectedDate(null);
        setHorasDisponibles([]);
      }
      fetchDiasDisponibles(selectedNovedad.value, anio, mes)
        .then(res => setDiasDisponibles(Array.isArray(res.data?.data) ? res.data.data.map(d => moment(d).format('YYYY-MM-DD')) : []))
        .catch(console.error);
      fetchEmpleadosPorNovedad(selectedNovedad.value)
        .then(res => setEmpleados(res.data?.data || []))
        .catch(console.error);
    }
  }, [selectedNovedad, currentMonth, viewMode, editingCitaId]);

  // --- Handlers de Interacción del Formulario ---
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
  if (selectedNovedad && selectedNovedad.value) {
      const fechaStr = moment(date).format('YYYY-MM-DD');
      fetchHorasDisponibles(selectedNovedad.value, fechaStr)
        .then(res => setHorasDisponibles(res.data?.data || []))
        .catch(console.error);
    }
  };
  
  const handleClienteSearch = (term) => {
    if (term.length > 2) {
      buscarClientes(term).then(res => setClientes(res.data?.data || [])).catch(console.error);
    }
  };

  // --- Lógica de Submisión y Modales ---
  const handleAgendarSubmit = () => {
    if (!selectedNovedad || !selectedDate || !selectedTime || !selectedEmpleado || selectedServicios.length === 0 || !selectedCliente) {
      setValidationMessage('Todos los campos son obligatorios.');
      setValidationTitle('Campos Incompletos');
      setIsValidationModalOpen(true);
      return;
    }
    
    const precioTotal = selectedServicios.reduce((sum, s) => {
        const priceMatch = s.label.match(/\(\$([\d,]+)\)/);
        const price = priceMatch ? parseFloat(priceMatch[1].replace(/,/g, '')) : 0;
        return sum + price;
    }, 0);

    setCitaParaConfirmar({
      cliente: selectedCliente,
      empleado: selectedEmpleado,
      servicios: selectedServicios,
      fecha: selectedDate,
      hora: selectedTime,
      precioTotal,
    });
    setIsConfirmAgendarOpen(true);
  };

  const handleConfirmarAgendamiento = async () => {
    setIsConfirmAgendarOpen(false);
    setIsLoading(true);

    const fechaHoraISO = moment(`${moment(selectedDate).format('YYYY-MM-DD')}T${selectedTime}`).toISOString();
    
    const citaPayload = {
      novedadId: selectedNovedad.value,
      clienteId: selectedCliente.value,
      usuarioId: selectedEmpleado.value,
      servicios: selectedServicios.map(s => s.value),
      fechaHora: fechaHoraISO,
      estadoCitaId: 1, // '1' = Pendiente/Programada por defecto
    };

    try {
      if (editingCitaId) {
        await actualizarCita(editingCitaId, citaPayload);
        setValidationMessage('¡Cita actualizada exitosamente!');
        setValidationTitle('Éxito');
      } else {
        await crearCita(citaPayload);
        setValidationMessage('¡Cita agendada exitosamente!');
        setValidationTitle('Éxito');
      }
      resetFormulario();
      setViewMode('lista');
    } catch (error) {
      setValidationMessage(error.response?.data?.message || 'Ocurrió un error.');
      setValidationTitle(editingCitaId ? 'Error al Actualizar' : 'Error al Agendar');
    } finally {
      setIsLoading(false);
      setIsValidationModalOpen(true);
    }
  };

  // --- Handlers de Acciones de la Tabla ---
  const handleOpenDeleteConfirm = (citaId) => {
    const cita = citas.find(c => c.id === citaId);
    setCitaParaOperacion(cita);
    setIsConfirmDeleteOpen(true);
  };
  
  const handleConfirmDeleteCita = async () => {
    if (citaParaOperacion?.id) {
      try {
        await deleteCitaById(citaParaOperacion.id);
        cargarDatosPrincipales();
        setValidationMessage("Cita eliminada exitosamente.");
        setValidationTitle("Éxito");
      } catch (error) {
        setValidationMessage(error.response?.data?.message || "No se pudo eliminar la cita.");
        setValidationTitle("Error al Eliminar");
      } finally {
        setIsConfirmDeleteOpen(false);
        setIsValidationModalOpen(true);
      }
    }
  };

  const handleStatusChange = async (citaId, newStatusId) => {
    setIsLoading(true);
    try {
        await actualizarCita(citaId, { estadoCitaId: newStatusId });
        setValidationMessage("Estado de la cita actualizado.");
        setValidationTitle("Éxito");
        cargarDatosPrincipales(); // Recarga para reflejar el cambio
    } catch (error) {
        setValidationMessage(error.response?.data?.message || "No se pudo actualizar el estado.");
        setValidationTitle("Error de Actualización");
    } finally {
        setIsLoading(false);
        setIsValidationModalOpen(true);
    }
  };

  const handleEditCita = (cita) => {
    resetFormulario();
    setEditingCitaId(cita.id);

    // Cargar datos de la cita en el formulario
    const novedad = { value: cita.novedadId, label: cita.novedad?.nombre || 'Novedad no encontrada' };
    const cliente = { value: cita.cliente.idCliente, label: `${cita.cliente.nombre} ${cita.cliente.apellido || ''}` };
    const empleado = { value: cita.empleado.id_usuario, label: cita.empleado.nombre };
    const serviciosSeleccionados = cita.serviciosProgramados.map(s => ({
        value: s.idServicio,
        label: `${s.nombre} ($${s.precio})`
    }));

    setSelectedNovedad(novedad);
    setSelectedDate(new Date(cita.start));
    setSelectedTime(moment(cita.start).format('HH:mm:ss'));
    setSelectedCliente(cliente);
    setClientes([cliente]); // Precarga el cliente en las opciones
    setSelectedEmpleado(empleado);
    setSelectedServicios(serviciosSeleccionados);

    setViewMode('agendar');
  };

  const resetFormulario = () => {
    setSelectedNovedad(null);
    setSelectedDate(null);
    setSelectedTime(null);
    setSelectedCliente(null);
    setSelectedEmpleado(null);
    setSelectedServicios([]);
    setDiasDisponibles([]);
    setHorasDisponibles([]);
    setEditingCitaId(null);
  };

  // --- Filtrado y Renderizado ---
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  const citasFiltradas = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return citas.filter(cita => {
        const matchesSearch = !term || Object.values(cita).some(val => String(val).toLowerCase().includes(term));
        const matchesEstado = estadoFiltro === "Todos" || cita.estadoCita?.toLowerCase() === estadoFiltro.toLowerCase();
        return matchesSearch && matchesEstado;
    });
  }, [citas, searchTerm, estadoFiltro]);

  const renderAgendarView = () => (
    <div className="agendar-cita-container">
      <div className="booking-content-wrapper">
        <div className="seccion-izquierda">
          <div className="form-group">
            <label>1. Selecciona una Novedad</label>
            <Select placeholder="Elige una novedad para empezar..." options={novedades.map(n => ({ value: n.id_novedad, label: n.nombre }))} onChange={setSelectedNovedad} value={selectedNovedad} />
          </div>
          <div className="calendar-container">
            <label>2. Elige una Fecha</label>
            <Calendar
              onChange={handleDateChange}
              value={selectedDate}
              tileClassName={({ date, view }) => view === 'month' && diasDisponibles.includes(moment(date).format('YYYY-MM-DD')) ? 'dia-disponible' : null}
              tileDisabled={({ date, view }) => view === 'month' && (!editingCitaId && moment(date).isBefore(moment(), 'day') || (selectedNovedad && !diasDisponibles.includes(moment(date).format('YYYY-MM-DD'))))}
              onActiveStartDateChange={({ activeStartDate }) => setCurrentMonth(activeStartDate)}
              minDate={editingCitaId ? null : new Date()}
            />
          </div>
        </div>
        <div className="seccion-derecha">
           <div className="time-slots-container form-group">
                <label>3. Elige un Horario</label>
                <div className="slots-pills-container">
                {horasDisponibles.length > 0 ? horasDisponibles.map(time => (
                    <button key={time} className={`time-slot-pill ${selectedTime === time ? 'selected' : ''}`} onClick={() => setSelectedTime(time)}>
                    {moment(time, 'HH:mm:ss').format('hh:mm A')}
                    </button>
                )) : <p className="no-slots-message">{selectedDate ? 'No hay horarios para este día.' : 'Selecciona un día para ver horarios.'}</p>}
                </div>
            </div>
            <div className="form-group">
                <label>4. Busca y Selecciona el Cliente</label>
                <Select placeholder="Escribe para buscar un cliente..." options={clientes.map(c => ({ value: c.idCliente, label: `${c.nombre} ${c.apellido || ''}` }))} onInputChange={handleClienteSearch} onChange={setSelectedCliente} value={selectedCliente} isDisabled={!selectedTime} />
            </div>
            <div className="form-group">
                <label>5. Selecciona el Empleado</label>
                <Select placeholder="Elige un empleado..." options={empleados.map(e => ({ value: e.id_usuario, label: e.nombre }))} onChange={setSelectedEmpleado} value={selectedEmpleado} isDisabled={!selectedCliente} />
            </div>
            <div className="form-group">
                <label>6. Selecciona los Servicios</label>
                <Select isMulti placeholder="Elige uno o más servicios..." options={servicios.map(s => ({ value: s.idServicio, label: `${s.nombre} ($${s.precio})` }))} onChange={setSelectedServicios} value={selectedServicios} isDisabled={!selectedEmpleado} closeMenuOnSelect={false} />
            </div>
            <button className="btn-agendar-final" onClick={handleAgendarSubmit} disabled={isLoading || !selectedServicios.length}>
                {isLoading ? 'Procesando...' : (editingCitaId ? 'Actualizar Cita' : 'Revisar y Agendar Cita')}
            </button>
        </div>
      </div>
    </div>
  );
  
  const renderListView = () => (
    <div className="citas-page-content-wrapper">
      <div className="citas-header-actions">
        <input type="text" placeholder="Busca en la lista..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="citas-search-input" />
        <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className="citas-filter-select">
          <option value="Todos">Todos los Estados</option>
          {[...new Set(citas.map(c => c.estadoCita))].map(estado => (
            <option key={estado} value={estado}>{estado}</option>
          ))}
        </select>
      </div>
      <CitasTable
        citas={citasFiltradas}
        estadosCita={estadosCita}
        onViewDetails={(cita) => { setCitaParaOperacion(cita); setIsDetailsModalOpen(true); }}
        onEdit={handleEditCita}
        onDelete={handleOpenDeleteConfirm}
        onStatusChange={handleStatusChange}
      />
    </div>
  );

  return (
    <div className="admin-layout">
      <div className="main-content">
        <div className="citas-view-toggle">
          <h1>{viewMode === 'agendar' ? (editingCitaId ? 'Editando Cita' : 'Agendar Nueva Cita') : 'Gestión de Citas'}</h1>
          <button onClick={() => { setViewMode(viewMode === 'agendar' ? 'lista' : 'agendar'); resetFormulario(); }}>
            {viewMode === 'agendar' ? 'Ver Lista de Citas' : 'Agendar Nueva Cita'}
          </button>
        </div>
        
        {isLoading && <div className="cargando-pagina"><span>Cargando...</span><div className="spinner"></div></div>}
        {viewMode === 'agendar' ? renderAgendarView() : renderListView()}
      </div>

      <CitaDetalleModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        cita={citaParaOperacion}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDeleteCita} 
        title="Confirmar Eliminación"
        message={`¿Está seguro de eliminar la cita para "${citaParaOperacion?.clienteNombre}"? Esta acción es irreversible.`}
      />
      <ConfirmAgendarModal
        isOpen={isConfirmAgendarOpen}
        onClose={() => setIsConfirmAgendarOpen(false)}
        onConfirm={handleConfirmarAgendamiento}
        citaData={citaParaConfirmar}
      />
      <ValidationModal
        isOpen={isValidationModalOpen}
        onClose={() => setIsValidationModalOpen(false)}
        title={validationTitle}
        message={validationMessage}
      />
    </div>
  );
}

export default CalendarioCitasPage;