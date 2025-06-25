// src/services/rol.service.js
const db = require("../models");
const { Op } = db.Sequelize;
const { NotFoundError, ConflictError, CustomError } = require("../errors");

//... (tu función cambiarEstadoRol se mantiene igual)
const cambiarEstadoRol = async (idRol, nuevoEstado) => {
  const rol = await db.Rol.findByPk(idRol);
  if (!rol) {
    throw new NotFoundError("Rol no encontrado para cambiar estado.");
  }
  if (rol.estado === nuevoEstado) {
    return rol;
  }
  await rol.update({ estado: nuevoEstado });
  return rol;
};

//... (tu función crearRol se mantiene igual)
const crearRol = async (datosRol) => {
  const { nombre, descripcion, estado } = datosRol;

  const rolExistente = await db.Rol.findOne({ where: { nombre } });
  if (rolExistente) {
    throw new ConflictError(`El rol con el nombre '${nombre}' ya existe.`);
  }

  try {
    const nuevoRol = await db.Rol.create({
      nombre,
      descripcion,
      estado: typeof estado === "boolean" ? estado : true,
    });
    return nuevoRol;
  } catch (error) {
    console.error("Error al crear el rol en el servicio:", error.message);
    throw new CustomError(`Error al crear el rol: ${error.message}`, 500);
  }
};

/**
 * Obtener todos los roles.
 */
const obtenerTodosLosRoles = async (opciones = {}) => {
  try {
    const { busqueda, estado } = opciones;
    const whereClause = {};

    if (estado !== undefined) {
      // Asegurarse que el estado sea un booleano si viene como string "true" o "false"
      if (typeof estado === 'string') {
        whereClause.estado = estado.toLowerCase() === 'true';
      } else {
        whereClause.estado = Boolean(estado);
      }
    }

    if (busqueda) {
      whereClause[Op.or] = [
        { nombre: { [Op.iLike]: `%${busqueda}%` } },
        { descripcion: { [Op.iLike]: `%${busqueda}%` } },
        // Podríamos incluir búsqueda en permisos si fuera necesario, pero por ahora lo mantenemos simple.
        // { '$permisos.nombre$': { [Op.iLike]: `%${busqueda}%` } } // Esto requeriría 'subQuery: false' y puede ser complejo.
      ];
    }

    return await db.Rol.findAll({
      where: whereClause,
      include: [{
        model: db.Permisos,
        as: 'permisos',
        attributes: ['idPermiso', 'nombre', 'descripcion'], // Traer más info de permisos por si se usa en el futuro
        through: { attributes: [] }
      }],
      order: [["nombre", "ASC"]],
    });
  } catch (error) {
    console.error(
      "Error al obtener todos los roles en el servicio:",
      error.message
    );
    throw new CustomError(`Error al obtener roles: ${error.message}`, 500);
  }
};

/**
 * Obtener un rol por su ID.
 */
const obtenerRolPorId = async (idRol) => {
  try {
    // CORRECCIÓN: Se añade 'include' para los detalles del rol.
    const rol = await db.Rol.findByPk(idRol, {
      include: [{
        model: db.Permisos,
        as: 'permisos',
        through: { attributes: [] }
      }]
    });
    if (!rol) {
      throw new NotFoundError("Rol no encontrado.");
    }
    return rol;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    console.error(
      `Error al obtener el rol con ID ${idRol} en el servicio:`,
      error.message
    );
    throw new CustomError(`Error al obtener el rol: ${error.message}`, 500);
  }
};

//... (tu función actualizarRol se mantiene igual)
const actualizarRol = async (idRol, datosActualizar) => {
  try {
    const rol = await db.Rol.findByPk(idRol);
    if (!rol) {
      throw new NotFoundError("Rol no encontrado para actualizar.");
    }
    if (datosActualizar.nombre && datosActualizar.nombre !== rol.nombre) {
      const rolConMismoNombre = await db.Rol.findOne({
        where: {
          nombre: datosActualizar.nombre,
          idRol: { [Op.ne]: idRol },
        },
      });
      if (rolConMismoNombre) {
        throw new ConflictError(
          `Ya existe otro rol con el nombre '${datosActualizar.nombre}'.`
        );
      }
    }
    await rol.update(datosActualizar);
    return rol;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ConflictError)
      throw error;
    console.error(
      `Error al actualizar el rol con ID ${idRol} en el servicio:`,
      error.message
    );
    throw new CustomError(`Error al actualizar el rol: ${error.message}`, 500);
  }
};

//... (tu función anularRol se mantiene igual, no la borro)
const anularRol = async (idRol) => {
  try {
    return await cambiarEstadoRol(idRol, false);
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    console.error(
      `Error al anular el rol con ID ${idRol} en el servicio:`,
      error.message
    );
    throw new CustomError(`Error al anular el rol: ${error.message}`, 500);
  }
};

//... (tu función habilitarRol se mantiene igual, no la borro)
const habilitarRol = async (idRol) => {
  try {
    return await cambiarEstadoRol(idRol, true);
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    console.error(
      `Error al habilitar el rol con ID ${idRol} en el servicio:`,
      error.message
    );
    throw new CustomError(`Error al habilitar el rol: ${error.message}`, 500);
  }
};

//... (tu función eliminarRolFisico se mantiene igual)
const eliminarRolFisico = async (idRol) => {
  try {
    const rol = await db.Rol.findByPk(idRol);
    if (!rol) {
      throw new NotFoundError("Rol no encontrado para eliminar físicamente.");
    }
    const filasEliminadas = await db.Rol.destroy({
      where: { idRol },
    });
    return filasEliminadas;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new ConflictError(
        "No se puede eliminar el rol porque está siendo referenciado por otras entidades. Considere anularlo en su lugar."
      );
    }
    console.error(
      `Error al eliminar físicamente el rol con ID ${idRol} en el servicio:`,
      error.message
    );
    throw new CustomError(
      `Error al eliminar físicamente el rol: ${error.message}`,
      500
    );
  }
};

module.exports = {
  crearRol,
  obtenerTodosLosRoles,
  obtenerRolPorId,
  actualizarRol,
  anularRol,
  habilitarRol,
  eliminarRolFisico,
  cambiarEstadoRol,
};

/**
 * Verifica si un nombre de rol ya existe.
 * @param {string} nombre - El nombre del rol a verificar.
 * @param {number|null} idExcluir - El ID del rol a excluir de la búsqueda (para modo edición).
 * @returns {Promise<boolean>} True si el nombre ya existe, false en caso contrario.
 */
const verificarNombreUnicoRol = async (nombre, idExcluir = null) => {
  const whereClause = { nombre };
  if (idExcluir) {
    whereClause.idRol = { [Op.ne]: idExcluir };
  }
  const rolExistente = await db.Rol.findOne({ where: whereClause });
  return !!rolExistente;
};

module.exports = {
  crearRol,
  obtenerTodosLosRoles,
  obtenerRolPorId,
  actualizarRol,
  anularRol,
  habilitarRol,
  eliminarRolFisico,
  cambiarEstadoRol,
  verificarNombreUnicoRol, // Exportar
};