import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/es";
import "react-big-calendar/lib/css/react-big-calendar.css";
import NavbarAdmin from "../../components/NavbarAdmin";
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
  if (!empleados || empleados.length === 0) {
    return [
      { id: 1, nombre: "Camila Herrera", rol: "Empleado" },
      { id: 2, nombre: "Juan López", rol: "Empleado" },
    ];
  }
  return empleados;
};

const obtenerClientes = () => {
  const guardados = JSON.parse(localStorage.getItem("clientes"));
  if (!guardados || guardados.length === 0) {
    return [
      { id: 1, nombre: "Cliente 1" },
      { id: 2, nombre: "Cliente 2" },
    ];
  }
  return guardados;
};

const obtenerServicios = () => {
  const guardados = JSON.parse(localStorage.getItem("servicios"));
  if (!guardados || guardados.length === 0) {
    return [
      { id: 1, nombre: "Corte de Cabello" },
      { id: 2, nombre: "Manicure" },
    ];
  }
  return guardados;
};

function Citas() {
  const [eventos, setEventos] = useState(() => {
    const guardados = localStorage.getItem("citas");
    return guardados ? JSON.parse(guardados) : [];
  });

  const [empleados, setEmpleados] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const inicializarNuevaCita = () => ({
    id: null,
    start: new Date(),
    end: new Date(),
    cliente: "",
    empleado: "",
    servicio: "",
    hora: "08:00",
  });

  const [nuevaCita, setNuevaCita] = useState(inicializarNuevaCita());

  useEffect(() => {
    setEmpleados(obtenerEmpleadosDesdeRoles());
    setServicios(obtenerServicios());
    setClientes(obtenerClientes());
  }, []);

  const manejarSeleccion = ({ start, end }) => {
    const ahora = new Date();
    if (moment(start).isBefore(moment(ahora), "day")) {
      alert("No puedes agendar en días anteriores.");
      return;
    }
    if (
      moment(start).isSame(moment(ahora), "day") &&
      moment(start).hour() < ahora.getHours()
    ) {
      alert("No puedes agendar en una hora anterior a la actual.");
      return;
    }

    setNuevaCita({ ...inicializarNuevaCita(), start, end });
    setMostrarModal(true);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevaCita((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCita = () => {
    const { cliente, empleado, servicio, hora } = nuevaCita;
    if (!cliente || !empleado || !servicio || !hora) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const citaActualizada = {
      ...nuevaCita,
      id: nuevaCita.id || Date.now(),
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
  };

  const manejarEventoClick = (evento) => {
    setCitaSeleccionada(evento);
    setNuevaCita(evento);
    setMostrarModal(true);
  };

  const eliminarCita = () => {
    const nuevasCitas = eventos.filter((e) => e.id !== nuevaCita.id);
    setEventos(nuevasCitas);
    localStorage.setItem("citas", JSON.stringify(nuevasCitas));
    cerrarModal();
  };

  return (
    <div className="citas-container">
      <NavbarAdmin />
      <div className="citasContent">
        <h1>Calendario de Citas</h1>
        <Calendar
          localizer={localizer}
          events={eventos}
          selectable
          onSelectSlot={manejarSeleccion}
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
                Empleado:
                <select
                  name="empleado"
                  value={nuevaCita.empleado}
                  onChange={manejarCambio}
                >
                  <option value="">Seleccione un empleado</option>
                  {empleados.map((e) => (
                    <option key={e.id} value={e.nombre}>
                      {e.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Servicio:
                <select
                  name="servicio"
                  value={nuevaCita.servicio}
                  onChange={manejarCambio}
                >
                  <option value="">Seleccione un servicio</option>
                  {servicios.map((s) => (
                    <option key={s.id} value={s.nombre}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Hora:
                <input
                  type="time"
                  name="hora"
                  value={nuevaCita.hora}
                  onChange={manejarCambio}
                />
              </label>

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
      </div>
    </div>
  );
}

export default Citas;
