// src/shared/components/common/PdfViewModal.jsx
import React from 'react';
import './pdfViewModal.css'; 

const PdfViewModal = ({ isOpen, onClose, pdfUrl, title }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay"> {/* Usa una clase de overlay genérica */}
      <div className="modal-content pdf-view-modal-content"> {/* Clase de contenido genérica y específica */}
        <div className="pdf-view-modal-header">
          <h2>{title || "Vista Previa del PDF"}</h2>
          <button onClick={onClose} className="pdf-view-modal-close-button">&times;</button>
        </div>
        {pdfUrl ? (
          <iframe
            src={pdfUrl}
            title={title || "Vista previa PDF"}
            width="100%"
            height="calc(80vh - 70px)" // Ajusta la altura según sea necesario
            style={{ border: 'none', marginTop: '10px' }}
          />
        ) : (
          <p>Generando PDF o no hay PDF para mostrar...</p>
        )}
        {/* No es necesario un botón de cerrar aquí si ya está en el header,
            pero puedes añadir uno si prefieres */}
        {/* <button onClick={onClose} className="button-secondary">Cerrar</button> */}
      </div>
    </div>
  );
};

export default PdfViewModal;