// src/features/proveedores/components/ProveedoresTable.jsx
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ProveedoresTable = ({ proveedores, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {
  return (
    <div className="tablaProveedores">{/* Contenedor de la tabla */}
      <table>{/*SIN ESPACIOS/SALTOS ANTES DE THEAD*/}
        <thead>{/*SIN ESPACIOS/SALTOS ANTES DE TR*/}
          <tr>{/*SIN ESPACIOS/SALTOS ANTES DEL PRIMER TH*/}
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
        <tbody>{/*SIN ESPACIOS/SALTOS ANTES DEL MAP*/}
          {proveedores.map((proveedor, index) => (
            <tr key={proveedor.id || index}>{/*SIN ESPACIOS/SALTOS ANTES DEL PRIMER TD*/}
              <td data-label="#">{index + 1}</td>
              <td data-label="Nombre/Empresa:">{proveedor.tipoDocumento === "Natural" ? proveedor.nombre : proveedor.nombreEmpresa}</td>
              <td data-label="Tipo Doc.:">{proveedor.tipoDocumento === "Natural" ? proveedor.tipoDocumentoNatural : "NIT"}</td>
              <td data-label="Teléfono:">{proveedor.telefono}</td>
              <td data-label="Email:">{proveedor.email}</td>
              <td data-label="Dirección:">{proveedor.direccion}</td>
              <td data-label="Estado:">
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={proveedor.estado === "Activo"}
                    onChange={() => onToggleEstado(proveedor.id)}
                  />
                  <span className="slider"></span>
                </label>
              </td>
              <td data-label="Acciones:" className="proveedores-table-actions">
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