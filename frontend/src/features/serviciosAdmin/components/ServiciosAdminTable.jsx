// src/features/serviciosAdmin/components/ServiciosAdminTable.jsx
import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const ServiciosAdminTable = ({ servicios, onView, onEdit, onDeleteConfirm, onToggleEstado }) => {
  return (
    <div className="tablaServicios"> {/* Clase del CSS original */}
      <table className="tablaServicio"> {/* Clase del CSS original */}
        <thead>
          <tr>
            <th className="thServicios">Nombre</th>
            <th className="thServicios">Precio</th>
            <th className="thServicios">Categoría</th>
            <th className="thServicios">Imagen</th>
            <th className="thServicios">Estado</th>
            <th className="thServicios">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {servicios.map((serv, index) => ( // Usar ID si los servicios lo tienen, sino index
            <tr key={serv.id || index}>
              <td>{serv.nombre}</td>
              <td>${serv.precio ? serv.precio.toFixed(2) : '0.00'}</td>
              <td>{serv.categoria || "—"}</td>
              <td>
                {serv.imagenURL ? (
                  <img
                    src={serv.imagenURL}
                    alt={serv.nombre}
                    className="servicio-imagen" // Clase del CSS original
                    style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                  />
                ) : "—"}
              </td>
              <td>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={serv.estado === "Activo"}
                    onChange={() => onToggleEstado(serv.id || index)} // Pasar ID o index
                  />
                  <span className="slider round"></span>
                </label>
              </td>
              <td className="servicios-admin-actions"> {/* Clase para centrar/espaciar */}
                <button className="botonVerDetallesServicios" onClick={() => onView(serv)} title="Ver Detalles">
                  <FontAwesomeIcon icon={faEye} />
                </button>
                <button className="botonEditarServicios" onClick={() => onEdit(serv)} title="Editar Servicio">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button className="botonEliminarServicios" onClick={() => onDeleteConfirm(serv)} title="Eliminar Servicio">
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

export default ServiciosAdminTable;