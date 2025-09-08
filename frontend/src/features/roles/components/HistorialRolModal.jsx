// src/features/roles/components/HistorialRolModal.jsx
import React from 'react';
import Modal from '../../../shared/components/common/Modal';
import Spinner from '../../../shared/components/common/Spinner'; // Importar Spinner
import { FaTimes, FaUserCircle } from 'react-icons/fa';
import '../css/HistorialRolModal.css';

const HistorialRolModal = ({ isOpen, onClose, history, roleName, isLoading, error }) => {
  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return new Date(dateString).toLocaleString('es-ES', options);
  };

  const renderValue = (value) => {
    return value === null || value === '' ? <span className="value-na">N/A</span> : value;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="historial-modal-content">
        <button onClick={onClose} className="historial-modal-close-button" title="Cerrar">
          <FaTimes />
        </button>
        <h2>
          Historial de Cambios para: <strong>{roleName}</strong>
        </h2>
        {isLoading ? (
          <div className="historial-loading">
            <Spinner />
            <p>Cargando historial...</p>
          </div>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : history.length > 0 ? (
          <div className="historial-table-container">
            <table className="historial-table">
              <thead>
                <tr>
                  <th className="th-fecha">Fecha</th>
                  <th className="th-usuario">Usuario</th>
                  <th className="th-campo">Campo Modificado</th>
                  <th className="th-anterior">Valor Anterior</th>
                  <th className="th-nuevo">Valor Nuevo</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.idHistorial}>
                    <td data-label="Fecha">{formatDate(record.fechaCambio)}</td>
                    <td data-label="Usuario" className="user-info">
                      <FaUserCircle className="user-icon" />
                      <span>{record.usuario?.nombreUsuario || 'Sistema'}</span>
                    </td>
                    <td data-label="Campo Modificado">{record.campoModificado}</td>
                    <td data-label="Valor Anterior">{renderValue(record.valorAnterior)}</td>
                    <td data-label="Valor Nuevo">{renderValue(record.valorNuevo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="historial-no-records">
            <p>Aún no hay cambios registrados para este rol.</p>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default HistorialRolModal;
