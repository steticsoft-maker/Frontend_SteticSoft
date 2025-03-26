import React, { useState, useEffect } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Horarios.css";

const Horarios = () => {
  // Empleados pre-registrados
  const empleadosDisponibles = [
    { id: 1, nombre: "Juan Pérez", especialidad: "Estilista" },
    { id: 2, nombre: "María García", especialidad: "Cosmetóloga" },
    { id: 3, nombre: "Carlos López", especialidad: "Masajista" },
    { id: 4, nombre: "Ana Martínez", especialidad: "Estilista" },
  ];

  // Días de la semana
  const diasSemana = [
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
    "Domingo",
  ];

  // Horarios pre-registrados
  const initialHorarios = [
    {
      id: 1,
      empleado: empleadosDisponibles[0],
      dia: "Lunes",
      horaInicio: "09:00",
      horaFin: "13:00",
      activo: true,
    },
    {
      id: 2,
      empleado: empleadosDisponibles[0],
      dia: "Miércoles",
      horaInicio: "14:00",
      horaFin: "18:00",
      activo: true,
    },
    {
      id: 3,
      empleado: empleadosDisponibles[1],
      dia: "Martes",
      horaInicio: "10:00",
      horaFin: "15:00",
      activo: true,
    },
  ];

  const [horarios, setHorarios] = useState(initialHorarios);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentHorario, setCurrentHorario] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Guardar horarios en LocalStorage cuando cambie el estado
  useEffect(() => {
    localStorage.setItem("horarios", JSON.stringify(horarios));
  }, [horarios]);

  // Manejar creación/edición de horarios
  const handleSave = (horario) => {
    if (modalType === "create") {
      setHorarios([
        ...horarios,
        {
          ...horario,
          id: Date.now(), // Asignar un ID único
        },
      ]);
    } else if (modalType === "edit" && currentHorario) {
      const updatedHorarios = horarios.map((h) =>
        h.id === currentHorario.id ? { ...currentHorario, ...horario } : h
      );
      setHorarios(updatedHorarios);
    }
    closeModal();
  };

  // Abrir modal
  const openModal = (type, horario = null) => {
    setModalType(type);
    setCurrentHorario(
      horario || {
        empleado: empleadosDisponibles[0],
        dia: diasSemana[0],
        horaInicio: "09:00",
        horaFin: "13:00",
        activo: true,
      }
    );
    setShowModal(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentHorario(null);
  };

  // Eliminar un horario
  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este horario?")) {
      setHorarios(horarios.filter((h) => h.id !== id));
    }
  };

  // Cambiar estado del horario (activo/inactivo)
  const toggleActivo = (id) => {
    const updatedHorarios = horarios.map((h) =>
      h.id === id ? { ...h, activo: !h.activo } : h
    );
    setHorarios(updatedHorarios);
  };

  // Filtrar horarios por búsqueda
  const filteredHorarios = horarios.filter(
    (h) =>
      h.empleado.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      h.dia.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="horarios-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Gestión de Horarios de Empleados</h1>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar horario por empleado o día..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />

        {/* Botón para crear horario */}
        <button className="action-button" onClick={() => openModal("create")}>
          Crear Horario
        </button>

        {/* Tabla de horarios */}
        <div className="table-responsive">
          <table className="horarios-table">
            <thead>
              <tr>
                <th>Empleado</th>
                <th>Día</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredHorarios.length > 0 ? (
                filteredHorarios.map((horario) => (
                  <tr key={horario.id}>
                    <td data-label="Empleado">
                      {horario.empleado.nombre} ({horario.empleado.especialidad}
                      )
                    </td>
                    <td data-label="Día">{horario.dia}</td>
                    <td data-label="Hora Inicio">{horario.horaInicio}</td>
                    <td data-label="Hora Fin">{horario.horaFin}</td>
                    <td data-label="Estado">
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={horario.activo || false}
                          onChange={() => toggleActivo(horario.id)}
                        />
                        <span className="slider"></span>
                      </label>
                      <span className="status-text">
                        {horario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td data-label="Acciones">
                      <div className="action-buttons">
                        <button
                          className="table-button"
                          onClick={() => openModal("details", horario)}
                        >
                          Ver
                        </button>
                        <button
                          className="table-button"
                          onClick={() => openModal("edit", horario)}
                        >
                          Editar
                        </button>
                        <button
                          className="table-button delete-button"
                          onClick={() => handleDelete(horario.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-results">
                    No se encontraron horarios
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para Crear/Editar/Detalles */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {modalType === "details" && currentHorario ? (
              <>
                <h2>Detalles del Horario</h2>
                <div className="detail-item">
                  <strong>Empleado:</strong>
                  <span>
                    {currentHorario.empleado.nombre} (
                    {currentHorario.empleado.especialidad})
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Día:</strong>
                  <span>{currentHorario.dia}</span>
                </div>
                <div className="detail-item">
                  <strong>Hora Inicio:</strong>
                  <span>{currentHorario.horaInicio}</span>
                </div>
                <div className="detail-item">
                  <strong>Hora Fin:</strong>
                  <span>{currentHorario.horaFin}</span>
                </div>
                <div className="detail-item">
                  <strong>Estado:</strong>
                  <span>{currentHorario.activo ? "Activo" : "Inactivo"}</span>
                </div>
                <button className="close-button" onClick={closeModal}>
                  Cerrar
                </button>
              </>
            ) : (
              <>
                <h2>
                  {modalType === "create" ? "Crear Horario" : "Editar Horario"}
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);

                    // Obtener el objeto completo del empleado seleccionado
                    const empleadoSeleccionado = empleadosDisponibles.find(
                      (emp) => emp.id === parseInt(formData.get("empleado"))
                    );

                    const horario = {
                      id: currentHorario ? currentHorario.id : Date.now(),
                      empleado: empleadoSeleccionado,
                      dia: formData.get("dia"),
                      horaInicio: formData.get("horaInicio"),
                      horaFin: formData.get("horaFin"),
                      activo: currentHorario?.activo || true,
                    };
                    handleSave(horario);
                  }}
                >
                  <div className="form-group">
                    <label htmlFor="empleado">Empleado:</label>
                    <select
                      id="empleado"
                      name="empleado"
                      defaultValue={
                        currentHorario?.empleado?.id ||
                        empleadosDisponibles[0].id
                      }
                      required
                    >
                      {empleadosDisponibles.map((empleado) => (
                        <option key={empleado.id} value={empleado.id}>
                          {empleado.nombre} ({empleado.especialidad})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="dia">Día:</label>
                    <select
                      id="dia"
                      name="dia"
                      defaultValue={currentHorario?.dia || diasSemana[0]}
                      required
                    >
                      {diasSemana.map((dia) => (
                        <option key={dia} value={dia}>
                          {dia}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="horaInicio">Hora Inicio:</label>
                    <input
                      type="time"
                      id="horaInicio"
                      name="horaInicio"
                      defaultValue={currentHorario?.horaInicio || "09:00"}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="horaFin">Hora Fin:</label>
                    <input
                      type="time"
                      id="horaFin"
                      name="horaFin"
                      defaultValue={currentHorario?.horaFin || "13:00"}
                      required
                    />
                  </div>

                  <div className="form-actions">
                    <button type="submit" className="action-button">
                      Guardar
                    </button>
                    <button
                      type="button"
                      className="close-button"
                      onClick={closeModal}
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Horarios;
