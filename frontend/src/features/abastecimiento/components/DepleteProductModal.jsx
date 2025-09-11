
import React, { useState, useEffect } from 'react';
import '../css/Abastecimiento.css';

const DepleteProductModal = ({ isOpen, onClose, onSubmit, abastecimiento }) => {
    const [razon, setRazon] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        // Reiniciar el estado cuando el modal se abre
        if (isOpen) {
            setRazon('');
            setError('');
        }
    }, [isOpen]);

    const handleRazonChange = (e) => {
        const value = e.target.value;
        if (value.length > 500) {
            setError('La razón no debe exceder los 500 caracteres.');
        } else {
            setError('');
        }
        setRazon(value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (razon.trim() === '') {
            setError('La razón de agotamiento es obligatoria.');
            return;
        }
        if (razon.length > 500) {
            setError('La razón no debe exceder los 500 caracteres.');
            return;
        }
        onSubmit(abastecimiento.idAbastecimiento, razon);
    };

    if (!isOpen || !abastecimiento) {
        return null;
    }

    return (
        <div className="modal-abastecimiento-overlay" onClick={onClose}>
            <div 
                className="modal-abastecimiento-content formulario-modal confirm-modal deplete-confirmation" 
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="abastecimiento-modal-title">Registrar Agotamiento</h3>
                <p style={{ textAlign: 'center', marginBottom: '20px' }}>
                    Estás a punto de marcar el producto <strong>"{abastecimiento.producto?.nombre}"</strong> asignado a <strong>{abastecimiento.usuario?.nombre}</strong> como agotado.
                </p>
                <form onSubmit={handleSubmit} className="abastecimiento-form-grid">
                    <div className="form-group-abastecimiento">
                        <label htmlFor="razon_agotamiento" className="form-label-abastecimiento">
                            Motivo del agotamiento: <span className="required-asterisk">*</span>
                        </label>
                        <textarea
                            id="razon_agotamiento"
                            value={razon}
                            onChange={handleRazonChange}
                            className="form-input-abastecimiento"
                            placeholder="Ej: El producto se utilizó para una limpieza no programada..."
                            rows="4"
                            style={{ resize: 'vertical' }}
                        />
                        {error && <p className="error-abastecimiento">{error}</p>}
                    </div>
                    <div className="form-actions-abastecimiento">
                        <button 
                            type="button" 
                            className="form-button-cancelar-abastecimiento" 
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button 
                            type="submit" 
                            className="deplete-button-abastecimiento" 
                            style={{ minWidth: '120px' }} // Estilo en línea para el botón de agotar
                        >
                            Confirmar Agotamiento
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DepleteProductModal;