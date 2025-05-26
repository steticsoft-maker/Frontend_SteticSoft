import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Citas.css";
import Select from "react-select";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin/NavbarAdmin";

const localizer = momentLocalizer(moment);

const obtenerDiasDeSemanaEntre = (inicio, fin) => {
  const dias = [];
  let actual = moment(inicio);
  while (actual.isBefore(fin)) {
    if (actual.day() !== 0 && actual.day() !== 6) { // Excluir fines de semana
      dias.push(moment(actual));
    }
    actual.add(1, "day");
  }
  return dias;
};

const generarHorariosDisponibles = (empleados, horariosEmpleados) => {
  const eventosDisponibles = [];
  const hoy = moment().startOf('day');
  
  empleados.forEach(empleado => {
    const horariosEmpleado = horariosEmpleados.filter(h => h.empleadoId === empleado.id);
    
    if (!horariosEmpleado.length) return;
    
    const dias = obtenerDiasDeSemanaEntre(hoy, hoy.clone().add(2, 'weeks'));
    
    dias.forEach(dia => {
      horariosEmpleado.forEach(horario => {
        if (horario.dia.toLowerCase() === dia.format("dddd").toLowerCase()) {
          const horaInicio = moment(`${dia.format("YYYY-MM-DD")}T${horario.horaInicio}`);
          const horaFin = moment(`${dia.format("YYYY-MM-DD")}T${horario.horaFin}`);
          
          let horaActual = moment(horaInicio);
          while (horaActual.isBefore(horaFin)) {
            const inicio = moment(horaActual);
            const fin = moment(horaActual).add(30, "minutes");
            
            eventosDisponibles.push({
              id: `disponible-${empleado.id}-${inicio.format()}`,
              title: `Disponible - ${empleado.nombre}`,
              start: inicio.toDate(),
              end: fin.toDate(),
              tipo: "disponible",
              empleadoId: empleado.id,
              resource: empleado
            });
            
            horaActual.add(30, "minutes");
          }
        }
      });
    });
  });
  
  return eventosDisponibles;
};

const Citas = () => {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({ 
    cliente: "", 
    empleado: "", 
    empleadoId: null,
    servicio: [], 
    start: null, 
    end: null 
  });
  const [errorModal, setErrorModal] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const empleados = JSON.parse(localStorage.getItem("empleados")) || [];
  const serviciosDisponibles = JSON.parse(localStorage.getItem("servicios")) || [];
  const horariosEmpleados = JSON.parse(localStorage.getItem("horarios")) || [];
  const navigate = useNavigate();
  const location = useLocation();

  // Memoizar los eventos disponibles para evitar recálculos innecesarios
  const eventosDisponibles = useMemo(() => (
    generarHorariosDisponibles(empleados, horariosEmpleados)
  ), [empleados, horariosEmpleados]);

  // Cargar citas existentes
  useEffect(() => {
    setIsLoading(true);
    try {
      const citasGuardadas = JSON.parse(localStorage.getItem("citas")) || [];
      const citasFormateadas = citasGuardadas.map((cita, i) => ({
        ...cita,
        id: i,
        title: `${cita.cliente} - ${cita.servicio?.join(", ")} - ${cita.empleado}`,
        start: new Date(cita.start),
        end: new Date(cita.end),
        tipo: "cita"
      }));
      setEventos([...citasFormateadas, ...eventosDisponibles]);
    } catch (error) {
      console.error("Error al cargar citas:", error);
      setErrorModal("Error al cargar las citas existentes");
    } finally {
      setIsLoading(false);
    }
  }, [eventosDisponibles]);

  useEffect(() => {
    if (location.state?.clientePreseleccionado) {
      setNuevaCita(prev => ({ 
        ...prev, 
        cliente: location.state.clientePreseleccionado 
      }));
    }
  }, [location.state]);

  const abrirModal = useCallback(({ start, end, resource }) => {
    const empleadoSeleccionado = empleados.find(e => e.id === resource?.empleadoId);
    
    setNuevaCita({ 
      cliente: "", 
      empleado: empleadoSeleccionado?.nombre || "",
      empleadoId: empleadoSeleccionado?.id || null,
      servicio: [], 
      start, 
      end 
    });
    setMostrarModal(true);
    setErrorModal("");
  }, [empleados]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevaCita(prev => ({ ...prev, [name]: value }));
    
    if (name === "empleado") {
      const empleadoSeleccionado = empleados.find(e => e.nombre === value);
      setNuevaCita(prev => ({ 
        ...prev, 
        empleadoId: empleadoSeleccionado?.id || null 
      }));
    }
  };

  const validarCita = (nuevaCita, citasExistentes) => {
    if (!nuevaCita.cliente || !nuevaCita.empleado || !nuevaCita.servicio?.length || !nuevaCita.start) {
      return "Por favor, completa todos los campos.";
    }
    
    // Verificar solapamiento con otras citas
    const solapamiento = citasExistentes.some(cita => {
      return (
        cita.tipo === "cita" &&
        cita.empleadoId === nuevaCita.empleadoId &&
        (
          (new Date(nuevaCita.start) >= new Date(cita.start) && new Date(nuevaCita.start) < new Date(cita.end)) ||
          (new Date(nuevaCita.end) > new Date(cita.start) && new Date(nuevaCita.end) <= new Date(cita.end)) ||
          (new Date(nuevaCita.start) <= new Date(cita.start) && new Date(nuevaCita.end) >= new Date(cita.end))
        )
      );
    });
    
    if (solapamiento) {
      return "El empleado ya tiene una cita programada en este horario.";
    }
    
    return null;
  };

  const guardarCita = () => {
    setIsLoading(true);
    try {
      const citasExistentes = eventos.filter(e => e.tipo === "cita");
      const errorValidacion = validarCita(nuevaCita, citasExistentes);
      
      if (errorValidacion) {
        setErrorModal(errorValidacion);
        return;
      }
      
      const nueva = {
        ...nuevaCita,
        id: citasExistentes.length,
        title: `${nuevaCita.cliente} - ${nuevaCita.servicio.join(", ")} - ${nuevaCita.empleado}`,
        tipo: "cita"
      };
      
      const nuevasCitas = [...citasExistentes, nueva];
      localStorage.setItem("citas", JSON.stringify(nuevasCitas));
      setEventos([...nuevasCitas, ...eventosDisponibles]);
      setMostrarModal(false);
    } catch (error) {
      console.error("Error al guardar cita:", error);
      setErrorModal("Error al guardar la cita");
    } finally {
      setIsLoading(false);
    }
  };

  const eventStyleGetter = (event) => {
    if (event.tipo === "disponible") {
      return {
        style: {
          backgroundColor: "#e3f2fd",
          border: "1px dashed #2196f3",
          cursor: "pointer",
          opacity: 0.8
        }
      };
    }
    return {
      style: {
        backgroundColor: "#64b5f6",
        color: "white",
        border: "1px solid #1976d2"
      }
    };
  };

  return (
    <div className="admin-layout">
      <NavbarAdmin />
      
      <div className="main-content">
        <div className="contenedor-citas">
          {isLoading && (
            <div className="cargando">
              <div className="spinner"></div>
            </div>
          )}
          
          <Calendar
            localizer={localizer}
            events={eventos}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "calc(100vh - 100px)" }}
            selectable
            onSelectEvent={abrirModal}
            onSelectSlot={abrirModal}
            eventPropGetter={eventStyleGetter}
            defaultView="week"
            min={new Date(0, 0, 0, 8, 0, 0)} // 8:00 AM
            max={new Date(0, 0, 0, 20, 0, 0)} // 8:00 PM
            step={30} // Intervalos de 30 minutos
            timeslots={2} // 2 divisiones por intervalo (15 minutos)
            messages={{
              today: "Hoy",
              previous: "Anterior",
              next: "Siguiente",
              month: "Mes",
              week: "Semana",
              day: "Día",
              agenda: "Agenda",
              date: "Fecha",
              time: "Hora",
              event: "Evento",
              noEventsInRange: "No hay eventos en este rango."
            }}
          />

          {mostrarModal && (
            <div className="modal-citas">
              <div className="modal-content-citas">
                <h3>Agregar Cita</h3>
                <button 
                  className="cerrar-modal" 
                  onClick={() => setMostrarModal(false)}
                >
                  &times;
                </button>
                
                <div className="form-group">
                  <label>Cliente:</label>
                  <input 
                    type="text" 
                    name="cliente" 
                    value={nuevaCita.cliente} 
                    onChange={manejarCambio}
                    placeholder="Nombre del cliente"
                  />
                </div>
                
                <div className="form-group">
                  <label>Empleado:</label>
                  <select 
                    name="empleado" 
                    value={nuevaCita.empleado} 
                    onChange={manejarCambio}
                    disabled={!!nuevaCita.empleadoId} // Deshabilitar si ya fue seleccionado por el horario
                  >
                    <option value="">Seleccione un empleado</option>
                    {empleados.map((e) => (
                      <option key={e.id} value={e.nombre}>{e.nombre}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Servicios:</label>
                  <Select
                    isMulti
                    options={serviciosDisponibles.map((s) => ({ 
                      value: s.nombre, 
                      label: s.nombre,
                      duration: s.duracion 
                    }))}
                    value={(nuevaCita.servicio || []).map(s => ({ value: s, label: s }))}
                    onChange={(selectedOptions) => {
                      const nombres = selectedOptions.map(opt => opt.value);
                      setNuevaCita(prev => ({ ...prev, servicio: nombres }));
                      
                      // Ajustar duración basada en servicios seleccionados
                      if (selectedOptions.length > 0 && nuevaCita.start) {
                        const duracionTotal = selectedOptions.reduce((total, opt) => {
                          const servicio = serviciosDisponibles.find(s => s.nombre === opt.value);
                          return total + (servicio?.duracion || 30);
                        }, 0);
                        
                        setNuevaCita(prev => ({
                          ...prev,
                          end: moment(prev.start).add(duracionTotal, 'minutes').toDate()
                        }));
                      }
                    }}
                    placeholder="Seleccione servicios..."
                    closeMenuOnSelect={false}
                  />
                </div>
                
                <div className="form-group">
                  <label>Fecha y Hora:</label>
                  <div className="horario-seleccionado">
                    <strong>Inicio:</strong> {moment(nuevaCita.start).format('LLL')}
                    <br />
                    <strong>Fin:</strong> {moment(nuevaCita.end).format('LLL')}
                  </div>
                </div>
                
                {errorModal && <div className="error-message">{errorModal}</div>}
                
                <div className="botonesModalCitas">
                  <button onClick={guardarCita} disabled={isLoading}>
                    {isLoading ? "Guardando..." : "Guardar Cita"}
                  </button>
                  <button onClick={() => setMostrarModal(false)} disabled={isLoading}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Citas;