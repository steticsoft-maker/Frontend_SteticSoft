// src/features/usuarios/components/UsuarioDetalleModal.jsx
import React from 'react';
// import '../css/Usuarios.css'; // Asegúrate que los estilos del modal estén disponibles

const UsuarioDetalleModal = ({ isOpen, onClose, usuario }) => {
  if (!isOpen || !usuario) return null;

  // Extraer la información del perfil (cliente o empleado) si existe.
  // Ambos, Cliente y Empleado, ahora tienen 'nombre', 'apellido', 'correo', 'telefono', 'tipoDocumento', 'numeroDocumento', 'fechaNacimiento'.
  const perfil = usuario.clienteInfo || usuario.empleadoInfo || {};

  const nombreCompleto = `${perfil.nombre || ''} ${perfil.apellido || ''}`.trim();
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    // Ajuste para asegurar que la fecha se muestre correctamente sin problemas de zona horaria UTC vs Local para fechas sin hora
    // Este ajuste es común para fechas que vienen de la DB sin información de hora y que se quieren mostrar como "día local"
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date.getTime() + userTimezoneOffset).toLocaleDateString();
  };

  return (
    <div className="usuarios-modalOverlay">
      <div className="usuarios-modalContent usuarios-modalContent-details">
        <button type="button" className="modal-close-button-x" onClick={onClose}>
          &times;
        </button>
        <h2>Detalles del Usuario</h2>

        {/* Datos del Perfil (Cliente o Empleado) */}
        {nombreCompleto && <p><strong>Nombre Completo:</strong> {nombreCompleto}</p>}
        {/* Aquí mostramos el correo del perfil del empleado/cliente.
            Para clientes y ahora para empleados, este campo existe. */}
        {perfil.correo && <p><strong>Correo Electrónico de Perfil:</strong> {perfil.correo}</p>}
        {perfil.tipoDocumento && <p><strong>Tipo de Documento:</strong> {perfil.tipoDocumento}</p>}
        {perfil.numeroDocumento && <p><strong>Número de Documento:</strong> {perfil.numeroDocumento}</p>}
        {perfil.telefono && <p><strong>Teléfono:</strong> {perfil.telefono}</p>}
        {perfil.fechaNacimiento && <p><strong>Fecha de Nacimiento:</strong> {formatDate(perfil.fechaNacimiento)}</p>}
        
        {/* Campo dirección: se mostrará si está en 'perfil.direccion' y este viene de la API.
            Actualmente no está en tu Cliente o Empleado SQL, así que probablemente 'perfil.direccion' será undefined. */}
        {perfil.direccion && <p><strong>Dirección:</strong> {perfil.direccion}</p>}

        {/* Datos de la Cuenta de Usuario (correo de login, rol, estado) */}
        {usuario.correo && <p><strong>Correo de Cuenta:</strong> {usuario.correo}</p>}
        {usuario.rol && <p><strong>Rol:</strong> {usuario.rol.nombre || 'No asignado'}</p>}
        <p>
          <strong>Estado de Cuenta:</strong> 
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