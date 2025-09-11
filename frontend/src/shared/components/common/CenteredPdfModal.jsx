// src/shared/components/common/CenteredPdfModal.jsx
import React from 'react';
import './CenteredPdfModal.css';

const CenteredPdfModal = ({ isOpen, onClose, pdfUrl, title }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="centered-pdf-modal-overlay" onClick={onClose}>
      <div className="centered-pdf-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="centered-pdf-modal-header">
          <h2>{title || 'Vista Previa del PDF'}</h2>
          <button onClick={onClose} className="centered-pdf-modal-close-button">&times;</button>
        </div>
        <div className="centered-pdf-modal-body">
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              title={title || 'Vista previa PDF'}
              className="centered-pdf-modal-iframe"
            />
          ) : (
            <p>Generando PDF...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CenteredPdfModal;
