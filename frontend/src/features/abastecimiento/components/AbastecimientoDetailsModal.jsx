
import React from 'react';
import '../css/Abastecimiento.css';

const AbastecimientoDetalleModal = ({ isOpen, onClose, abastecimiento }) => {
    if (!isOpen || !abastecimiento) {
        return null;
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // Se suma un día porque DATEONLY puede tener problemas de zona horaria
        const date = new Date(dateString);
        date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
        return date.toLocaleDateString('es-CO', options);
    };

    return (
        <div className="modal-abastecimiento-overlay" onClick={onClose}>
            <div className="modal-abastecimiento-content detalle-modal" onClick={(e) => e.stopPropagation()}>
                <h2 className="abastecimiento-modal-title">Detalles del Abastecimiento</h2>
                
                <div className="abastecimiento-details-text">
                    <p><strong>ID Registro:</strong> {abastecimiento.idAbastecimiento}</p>
                    <p><strong>Empleado:</strong> {abastecimiento.usuario?.nombre || 'No disponible'}</p>
                    <p><strong>Producto:</strong> {abastecimiento.producto?.nombre || 'No disponible'}</p>
                    <p><strong>Cantidad Asignada:</strong> {abastecimiento.cantidad}</p>
                    <p><strong>Fecha de Asignación:</strong> {formatDate(abastecimiento.fechaIngreso)}</p>
                    <p><strong>Estado del Registro:</strong> 
                        <span style={{ color: abastecimiento.estado ? 'green' : 'red', fontWeight: 'bold' }}>
                            {abastecimiento.estado ? " Activo" : " Inactivo"}
                        </span>
                    </p>

                    {abastecimiento.estaAgotado && (
                        <>
                            <hr style={{ margin: '15px 0' }} />
                            <p><strong>Estado del Insumo:</strong> <span className="depleted-text">Agotado</span></p>
                            <p><strong>Fecha de Agotamiento:</strong> {formatDate(abastecimiento.fechaAgotamiento)}</p>
                            <p><strong>Razón de Agotamiento:</strong> {abastecimiento.razonAgotamiento || 'No especificada'}</p>
                        </>
                    )}
                </div>

                <button onClick={onClose} className="modal-abastecimiento-button-cerrar">
                    Cerrar
                </button>
            </div>
        </div>
    );
};

export default AbastecimientoDetalleModal;