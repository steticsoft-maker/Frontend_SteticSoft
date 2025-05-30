// src/features/home/pages/NovedadesPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../shared/components/layout/Navbar'; // Ruta actualizada
import '../css/Novedades.css'; // Nueva ruta CSS

function NovedadesPage() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState('');
  const [confirmation, setConfirmation] = useState('');

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!schedule) {
      alert('Por favor, selecciona un horario.');
      return;
    }
    localStorage.setItem('selectedSchedule', schedule);
    setConfirmation(`Tu horario seleccionado es: ${schedule}`);
  };

  return (
    <div className="novedades-page-container"> {/* Renombrado para claridad */}
      <Navbar />
      <div className="novedades-content-box"> {/* Renombrado */}
        <h1 className="novedades-title">
          Selecciona el horario para tu servicio
        </h1>
        <form className="novedades-form" onSubmit={handleSchedule}>
          <label htmlFor="schedule-select">Elige tu horario:</label> {/* Mejorar accesibilidad con htmlFor */}
          <select
            id="schedule-select"
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
          <button type="submit" className="novedades-primary-button"> {/* Clase más específica */}
            Confirmar
          </button>
        </form>
        {confirmation && (
          <div className="novedades-confirmation-section"> {/* Renombrado */}
            <p className="novedades-confirmation-message">{confirmation}</p>
            <button
              onClick={() => navigate('/Servicios')} // Asumiendo que /Servicios es la ruta de PublicServiciosPage
              className="novedades-secondary-button" // Clase más específica
            >
              Regresar a Servicios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default NovedadesPage;