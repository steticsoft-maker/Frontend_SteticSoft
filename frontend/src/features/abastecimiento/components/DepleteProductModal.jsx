// src/features/abastecimiento/components/DepleteProductModal.jsx
import React, { useState, useEffect } from 'react';

const DepleteProductModal = ({ isOpen, onClose, onConfirm, productName }) => {
    const [reason, setReason] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isOpen) {
            setReason(''); // Reset reason when modal opens
            setError('');
        }
    }, [isOpen]);

    const handleConfirm = () => {
        if (!reason.trim()) {
            setError('El motivo es obligatorio.');
            return;
        }
        onConfirm(reason);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-abastecimiento-overlay">
            <div className="modal-abastecimiento-content modal-abastecimiento-confirm">
                <h3>Marcar producto como Agotado</h3>
                <p>¿Estás seguro de que deseas marcar el producto <strong>{productName}</strong> como agotado?</p>
                <div className="form-group-abastecimiento">
                    <label htmlFor="depletionReason" className="form-label-abastecimiento">
                        Motivo: <span className="required-asterisk">*</span>
                    </label>
                    <input
                        id="depletionReason"
                        className="form-input-abastecimiento"
                        type="text"
                        value={reason}
                        onChange={(e) => { setReason(e.target.value); setError(''); }}
                        placeholder="Ej: Se terminó antes, dañado, etc."
                    />
                    {error && <p style={{color: 'red', fontSize: '0.8em'}}>{error}</p>}
                </div>
                <div className="form-actions-abastecimiento">
                    <button className="form-button-guardar-abastecimiento deplete-button-abastecimiento" onClick={handleConfirm}>
                        Confirmar Agotado
                    </button>
                    <button className="form-button-cancelar-abastecimiento" onClick={onClose}>
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DepleteProductModal;