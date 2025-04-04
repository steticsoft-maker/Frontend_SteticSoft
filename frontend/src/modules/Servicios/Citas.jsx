import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Citas.css";
import "moment/locale/es"; // Importa el idioma español para moment.js
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";

moment.locale("es");
const localizer = momentLocalizer(moment);

const empleados = ["Juan Pérez", "María Gómez", "Carlos López"];
const servicios = ["Consulta Médica", "Asesoría Legal", "Terapia Física"];
const clientes = ["Ana Rodríguez", "Luis Fernández", "Sofía Ramírez"];

function Citas() {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  const inicializarNuevaCita = () => ({
    id: null,
    title: "",
    start: new Date(),
    end: new Date(),
    cliente: "",
    empleado: "",
    servicio: "",
    hora: "08:00",
  });

  const [nuevaCita, setNuevaCita] = useState(inicializarNuevaCita());

  const manejarSeleccion = ({ start, end }) => {
    setNuevaCita({ ...inicializarNuevaCita(), start, end });
    setMostrarModal(true);
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevaCita((prev) => ({ ...prev, [name]: value }));
  };

  const guardarCita = () => {
    if (
      !nuevaCita.title ||
      !nuevaCita.cliente ||
      !nuevaCita.empleado ||
      !nuevaCita.servicio ||
      !nuevaCita.hora
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    if (nuevaCita.id) {
      setEventos(
        eventos.map((evento) =>
          evento.id === nuevaCita.id ? nuevaCita : evento
        )
      );
    } else {
      setEventos([...eventos, { ...nuevaCita, id: Date.now() }]);
    }
    cerrarModal();
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setCitaSeleccionada(null);
    setNuevaCita(inicializarNuevaCita()); // Reiniciar valores al cerrar
  };

  const manejarEventoClick = (evento) => {
    setCitaSeleccionada(evento);
    setNuevaCita(evento);
    setMostrarModal(true);
  };

  const eliminarCita = () => {
    setEventos(eventos.filter((e) => e.id !== nuevaCita.id));
    cerrarModal();
  };

  return (
    <div className="citas-container">
      <NavbarAdmin />
      <div className="main-content">
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
          <div className="modal">
            <div className="modal-content">
              <h3>{citaSeleccionada ? "Editar Cita" : "Nueva Cita"}</h3>
              <label>
                Título:
                <input
                  type="text"
                  name="title"
                  value={nuevaCita.title}
                  onChange={manejarCambio}
                />
              </label>
              <label>
                Cliente:
                <select
                  name="cliente"
                  value={nuevaCita.cliente}
                  onChange={manejarCambio}
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((c) => (
                    <option key={c} value={c}>
                      {c}
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
                    <option key={e} value={e}>
                      {e}
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
                    <option key={s} value={s}>
                      {s}
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
              <div className="modal-buttons">
                <button onClick={guardarCita} className="btn-guardar">
                  <FontAwesomeIcon icon={faSave} /> Guardar
                </button>
                {citaSeleccionada && (
                  <button onClick={eliminarCita} className="btn-eliminar">
                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                  </button>
                )}
                <button onClick={cerrarModal} className="btn-cancelar">
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
