// src/features/roles/components/HistorialRolModal.jsx
import React, { useState, useMemo } from 'react';
import Modal from '../../../shared/components/common/Modal';
import Spinner from '../../../shared/components/common/Spinner';
import { FaTimes, FaUserCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../css/HistorialRolModal.css';

const HistorialRolModal = ({ isOpen, onClose, history, roleName, isLoading, error, permisosDisponibles }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    // Función mejorada para evitar "Invalid Date"
    if (!dateString) return 'Fecha no disponible';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Fecha inválida';

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleString('es-ES', options);
  };

  const renderValue = (value, campo) => {
    if (value === null || typeof value === 'undefined' || value === '') {
      return <span className="value-na">N/A</span>;
    }

    if (campo === 'permisos') {
      try {
        const ids = JSON.parse(value);
        if (Array.isArray(ids)) {
          if (ids.length === 0) return <span className="value-na">Ninguno</span>;

          const nombres = ids.map(id => {
            const permiso = permisosDisponibles.find(p => p.idPermiso === id);
            return permiso ? permiso.nombre.replace('MODULO_', '').replace('_GESTIONAR', '') : `ID ${id}`;
          });

          return (
            <ul className="permission-list">
              {nombres.map(nombre => <li key={nombre}>{nombre}</li>)}
            </ul>
          );
        }
      } catch {
        // Fallback si no es JSON
      }
    }
    
    if (typeof value === 'boolean') {
      return value ? <span className="status-active">Activo</span> : <span className="status-inactive">Inactivo</span>;
    }

    return value.toString();
  };

  // Paginación
  const paginatedHistory = useMemo(() => {
    if (!history || history.length === 0) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return history.slice(startIndex, startIndex + itemsPerPage);
  }, [history, currentPage, itemsPerPage]);

  const totalPages = Math.ceil((history?.length || 0) / itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const resetPagination = () => {
    setCurrentPage(1);
  };

  // Reset pagination when modal opens
  React.useEffect(() => {
    if (isOpen) {
      resetPagination();
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="historial-modal-content">
        <button onClick={onClose} className="historial-modal-close-button" title="Cerrar"><FaTimes /></button>
        <h2>Historial de Cambios para: <strong>{roleName}</strong></h2>
        {isLoading ? ( <div className="historial-loading"><Spinner /><p>Cargando historial...</p></div>
        ) : error ? ( <p className="error-message">{error}</p>
        ) : history.length > 0 ? (
          <>
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
                  {paginatedHistory.map((record) => (
                    <tr key={record.idHistorial}>
                      <td data-label="Fecha">{formatDate(record.fechaCambio)}</td>
                      <td data-label="Usuario" className="user-info">
                        <FaUserCircle className="user-icon" />
                        <div className="user-details">
                          <span className="user-role">
                            {record.usuarioModificador?.rol?.nombre || 'Rol Desconocido'}
                          </span>
                          <span className="user-email">
                            {record.usuarioModificador?.correo || 'Sistema'}
                          </span>
                        </div>
                      </td>
                      <td data-label="Campo Modificado">{record.campoModificado}</td>
                      <td data-label="Valor Anterior">{renderValue(record.valorAnterior, record.campoModificado)}</td>
                      <td data-label="Valor Nuevo">{renderValue(record.valorNuevo, record.campoModificado)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Paginación */}
            {totalPages > 1 && (
              <div className="historial-pagination">
                <button 
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="pagination-button"
                >
                  <FaChevronLeft />
                </button>
                
                <span className="pagination-info">
                  Página {currentPage} de {totalPages}
                </span>
                
                <button 
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="pagination-button"
                >
                  <FaChevronRight />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="historial-no-records"><p>Aún no hay cambios registrados para este rol.</p></div>
        )}
      </div>
    </Modal>
  );
};

export default HistorialRolModal;