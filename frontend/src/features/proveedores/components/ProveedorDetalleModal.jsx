// src/features/proveedores/components/ProveedorDetalleModal.jsx
import React from 'react';
import '../css/Proveedores.css';

const ProveedorDetalleModal = ({ isOpen, onClose, proveedor }) => {
  if (!isOpen || !proveedor) return null;

  return (
    <div className="modal-Proveedores" onClick={onClose}>
      <div className="modal-content-Proveedores proveedores-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="proveedores-modal-header">
          <h3 className="proveedores-modal-title">
            <span className="proveedores-modal-icon">🏢</span>
            Detalles del Proveedor
          </h3>
          <button
            type="button"
            className="proveedores-modal-close-button"
            onClick={onClose}
            title="Cerrar"
          >
            &times;
          </button>
        </div>

        <div className="proveedores-modal-body">
          <div className="proveedores-details-container">
            <div className="proveedores-details-section">
              <h4 className="proveedores-details-section-title">
                <span className="section-icon">📋</span>
                Información Básica
              </h4>
              <div className="proveedores-details-grid">
                <div className="proveedores-detail-item">
                  <label className="proveedores-detail-label">Tipo</label>
                  <span className={`proveedores-type-badge ${proveedor.tipo?.toLowerCase()}`}>
                    {proveedor.tipo === 'Natural' ? 'Persona Natural' : 'Persona Jurídica'}
                  </span>
                </div>
                <div className="proveedores-detail-item">
                  <label className="proveedores-detail-label">Estado</label>
                  <span className={`proveedores-status-badge ${proveedor.estado ? 'active' : 'inactive'}`}>
                    {proveedor.estado ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <div className="proveedores-detail-item proveedores-detail-item-full">
                  <label className="proveedores-detail-label">
                    {proveedor.tipo === 'Natural' ? 'Nombre Completo' : 'Nombre de la Empresa'}
                  </label>
                  <span className="proveedores-detail-value proveedores-name-text">
                    {proveedor.nombre || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            <div className="proveedores-details-section">
              <h4 className="proveedores-details-section-title">
                <span className="section-icon">📄</span>
                Documentación
              </h4>
              <div className="proveedores-details-grid">
                {proveedor.tipo === "Natural" ? (
                  <>
                    <div className="proveedores-detail-item">
                      <label className="proveedores-detail-label">Tipo de Documento</label>
                      <span className="proveedores-detail-value proveedores-document-type">
                        {proveedor.tipoDocumento || 'N/A'}
                      </span>
                    </div>
                    <div className="proveedores-detail-item">
                      <label className="proveedores-detail-label">Número de Documento</label>
                      <span className="proveedores-detail-value proveedores-document-number">
                        {proveedor.numeroDocumento || 'N/A'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="proveedores-detail-item proveedores-detail-item-full">
                    <label className="proveedores-detail-label">NIT</label>
                    <span className="proveedores-detail-value proveedores-nit-text">
                      {proveedor.nitEmpresa || 'N/A'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="proveedores-details-section">
              <h4 className="proveedores-details-section-title">
                <span className="section-icon">📞</span>
                Información de Contacto
              </h4>
              <div className="proveedores-details-grid">
                <div className="proveedores-detail-item">
                  <label className="proveedores-detail-label">Teléfono Principal</label>
                  <span className="proveedores-detail-value proveedores-phone-text">
                    {proveedor.telefono || 'N/A'}
                  </span>
                </div>
                <div className="proveedores-detail-item">
                  <label className="proveedores-detail-label">Email Principal</label>
                  <span className="proveedores-detail-value proveedores-email-text">
                    {proveedor.correo || 'N/A'}
                  </span>
                </div>
                <div className="proveedores-detail-item proveedores-detail-item-full">
                  <label className="proveedores-detail-label">Dirección</label>
                  <span className="proveedores-detail-value proveedores-address-text">
                    {proveedor.direccion || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {(proveedor.nombrePersonaEncargada || proveedor.telefonoPersonaEncargada || proveedor.emailPersonaEncargada) && (
              <div className="proveedores-details-section proveedores-contact-section">
                <h4 className="proveedores-details-section-title">
                  <span className="section-icon">👤</span>
                  Datos de la Persona Encargada
                </h4>
                <div className="proveedores-details-grid">
                  {proveedor.nombrePersonaEncargada && (
                    <div className="proveedores-detail-item proveedores-detail-item-full">
                      <label className="proveedores-detail-label">Nombre del Encargado</label>
                      <span className="proveedores-detail-value proveedores-contact-name">
                        {proveedor.nombrePersonaEncargada}
                      </span>
                    </div>
                  )}
                  {proveedor.telefonoPersonaEncargada && (
                    <div className="proveedores-detail-item">
                      <label className="proveedores-detail-label">Teléfono del Encargado</label>
                      <span className="proveedores-detail-value proveedores-contact-phone">
                        {proveedor.telefonoPersonaEncargada}
                      </span>
                    </div>
                  )}
                  {proveedor.emailPersonaEncargada && (
                    <div className="proveedores-detail-item">
                      <label className="proveedores-detail-label">Email del Encargado</label>
                      <span className="proveedores-detail-value proveedores-contact-email">
                        {proveedor.emailPersonaEncargada}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="proveedores-modal-footer">
          <button className="proveedores-detalle-modal-button-cerrar" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProveedorDetalleModal;