import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Citas.css";

const empleados = ["Juan Pérez", "María Gómez", "Carlos López"];
const servicios = ["Consulta Médica", "Asesoría Legal", "Terapia Física"];
const clientes = ["Ana Rodríguez", "Luis Fernández", "Sofía Ramírez"];

function Citas() {
  const [eventos, setEventos] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarClientes, setMostrarClientes] = useState(false);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);
  const [barraBusqueda, setBarraBusqueda] = useState("");
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);
  const [clienteSeleccionado, setClienteSeleccionado] = useState("");
  const [nuevaCita, setNuevaCita] = useState({
    titulo: "",
    fecha: "",
    hora: "",
    cliente: "",
    empleado: "",
    estado: "Activo",
    servicio: "",
  });

  const minimizarCalendario = () => {
    document.querySelector(".calendar-wrapper").style.height = "300px";
  };

  const manejarClicFecha = (seleccion) => {
    setNuevaCita({ ...nuevaCita, fecha: seleccion.dateStr });
    setMostrarModal(true);
    minimizarCalendario();
  };

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setNuevaCita({ ...nuevaCita, [name]: value });
  };

  const guardarCita = () => {
    const evento = {
      title: nuevaCita.titulo,
      start: `${nuevaCita.fecha}T${nuevaCita.hora}`,
      cliente: clienteSeleccionado,
      empleado: nuevaCita.empleado,
      estado: nuevaCita.estado,
      servicio: nuevaCita.servicio,
    };
    setEventos([...eventos, evento]);
    cerrarModal();
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    document.querySelector(".calendar-wrapper").style.height = "500px";
  };

  const seleccionarCliente = () => {
    setMostrarClientes(true);
  };

  const manejarClienteSeleccionado = (cliente) => {
    setClienteSeleccionado(cliente);
    setNuevaCita({ ...nuevaCita, cliente });
    setMostrarClientes(false);
  };

  const manejarHoraCita = (evento) => {
    setCitaSeleccionada(evento);
    setMostrarDetalle(true);
  };

  const cerrarDetalle = () => {
    setMostrarDetalle(false);
    setCitaSeleccionada(null);
  };

  const filtrarClientes = () => {
    return clientes.filter((cliente) =>
      cliente.toLowerCase().includes(barraBusqueda.toLowerCase())
    );
  };

  return (
    <div className="citas-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Calendario de Citas</h1>
        <p>Seleccione una fecha para administrar las citas.</p>

        <div className="calendar-wrapper">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={eventos}
            dateClick={manejarClicFecha}
            eventClick={(info) => manejarHoraCita(info.event)}
            selectable={true}
            editable={true}
          />
        </div>

        {mostrarModal && (
          <div className="modal">
            <div className="modal-content">
              <h3>Gestionar Cita</h3>
              <p>
                <strong>Cliente Seleccionado:</strong> {clienteSeleccionado}
              </p>
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
                <button onClick={seleccionarCliente}>
                  Seleccionar Cliente
                </button>
              </label>
              <label>
                Empleado:
                <select
                  name="empleado"
                  value={nuevaCita.empleado}
                  onChange={manejarCambio}
                >
                  <option value="" disabled>
                    Seleccione un empleado
                  </option>
                  {empleados.map((empleado, index) => (
                    <option key={index} value={empleado}>
                      {empleado}
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
                  <option value="" disabled>
                    Seleccione un servicio
                  </option>
                  {servicios.map((servicio, index) => (
                    <option key={index} value={servicio}>
                      {servicio}
                    </option>
                  ))}
                </select>
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
                <button onClick={cerrarModal}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

        {mostrarClientes && (
          <div className="modal">
            <div className="modal-content">
              <h3>Seleccionar Cliente</h3>
              <input
                type="text"
                placeholder="Buscar cliente..."
                value={barraBusqueda}
                onChange={(e) => setBarraBusqueda(e.target.value)}
              />
              {filtrarClientes().map((cliente, index) => (
                <button
                  key={index}
                  onClick={() => manejarClienteSeleccionado(cliente)}
                >
                  {cliente}
                </button>
              ))}
              <button onClick={() => setMostrarClientes(false)}>Cerrar</button>
            </div>
          </div>
        )}

        {mostrarDetalle && (
          <div className="modal">
            <div className="modal-content">
              <h3>Detalles de la Cita</h3>
              {citaSeleccionada && (
                <>
                  <p>
                    <strong>Título:</strong> {citaSeleccionada.title}
                  </p>
                  <p>
                    <strong>Cliente:</strong>{" "}
                    {citaSeleccionada.extendedProps.cliente}
                  </p>
                  <p>
                    <strong>Empleado:</strong>{" "}
                    {citaSeleccionada.extendedProps.empleado}
                  </p>
                  <p>
                    <strong>Servicio:</strong>{" "}
                    {citaSeleccionada.extendedProps.servicio}
                  </p>
                  <p>
                    <strong>Estado:</strong>{" "}
                    {citaSeleccionada.extendedProps.estado}
                  </p>
                </>
              )}
              <div className="modal-buttons">
                <button onClick={cerrarDetalle}>Cerrar</button>
                <button>Editar</button>
                <button>Eliminar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Citas;
