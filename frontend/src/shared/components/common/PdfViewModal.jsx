// src/shared/components/common/PdfViewModal.jsx
import React from 'react';
import './PdfViewModal.css'; 
// Asegúrate de que los estilos de .shared-modal-overlay y .shared-modal-content 
// (de ConfirmModal.css o un global modal css) se apliquen globalmente o impórtalos si es necesario.

const PdfViewModal = ({ isOpen, onClose, pdfUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="shared-modal-overlay"> 
      <div className="shared-modal-content pdf-view-modal-content"> 
        <div className="pdf-view-modal-header">
          <h2>{title || "Vista Previa del PDF"}</h2>
          <button onClick={onClose} className="pdf-view-modal-close-button">&times;</button>
        </div>
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title={title || "Vista previa PDF"}
            width="100%"
            style={{ border: 'none', flexGrow: 1 }} // flexGrow permite que el iframe ocupe el espacio restante
          />
        ) : (
          <p>Generando PDF o no hay PDF para mostrar...</p>
        )}
      </div>
    </div>
  );
};

export default PdfViewModal;