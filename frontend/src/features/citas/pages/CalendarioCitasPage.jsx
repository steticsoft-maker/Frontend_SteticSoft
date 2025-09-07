// src/features/citas/pages/CalendarioCitasPage.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';
import 'moment/locale/es';
import Select from 'react-select';

import NavbarAdmin from '../../../shared/components/layout/NavbarAdmin';
import { CitasTable, CitaDetalleModal } from '../components';
import ConfirmModal from '../../../shared/components/common/ConfirmModal';
import ValidationModal from '../../../shared/components/common/ValidationModal';
import {
  fetchCitas,
  crearCita,
  deleteCitaById,
  anularCita,
  fetchNovedadesAgendables,
  fetchDiasDisponibles,
  fetchHorasDisponibles,
  fetchEmpleadosPorNovedad,
  fetchServiciosDisponibles,
  buscarClientes,
} from '../services/citasService';
import '../css/Citas.css';

moment.locale('es');

function CalendarioCitasPage() {
  const [viewMode, setViewMode] = useState('lista');
  const [citas, setCitas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isConfirmCancelOpen, setIsConfirmCancelOpen] = useState(false);
  const [citaParaOperacion, setCitaParaOperacion] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  const [validationTitle, setValidationTitle] = useState('Aviso');
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [novedades, setNovedades] = useState([]);
  const [diasDisponibles, setDiasDisponibles] = useState([]);
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedNovedad, setSelectedNovedad] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedEmpleado, setSelectedEmpleado] = useState(null);
  const [selectedServicios, setSelectedServicios] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);


  const cargarDatosAgendamiento = useCallback(() => {
    fetchNovedadesAgendables().then(res => setNovedades(res.data?.data || [])).catch(console.error);
    fetchServiciosDisponibles().then(res => setServicios(res.data?.data || [])).catch(console.error);
  }, []);

  const cargarDatosLista = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchCitas();
      const citasAPI = response.data?.data || [];
      const normalizadas = citasAPI.map(c => ({
        ...c,
        id: c.idCita,
        clienteNombre: c.cliente ? `${c.cliente.nombre} ${c.cliente.apellido || ''}`.trim() : "N/A",
        empleadoNombre: c.empleado?.nombre || "N/A",
        serviciosNombres: c.serviciosProgramados?.map(s => s.nombre).join(", ") || "N/A",
        estadoCita: c.estadoDetalle?.nombreEstado || "Desconocido",
        start: c.fechaHora,
        precioTotal: c.serviciosProgramados?.reduce((sum, s) => sum + Number(s.precio || 0), 0),
      }));
      setCitas(normalizadas);
    } catch (error) {
        setValidationMessage("No se pudieron cargar las citas: " + (error.response?.data?.message || error.message));
        setValidationTitle("Error de Carga");
        setIsValidationModalOpen(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (viewMode === 'agendar') {
      cargarDatosAgendamiento();
    } else {
      cargarDatosLista();
    }
  }, [viewMode, cargarDatosAgendamiento, cargarDatosLista]);

  useEffect(() => {
    if (selectedNovedad && viewMode === 'agendar') {
      const anio = moment(currentMonth).year();
      const mes = moment(currentMonth).month() + 1;
      setSelectedDate(null);
      setHorasDisponibles([]);
      fetchDiasDisponibles(selectedNovedad.value, anio, mes)
        .then(res => setDiasDisponibles(Array.isArray(res.data?.data) ? res.data.data.map(d => moment(d).format('YYYY-MM-DD')) : []))
        .catch(console.error);
      fetchEmpleadosPorNovedad(selectedNovedad.value)
        .then(res => setEmpleados(res.data?.data || []))
        .catch(console.error);
    }
  }, [selectedNovedad, currentMonth, viewMode]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null);
    if (selectedNovedad) {
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

  const handleAgendarSubmit = async () => {
    if (!selectedNovedad || !selectedDate || !selectedTime || !selectedEmpleado || selectedServicios.length === 0 || !selectedCliente) {
      setValidationMessage('Todos los campos son obligatorios.');
      setValidationTitle('Campos Incompletos');
      setIsValidationModalOpen(true);
      return;
    }
    
    setIsLoading(true);
    const fechaHoraISO = moment(`${moment(selectedDate).format('YYYY-MM-DD')}T${selectedTime}`).toISOString();
    
    // ✅ CORRECCIÓN FINAL: Se extrae solo el `.value` de los objetos de react-select
    try {
      await crearCita({
        novedadId: selectedNovedad.value,
        clienteId: selectedCliente.value,
        usuarioId: selectedEmpleado.value,
        servicios: selectedServicios.map(s => s.value),
        fechaHora: fechaHoraISO,
        estadoCitaId: 1, // '1' = Pendiente/Programada
      });
      setValidationMessage('¡Cita agendada exitosamente!');
      setValidationTitle('Éxito');
      setViewMode('lista');
    } catch (error) {
      setValidationMessage(error.response?.data?.message || 'Ocurrió un error.');
      setValidationTitle('Error al Agendar');
    } finally {
      setIsLoading(false);
      setIsValidationModalOpen(true);
    }
  };

  const handleOpenDeleteConfirm = (citaId) => {
    const cita = citas.find(c => c.id === citaId);
    setCitaParaOperacion(cita);
    setIsConfirmDeleteOpen(true);
  };
  
  const handleOpenCancelConfirm = (citaId) => {
    const cita = citas.find(c => c.id === citaId);
    setCitaParaOperacion(cita);
    setIsConfirmCancelOpen(true);
  };

  const handleConfirmDeleteCita = async () => {
    if (citaParaOperacion?.id) {
      try {
        await deleteCitaById(citaParaOperacion.id);
        cargarDatosLista();
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

  const handleConfirmCancelCita = async () => {
    if (citaParaOperacion?.id) {
        try {
            await anularCita(citaParaOperacion.id);
            cargarDatosLista();
            setValidationMessage("Cita cancelada exitosamente.");
            setValidationTitle("Éxito");
        } catch (error) {
            setValidationMessage(error.response?.data?.message || "No se pudo cancelar la cita.");
            setValidationTitle("Error al Cancelar");
        } finally {
            setIsConfirmCancelOpen(false);
            setIsValidationModalOpen(true);
        }
    }
  };

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
                <Select placeholder="Elige una novedad para empezar..." options={novedades.map(n => ({ value: n.id_novedad, label: n.nombre }))} onChange={setSelectedNovedad} value={selectedNovedad}/>
            </div>
            <div className="calendar-container">
                <label>2. Elige una Fecha</label>
                <Calendar onChange={handleDateChange} value={selectedDate} tileClassName={({ date, view }) => view === 'month' && diasDisponibles.includes(moment(date).format('YYYY-MM-DD')) ? 'dia-disponible' : null} tileDisabled={({ date, view }) => view === 'month' && (moment(date).isBefore(moment(), 'day') || (selectedNovedad && !diasDisponibles.includes(moment(date).format('YYYY-MM-DD'))))} onActiveStartDateChange={({ activeStartDate }) => setCurrentMonth(activeStartDate)} minDate={new Date()}/>
            </div>
            <div className="time-slots-container">
                <label>3. Elige un Horario</label>
                <div className="slots-pills-container">
                {horasDisponibles.length > 0 ? horasDisponibles.map(time => (
                    <button key={time} className={`time-slot-pill ${selectedTime === time ? 'selected' : ''}`} onClick={() => setSelectedTime(time)}>
                    {moment(time, 'HH:mm:ss').format('hh:mm A')}
                    </button>
                )) : <p className="no-slots-message">Selecciona un día para ver horarios.</p>}
                </div>
            </div>
        </div>
        <div className="seccion-derecha">
            <div className="form-group">
                <label>4. Busca y Selecciona el Cliente</label>
                <Select placeholder="Escribe para buscar un cliente..." options={clientes.map(c => ({ value: c.idCliente, label: `${c.nombre} ${c.apellido || ''}` }))} onInputChange={handleClienteSearch} onChange={setSelectedCliente} value={selectedCliente} isDisabled={!selectedTime}/>
            </div>
            <div className="form-group">
                <label>5. Selecciona el Empleado</label>
                <Select placeholder="Elige un empleado..." options={empleados.map(e => ({ value: e.id_usuario, label: e.nombre }))} onChange={setSelectedEmpleado} value={selectedEmpleado} isDisabled={!selectedCliente}/>
            </div>
            <div className="form-group">
                <label>6. Selecciona los Servicios</label>
                <Select isMulti placeholder="Elige uno o más servicios..." options={servicios.map(s => ({ value: s.idServicio, label: `${s.nombre} ($${s.precio})` }))} onChange={setSelectedServicios} value={selectedServicios} isDisabled={!selectedEmpleado} closeMenuOnSelect={false}/>
            </div>
            <button className="btn-agendar-final" onClick={handleAgendarSubmit} disabled={isLoading}>
                {isLoading ? 'Agendando...' : 'Confirmar y Agendar Cita'}
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
          <option value="Pendiente">Pendiente</option>
          <option value="Confirmada">Confirmada</option>
          <option value="Completada">Completada</option>
          <option value="Cancelada">Cancelada</option>
        </select>
      </div>
      <CitasTable
        citas={citasFiltradas}
        onViewDetails={(cita) => { setCitaParaOperacion(cita); setIsDetailsModalOpen(true); }}
        onDelete={handleOpenDeleteConfirm}
        onCancel={handleOpenCancelConfirm}
      />
    </div>
  );

  return (
    <div className="admin-layout">
      <NavbarAdmin />
      <div className="main-content">
        <div className="citas-view-toggle">
          <h1>{viewMode === 'agendar' ? 'Agendar Nueva Cita' : 'Gestión de Citas'}</h1>
          <button onClick={() => setViewMode(viewMode === 'agendar' ? 'lista' : 'agendar')}>
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
        onDeleteConfirm={() => { setIsDetailsModalOpen(false); setIsConfirmDeleteOpen(true); }}
      />
      <ConfirmModal
        isOpen={isConfirmDeleteOpen}
        onClose={() => setIsConfirmDeleteOpen(false)}
        onConfirm={handleConfirmDeleteCita} 
        title="Confirmar Eliminación"
        message={`¿Está seguro de eliminar la cita para "${citaParaOperacion?.clienteNombre}"?`}
      />
      <ConfirmModal
        isOpen={isConfirmCancelOpen}
        onClose={() => setIsConfirmCancelOpen(false)}
        onConfirm={handleConfirmCancelCita}
        title="Confirmar Cancelación"
        message={`¿Está seguro de cancelar la cita para "${citaParaOperacion?.clienteNombre}"?`}
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