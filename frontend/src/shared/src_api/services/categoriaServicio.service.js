// src/services/categoriaServicio.service.js
const db = require("../models");
const { Op } = db.Sequelize;
const { NotFoundError, ConflictError, CustomError } = require("../errors");

/**
 * Helper interno para cambiar el estado de una categoría de servicio.
 */
const cambiarEstadoCategoriaServicio = async (idCategoriaServicio, nuevoEstado) => {
  const categoria = await db.CategoriaServicio.findByPk(idCategoriaServicio);
  if (!categoria) {
    throw new NotFoundError(
      "Categoría de servicio no encontrada para cambiar estado."
    );
  }
  if (categoria.estado === nuevoEstado) {
    return categoria; // Ya está en el estado deseado
  }
  await categoria.update({ estado: nuevoEstado });
  return categoria;
};

const crearCategoriaServicio = async (datosCategoria) => {              /* (1) Inicio */
  const { nombre, descripcion, estado } = datosCategoria;

  try {                                                                 /* (2) Intentar crear categoría */
    const nuevaCategoria = await db.CategoriaServicio.create({
      nombre,
      descripcion: descripcion || null,
      estado: typeof estado === "boolean" ? estado : true,
    });
    return nuevaCategoria;                                              /* (3) Retorno exitoso → Fin */
  } catch (error) {                                                     /* (4) Error al crear */
    if (error.name === "SequelizeUniqueConstraintError") {              /* (5) Error unicidad */
      throw new ConflictError(
        `La categoría de servicio con el nombre '${nombre}' ya existe.`
      );                                                                /* (5) → Fin */
    }
    console.error("Error al crear la categoría de servicio:", error.message);
    throw new CustomError(                                              /* (6) Otro error → Fin */
      `Error al crear la categoría de servicio: ${error.message}`,
      500
    );
  }
}; /* (Fin) */


/**
 * Obtener todas las categorías de servicio.
 */
const obtenerTodasLasCategoriasServicio = async (opcionesDeFiltro = {}) => {
  try {
    return await db.CategoriaServicio.findAll({
      where: opcionesDeFiltro,
      order: [["nombre", "ASC"]],
    });
  } catch (error) {
    console.error(
      "Error al obtener todas las categorías de servicio:",
      error.message
    );
    throw new CustomError(
      `Error al obtener categorías de servicio: ${error.message}`,
      500
    );
  }
};

/**
 * Obtener una categoría de servicio por su ID.
 */
const obtenerCategoriaServicioPorId = async (idCategoriaServicio) => {
  try {
    const categoria = await db.CategoriaServicio.findByPk(idCategoriaServicio);
    if (!categoria) {
      throw new NotFoundError("Categoría de servicio no encontrada.");
    }
    return categoria;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    console.error(
      `Error al obtener la categoría de servicio con ID ${idCategoriaServicio}:`,
      error.message
    );
    throw new CustomError(
      `Error al obtener la categoría de servicio: ${error.message}`,
      500
    );
  }
};

/**
 * Actualizar una categoría de servicio existente.
 */
const actualizarCategoriaServicio = async (
  idCategoriaServicio,
  datosActualizar
) => {
  try {
    const categoria = await db.CategoriaServicio.findByPk(idCategoriaServicio);
    if (!categoria) {
      throw new NotFoundError(
        "Categoría de servicio no encontrada para actualizar."
      );
    }

    await categoria.update(datosActualizar);
    return categoria;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new ConflictError(
        `Ya existe otra categoría de servicio con el nombre '${datosActualizar.nombre}'.`
      );
    }
    console.error(
      `Error al actualizar la categoría de servicio con ID ${idCategoriaServicio}:`,
      error.message
    );
    throw new CustomError(
      `Error al actualizar la categoría de servicio: ${error.message}`,
      500
    );
  }
};


/**
 * Eliminar una categoría de servicio físicamente.
 */
const eliminarCategoriaServicioFisica = async (idCategoriaServicio) => {
  try {
    const categoria = await db.CategoriaServicio.findByPk(idCategoriaServicio);
    if (!categoria) {
      throw new NotFoundError(
        "Categoría de servicio no encontrada para eliminar físicamente."
      );
    }

    const serviciosAsociados = await db.Servicio.count({
      // ✅ CORRECCIÓN APLICADA AQUÍ:
      // Se cambió `categoriaServicioId` por `idCategoriaServicio` para que coincida con el modelo.
      where: { idCategoriaServicio: idCategoriaServicio },
    });
    
    if (serviciosAsociados > 0) {
      throw new ConflictError(
        `No se puede eliminar la categoría de servicio '${categoria.nombre}' porque tiene ${serviciosAsociados} servicio(s) asociado(s).`
      );
    }

    const filasEliminadas = await db.CategoriaServicio.destroy({
      where: { idCategoriaServicio },
    });
    return filasEliminadas;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ConflictError)
      throw error;
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new ConflictError(
        "No se puede eliminar la categoría de servicio porque está siendo referenciada."
      );
    }
    console.error(
      `Error al eliminar físicamente la categoría de servicio con ID ${idCategoriaServicio}:`,
      error.message
    );
    throw new CustomError(
      `Error al eliminar físicamente la categoría de servicio: ${error.message}`,
      500
    );
  }
};


module.exports = {
  crearCategoriaServicio,
  obtenerTodasLasCategoriasServicio,
  obtenerCategoriaServicioPorId,
  actualizarCategoriaServicio,
  eliminarCategoriaServicioFisica,
  cambiarEstadoCategoriaServicio,
};
