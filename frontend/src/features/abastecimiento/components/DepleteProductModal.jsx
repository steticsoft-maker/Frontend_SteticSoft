
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
                className="modal-abastecimiento-content abastecimiento-deplete-modal" 
                onClick={(e) => e.stopPropagation()}
            >
                <div className="abastecimiento-modal-header">
                    <h2 className="abastecimiento-modal-title">
                        <span className="abastecimiento-modal-icon">⚠️</span>
                        Registrar Agotamiento
                    </h2>
                    <button
                        type="button"
                        className="abastecimiento-modal-close-button"
                        onClick={onClose}
                        title="Cerrar"
                    >
                        &times;
                    </button>
                </div>

                <div className="abastecimiento-modal-body">
                    <div className="abastecimiento-deplete-container">
                        <div className="abastecimiento-deplete-warning">
                            <div className="abastecimiento-deplete-warning-icon">
                                ⚠️
                            </div>
                            <div className="abastecimiento-deplete-warning-content">
                                <h3>Confirmar Agotamiento de Producto</h3>
                                <p>
                                    Estás a punto de marcar el producto <strong>"{abastecimiento.producto?.nombre}"</strong> 
                                    asignado a <strong>{abastecimiento.usuario?.nombre}</strong> como agotado.
                                </p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="abastecimiento-deplete-form">
                            <div className="form-group-abastecimiento">
                                <label htmlFor="razon_agotamiento" className="form-label-abastecimiento">
                                    <span className="section-icon">📝</span>
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
                        </form>
                    </div>
                </div>

                <div className="abastecimiento-modal-footer">
                    <button 
                        type="button" 
                        className="abastecimiento-modal-button-cancelar" 
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit" 
                        className="abastecimiento-modal-button-deplete"
                        onClick={handleSubmit}
                    >
                        <span className="button-icon">⚠️</span>
                        Confirmar Agotamiento
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DepleteProductModal;