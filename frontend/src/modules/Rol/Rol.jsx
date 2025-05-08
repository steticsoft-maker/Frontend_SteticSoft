import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarAdmin from "../../components/NavbarAdmin";
import "./Rol.css";
import { FaEye, FaTrash, FaEdit } from "react-icons/fa";

// Componente interno para el formulario de ProcesoRoles como modal
const ProcesoRolesFormModal = ({
  isOpen,
  onClose,
  onSave,
  initialRoleData,
  existingRoles,
  modulosPermisos,
}) => {
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarPopupRoles, setMostrarPopupRoles] = useState(false);
  const [datosRol, setDatosRol] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    permisos: [],
    anulado: false,
  });
  const [mostrarPopupPermisos, setMostrarPopupPermisos] = useState(false);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);

  // Efecto para cargar los datos del rol cuando se abre en modo edición
  useEffect(() => {
    if (isOpen) {
      if (initialRoleData) {
        setModoEdicion(true);
        setDatosRol({
          id: initialRoleData.id,
          nombre: initialRoleData.nombre || "",
          descripcion: initialRoleData.descripcion || "",
          permisos: initialRoleData.permisos || [],
          anulado: initialRoleData.anulado || false,
        });
        // Asegúrate de que los permisos guardados correspondan a los IDs
        const savedPermisoNames = initialRoleData.permisos || []; // Assuming initialRoleData permissions are names
        const allPermisosFlat = modulosPermisos.flatMap(
          (modulo) => modulo.permisos
        );
        const savedPermisoIds = allPermisosFlat
          .filter((p) => savedPermisoNames.includes(p.nombre))
          .map((p) => p.id);
        setPermisosSeleccionados(savedPermisoIds);
      } else {
        // Reset para el modo creación
        setModoEdicion(false);
        setDatosRol({
          id: null,
          nombre: "",
          descripcion: "",
          permisos: [],
          anulado: false,
        });
        setPermisosSeleccionados([]);
      }
      setMostrarPopupRoles(false); // Asegura que el popup de selección de rol esté cerrado al abrir el modal
    }
  }, [isOpen, initialRoleData, modulosPermisos]); // Depende de isOpen y initialRoleData

  // Resetea el estado del formulario cuando el modal se cierra
  useEffect(() => {
    if (!isOpen) {
      setDatosRol({
        id: null,
        nombre: "",
        descripcion: "",
        permisos: [],
        anulado: false,
      });
      setPermisosSeleccionados([]);
      setModoEdicion(false);
      setMostrarPopupRoles(false);
      setMostrarPopupPermisos(false);
    }
  }, [isOpen]);

  const seleccionarRolParaEdicion = (rol) => {
    setDatosRol({
      id: rol.id,
      nombre: rol.nombre || "",
      descripcion: rol.descripcion || "",
      permisos: rol.permisos || [], // Los permisos aquí son nombres si vienen de initialRoles
      anulado: rol.anulado || false,
    });
    setMostrarPopupRoles(false);
    setModoEdicion(true);

    // Mapear nombres de permisos a IDs si rolesExistentes usa nombres
    const allPermisosFlat = modulosPermisos.flatMap(
      (modulo) => modulo.permisos
    );
    const selectedPermisoIds = allPermisosFlat
      .filter((p) => (rol.permisos || []).includes(p.nombre))
      .map((p) => p.id);

    setPermisosSeleccionados(selectedPermisoIds);
  };

  const togglePermiso = (permisoId) => {
    if (permisosSeleccionados.includes(permisoId)) {
      setPermisosSeleccionados(
        permisosSeleccionados.filter((id) => id !== permisoId)
      );
    } else {
      setPermisosSeleccionados([...permisosSeleccionados, permisoId]);
    }
  };

  const seleccionarTodosPermisosModulo = (moduloId, seleccionar) => {
    const modulo = modulosPermisos.find((m) => m.id === moduloId);
    if (!modulo) return;

    const permisosDelModuloIds = modulo.permisos.map((p) => p.id);

    if (seleccionar) {
      setPermisosSeleccionados([
        ...new Set([...permisosSeleccionados, ...permisosDelModuloIds]),
      ]);
    } else {
      setPermisosSeleccionados(
        permisosSeleccionados.filter((id) => !permisosDelModuloIds.includes(id))
      );
    }
  };

  const guardarRol = () => {
    if (!datosRol.nombre.trim()) {
      alert("Debes ingresar un nombre para el rol");
      return;
    }

    // Mapear IDs de permisos seleccionados a nombres para guardar
    const allPermisosFlat = modulosPermisos.flatMap(
      (modulo) => modulo.permisos
    );
    const selectedPermisoNames = permisosSeleccionados
      .map((id) => {
        const permiso = allPermisosFlat.find((p) => p.id === id);
        return permiso ? permiso.nombre : null;
      })
      .filter((name) => name !== null);

    const rolAGuardar = {
      id: modoEdicion && datosRol.id ? datosRol.id : Date.now(), // Usar ID existente o generar uno nuevo
      nombre: datosRol.nombre,
      descripcion: datosRol.descripcion,
      permisos: selectedPermisoNames, // Guardamos los nombres de los permisos
      anulado: modoEdicion ? datosRol.anulado : false, // Anulado solo editable en modo edición, por defecto false en creación
    };

    onSave(rolAGuardar, modoEdicion);
    onClose(); // Cerrar modal después de guardar
  };

  if (!isOpen) return null; // No renderizar nada si el modal no está abierto

  return (
    <div className="modal-overlay">
      {" "}
      {/* Fondo oscuro */}
      <div className="modal-content">
        {" "}
        {/* Contenedor del formulario */}
        <div className="procesoRoles-container">
          {" "}
          {/* Reutilizamos la clase del contenedor, ajustada en CSS */}
          <h1>{modoEdicion ? "Editar Rol" : "Crear Nuevo Rol"}</h1>
          {/* Botones de modo Nuevo/Editar (solo si no estamos editando uno específico ya) */}
          {!modoEdicion && (
            <div className="procesoRoles-accionesModo">
              <button
                className={`procesoRoles-botonModoNuevo ${
                  !modoEdicion ? "activo" : ""
                }`}
                onClick={() => {
                  setModoEdicion(false);
                  setDatosRol({
                    id: null,
                    nombre: "",
                    descripcion: "",
                    permisos: [],
                    anulado: false,
                  });
                  setPermisosSeleccionados([]);
                }}
              >
                Nuevo Rol
              </button>
              <button
                className={`procesoRoles-botonModoEditar ${
                  modoEdicion ? "activo" : ""
                }`}
                onClick={() => setMostrarPopupRoles(true)}
              >
                Editar Rol Existente
              </button>
            </div>
          )}
          {/* Popup para seleccionar rol a editar */}
          {mostrarPopupRoles && (
            <div className="procesoRoles-popupSeleccionarRol">
              <h3>Seleccionar Rol para Editar</h3>
              <ul>
                {existingRoles.map(
                  (rol) =>
                    // Excluir el rol "Administrador" y roles anulados de la lista de edición si aplica
                    rol.nombre !== "Administrador" && (
                      <li key={rol.id}>
                        <span>
                          {rol.nombre} ({rol.anulado ? "Inactivo" : "Activo"})
                        </span>
                        <button
                          className="procesoRoles-botonSeleccionarRolEnPopup"
                          onClick={() => seleccionarRolParaEdicion(rol)}
                        >
                          Seleccionar
                        </button>
                      </li>
                    )
                )}
              </ul>
              <button
                className="procesoRoles-botonCerrarPopupSeleccionarRol"
                onClick={() => setMostrarPopupRoles(false)}
              >
                Cerrar
              </button>
            </div>
          )}
          {/* Sección de información del Rol */}
          <div className="procesoRoles-seccionInformacionRol">
            <h3>Información del Rol</h3>
            <div className="procesoRoles-formularioInformacionRol">
              <div className="procesoRoles-campoContainer">
                <label htmlFor="nombreRolInput" className="procesoRoles-label">
                  Nombre del Rol:
                </label>
                <input
                  id="nombreRolInput"
                  type="text"
                  placeholder="Ingrese el nombre del rol"
                  value={datosRol.nombre}
                  onChange={(e) =>
                    setDatosRol({ ...datosRol, nombre: e.target.value })
                  }
                  className="procesoRoles-input"
                  disabled={modoEdicion && datosRol.nombre === "Administrador"} // Deshabilita editar nombre Admin
                />
              </div>
              <div className="procesoRoles-campoContainer">
                <label
                  htmlFor="descripcionRolInput"
                  className="procesoRoles-label"
                >
                  Descripción del Rol:
                </label>
                <textarea
                  id="descripcionRolInput"
                  placeholder="Ingrese la descripción del rol"
                  value={datosRol.descripcion}
                  onChange={(e) =>
                    setDatosRol({ ...datosRol, descripcion: e.target.value })
                  }
                  className="procesoRoles-textarea"
                />
              </div>

              {/* Checkbox para Anular/Activar solo en modo edición y si no es Admin */}
              {modoEdicion && datosRol.nombre !== "Administrador" && (
                <div className="procesoRoles-campoContainer">
                  <label className="procesoRoles-label">Estado:</label>
                  <label className="switch">
                    {" "}
                    {/* Reutiliza la clase switch de Rol.css */}
                    <input
                      type="checkbox"
                      checked={datosRol.anulado}
                      onChange={(e) =>
                        setDatosRol({ ...datosRol, anulado: e.target.checked })
                      }
                    />
                    <span className="slider"></span>
                  </label>
                </div>
              )}
            </div>
          </div>
          <button
            className="procesoRoles-botonAbrirPopupPermisos"
            onClick={() => setMostrarPopupPermisos(true)}
          >
            Seleccionar Permisos ({permisosSeleccionados.length})
          </button>
          {/* Popup para seleccionar permisos */}
          {mostrarPopupPermisos && (
            <div className="procesoRoles-popupSeleccionarPermisos">
              <h3>Seleccionar Permisos</h3>
              <div className="procesoRoles-contenedorModulosPermisos">
                {modulosPermisos.map((modulo) => (
                  <div key={modulo.id} className="procesoRoles-moduloPermiso">
                    <div className="procesoRoles-moduloPermiso-header">
                      <h4>{modulo.nombre}</h4>
                      <button
                        // Deshabilitar botón Marcar/Desmarcar si es el rol Admin
                        disabled={
                          modoEdicion && datosRol.nombre === "Administrador"
                        }
                        onClick={() =>
                          seleccionarTodosPermisosModulo(
                            modulo.id,
                            !modulo.permisos.every((p) =>
                              permisosSeleccionados.includes(p.id)
                            )
                          )
                        }
                      >
                        {modulo.permisos.every((p) =>
                          permisosSeleccionados.includes(p.id)
                        )
                          ? "Desmarcar todos"
                          : "Marcar todos"}
                      </button>
                    </div>
                    <div className="procesoRoles-moduloPermiso-lista">
                      {modulo.permisos.map((permiso) => (
                        <div
                          key={permiso.id}
                          className="procesoRoles-moduloPermiso-item"
                        >
                          <input
                            type="checkbox"
                            id={`permiso-${permiso.id}`}
                            checked={permisosSeleccionados.includes(permiso.id)}
                            onChange={() => togglePermiso(permiso.id)}
                            // Deshabilitar checkbox si es el rol Admin
                            disabled={
                              modoEdicion && datosRol.nombre === "Administrador"
                            }
                          />
                          <label htmlFor={`permiso-${permiso.id}`}>
                            {permiso.nombre}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <button
                className="procesoRoles-botonCerrarPopupPermisos"
                onClick={() => setMostrarPopupPermisos(false)}
              >
                Cerrar
              </button>
            </div>
          )}
          {/* Sección de permisos seleccionados (display) */}
          <div className="procesoRoles-seccionPermisosSeleccionados">
            <h3>Permisos Seleccionados</h3>
            {permisosSeleccionados.length > 0 ? (
              <ul className="procesoRoles-listaPermisosSeleccionados">
                {/* Mapeamos IDs a nombres para mostrar */}
                {permisosSeleccionados.map((permisoId) => {
                  const permiso = modulosPermisos
                    .flatMap((m) => m.permisos)
                    .find((p) => p.id === permisoId);
                  return permiso ? (
                    <li key={permisoId}>{permiso.nombre}</li>
                  ) : null;
                })}
              </ul>
            ) : (
              <p>No hay permisos seleccionados</p>
            )}
          </div>
          {/* Botones de acción final (Guardar/Cancelar) */}
          <div className="procesoRoles-accionesFormulario">
            <button className="procesoRoles-botonGuardar" onClick={guardarRol}>
              {modoEdicion ? "Actualizar Rol" : "Crear Rol"}
            </button>
            <button
              className="procesoRoles-botonCancelar"
              onClick={onClose} // Usamos onClose prop para cerrar el modal
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// Componente Principal Rol
// ============================================================

const Rol = () => {
  // Define los permisos con IDs dentro de Rol.jsx para que el modal pueda acceder
  const modulosPermisos = [
    {
      id: 1,
      nombre: "Usuarios",
      permisos: [
        { id: 1, nombre: "Crear usuarios" },
        { id: 2, nombre: "Editar usuarios" },
        { id: 3, nombre: "Eliminar usuarios" },
        { id: 4, nombre: "Ver usuarios" },
      ],
    },
    {
      id: 2,
      nombre: "Ventas",
      permisos: [
        { id: 5, nombre: "Crear ventas" },
        { id: 6, nombre: "Anular ventas" },
        { id: 7, nombre: "Ver reportes" },
      ],
    },
    {
      id: 3,
      nombre: "Productos",
      permisos: [
        { id: 8, nombre: "Agregar productos" },
        { id: 9, nombre: "Editar productos" },
        { id: 10, nombre: "Eliminar productos" },
        { id: 11, nombre: "Ver inventario" },
      ],
    },
  ];

  // Define initialRoles usando nombres de permisos correspondientes a los IDs arriba
  // NOTA: Si tus permisos en localStorage están guardados como NOMBRES,
  // la lógica en el modal (mapeo de IDs a NOMBRES y viceversa) es correcta.
  // Si están guardados como IDs, necesitarás ajustar el mapeo en el modal.
  const initialRoles = [
    {
      id: 1,
      nombre: "Administrador",
      descripcion: "Acceso completo a todas las funciones del sistema.",
      permisos: [
        "Crear usuarios",
        "Editar usuarios",
        "Eliminar usuarios",
        "Ver usuarios",
        "Crear ventas",
        "Anular ventas",
        "Ver reportes",
        "Agregar productos",
        "Editar productos",
        "Eliminar productos",
        "Ver inventario",
      ],
      anulado: false,
    },
    {
      id: 2,
      nombre: "Vendedor",
      descripcion: "Acceso a módulo de ventas e inventario",
      permisos: ["Crear ventas", "Ver reportes", "Ver inventario"],
      anulado: false,
    },
    {
      id: 3,
      nombre: "Consulta",
      descripcion: "Solo permisos de visualización",
      permisos: ["Ver reportes", "Ver inventario"],
      anulado: true,
    },
  ];

  const [roles, setRoles] = useState(() => {
    const savedRoles = localStorage.getItem("roles");
    return savedRoles ? JSON.parse(savedRoles) : initialRoles;
  });
  const [busqueda, setBusqueda] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Estado para controlar la visibilidad del modal de creación/edición
  const [showProcesoRolesModal, setShowProcesoRolesModal] = useState(false);
  // Estado para pasar los datos del rol a editar al modal
  const [roleToEdit, setRoleToEdit] = useState(null);

  useEffect(() => {
    localStorage.setItem("roles", JSON.stringify(roles));
  }, [roles]);

  const handleDelete = (id) => {
    const rol = roles.find((r) => r.id === id);
    // No permitir eliminar el rol "Administrador"
    if (rol && rol.nombre === "Administrador") {
      alert("El rol 'Administrador' no puede ser eliminado.");
      return;
    }
    setConfirmDelete(rol);
  };

  const deleteRol = () => {
    setRoles(roles.filter((r) => r.id !== confirmDelete.id));
    setConfirmDelete(null);
  };

  const toggleAnular = (id) => {
    // No permitir anular el rol "Administrador"
    const rol = roles.find((r) => r.id === id);
    if (rol && rol.nombre === "Administrador") {
      alert("El rol 'Administrador' no puede ser anulado/activado.");
      return;
    }
    setRoles(
      roles.map((r) => (r.id === id ? { ...r, anulado: !r.anulado } : r))
    );
  };

  // Función para guardar/actualizar rol recibida del modal
  const handleSaveRole = (savedRole, isEditing) => {
    setRoles((prevRoles) => {
      if (isEditing) {
        // Actualizar rol existente
        return prevRoles.map((rol) =>
          rol.id === savedRole.id ? savedRole : rol
        );
      } else {
        // Agregar nuevo rol
        return [...prevRoles, savedRole];
      }
    });
    // El modal ya llama a onClose
  };

  const filteredRoles = roles.filter((r) =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const openCreateModal = () => {
    setRoleToEdit(null); // Asegurarse de que no estamos en modo edición
    setShowProcesoRolesModal(true);
  };

  const openEditModal = (rol) => {
    // No permitir editar el rol "Administrador" a través del modal de edición general
    if (rol.nombre === "Administrador") {
      alert(
        "El rol 'Administrador' tiene permisos fijos y no se puede editar."
      );
      // O podrías abrir el modal pero con campos deshabilitados
      // setRoleToEdit(rol);
      // setShowProcesoRolesModal(true);
      return;
    }
    setRoleToEdit(rol); // Pasar los datos del rol a editar
    setShowProcesoRolesModal(true);
  };

  const showRoleDetails = (rol) => {
    setSelectedRole(rol);
    setShowDetailsModal(true);
  };

  return (
    <div className="rol-container">
      <NavbarAdmin />
      <div className="rolContent">
        <h1>Gestión de Roles</h1>

        <div className="barraBusquedaBotonCrearRol">
          <input
            type="text"
            placeholder="Buscar rol..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="barraBusquedaRol"
          />
          {/* Botón para abrir el modal de creación */}
          <button className="botonCrearRol" onClick={openCreateModal}>
            Crear Rol
          </button>
        </div>

        <table className="rol-table">
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
                  {/* Mostrar solo algunos permisos en la tabla */}
                  {(rol.permisos || []).length > 3
                    ? (rol.permisos || []).slice(0, 3).join(", ") + "..."
                    : (rol.permisos || []).join(", ")}
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
                    <span>Activo</span> // Rol Admin siempre Activo visualmente
                  )}
                </td>
                <td>
                  <div className="iconosTablaRol">
                    <button
                      className="botonDetalleRol"
                      onClick={() => showRoleDetails(rol)}
                      title="Ver"
                    >
                      <FaEye />
                    </button>
                    {/* Botones de edición y eliminación solo si no es el rol Admin */}
                    {rol.nombre !== "Administrador" && (
                      <>
                        <button
                          className="botonEditarRol"
                          onClick={() => openEditModal(rol)} // Abre el modal en modo edición
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="botonEliminarRol"
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

        {/* Modal de Detalles del Rol (ya existía) */}
        {showDetailsModal && selectedRole && (
          <div className="modal-rol">
            {" "}
            {/* Reutilizamos la clase modal existente */}
            <div className="modal-content-rol">
              {" "}
              {/* Reutilizamos la clase modal-content existente */}
              <h2>Detalles del Rol</h2>
              <p>
                <strong>Nombre:</strong> {selectedRole.nombre}
              </p>
              <p>
                <strong>Descripción:</strong> {selectedRole.descripcion}
              </p>
              <div>
                <strong>Permisos:</strong>
                <ul className="listaPermisosModalRol">
                  {(selectedRole.permisos || []).map((permiso, index) => (
                    <li key={index}>{permiso}</li>
                  ))}
                </ul>
              </div>
              <p>
                <strong>Estado:</strong>{" "}
                {selectedRole.anulado ? "Inactivo" : "Activo"}
              </p>
              <button
                className="botonCerrarModalDetalleRol"
                onClick={() => setShowDetailsModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Confirmación de Eliminación (ya existía) */}
        {confirmDelete && (
          <div className="modal-rol">
            {" "}
            {/* Reutilizamos la clase modal existente */}
            <div className="modal-content-rol">
              {" "}
              {/* Reutilizamos la clase modal-content existente */}
              <h3>¿Eliminar rol?</h3>
              <p>
                ¿Estás seguro de que deseas eliminar el rol{" "}
                <strong>{confirmDelete.nombre}</strong>?
              </p>
              <div className="botonesModalConfirmarEliminarRol">
                <button
                  className="botonConfirmarEliminarRol"
                  onClick={deleteRol}
                >
                  Eliminar
                </button>
                <button
                  className="botonCancelarModalEliminarRol"
                  onClick={() => setConfirmDelete(null)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal del Formulario ProcesoRoles */}
        <ProcesoRolesFormModal
          isOpen={showProcesoRolesModal}
          onClose={() => setShowProcesoRolesModal(false)}
          onSave={handleSaveRole} // Pasa la función para guardar/actualizar
          initialRoleData={roleToEdit} // Pasa el rol a editar (o null para crear)
          existingRoles={roles} // Pasa la lista de roles para el popup de selección
          modulosPermisos={modulosPermisos} // Pasa la estructura de permisos
        />
      </div>
    </div>
  );
};

export default Rol;
