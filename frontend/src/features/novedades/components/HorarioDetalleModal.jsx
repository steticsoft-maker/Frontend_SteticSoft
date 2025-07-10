// src/features/novedades/components/HorarioDetalleModal.jsx
import React from 'react';

const HorarioDetalleModal = ({ isOpen, onClose, horario }) => {
  if (!isOpen || !horario) return null;

  // Mapeo para mostrar el nombre del día a partir del número de la API
  const diasSemana = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  return (
    <div className="novedades-modal-overlay">
      <div className="novedades-modal-content">
        <div className="modal-header">
            <h3>Detalles del Horario</h3>
            <button onClick={onClose} className="close-button">&times;</button>
        </div>
        
        <div className="modal-body">
            {/* El nombre del empleado ya viene en el objeto horario */}
            <p><strong>Encargado:</strong> {horario.empleado?.nombre || 'Desconocido'}</p>
            
            <div>
              <strong>Días y Horarios:</strong>
              {/* Nos aseguramos que el array exista antes de mapearlo */}
              {(horario.dias || []).map((dia) => (
                <p key={dia.idNovedad} style={{ marginLeft: '20px' }}>
                  {/* Usamos el mapeo para mostrar el nombre del día */}
                  <strong>{diasSemana[dia.dia] || "Día N/A"}:</strong> {dia.horaInicio} - {dia.horaFin}
                </p>
              ))}
            </div>

            <p><strong>Estado:</strong> {horario.estado ? "Activo" : "Anulado"}</p>
        </div>

        <div className="modal-footer">
            <button className="btn-secondary" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};

export default HorarioDetalleModal;