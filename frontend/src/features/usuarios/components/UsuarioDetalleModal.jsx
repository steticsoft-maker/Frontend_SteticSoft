// src/features/usuarios/components/UsuarioDetalleModal.jsx
import React from 'react';
// import '../css/Usuarios.css'; // Asegúrate que los estilos del modal estén disponibles

const UsuarioDetalleModal = ({ isOpen, onClose, usuario }) => {
  if (!isOpen || !usuario) return null;

  // Extraer la información del perfil (cliente o empleado) si existe.
  // Esto hace el código más limpio y adaptable si también tienes empleadoInfo.
  const perfil = usuario.clienteInfo || usuario.empleadoInfo || {};

  const nombreCompleto = `${perfil.nombre || ''} ${perfil.apellido || ''}`.trim();
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Ajuste para asegurar que la fecha se muestre correctamente sin problemas de zona horaria UTC vs Local para fechas sin hora
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString();
  };

  return (
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-details">
        <h2>Detalles del Usuario</h2>

        {/* Datos del Perfil */}
        {nombreCompleto && <p><strong>Nombre Completo:</strong> {nombreCompleto}</p>}
        {perfil.tipoDocumento && <p><strong>Tipo de Documento:</strong> {perfil.tipoDocumento}</p>}
        {perfil.numeroDocumento && <p><strong>Número de Documento:</strong> {perfil.numeroDocumento}</p>}
        {perfil.telefono && <p><strong>Teléfono:</strong> {perfil.telefono}</p>}
        {perfil.fechaNacimiento && <p><strong>Fecha de Nacimiento:</strong> {formatDate(perfil.fechaNacimiento)}</p>}
        
        {/* Campo dirección: se mostrará si está en 'perfil.direccion' y este viene de la API */}
        {/* Actualmente no está en tu Cliente o Empleado SQL, así que probablemente 'perfil.direccion' será undefined */}
        {perfil.direccion && <p><strong>Dirección:</strong> {perfil.direccion}</p>}

        {/* Datos de la Cuenta de Usuario */}
        {usuario.correo && <p><strong>Correo Electrónico:</strong> {usuario.correo}</p>}
        {usuario.rol && <p><strong>Rol:</strong> {usuario.rol.nombre || 'No asignado'}</p>}
        <p>
          <strong>Estado:</strong> 
          {typeof usuario.estado === 'boolean' ? (usuario.estado ? "Activo" : "Inactivo") : "No definido"}
        </p>
        
        <button className="usuarios-modalButton-cerrar" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default UsuarioDetalleModal;