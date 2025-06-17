// src/features/proveedores/components/ProveedoresTable.jsx
import React from 'react';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ProveedoresTable = ({ proveedores, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {
  return (
    <div className="tablaProveedores">
      <table>
        <thead>
          <tr>
            {/* ==================== INICIO DE LA CORRECCIÓN ====================
              Se juntan todas las etiquetas <th> en una sola línea para eliminar
              cualquier espacio en blanco o salto de línea entre ellas.
              Esto soluciona el error de hidratación de React.
            ====================== FIN DE LA CORRECCIÓN ======================= */}
            <th>#</th><th>Nombre/Empresa</th><th>Tipo / N° Doc.</th><th>Teléfono</th><th>Email</th><th>Dirección</th><th>Estado</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {proveedores.map((proveedor, index) => (
            <tr key={proveedor.idProveedor || index}>
              <td data-label="#">{index + 1}</td>
              
              {/* CORRECCIÓN 1: Mostrar siempre el campo 'nombre', que contiene tanto el nombre de la persona como el de la empresa. */}
              <td data-label="Nombre/Empresa:">{proveedor.nombre}</td>
              
              {/* CORRECCIÓN 2: Mostrar el tipo y número de documento correcto según el tipo de proveedor. */}
              <td data-label="Tipo / N° Doc.:">
                {proveedor.tipo === "Natural" 
                  ? `${proveedor.tipoDocumento || 'N/A'}: ${proveedor.numeroDocumento || 'N/A'}`
                  : `NIT: ${proveedor.nitEmpresa || 'N/A'}`
                }
              </td>

              <td data-label="Teléfono:">{proveedor.telefono}</td>
              
              {/* CORRECCIÓN 3: Usar 'proveedor.correo' en lugar de 'proveedor.email'. */}
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