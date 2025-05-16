import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import "./Citas.css";

moment.locale("es");
const localizer = momentLocalizer(moment);

const obtenerEmpleadosDesdeRoles = () => {
    const rolesGuardados = JSON.parse(localStorage.getItem("roles"));
    const empleados = rolesGuardados?.filter(
        (r) => r.rol?.toLowerCase() === "empleado"
    );
    return empleados || [];
};

const obtenerClientes = () => {
    const guardados = JSON.parse(localStorage.getItem("clientes"));
    return guardados || [];
};

const obtenerServiciosDesdeStorage = () => {
    const guardados = JSON.parse(localStorage.getItem("servicios"));
    return guardados || [];
};

const obtenerHorariosDesdeStorage = () => {
    const guardados = JSON.parse(localStorage.getItem("horarios"));
    return guardados || [];
};

function Citas() {
    const [eventos, setEventos] = useState(() => {
        const guardados = localStorage.getItem("citas");
        return guardados ? JSON.parse(guardados) : [];
    });

    const [empleados, setEmpleados] = useState([]);
    const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [horariosEmpleados, setHorariosEmpleados] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false);
    const [citaSeleccionada, setCitaSeleccionada] = useState(null);
    const [errorModal, setErrorModal] = useState(null); // Nuevo estado para el modal de error

    const inicializarNuevaCita = () => ({
        id: null,
        start: new Date(),
        end: new Date(),
        cliente: "",
        empleado: "",
        servicio: "",
        hora: moment(new Date()).format('HH:mm'),
    });

    const [nuevaCita, setNuevaCita] = useState(inicializarNuevaCita());
    const [empleadosDisponiblesParaFecha, setEmpleadosDisponiblesParaFecha] = useState([]);
    const [horaSeleccionada, setHoraSeleccionada] = useState(null); // Para la selección granular de hora

    useEffect(() => {
        setEmpleados(obtenerEmpleadosDesdeRoles());
        setServiciosDisponibles(obtenerServiciosDesdeStorage());
        setClientes(obtenerClientes());
        setHorariosEmpleados(obtenerHorariosDesdeStorage());
    }, []);

    const actualizarEmpleadosDisponiblesParaDia = useCallback((fecha) => {
        if (!fecha) {
            setEmpleadosDisponiblesParaFecha(empleados);
            return;
        }

        const diaCita = moment(fecha).format('dddd').toLowerCase();
        const empleadosFiltradosPorDia = empleados.filter(empleado => {
            return horariosEmpleados.some(horario => {
                return horario.empleadoId === empleado.id && horario.dia?.toLowerCase() === diaCita;
            });
        });
        setEmpleadosDisponiblesParaFecha(empleadosFiltradosPorDia);
    }, [empleados, horariosEmpleados]);

    useEffect(() => {
        actualizarEmpleadosDisponiblesParaDia(nuevaCita.start);
        // También podrías restablecer la hora seleccionada al cambiar el día
        setHoraSeleccionada(null);
        setNuevaCita(prev => ({ ...prev, hora: moment(nuevaCita.start).format('HH:mm'), empleado: '' }));
    }, [nuevaCita.start, actualizarEmpleadosDisponiblesParaDia]);

    const obtenerHorasDisponiblesParaEmpleado = useCallback((empleadoId, fecha) => {
        if (!empleadoId || !fecha) {
            return [];
        }
        const diaCita = moment(fecha).format('dddd').toLowerCase();
        const horariosEmpleado = horariosEmpleados.filter(h => h.empleadoId === empleadoId && h.dia?.toLowerCase() === diaCita);
        const horasDisponibles = [];
        horariosEmpleado.forEach(horario => {
            const inicio = moment(horario.horaInicio, 'HH:mm');
            const fin = moment(horario.horaFin, 'HH:mm');
            let horaActual = moment(inicio);
            while (horaActual.isBefore(fin)) {
                horasDisponibles.push(horaActual.format('HH:mm'));
                horaActual.add(30, 'minutes'); // Intervalo de 30 minutos (ajusta si es necesario)
            }
        });
        return horasDisponibles;
    }, [horariosEmpleados]);

    const esDiaYHoraDisponible = useCallback((fecha, hora) => {
        if (!fecha || !hora) {
            return false;
        }
        const diaCita = moment(fecha).format('dddd').toLowerCase();
        const horaCitaMoment = moment(hora, 'HH:mm');

        return empleados.some(empleado => {
            const horariosEmpleado = horariosEmpleados.filter(h => h.empleadoId === empleado.id);
            return horariosEmpleado.some(horario => {
                if (horario.dia && horario.dia.toLowerCase() === diaCita) {
                    const horaInicio = moment(horario.horaInicio, 'HH:mm');
                    const horaFin = moment(horario.horaFin, 'HH:mm');
                    return horaCitaMoment.isSameOrAfter(horaInicio) && horaCitaMoment.isBefore(horaFin);
                }
                return false;
            });
        });
    }, [empleados, horariosEmpleados]);

    const manejarSeleccion = ({ start }) => {
        const ahora = moment();
        if (moment(start).isBefore(ahora, "day")) {
            setErrorModal("No puedes agendar en días anteriores.");
            return;
        }
        setNuevaCita({ ...inicializarNuevaCita(), start: new Date(start) });
        actualizarEmpleadosDisponiblesParaDia(new Date(start));
        setMostrarModal(true);
    };

    const manejarCambio = (e) => {
        const { name, value } = e.target;
        setNuevaCita((prev) => ({ ...prev, [name]: value }));
        if (name === 'empleado') {
            setHoraSeleccionada(null); // Resetear la hora al cambiar de empleado
        }
    };

    const manejarCambioHora = (e) => {
        setHoraSeleccionada(e.target.value);
        setNuevaCita(prev => ({ ...prev, hora: e.target.value }));
    };

    const guardarCita = () => {
        const { cliente, empleado, servicio, hora, start } = nuevaCita;
        if (!cliente || !empleado || !servicio || !hora || !start) {
            setErrorModal("Por favor, completa todos los campos.");
            return;
        }

        const [horaInicio, minutosInicio] = hora.split(':');
        const fechaInicio = new Date(start);
        fechaInicio.setHours(parseInt(horaInicio, 10));
        fechaInicio.setMinutes(parseInt(minutosInicio, 10));
        const fechaFin = new Date(fechaInicio);
        fechaFin.setMinutes(fechaFin.getMinutes() + 30); // Duración estimada

        const citaActualizada = {
            ...nuevaCita,
            id: nuevaCita.id || Date.now(),
            start: fechaInicio,
            end: fechaFin,
        };

        const nuevasCitas = nuevaCita.id
            ? eventos.map((e) => (e.id === nuevaCita.id ? citaActualizada : e))
            : [...eventos, citaActualizada];

        setEventos(nuevasCitas);
        localStorage.setItem("citas", JSON.stringify(nuevasCitas));
        cerrarModal();
    };

    const cerrarModal = () => {
        setMostrarModal(false);
        setCitaSeleccionada(null);
        setNuevaCita(inicializarNuevaCita());
        setErrorModal(null);
    };

    const manejarEventoClick = (evento) => {
        setCitaSeleccionada(evento);
        setNuevaCita({
            ...evento,
            hora: moment(evento.start).format('HH:mm'),
            servicio: evento.servicio,
        });
        setMostrarModal(true);
    };

    const eliminarCita = () => {
        const nuevasCitas = eventos.filter((e) => e.id !== nuevaCita.id);
        setEventos(nuevasCitas);
        localStorage.setItem("citas", JSON.stringify(nuevasCitas));
        cerrarModal();
    };

    const eventPropGetter = useCallback(
        (event, start, end, isSelected) => {
            return {
                className: 'rbc-event', // Mantén tu clase existente
                style: {},
            };
        },
        []
    );

    const slotPropGetter = useCallback(
        (date) => {
            const ahora = moment();
            if (moment(date).isBefore(ahora, 'day')) {
                return {
                    className: 'rbc-slot-disabled',
                    style: {
                        backgroundColor: '#f2f2f2',
                        cursor: 'not-allowed',
                    },
                };
            }
            const tieneEmpleadosDisponibles = empleados.some(empleado => {
                const dia = moment(date).format('dddd').toLowerCase();
                return horariosEmpleados.some(horario =>
                    horario.empleadoId === empleado.id && horario.dia?.toLowerCase() === dia
                );
            });

            if (tieneEmpleadosDisponibles) {
                return {
                    className: 'rbc-slot-available',
                    style: {
                        cursor: 'pointer',
                    },
                };
            } else {
                return {
                    className: 'rbc-slot-unavailable',
                    style: {
                        backgroundColor: '#ffe0b2',
                        cursor: 'not-allowed',
                    },
                };
            }
        },
        [empleados, horariosEmpleados]
    );

    return (
        <div className="citas-container">
            <NavbarAdmin />
            <div className="citasContent">
                <h1>Calendario de Citas</h1>
                <Calendar
                    localizer={localizer}
                    events={eventos}
                    selectable
                    onSelectSlot={({ start }) => {
                        const ahora = moment();
                        if (moment(start).isSameOrAfter(ahora, 'day')) {
                            manejarSeleccion({ start });
                        }
                    }}
                    onSelectEvent={manejarEventoClick}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 500 }}
                    messages={{
                        next: "Siguiente",
                        previous: "Anterior",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        agenda: "Agenda",
                        date: "Fecha",
                        time: "Hora",
                        event: "Evento",
                        showMore: (total) => `+ Ver más (${total})`,
                    }}
                    eventPropGetter={eventPropGetter}
                    slotPropGetter={slotPropGetter}
                />

                {mostrarModal && (
                    <div className="modal-citas">
                        <div className="modal-content-citas">
                            <h3>{citaSeleccionada ? "Editar Cita" : "Nueva Cita"}</h3>

                            <label>
                                Cliente:
                                <select
                                    name="cliente"
                                    value={nuevaCita.cliente}
                                    onChange={manejarCambio}
                                >
                                    <option value="">Seleccione un cliente</option>
                                    {clientes.map((c) => (
                                        <option key={c.id} value={c.nombre}>
                                            {c.nombre}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label>
                                Servicio:
                                <input
                                    type="text"
                                    name="servicio"
                                    value={nuevaCita.servicio}
                                    onChange={manejarCambio}
                                    list="servicios-lista"
                                    placeholder="Escribe o selecciona un servicio"
                                />
                                <datalist id="servicios-lista">
                                    {serviciosDisponibles.map((s) => (
                                        <option key={s.id} value={s.nombre} />
                                    ))}
                                </datalist>
                            </label>

                            <label>
                                Empleado:
                                <select
                                    name="empleado"
                                    value={nuevaCita.empleado}
                                    onChange={manejarCambio}
                                >
                                    <option value="">Seleccione un empleado</option>
                                    {empleadosDisponiblesParaFecha.map((e) => (
                                        <option key={e.id} value={e.nombre}>
                                            {e.nombre}
                                        </option>
                                    ))}
                                </select>
                            </label>

                            {nuevaCita.empleado && (
                                <label>
                                    Hora:
                                    <select
                                        name="hora"
                                        value={nuevaCita.hora}
                                        onChange={manejarCambioHora}
                                    >
                                        <option value="">Seleccione una hora</option>
                                        {obtenerHorasDisponiblesParaEmpleado(nuevaCita.empleado, nuevaCita.start).map(hora => (
                                            <option key={hora} value={hora}>{hora}</option>
                                        ))}
                                    </select>
                                </label>
                            )}

                            <div className="botonesModalCitas">
                                <button onClick={guardarCita} className="botonGuardarCita">
                                    <FontAwesomeIcon icon={faSave} /> Guardar
                                </button>
                                {citaSeleccionada && (
                                    <button onClick={eliminarCita} className="botonEliminarcita">
                                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                                    </button>
                                )}
                                <button onClick={cerrarModal} className="botonCancelarCita">
                                    <FontAwesomeIcon icon={faTimes} /> Cancelar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {errorModal && (
                    <div className="modalServicio">
                        <div className="modal-Servicio-confirm">
                            <h3>Error</h3>
                            <p>{errorModal}</p>
                            <div className="modalConfirmacionEliminar">
                                <button className="botonEliminarServicios" onClick={() => setErrorModal(null)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Citas;