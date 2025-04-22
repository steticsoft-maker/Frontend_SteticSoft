import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash, faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../../components/NavbarAdmin";
import "./horarios.css";

const Horarios = () => {
  const [horarios, setHorarios] = useState(() => {
    const stored = localStorage.getItem("horariosCitas");
    return stored ? JSON.parse(stored) : [];
  });
  
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState({ open: false, type: "", index: null });
  const [formData, setFormData] = useState({ 
    encargado: "",
    fechaInicio: "",
    fechaFin: "",
    dias: [{ dia: "", horaInicio: "", horaFin: "" }]
  });
  const [formErrors, setFormErrors] = useState({});
  const [confirmDelete, setConfirmDelete] = useState(null);

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem("horariosCitas", JSON.stringify(horarios));
  }, [horarios]);

  const encargados = ["María", "Juan", "Lucía", "Carlos"];
  const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const handleSearch = (e) => setSearch(e.target.value);

  const filteredHorarios = horarios.filter(h =>
    h.encargado.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (type, index = null) => {
    setModal({ open: true, type, index });
    setFormErrors({});
    
    if (type === "editar" && index !== null) {
      setFormData(horarios[index]);
    } else if (type === "agregar") {
      setFormData({ 
        encargado: "",
        fechaInicio: "",
        fechaFin: "",
        dias: [{ dia: "", horaInicio: "", horaFin: "" }]
      });
    } else if (type === "ver" && index !== null) {
      setFormData(horarios[index]);
    }
  };

  const closeModal = () => {
    setModal({ open: false, type: "", index: null });
  };

  const handleDiaChange = (index, field, value) => {
    const updatedDias = [...formData.dias];
    updatedDias[index][field] = value;
    setFormData({ ...formData, dias: updatedDias });
  };

  const addDia = () => {
    setFormData({ 
      ...formData, 
      dias: [...formData.dias, { dia: "", horaInicio: "", horaFin: "" }]
    });
  };

  const removeDia = (index) => {
    if (formData.dias.length > 1) {
      const updatedDias = formData.dias.filter((_, i) => i !== index);
      setFormData({ ...formData, dias: updatedDias });
    }
  };

  const saveHorario = () => {
    const errors = {};
    if (!formData.encargado.trim()) errors.encargado = "El encargado es obligatorio";
    if (!formData.fechaInicio) errors.fechaInicio = "La fecha de inicio es obligatoria";
    if (!formData.fechaFin) errors.fechaFin = "La fecha de fin es obligatoria";
    
    formData.dias.forEach((dia, idx) => {
      if (!dia.dia) errors[`dia-${idx}`] = "El día es obligatorio";
      if (!dia.horaInicio) errors[`horaInicio-${idx}`] = "La hora de inicio es obligatoria";
      if (!dia.horaFin) errors[`horaFin-${idx}`] = "La hora de fin es obligatoria";
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const horarioData = {
      ...formData,
      estado: true
    };

    if (modal.type === "agregar") {
      setHorarios(prev => [...prev, horarioData]);
    } else if (modal.type === "editar" && modal.index !== null) {
      setHorarios(prev =>
        prev.map((h, idx) => (idx === modal.index ? horarioData : h))
      );
    }

    closeModal();
  };

  const toggleEstado = (index) => {
    setHorarios(prev =>
      prev.map((h, idx) =>
        idx === index ? { ...h, estado: !h.estado } : h
      )
    );
  };

  const deleteHorario = () => {
    setHorarios(prev => prev.filter((_, idx) => idx !== confirmDelete));
    setConfirmDelete(null);
  };

  return (
    <div className="horarios-container">
      <Navbar />
      <div className="horarios-content">
        <h2>Horarios de Citas</h2>
        <div className="acciones-barra">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Buscar por encargado..."
              value={search}
              onChange={handleSearch}
            />
          </div>
          <button className="btn-agregar" onClick={() => openModal("agregar")}>
            Agregar Horario
          </button>
        </div>

        <div className="horarios-table">
          <table>
            <thead>
              <tr>
                <th>Encargado</th>
                <th>Periodo</th>
                <th>Días y Horarios</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredHorarios.map((horario, index) => (
                <tr key={index}>
                  <td>{horario.encargado}</td>
                  <td>{horario.fechaInicio} a {horario.fechaFin}</td>
                  <td>
                    {horario.dias.map((dia, idx) => (
                      <div key={idx} className="dia-horario">
                        <strong>{dia.dia}:</strong> {dia.horaInicio} - {dia.horaFin}
                      </div>
                    ))}
                  </td>
                  <td>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={horario.estado}
                        onChange={() => toggleEstado(index)}
                      />
                      <span className="slider round"></span>
                    </label>
                  </td>
                  <td>
                    <button className="btn info btn-blue" onClick={() => openModal("ver", index)}>
                      <FontAwesomeIcon icon={faEye} />
                    </button>
                    <button className="btn info btn-blue" onClick={() => openModal("editar", index)}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button className="btn danger btn-red" onClick={() => setConfirmDelete(index)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal */}
        {modal.open && (
          <div className="modal">
            <div className="modal-content">
              {modal.type === "ver" ? (
                <>
                  <h3>Detalles del Horario</h3>
                  <p><strong>Encargado:</strong> {formData.encargado}</p>
                  <p><strong>Periodo:</strong> {formData.fechaInicio} a {formData.fechaFin}</p>
                  <div>
                    <strong>Días y Horarios:</strong>
                    {formData.dias.map((dia, idx) => (
                      <p key={idx}>
                        {dia.dia}: {dia.horaInicio} - {dia.horaFin}
                      </p>
                    ))}
                  </div>
                  <button className="btn close" onClick={closeModal}>Cerrar</button>
                </>
              ) : (
                <>
                  <h3>{modal.type === "agregar" ? "Agregar Horario" : "Editar Horario"}</h3>
                  <form className="modal-form-grid">
                    <div className="form-group">
                      <label className="asterisco">
                        Encargado <span className="required">*</span>
                      </label>
                      <select
                        value={formData.encargado}
                        onChange={(e) => {
                          setFormData({ ...formData, encargado: e.target.value });
                          setFormErrors({ ...formErrors, encargado: "" });
                        }}
                      >
                        <option value="">Seleccionar encargado</option>
                        {encargados.map((enc, idx) => (
                          <option key={idx} value={enc}>{enc}</option>
                        ))}
                      </select>
                      {formErrors.encargado && <span className="error">{formErrors.encargado}</span>}
                    </div>

                    <div className="form-group">
                      <label className="asterisco">
                        Fecha Inicio <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.fechaInicio}
                        onChange={(e) => {
                          setFormData({ ...formData, fechaInicio: e.target.value });
                          setFormErrors({ ...formErrors, fechaInicio: "" });
                        }}
                      />
                      {formErrors.fechaInicio && <span className="error">{formErrors.fechaInicio}</span>}
                    </div>

                    <div className="form-group">
                      <label className="asterisco">
                        Fecha Fin <span className="required">*</span>
                      </label>
                      <input
                        type="date"
                        value={formData.fechaFin}
                        onChange={(e) => {
                          setFormData({ ...formData, fechaFin: e.target.value });
                          setFormErrors({ ...formErrors, fechaFin: "" });
                        }}
                        min={formData.fechaInicio}
                      />
                      {formErrors.fechaFin && <span className="error">{formErrors.fechaFin}</span>}
                    </div>

                    <div className="form-group full-width">
                      <label className="asterisco">Días y Horarios <span className="required">*</span></label>
                      <div className="dia-container">
                        {formData.dias.map((dia, idx) => (
                          <div key={idx} className="dia-fields">
                            <div className="dia-row">
                              <div>
                                <select
                                  value={dia.dia}
                                  onChange={(e) => {
                                    handleDiaChange(idx, "dia", e.target.value);
                                    setFormErrors({ ...formErrors, [`dia-${idx}`]: "" });
                                  }}
                                >
                                  <option value="">Seleccionar día</option>
                                  {diasSemana.map((d, i) => (
                                    <option key={i} value={d}>{d}</option>
                                  ))}
                                </select>
                                {formErrors[`dia-${idx}`] && <span className="error">{formErrors[`dia-${idx}`]}</span>}
                              </div>

                              <div>
                                <input
                                  type="time"
                                  value={dia.horaInicio}
                                  onChange={(e) => {
                                    handleDiaChange(idx, "horaInicio", e.target.value);
                                    setFormErrors({ ...formErrors, [`horaInicio-${idx}`]: "" });
                                  }}
                                />
                                {formErrors[`horaInicio-${idx}`] && <span className="error">{formErrors[`horaInicio-${idx}`]}</span>}
                              </div>

                              <span>a</span>

                              <div>
                                <input
                                  type="time"
                                  value={dia.horaFin}
                                  onChange={(e) => {
                                    handleDiaChange(idx, "horaFin", e.target.value);
                                    setFormErrors({ ...formErrors, [`horaFin-${idx}`]: "" });
                                  }}
                                  min={dia.horaInicio}
                                />
                                {formErrors[`horaFin-${idx}`] && <span className="error">{formErrors[`horaFin-${idx}`]}</span>}
                              </div>

                              {formData.dias.length > 1 && (
                                <button 
                                  type="button" 
                                  className="btn danger btn-red btn-small"
                                  onClick={() => removeDia(idx)}
                                >
                                  <FontAwesomeIcon icon={faMinus} />
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <button 
                        type="button" 
                        className="btn info btn-blue btn-small"
                        onClick={addDia}
                      >
                        <FontAwesomeIcon icon={faPlus} /> Agregar otro día
                      </button>
                    </div>

                    <div className="form-buttons">
                      <button className="btn success" type="button" onClick={saveHorario}>
                        Guardar
                      </button>
                      <button className="btn close" type="button" onClick={closeModal}>
                        Cancelar
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}

        {/* Confirmación de eliminación */}
        {confirmDelete !== null && (
          <div className="modal">
            <div className="modal-confirm">
              <h3>Confirmar eliminación</h3>
              <p>¿Está seguro de que desea eliminar este horario?</p>
              <div className="modal-confirm-buttons">
                <button className="btn-blue" onClick={deleteHorario}>Sí, eliminar</button>
                <button className="btn-red" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Horarios;