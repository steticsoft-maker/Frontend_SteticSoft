import React, { useState, useEffect } from "react";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./horarios.css";

const Horarios = () => {
  const loadInitialData = () => {
    const savedHorarios = localStorage.getItem("horarios");
    return savedHorarios ? JSON.parse(savedHorarios) : [];
  };

  const [horarios, setHorarios] = useState(loadInitialData());
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "create", "edit", "details"
  const [currentHorario, setCurrentHorario] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    localStorage.setItem("horarios", JSON.stringify(horarios));
  }, [horarios]);

  const encargados = ["María", "Juan", "Lucía", "Carlos"]; // Simulación de encargados

  const handleSave = (horario) => {
    if (modalType === "create") {
      const newId = horarios.length > 0 ? Math.max(...horarios.map(h => h.id)) + 1 : 1;
      setHorarios([...horarios, { ...horario, id: newId }]);
    } else {
      const updated = horarios.map((h) =>
        h.id === currentHorario.id ? { ...currentHorario, ...horario } : h
      );
      setHorarios(updated);
    }
    closeModal();
  };

  const openModal = (type, horario = null) => {
    setModalType(type);
    setCurrentHorario(horario);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalType("");
    setCurrentHorario(null);
  };

  const handleDelete = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este horario?")) {
      setHorarios(horarios.filter((h) => h.id !== id));
    }
  };

  const toggleEstado = (id) => {
    const updated = horarios.map((h) =>
      h.id === id ? { ...h, estado: !h.estado } : h
    );
    setHorarios(updated);
  };

  const filteredHorarios = horarios.filter((h) =>
    h.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="servicios-container">
      <NavbarAdmin />
      <div className="main-content">
        <h1>Horarios</h1>
        <div className="header-actions">
          <input
            type="text"
            placeholder="Buscar horario por nombre..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="search-input"
          />
          <button className="action-button" onClick={() => openModal("create")}>
            Agregar Horario
          </button>
        </div>

        <table className="servicios-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Encargado</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredHorarios.map((h) => (
              <tr key={h.id}>
                <td>{h.nombre || "Sin nombre"}</td>
                <td>{h.encargado}</td>
                <td>{h.fechaInicio} - {h.fechaFin}</td>
                <td>{h.horaInicio} - {h.horaFin}</td>
                <td>
                <label className="switch">
                  <input
                  type="checkbox"
                  checked={h.estado}
                  onChange={() => toggleEstado(h.id)}
                  />
                  <span className="slider round"></span>
                </label>
                </td>
                <td>
                  <button className="table-button" onClick={() => openModal("details", h)} title="Ver">
                    <FaEye />
                  </button>
                  <button className="table-button" onClick={() => openModal("edit", h)} title="Editar">
                    <FaEdit />
                  </button>
                  <button className="table-button delete-button" onClick={() => handleDelete(h.id)} title="Eliminar">
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              {modalType === "details" && currentHorario ? (
                <>
                  <h2>Detalles del Horario</h2>
                  <p><strong>Nombre:</strong> {currentHorario.nombre || "Sin nombre"}</p>
                  <p><strong>Encargado:</strong> {currentHorario.encargado}</p>
                  <p><strong>Fecha:</strong> {currentHorario.fechaInicio} - {currentHorario.fechaFin}</p>
                  <p><strong>Hora:</strong> {currentHorario.horaInicio} - {currentHorario.horaFin}</p>
                  <div className="form-buttons">
                    <button className="close-button" onClick={closeModal}>Cerrar</button>
                  </div>
                </>
              ) : (
                <>
                  <h2>{modalType === "create" ? "Agregar Horario" : "Editar Horario"}</h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = new FormData(e.target);
                    const horario = {
                      nombre: form.get("nombre"),
                      encargado: form.get("encargado"),
                      fechaInicio: form.get("fechaInicio"),
                      fechaFin: form.get("fechaFin"),
                      horaInicio: form.get("horaInicio"),
                      horaFin: form.get("horaFin"),
                      estado: currentHorario?.estado ?? true
                    };
                    handleSave(horario);
                  }}>
                    <div className="form-group">
                      <label>Nombre
                        <input
                          type="text"
                          name="nombre"
                          defaultValue={currentHorario?.nombre || ""}
                          placeholder="Nombre del horario"
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>Encargado<span className="required">*</span>
                        <select name="encargado" required defaultValue={currentHorario?.encargado || ""}>
                          <option value="" disabled>Seleccionar encargado</option>
                          {encargados.map((e) => (
                            <option key={e} value={e}>{e}</option>
                          ))}
                        </select>
                      </label>
                    </div>

                    <div className="form-group">
                      <label>Fecha Inicio<span className="required">*</span>
                        <input
                          type="date"
                          name="fechaInicio"
                          defaultValue={currentHorario?.fechaInicio || ""}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>Fecha Fin<span className="required">*</span>
                        <input
                          type="date"
                          name="fechaFin"
                          defaultValue={currentHorario?.fechaFin || ""}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>Hora Inicio<span className="required">*</span>
                        <input
                          type="time"
                          name="horaInicio"
                          defaultValue={currentHorario?.horaInicio || ""}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-group">
                      <label>Hora Fin<span className="required">*</span>
                        <input
                          type="time"
                          name="horaFin"
                          defaultValue={currentHorario?.horaFin || ""}
                          required
                        />
                      </label>
                    </div>

                    <div className="form-buttons">
                      <button type="submit" className="save-button">Guardar</button>
                      <button type="button" className="cancel-button" onClick={closeModal}>Cancelar</button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Horarios;
