// src/features/proveedores/components/ProveedorDetalleModal.jsx
import React from 'react';

const ProveedorDetalleModal = ({ isOpen, onClose, proveedor }) => {
  if (!isOpen || !proveedor) return null;

  return (
    <div className="modal-Proveedores">
      <div className="modal-content-Proveedores">
        <h3>Detalles del Proveedor</h3>
        {proveedor.tipoDocumento === "Natural" ? (
          <>
            <p><strong>Nombre:</strong> {proveedor.nombre}</p>
            <p><strong>Tipo de Documento:</strong> {proveedor.tipoDocumentoNatural}</p>
            <p><strong>Número de Documento:</strong> {proveedor.numeroDocumento}</p>
          </>
        ) : (
          <>
            <p><strong>Nombre de la Empresa:</strong> {proveedor.nombreEmpresa}</p>
            <p><strong>NIT:</strong> {proveedor.nit}</p>
          </>
        )}
        <p><strong>Teléfono Principal:</strong> {proveedor.telefono}</p>
        <p><strong>Email Principal:</strong> {proveedor.email}</p>
        <p><strong>Dirección:</strong> {proveedor.direccion}</p>
        <p><strong>Estado:</strong> {proveedor.estado}</p>

        {(proveedor.personaEncargadaNombre || proveedor.personaEncargadaTelefono || proveedor.personaEncargadaEmail) && (
          <>
            <h4 className="modal-subtitle-proveedores">Datos de la Persona Encargada</h4>
            {proveedor.personaEncargadaNombre && <p><strong>Nombre:</strong> {proveedor.personaEncargadaNombre}</p>}
            {proveedor.personaEncargadaTelefono && <p><strong>Teléfono:</strong> {proveedor.personaEncargadaTelefono}</p>}
            {proveedor.personaEncargadaEmail && <p><strong>Email:</strong> {proveedor.personaEncargadaEmail}</p>}
          </>
        )}
        <button className="botonCerrarModalVerDetallesProveedores" onClick={onClose}>Cerrar</button>
      </div>
    </div>
  );
};

export default ProveedorDetalleModal;