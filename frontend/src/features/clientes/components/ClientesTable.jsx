// src/features/clientes/components/ClientesTable.jsx
import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ClientesTable = ({ clientes, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {
  return (
    <table className="tablaClientes">
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Correo</th>
          <th>Teléfono</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.idCliente}>
            <td data-label="Nombre:">{cliente.nombre}</td>
            <td data-label="Apellido:">{cliente.apellido}</td>
            <td data-label="Correo:">{cliente.correo}</td>
            <td data-label="Teléfono:">{cliente.telefono}</td>
            <td data-label="Estado:">
              <label className="switch">
                <input
                  type="checkbox"
                  checked={cliente.estado}
                  onChange={() => onToggleEstado(cliente.idCliente)}
                />
                <span className="slider"></span>
              </label>
            </td>
            <td data-label="Acciones:">
              <div className="clientes-table-actions">
                <button className="iconsTablaclientes" onClick={() => onView(cliente)} title="Ver">
                  <FaEye />
                </button>
                <button className="iconsTablaclientes" onClick={() => onEdit(cliente)} title="Editar">
                  <FaEdit />
                </button>
                <button className="iconsTablaclientes delete-button-elimnarCliente" onClick={() => onDeleteConfirm(cliente)} title="Eliminar">
                  <FaTrash />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientesTable;