// src/features/roles/components/HistorialRolModal.jsx
import React from 'react';
import Modal from '../../../shared/components/common/Modal';
import { Spinner } from '../../../shared/components/common/Spinner'; // Importación corregida
import { FaTimes, FaUserCircle } from 'react-icons/fa';
import '../css/HistorialRolModal.css';

const HistorialRolModal = ({ isOpen, onClose, history, roleName, isLoading, error }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="historial-modal-content">
        <div className="historial-modal-header">
          <h2>
            Historial de Cambios para <strong>{roleName}</strong>
          </h2>
          <button onClick={onClose} className="historial-modal-close-button">
            <FaTimes />
          </button>
        </div>
        {isLoading ? (
          <div className="spinner-container">
            <Spinner />
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : history.length > 0 ? (
          <div className="historial-table-container">
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Fecha del Cambio</th>
                  <th>Usuario</th>
                  <th>Campo Modificado</th>
                  <th>Valor Anterior</th>
                  <th>Valor Nuevo</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.idHistorial}>
                    <td>{new Date(record.fechaCambio).toLocaleString()}</td>
                    <td className="user-info">
                      <FaUserCircle className="user-icon" />
                      <span>{record.usuario?.nombreUsuario || 'Sistema'}</span>
                    </td>
                    <td>{record.campoModificado}</td>
                    <td>{record.valorAnterior}</td>
                    <td>{record.valorNuevo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No hay cambios registrados para este rol.</p>
        )}
      </div>
    </Modal>
  );
};

export default HistorialRolModal;
