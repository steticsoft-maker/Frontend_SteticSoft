// src/features/proveedores/components/ProveedorDetalleModal.jsx
import React from 'react';

const ProveedorDetalleModal = ({ isOpen, onClose, proveedor }) => {
  if (!isOpen || !proveedor) return null;

  return (
    // Se utilizan las clases que ya tienes en Proveedores.css
    <div className="modal-Proveedores">
      <div className="modal-content-Proveedores detalle-modal">
        <h3>Detalles del Proveedor</h3>
        
        <div className="proveedor-details-list">
          {/* CORRECCIÓN 1: La condición debe basarse en el campo 'tipo' */}
          {proveedor.tipo === "Natural" ? (
            <>
              {/* CORRECCIÓN 2: 'nombre' se usa para el nombre de la persona natural. */}
              <p><strong>Nombre Completo:</strong> {proveedor.nombre || 'N/A'}</p>
              {/* CORRECCIÓN 3: Se usa 'tipoDocumento' para mostrar "CC", "CE", etc. */}
              <p><strong>Tipo de Documento:</strong> {proveedor.tipoDocumento || 'N/A'}</p>
              <p><strong>Número de Documento:</strong> {proveedor.numeroDocumento || 'N/A'}</p>
            </>
          ) : ( // Si el tipo es "Jurídico"
            <>
              {/* CORRECCIÓN 4: 'nombre' también se usa para el nombre de la empresa. */}
              <p><strong>Nombre de la Empresa:</strong> {proveedor.nombre || 'N/A'}</p>
              {/* CORRECCIÓN 5: Se usa 'nitEmpresa' en lugar de 'nit'. */}
              <p><strong>NIT:</strong> {proveedor.nitEmpresa || 'N/A'}</p>
            </>
          )}
          
          {/* --- Campos Comunes Corregidos --- */}
          <p><strong>Teléfono Principal:</strong> {proveedor.telefono || 'N/A'}</p>
          {/* CORRECCIÓN 6: Se usa 'correo' en lugar de 'email'. */}
          <p><strong>Email Principal:</strong> {proveedor.correo || 'N/A'}</p>
          <p><strong>Dirección:</strong> {proveedor.direccion || 'N/A'}</p>
          {/* CORRECCIÓN 7: Se muestra un texto legible para el estado booleano. */}
          <p><strong>Estado:</strong> {proveedor.estado ? "Activo" : "Inactivo"}</p>

          {/* CORRECCIÓN 8: Se añaden los detalles de la persona encargada, que faltaban. */}
          {(proveedor.nombrePersonaEncargada || proveedor.telefonoPersonaEncargada) && (
            <>
              <h4 className="modal-subtitle-proveedores">Datos de la Persona Encargada</h4>
              {proveedor.nombrePersonaEncargada && <p><strong>Nombre Encargado:</strong> {proveedor.nombrePersonaEncargada}</p>}
              {proveedor.telefonoPersonaEncargada && <p><strong>Teléfono Encargado:</strong> {proveedor.telefonoPersonaEncargada}</p>}
              {proveedor.emailPersonaEncargada && <p><strong>Email Encargado:</strong> {proveedor.emailPersonaEncargada}</p>}
            </>
          )}
        </div>
        
        <button className="proveedores-detalle-modal-button-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ProveedorDetalleModal;