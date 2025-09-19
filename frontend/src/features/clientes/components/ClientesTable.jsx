// src/features/clientes/components/ClientesTable.jsx
import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import "../../../shared/styles/table-common.css";

const ClientesTable = ({
  clientes,
  onView,
  onEdit,
  onDeleteConfirm,
  onToggleEstado,
  currentPage = 1,
  rowsPerPage = 10
}) => {
  if (!clientes || clientes.length === 0) {
    return <p className="no-clientes-message">No hay clientes para mostrar.</p>;
  }

  return (
    <div className="table-container">
      <table className="table-main">
        <thead>
          <tr>
            <th>#</th>
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
          {clientes.map((cliente, index) => {
            const numeroFila = (currentPage - 1) * rowsPerPage + index + 1;
            return (
              <tr key={cliente.idCliente}>
                <td data-label="#">{numeroFila}</td>
                <td data-label="Nombre:">{cliente.nombre}</td>
                <td data-label="Apellido:">{cliente.apellido}</td>
                <td data-label="Correo:">{cliente.correo}</td>
                <td data-label="Teléfono:">{cliente.telefono}</td>
                <td data-label="Dirección:">{cliente.direccion}</td>
                <td data-label="Estado:">
                  <label className="table-switch">
                    <input
                      type="checkbox"
                      checked={cliente.estado}
                      onChange={() => onToggleEstado(cliente.idCliente)}
                    />
                    <span className="table-slider"></span>
                  </label>
                </td>
                <td data-label="Acciones:">
                  <div className="table-iconos">
                    <button className="table-button btn-view" onClick={() => onView(cliente)} title="Ver">
                      <FaEye />
                    </button>
                    <button className="table-button btn-edit" onClick={() => onEdit(cliente)} title="Editar">
                      <FaEdit />
                    </button>
                    <button className="table-button btn-delete" onClick={() => onDeleteConfirm(cliente)} title="Eliminar">
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ClientesTable;