import React, { useState, useEffect, useMemo } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

// Servicios
import { 
    fetchNovedades, 
    // fetchClientesParaCitas, 
    // fetchServiciosDisponiblesParaCitas, 
    saveCita 
} from '../services/citasService';

// Estilos
import '../css/Citas.css';

const AgendarCitaPage = () => {
    const navigate = useNavigate();

    // Estados para datos de la API
    const [novedades, setNovedades] = useState([]);
    // const [clientes, setClientes] = useState([]);
    // const [servicios, setServicios] = useState([]);

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
    const [showNovedadDropdown, setShowNovedadDropdown] = useState(false);

    // Carga de datos inicial
    useEffect(() => {
        const cargarDatos = async () => {
            try {
                setIsLoading(true);
                const [novedadesData] = await Promise.all([
                    fetchNovedades()
                    // fetchClientesParaCitas(),
                    // fetchServiciosDisponiblesParaCitas()
                ]);
                setNovedades(novedadesData);
                // setClientes(clientesData);
                // setServicios(serviciosData);
            } catch (err) {
                setError('Error al cargar los datos necesarios. ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };
        cargarDatos();
    }, []);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showNovedadDropdown && !event.target.closest('.novedad-selector')) {
                setShowNovedadDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showNovedadDropdown]);


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
        <div className="admin-page-layout">
            <div className="admin-main-content-area">
                <div className="agendar-cita-container">
                    <div className="agendar-cita-header">
                        <h1>Cita</h1>
                        <button 
                            className="btn-ver-lista"
                            onClick={() => navigate('/admin/citas')}
                        >
                            Ver Lista de Citas
                        </button>
                    </div>
                    
                    <div className="agendar-cita-form">
                        
                        <div className="form-step">
                            <h2>1. Selecciona una Novedad</h2>
                            <div className="novedad-selector">
                                <input
                                    type="text"
                                    placeholder="03/09/2025 - 07/01/2026"
                                    value={formData.novedad ? `${moment(formData.novedad.fechaInicio).format('DD/MM/YYYY')} - ${moment(formData.novedad.fechaFin).format('DD/MM/YYYY')}` : ''}
                                    readOnly
                                    className="novedad-input"
                                    onClick={() => setShowNovedadDropdown(!showNovedadDropdown)}
                                />
                                {showNovedadDropdown && (
                                    <div className="novedad-dropdown">
                                        {novedades.map(novedad => (
                                            <div 
                                                key={novedad.idNovedad}
                                                className="novedad-option"
                                                onClick={() => {
                                                    setFormData({ 
                                                        novedad: novedad,
                                                        fecha: null,
                                                        hora: null,
                                                        clienteId: null,
                                                        empleadoId: null,
                                                        servicios: [],
                                                    });
                                                    setShowNovedadDropdown(false);
                                                }}
                                            >
                                                {moment(novedad.fechaInicio).format('DD/MM/YYYY')} - {moment(novedad.fechaFin).format('DD/MM/YYYY')}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {formData.novedad && (
                            <div className="form-step">
                                <h2>2. Elige una Fecha</h2>
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
                                <h2>3. Elige un Horario</h2>
                                <p className="horario-placeholder">Selecciona un día para ver horarios.</p>
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
                                    <h2>4. Busca y Selecciona el Cliente</h2>
                                    <div className="cliente-selector">
                                        <input
                                            type="text"
                                            placeholder="Escribe para buscar un cliente..."
                                            className="cliente-input"
                                        />
                                    </div>
                                </div>
                                <div className="form-step">
                                    <h2>5. Selecciona el Empleado</h2>
                                    <div className="empleado-selector">
                                        <input
                                            type="text"
                                            placeholder="Elige un empleado..."
                                            className="empleado-input"
                                        />
                                    </div>
                                </div>
                                <div className="form-step">
                                    <h2>6. Selecciona los Servicios</h2>
                                    <div className="servicios-selector">
                                        <input
                                            type="text"
                                            placeholder="Elige uno o más servicios..."
                                            className="servicios-input"
                                        />
                                    </div>
                                </div>
                            </>
                        )}
                        
                        <div className="form-step-submit">
                            {error && <p className="error-message">{error}</p>}
                            <button 
                                className="btn-agendar"
                                onClick={handleAgendarCita} 
                                disabled={isSubmitting || !formData.hora}
                            >
                                {isSubmitting ? 'Agendando...' : 'Revisar y Agendar Cita'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgendarCitaPage;