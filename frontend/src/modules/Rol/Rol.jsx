import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Rol.css";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

const Rol = () => {
  const initialRoles = [
    {
      id: 1,
      nombre: "Administrador",
      descripcion: "Acceso completo a todos los módulos del sistema",
      permisos: [
        "Usuarios: Crear",
        "Usuarios: Editar",
        "Usuarios: Eliminar",
        "Usuarios: Visualizar",
        "Ventas: Crear",
        "Ventas: Anular",
        "Ventas: Reportes",
        "Inventario: Gestionar",
        "Configuracion: Administrar",
      ],
      anulado: false,
    },
    {
      id: 2,
      nombre: "Vendedor",
      descripcion: "Acceso a módulo de ventas e inventario",
      permisos: ["Ventas: Crear", "Ventas: Reportes", "Inventario: Consultar"],
      anulado: false,
    },
    {
      id: 3,
      nombre: "Consulta",
      descripcion: "Solo permisos de visualización",
      permisos: ["Ventas: Reportes", "Inventario: Consultar"],
      anulado: true,
    },
  ];

  const navigate = useNavigate();
  const [roles, setRoles] = useState(initialRoles);
  const [busqueda, setBusqueda] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  useEffect(() => {
    localStorage.setItem("roles", JSON.stringify(roles));
  }, [roles]);

  const handleDelete = (id) => {
    const rol = roles.find((r) => r.id === id);
    setConfirmDelete(rol);
  };

  const deleteRol = () => {
    setRoles(roles.filter((r) => r.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const toggleAnular = (id) => {
    setRoles(
      roles.map((r) => (r.id === id ? { ...r, anulado: !r.anulado } : r))
    );
  };

  const filteredRoles = roles.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const navigateToCreateRole = () => {
    navigate("/procesoroles", { state: { mode: "create" } });
  };

  const navigateToEditRole = (rol) => {
    navigate("/procesoroles", { state: { mode: "edit", roleData: rol } });
  };

  const showRoleDetails = (rol) => {
    setSelectedRole(rol);
    setShowDetailsModal(true);
  };

  return (
    <div className="rol-container">
      <NavbarAdmin />
      <div className="main-content-Roles">
        <h1>Gestión de Roles</h1>

        <div className="barraBusquedaBotonCrearRol">
          <input
            type="text"
            placeholder="Buscar rol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="inputBarraBusquedaRoles"
          />
          <button className="botonSuperiorCrearRol" onClick={navigateToCreateRole}>
            Crear Rol
          </button>
        </div>

        <table className="tablaRoles">
          <thead>
            <tr>
              <th>Nombre del Rol</th>
              <th>Descripción</th>
              <th>Permisos</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.map((rol) => (
              <tr key={rol.id}>
                <td>{rol.nombre}</td>
                <td>{rol.descripcion}</td>
                <td>
                  {rol.permisos.length > 3
                    ? rol.permisos.slice(0, 3).join(", ") + "..."
                    : rol.permisos.join(", ")}
                </td>
                <td>
                  {rol.nombre !== "Administrador" ? (
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={rol.anulado}
                        onChange={() => toggleAnular(rol.id)}
                      />
                      <span className="slider"></span>
                    </label>
                  ) : (
                    <span>No disponible</span>
                  )}
                </td>
                <td>
                  <div className="iconosTablaRoles">
                    <button
                      className="botonVerDetallesRoles"
                      onClick={() => showRoleDetails(rol)}
                      title="Ver"
                    >
                      <FaEye />
                    </button>
                    {rol.nombre !== "Administrador" && (
                      <>
                        <button
                          className="BotonEditarRoles"
                          onClick={() => navigateToEditRole(rol)}
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="botonEliminarRoles"
                          onClick={() => handleDelete(rol.id)}
                          title="Eliminar"
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Modal de detalles (se mantiene como antes) */}
        {showDetailsModal && (
          <div className="modal-roles">
            <div className="modal-content-roles">
              <h2>Detalles del Rol</h2>
              <p>
                <strong>Nombre:</strong> {selectedRole.nombre}
              </p>
              <p>
                <strong>Descripción:</strong> {selectedRole.descripcion}
              </p>
              <div>
                <strong>Permisos:</strong>
                <ul className="modalListaPermisos">

                  {selectedRole.permisos.map((permiso, index) => (
                    <li key={index}>{permiso}</li>
                  ))}
                </ul>
              </div>
              <p>
                <strong>Estado:</strong>{" "}
                {selectedRole.anulado ? "Inactivo" : "Activo"}
              </p>
              <button
                className="botonCerrarModalVerDetallesRoles"
                onClick={() => setShowDetailsModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div className="modal-roles">
            <div className="modal-content-roles">
              <h3>¿Eliminar rol?</h3>
              <p>
                ¿Estás seguro de que deseas eliminar el rol{" "}
                <strong>{confirmDelete.nombre}</strong>?
              </p>
              <div className="BotonesEliminarCancelarRolesModalEliminar">
                <button className="botonConfirmarEliminarRoles" onClick={deleteRol}>
                  Eliminar
                </button>
                <button
                  className="botonCancelarEliminarRol"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Rol;
