import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../../shared/components/layout/Navbar';
import Footer from '../../../shared/components/layout/Footer';
import '../css/Home.css';

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
    <div className="novedades-page">
      <Navbar />
      <div className="novedades-container">
        <h1 className="novedades-title">
          Selecciona el horario para tu servicio
        </h1>
        <form className="novedades-form" onSubmit={handleSchedule}>
          <label htmlFor="schedule-select">Elige tu horario:</label>
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
          <button type="submit" className="novedades-button">
            Confirmar
          </button>
        </form>
        {confirmation && (
          <div className="novedades-confirmation">
            <p>{confirmation}</p>
            <button
              onClick={() => navigate('/servicios')}
              className="novedades-button-secondary"
            >
              Regresar a Servicios
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default NovedadesPage;