// src/features/proveedores/components/ProveedoresTable.jsx
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ProveedoresTable = ({ proveedores, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {
  return (
    <div className="tablaProveedores">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre/Empresa</th>
            <th>Tipo Doc.</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Dirección</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor, index) => (
            <tr key={proveedor.id || index}> {/* Usar ID si existe, sino index como fallback */}
              <td>{index + 1}</td>
              <td>{proveedor.tipoDocumento === "Natural" ? proveedor.nombre : proveedor.nombreEmpresa}</td>
              <td>{proveedor.tipoDocumento === "Natural" ? proveedor.tipoDocumentoNatural : "NIT"}</td>
              <td>{proveedor.telefono}</td>
              <td>{proveedor.email}</td>
              <td>{proveedor.direccion}</td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={proveedor.estado === "Activo"}
                    onChange={() => onToggleEstado(proveedor.id)} // Asumimos que el proveedor tiene un 'id' único
                  />
                  <span className="slider"></span>
                </label>
              </td>
              <td className="iconosTablaProveedores">
                <button className="botonVerDetallesProveedor" onClick={() => onView(proveedor)} title="Ver Detalles">
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className="botonEditarProveedor" onClick={() => onEdit(proveedor)} title="Editar">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="botonEliminarProveedor" onClick={() => onDeleteConfirm(proveedor)} title="Eliminar">
                  <FontAwesomeIcon icon={faTrash} />
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