// src/features/proveedores/components/ProveedoresTable.jsx
import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ProveedoresTable = ({ proveedores, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {
  return (
    <div className="tablaProveedores">
      <table>
        <thead>
          <tr>
            <th>#</th><th>Nombre/Empresa</th><th>Tipo / N° Doc.</th><th>Teléfono</th><th>Email</th><th>Dirección</th><th>Estado</th><th>Acciones</th>
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

              <td data-label="Dirección:">{proveedor.direccion}</td>

              <td data-label="Estado:">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={proveedor.estado === true}
                    onChange={() => onToggleEstado(proveedor)}
                  />
                  <span className="slider"></span>
                </label>
              </td>

              <td data-label="Acciones:" className="proveedores-table-actions">
                <button className="botonVerDetallesProveedor" onClick={() => onView(proveedor)} title="Ver Detalles">
                  <FaEye />
                </button>
                <button className="botonEditarProveedor" onClick={() => onEdit(proveedor)} title="Editar">
                  <FaEdit />
                </button>
                <button className="botonEliminarProveedor" onClick={() => onDeleteConfirm(proveedor)} title="Eliminar">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProveedoresTable;
