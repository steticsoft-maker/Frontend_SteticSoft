import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import NavbarAdmin from "../../components/NavbarAdmin"; // Invoca el NavbarAdmin
import "./Citas.css";

function Citas() {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevaCita, setNuevaCita] = useState({
    titulo: "",
    fecha: "",
    hora: "",
  });

  // Maneja clic en fechas para abrir el modal
  const manejarClicFecha = (seleccion) => {
    setNuevaCita({ ...nuevaCita, fecha: seleccion.dateStr });
    setMostrarModal(true);
  };

  // Maneja cambios en el formulario del modal
  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevaCita({ ...nuevaCita, [name]: value });
  };

  // Guarda la cita
  const guardarCita = () => {
    const evento = {
      title: nuevaCita.titulo,
      start: `${nuevaCita.fecha}T${nuevaCita.hora}`,
    };
    setEventos([...eventos, evento]); // Agregar nueva cita
    setMostrarModal(false); // Cierra el modal
    setNuevaCita({ titulo: "", fecha: "", hora: "" }); // Limpia el formulario
  };

  return (
    <div className="citas-container">
      <NavbarAdmin /> {/* Incluye el navbar */}
      <div className="main-content">
        <h1>Citas</h1>
        <p>Bienvenido al Dashboard de Administración.</p>

        {/* Calendario */}
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={eventos} // Mostrar eventos agendados
          dateClick={manejarClicFecha} // Manejar clic en fechas
          selectable={true}
          editable={true}
        />

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
