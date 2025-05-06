import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProcesoRoles.css";

const ProcesoRoles = ({ guardarRol }) => {
  // Roles existentes de ejemplo
  const rolesExistentes = [
    {
      id: 1,
      nombre: "Administrador",
      descripcion: "Acceso completo a todos los módulos del sistema",
    },
    {
      id: 2,
      nombre: "Vendedor",
      descripcion: "Acceso a módulo de ventas e inventario",
    },
    {
      id: 3,
      nombre: "Consulta",
      descripcion: "Solo permisos de visualización",
    },
  ];

  // Módulos y permisos de ejemplo
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

  const navigate = useNavigate();

  // Estados del componente
  const [modoEdicion, setModoEdicion] = useState(false);
  const [mostrarRoles, setMostrarRoles] = useState(false);
  const [datosRol, setDatosRol] = useState({
    nombre: "",
    descripcion: "",
    permisos: [],
  });
  const [mostrarPermisos, setMostrarPermisos] = useState(false);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState([]);

  // Seleccionar un rol existente para editar
  const seleccionarRol = (rol) => {
    setDatosRol({
      nombre: rol.nombre,
      descripcion: rol.descripcion,
      permisos: rol.permisos || [],
    });
    setMostrarRoles(false);
    setModoEdicion(true);
    setPermisosSeleccionados(rol.permisos || []);
  };

  // Manejar cambio de selección de permisos
  const togglePermiso = (permisoId) => {
    if (permisosSeleccionados.includes(permisoId)) {
      setPermisosSeleccionados(
        permisosSeleccionados.filter((id) => id !== permisoId)
      );
    } else {
      setPermisosSeleccionados([...permisosSeleccionados, permisoId]);
    }
  };

  // Seleccionar todos los permisos de un módulo
  const seleccionarTodosPermisos = (moduloId, seleccionar) => {
    const modulo = modulosPermisos.find((m) => m.id === moduloId);
    if (seleccionar) {
      const nuevosPermisos = [
        ...new Set([
          ...permisosSeleccionados,
          ...modulo.permisos.map((p) => p.id),
        ]),
      ];
      setPermisosSeleccionados(nuevosPermisos);
    } else {
      const nuevosPermisos = permisosSeleccionados.filter(
        (id) => !modulo.permisos.some((p) => p.id === id)
      );
      setPermisosSeleccionados(nuevosPermisos);
    }
  };

  // Guardar el nuevo rol o los cambios
  const guardarNuevoRol = () => {
    if (!datosRol.nombre) {
      alert("Debes ingresar un nombre para el rol");
      return;
    }

    const nuevoRol = {
      nombre: datosRol.nombre,
      descripcion: datosRol.descripcion,
      permisos: permisosSeleccionados,
      fechaCreacion: new Date().toISOString(),
    };

    guardarRol(nuevoRol);
    setDatosRol({ nombre: "", descripcion: "", permisos: [] });
    setPermisosSeleccionados([]);
    alert(`Rol ${modoEdicion ? "actualizado" : "creado"} exitosamente!`);
    navigate("/roles");
  };

  return (
    <div className="proceso-roles-main">
      <h1>{modoEdicion ? "Editar Rol" : "Crear Nuevo Rol"}</h1>

      <div className="accionesAgregarRol">
        <button
          className={`nuevo-button-rol ${!modoEdicion ? "activo" : ""}`}
          onClick={() => {
            setModoEdicion(false);
            setDatosRol({ nombre: "", descripcion: "", permisos: [] });
            setPermisosSeleccionados([]);
          }}
        >
          Nuevo Rol
        </button>
        <button
          className={`editar-button-rol ${modoEdicion ? "activo" : ""}`}
          onClick={() => setMostrarRoles(true)}
        >
          Editar Rol Existente
        </button>
      </div>

      {mostrarRoles && (
        <div className="roles-emergente">
          <h3>Seleccionar Rol para Editar</h3>
          <ul>
            {rolesExistentes.map((rol) => (
              <li key={rol.id}>
                {rol.nombre}
                <button className= "botonSeleccionarRol" onClick={() => seleccionarRol(rol)}>Seleccionar</button>
              </li>
            ))}
          </ul>
          <button
            className="botonCerrarRolesEmergente"
            onClick={() => setMostrarRoles(false)}
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="datosRolSeleccionado">
        <h3>Información del Rol</h3>
        <div className="formularioNuevoRol">
          <div className="campoNombreRol">
            <input
              type="text"
              placeholder="Nombre del Rol"
              value={datosRol.nombre}
              onChange={(e) =>
                setDatosRol({ ...datosRol, nombre: e.target.value })
              }
            />
          </div>
          <br />
        </div>
          <div className="descripcionNuevoRol">
            <textarea
              placeholder="Descripción del Rol"
              value={datosRol.descripcion}
              onChange={(e) =>
                setDatosRol({ ...datosRol, descripcion: e.target.value })
              }
            />
          </div>
      </div>

      <button
        className="catalogo-button"
        onClick={() => setMostrarPermisos(true)}>
        Seleccionar Permisos
      </button>

      {mostrarPermisos && (
        <div className="permisos-emergente">
          <h3>Seleccionar Permisos</h3>
          <div className="modulos-container">
            {modulosPermisos.map((modulo) => (
              <div key={modulo.id} className="modulo-permisos">
                <div className="modulo-header">
                  <h4>{modulo.nombre}</h4>
                  <button
                    onClick={() =>
                      seleccionarTodosPermisos(
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
                <div className="permisos-list">
                  {modulo.permisos.map((permiso) => (
                    <div key={permiso.id} className="permiso-item">
                      <input
                        type="checkbox"
                        id={`permiso-${permiso.id}`}
                        checked={permisosSeleccionados.includes(permiso.id)}
                        onChange={() => togglePermiso(permiso.id)}
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
            className="cerrar-button"
            onClick={() => setMostrarPermisos(false)}
          >
            Cerrar
          </button>
        </div>
      )}

      <div className="permisos-seleccionados">
        <h3>Permisos Seleccionados</h3>
        {permisosSeleccionados.length > 0 ? (
          <ul className="lista-permisos">
            {permisosSeleccionados.map((permisoId) => {
              const permiso = modulosPermisos
                .flatMap((m) => m.permisos)
                .find((p) => p.id === permisoId);
              return permiso ? <li key={permisoId}>{permiso.nombre}</li> : null;
            })}
          </ul>
        ) : (
          <p>No hay permisos seleccionados</p>
        )}
      </div>

      <div className="botones-accion">
        <button className="guardar-rol-button" onClick={guardarNuevoRol}>
          {modoEdicion ? "Actualizar Rol" : "Crear Rol"}
        </button>
        <button
          className="cancelar-rol-button"
          onClick={() => navigate("/rol")}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default ProcesoRoles;
