import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Hook para redirección
import Navbar from "../../components/Navbar/Navbar";
import "./Novedades.css";

function Novedades() {
  const navigate = useNavigate(); // Para redirección
  const [schedule, setSchedule] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!schedule) {
      alert("Por favor, selecciona un horario.");
      return;
    }
    localStorage.setItem("selectedSchedule", schedule); // Guardamos el horario en localStorage
    setConfirmation(`Tu horario seleccionado es: ${schedule}`);
  };

  return (
    <div className="novedades-page">
      <Navbar />
      <div className="novedades-container">
        <h1 className="novedades-title">
          Selecciona el horario para tu servicio
        </h1>
        <form className="novedades-form" onSubmit={handleSchedule}>
          <label htmlFor="schedule">Elige tu horario:</label>
          <select
            id="schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="novedades-select"
          >
            <option value="">-- Selecciona --</option>
            <option value="9:00 AM">9:00 AM</option>
            <option value="11:00 AM">11:00 AM</option>
            <option value="2:00 PM">2:00 PM</option>
            <option value="4:00 PM">4:00 PM</option>
          </select>
          <button type="submit" className="primary-button">
            Confirmar
          </button>
        </form>
        {confirmation && (
          <div className="confirmation-section">
            <p className="confirmation-message">{confirmation}</p>
            <button
              onClick={() => navigate("/servicios")} // Regresa a Servicios
              className="secondary-button"
            >
              Regresar a Servicios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Novedades;
    