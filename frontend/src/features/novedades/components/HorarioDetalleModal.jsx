// src/features/novedades/components/HorarioDetalleModal.jsx
import React from 'react';
import { getEmpleadosParaHorarios } from '../services/horariosService'; // Para obtener nombre del empleado

const HorarioDetalleModal = ({ isOpen, onClose, horario }) => {
  if (!isOpen || !horario) return null;

  const empleados = getEmpleadosParaHorarios();
  const empleadoNombre = empleados.find(e => e.id === parseInt(horario.empleadoId))?.nombre || 'Desconocido';

  return (
    <div className="novedades-modal-overlay"> {/* Usar prefijo o clase genérica de modal */}
      <div className="novedades-modal-content"> {/* Usar prefijo o clase genérica de modal */}
        <h3>Detalles del Horario</h3>
        <p><strong>Encargado:</strong> {empleadoNombre}</p>
        <p><strong>Periodo:</strong> {horario.fechaInicio} a {horario.fechaFin}</p>
        <div>
          <strong>Días y Horarios:</strong>
          {(horario.dias || []).map((dia, idx) => (
            <p key={idx} style={{ marginLeft: '20px' }}>
              <strong>{dia.dia}:</strong> {dia.horaInicio} - {dia.horaFin}
            </p>
          ))}
        </div>
        <p><strong>Estado:</strong> {horario.estado ? "Activo" : "Inactivo"}</p>
        <div className="botonesAgregarHorarioCitasGuardarCancelar">
            <button className="botonCerrar" onClick={onClose}>Cerrar</button>
        </div>
      </div>
    </div>
  );
};
export default HorarioDetalleModal;