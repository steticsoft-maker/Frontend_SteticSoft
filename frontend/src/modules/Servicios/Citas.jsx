import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import NavbarAdmin from "../../components/NavbarAdmin"; // Invocar el NavbarAdmin
import "./Citas.css";

function Citas() {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({
    titulo: "",
    fecha: "",
    hora: "",
    cliente: "",
    empleado: "",
    estado: "Activo",
    servicio: "",
  });

  // Abre el modal al hacer clic en una fecha
  const manejarClicFecha = (seleccion) => {
    setNuevaCita({ ...nuevaCita, fecha: seleccion.dateStr });
    setMostrarModal(true);
  };

  // Maneja los cambios en el formulario del modal
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevaCita({ ...nuevaCita, [name]: value });
  };

  // Guarda la cita
  const guardarCita = () => {
    const evento = {
      title: nuevaCita.titulo,
      start: `${nuevaCita.fecha}T${nuevaCita.hora}`,
      cliente: nuevaCita.cliente,
      empleado: nuevaCita.empleado,
      estado: nuevaCita.estado,
      servicio: nuevaCita.servicio,
    };
    setEventos([...eventos, evento]);
    setMostrarModal(false);
    setNuevaCita({ titulo: "", fecha: "", hora: "", cliente: "", empleado: "", estado: "Activo", servicio: "" });
  };

  return (
    <div className="citas-container">
      <NavbarAdmin /> {/* Incluye el navbar */}
      <div className="main-content">
        <h1>Calendario de Citas</h1>
        <p>Seleccione una fecha para agendar una cita.</p>

        {/* Calendario amplio */}
        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={eventos} // Mostrar eventos agendados
            dateClick={manejarClicFecha} // Manejar clic en fechas
            selectable={true}
            editable={true}
          />
        </div>

        {/* Modal para agendar cita */}
        {mostrarModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Agendar Cita</h3>
              <label>
                Título:
                <input
                  type="text"
                  name="titulo"
                  value={nuevaCita.titulo}
                  onChange={manejarCambio}
                />
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
              <label>
                Cliente:
                <input
                  type="text"
                  name="cliente"
                  value={nuevaCita.cliente}
                  onChange={manejarCambio}
                />
              </label>
              <label>
                Empleado:
                <input
                  type="text"
                  name="empleado"
                  value={nuevaCita.empleado}
                  onChange={manejarCambio}
                />
              </label>
              <label>
                Servicio:
                <input
                  type="text"
                  name="servicio"
                  value={nuevaCita.servicio}
                  onChange={manejarCambio}
                />
              </label>
              <label>
                Estado:
                <select
                  name="estado"
                  value={nuevaCita.estado}
                  onChange={manejarCambio}
                >
                  <option value="Activo">Activo</option>
                  <option value="Cancelado">Cancelado</option>
                </select>
              </label>
              <div className="modal-buttons">
                <button onClick={guardarCita}>Guardar</button>
                <button onClick={() => setMostrarModal(false)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Citas;
