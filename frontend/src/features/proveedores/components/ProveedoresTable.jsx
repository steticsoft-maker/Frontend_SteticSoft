// src/features/proveedores/components/ProveedoresTable.jsx
import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import '../../../shared/styles/table-common.css';

const ProveedoresTable = ({ proveedores, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {
  return (
    <table className="table-main">
      <thead>
        <tr>
          <th>#</th>
          <th>Nombre/Empresa</th>
          <th>Tipo / N° Doc.</th>
          <th>Teléfono</th>
          <th>Email</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {proveedores.map((proveedor, index) => (
          <tr key={proveedor.idProveedor || index}>
            <td data-label="#">{proveedor.numeroGlobal || index + 1}</td>

            <td data-label="Nombre/Empresa:">{proveedor.nombre}</td>

            <td data-label="Tipo / N° Doc.:">
              {proveedor.tipo === "Natural"
                ? `${proveedor.tipoDocumento || 'N/A'}: ${proveedor.numeroDocumento || 'N/A'}`
                : `NIT: ${proveedor.nitEmpresa || 'N/A'}`
              }
            </td>

            <td data-label="Teléfono:">{proveedor.telefono}</td>

            <td data-label="Email:">{proveedor.correo}</td>

            <td data-label="Estado:">
              <label className="table-switch">
                <input
                  type="checkbox"
                  checked={proveedor.estado === true}
                  onChange={() => onToggleEstado(proveedor)}
                />
                <span className="table-slider"></span>
              </label>
            </td>

            <td data-label="Acciones:">
              <div className="table-iconos">
                <button
                  className="table-button btn-view"
                  onClick={() => onView(proveedor)}
                  title="Ver Detalles"
                >
                  <FaEye />
                </button>
                <button
                  className="table-button btn-edit"
                  onClick={() => onEdit(proveedor)}
                  title="Editar"
                >
                  <FaEdit />
                </button>
                <button
                  className="table-button btn-delete"
                  onClick={() => onDeleteConfirm(proveedor)}
                  title="Eliminar"
                >
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

export default ProveedoresTable;
