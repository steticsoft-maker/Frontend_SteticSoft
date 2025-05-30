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
          <th>Dirección</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {clientes.map((cliente) => (
          <tr key={cliente.id}>
            <td>{cliente.nombre}</td>
            <td>{cliente.apellido}</td>
            <td>{cliente.email}</td>
            <td>{cliente.telefono}</td>
            <td>{cliente.direccion}</td>
            <td>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={cliente.estado}
                  onChange={() => onToggleEstado(cliente.id)}
                />
                <span className="slider"></span>
              </label>
            </td>
            <td className="clientes-table-actions"> {/* Nueva clase para centrar/espaciar iconos */}
              <button className="iconsTablaclientes" onClick={() => onView(cliente)} title="Ver">
                <FaEye />
              </button>
              <button className="iconsTablaclientes" onClick={() => onEdit(cliente)} title="Editar">
                <FaEdit />
              </button>
              <button className="iconsTablaclientes delete-button-elimnarCliente" onClick={() => onDeleteConfirm(cliente)} title="Eliminar">
                <FaTrash />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ClientesTable;