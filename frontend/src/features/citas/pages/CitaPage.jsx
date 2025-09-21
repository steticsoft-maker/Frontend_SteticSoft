import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

// Servicios
import { 
    fetchNovedades, 
    fetchClientesParaCitas, 
    fetchServiciosDisponiblesParaCitas, 
    saveCita 
} from '../services/citasService';

// Estilos
import '../css/Citas.css';

const AgendarCitaPage = () => {
    const navigate = useNavigate();

    // Estados para datos de la API
    const [novedades, setNovedades] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [servicios, setServicios] = useState([]);

    // ✅ 1. Unificar el estado del formulario en un solo objeto. ¡Mucho más limpio!
    const [formData, setFormData] = useState({
        novedad: null,
        fecha: null,
        hora: null,
        clienteId: null,
        empleadoId: null,
        servicios: [],
    });

    // Estados para UI
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Carga de datos inicial
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setIsLoading(true);
                const [novedadesData, clientesData, serviciosData] = await Promise.all([
                    fetchNovedades(),
                    fetchClientesParaCitas(),
                    fetchServiciosDisponiblesParaCitas()
                ]);
                setNovedades(novedadesData);
                setClientes(clientesData);
                setServicios(serviciosData);
            } catch (err) {
                setError('Error al cargar los datos necesarios. ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };
        cargarDatos();
    }, []);

    // Opciones para los Selectores (sin cambios, ya estaban bien)
    const opcionesNovedades = useMemo(() => novedades.map(n => ({
        label: `Horario del ${moment(n.fechaInicio).format('DD/MM/YYYY')} al ${moment(n.fechaFin).format('DD/MM/YYYY')}`,
        value: n.idNovedad,
        novedadCompleta: n
    })), [novedades]);

    const opcionesClientes = useMemo(() => clientes.map(c => ({
        label: `${c.nombre} ${c.apellido || ''} (${c.numeroDocumento || 'N/A'})`,
        value: c.idCliente
    })), [clientes]);

    const opcionesEmpleados = useMemo(() => 
        formData.novedad?.empleados.map(e => ({
            label: e.nombre,
            value: e.idUsuario // ✅ Usar idUsuario que es el ID correcto del empleado
        })) || [], 
    [formData.novedad]);

    const opcionesServicios = useMemo(() => servicios.map(s => ({
        label: `${s.nombre} - $${Number(s.precio).toLocaleString('es-CO')}`,
        value: s.id
    })), [servicios]);

    // Lógica para el Calendario (sin cambios)
    const diasPermitidosNumeros = useMemo(() => {
        if (!formData.novedad) return [];
        const diasMap = { "Domingo": 0, "Lunes": 1, "Martes": 2, "Miércoles": 3, "Jueves": 4, "Viernes": 5, "Sábado": 6 };
        return formData.novedad.dias.map(nombreDia => diasMap[nombreDia]).filter(dia => dia !== undefined);
    }, [formData.novedad]);

    const filtrarDiasDisponibles = (date) => {
        const diaDeLaSemana = moment(date).day();
        return diasPermitidosNumeros.includes(diaDeLaSemana);
    };

    // Lógica para generar Horas (sin cambios)
    const horasDisponibles = useMemo(() => {
        if (!formData.novedad) return [];
        const horas = [];
        let tiempoActual = moment(formData.novedad.horaInicio, 'HH:mm:ss');
        const tiempoFin = moment(formData.novedad.horaFin, 'HH:mm:ss');
        while (tiempoActual.isBefore(tiempoFin)) {
            horas.push(tiempoActual.format('HH:mm'));
            tiempoActual.add(60, 'minutes');
        }
        return horas;
    }, [formData.novedad]);
    
    // ✅ 2. Manejo del envío del formulario COMPLETAMENTE REVISADO
    const handleAgendarCita = async () => {
        setError('');
        if (!formData.fecha || !formData.hora || !formData.clienteId || !formData.empleadoId || formData.servicios.length === 0) {
            setError('Por favor, complete todos los pasos antes de agendar.');
            return;
        }

        setIsSubmitting(true);
        const [horas, minutos] = formData.hora.split(':');
        const startDateTime = moment(formData.fecha).set({ hour: horas, minute: minutos }).toDate();
        const citaParaGuardar = {
            start: startDateTime,
            clienteId: formData.clienteId,
            empleadoId: formData.empleadoId,
            servicios: formData.servicios,
            novedadId: formData.novedad.idNovedad,
            estadoCitaId: 2, 
        };

        console.log("➡️ Payload enviado a saveCita:", JSON.stringify(citaParaGuardar, null, 2));

        try {
            await saveCita(citaParaGuardar);
            alert('¡Cita agendada con éxito!');
            navigate('/admin/citas');
        } catch (err) {
            setError(`Error al guardar la cita: ${err.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="cargando-pagina">Cargando...</div>;
    return (
        <div className="admin-content-wrapper">
            <h1>Agendar Nueva Cita</h1>
            <div className="agendar-cita-container">
                <div className="agendar-cita-form">
                    
                    <div className="form-step">
                        <label>1. Selecciona una Novedad de Horario</label>
                        <Select
                            options={opcionesNovedades}
                            onChange={opcion => {
                                setFormData({ 
                                    novedad: opcion.novedadCompleta,
                                    fecha: null,
                                    hora: null,
                                    clienteId: null,
                                    empleadoId: null,
                                    servicios: [],
                                });
                            }}
                            placeholder="Busca o selecciona un rango de fechas..."
                            noOptionsMessage={() => "No hay novedades de horario disponibles."}
                        />
                    </div>

                    {formData.novedad && (
                        <div className="form-step">
                            <label>2. Elige una Fecha</label>
                            <div className="datepicker-wrapper">
                                <DatePicker
                                    selected={formData.fecha}
                                    onChange={(date) => setFormData(prev => ({ ...prev, fecha: date, hora: null }))}
                                    minDate={moment(formData.novedad.fechaInicio).toDate()}
                                    maxDate={moment(formData.novedad.fechaFin).toDate()}
                                    filterDate={filtrarDiasDisponibles}
                                    locale="es"
                                    inline
                                />
                            </div>
                        </div>
                    )}

                    {formData.fecha && (
                        <div className="form-step">
                            <label>3. Elige un Horario</label>
                            <div className="horas-grid">
                                {horasDisponibles.map(hora => (
                                    <button 
                                        key={hora} 
                                        className={`hora-btn ${formData.hora === hora ? 'selected' : ''}`}
                                        onClick={() => setFormData(prev => ({ ...prev, hora }))}
                                    >
                                        {moment(hora, 'HH:mm').format('hh:mm A')}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {formData.hora && (
                        <>
                            <div className="form-step">
                                <label>4. Busca y Selecciona el Cliente</label>
                                <Select options={opcionesClientes} onChange={opcion => setFormData(prev => ({ ...prev, clienteId: opcion.value }))} placeholder="Escribe para buscar un cliente..." />
                            </div>
                            <div className="form-step">
                                <label>5. Selecciona el Empleado</label>
                                <Select options={opcionesEmpleados} onChange={opcion => setFormData(prev => ({ ...prev, empleadoId: opcion.value }))} placeholder="Elige un empleado..." />
                            </div>
                            <div className="form-step">
                                <label>6. Selecciona los Servicios</label>
                                <Select options={opcionesServicios} isMulti onChange={opciones => setFormData(prev => ({ ...prev, servicios: opciones.map(o => o.value) }))} placeholder="Elige uno o más servicios..." />
                            </div>
                        </>
                    )}
                    
                    <div className="form-step-submit">
                        {error && <p className="error-message">{error}</p>}
                        <button onClick={handleAgendarCita} disabled={isSubmitting || !formData.hora}>
                            {isSubmitting ? 'Agendando...' : 'Revisar y Agendar Cita'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgendarCitaPage;