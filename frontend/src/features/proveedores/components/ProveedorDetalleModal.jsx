// src/features/proveedores/components/ProveedorDetalleModal.jsx
import React from 'react';

const ProveedorDetalleModal = ({ isOpen, onClose, proveedor }) => {
  if (!isOpen || !proveedor) return null;

  return (
    <div className="modal-Proveedores"> {/* Overlay */}
      {/* Contenido del modal con clase específica para detalles y la general */}
      <div className="modal-content-Proveedores detalle-modal"> 
        {/* Título del modal, puedes añadirle una clase si necesitas más control que h3 directo */}
        <h3>Detalles del Proveedor</h3> 
        
        {/* Contenedor para la lista de detalles */}
        <div className="proveedor-details-list"> 
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
        </div>
        
        {/* Botón con clase específica para el modal de detalles */}
        <button className="proveedores-detalle-modal-button-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ProveedorDetalleModal;