// src/shared/src_api/services/producto.service.js
const db = require("../models");
const { Op } = db.Sequelize;
const {
  NotFoundError,
  ConflictError,
  CustomError,
  BadRequestError,
} = require("../errors");

/**
 * Helper interno para cambiar el estado de un producto.
 */
const cambiarEstadoProducto = async (idProducto, nuevoEstado) => {
  const producto = await db.Producto.findByPk(idProducto);
  if (!producto) {
    throw new NotFoundError("Producto no encontrado para cambiar estado.");
  }
  if (producto.estado === nuevoEstado) {
    return producto; // Ya está en el estado deseado
  }
  await producto.update({ estado: nuevoEstado });
  return producto;
};

/**
 * Crear un nuevo producto.
 */
const crearProducto = async (datosProducto) => {
  const {
    nombre,
    descripcion,
    existencia,
    precio,
    stockMinimo,
    stockMaximo,
    imagen,
    estado,
    categoriaProductoId,
  } = datosProducto;

  if (
    stockMinimo !== undefined &&
    stockMaximo !== undefined &&
    Number(stockMaximo) < Number(stockMinimo)
  ) {
    throw new BadRequestError(
      "El stock máximo no puede ser menor que el stock mínimo."
    );
  }

  if (categoriaProductoId) {
    const categoria = await db.CategoriaProducto.findOne({
      where: { idCategoriaProducto: categoriaProductoId, estado: true },
    });
    if (!categoria) {
      throw new BadRequestError(
        `La categoría de producto con ID ${categoriaProductoId} no existe o no está activa.`
      );
    }
  }

  try {
    const nuevoProducto = await db.Producto.create({
      nombre,
      descripcion: descripcion || null,
      existencia: existencia !== undefined ? Number(existencia) : 0,
      precio: precio !== undefined ? Number(precio) : 0.0,
      stockMinimo: stockMinimo !== undefined ? Number(stockMinimo) : 0,
      stockMaximo: stockMaximo !== undefined ? Number(stockMaximo) : 0,
      imagen: imagen || null,
      estado: typeof estado === "boolean" ? estado : true,
      categoriaProductoId: categoriaProductoId || null,
    });
    return nuevoProducto;
  } catch (error) {
    console.error(
      "Error al crear el producto en el servicio:",
      error.message,
      error.stack
    );
    throw new CustomError(`Error al crear el producto: ${error.message}`, 500);
  }
};

/**
 * Obtener todos los productos.
 */
const obtenerTodosLosProductos = async (filtros) => {
  const {
    page = 1,
    limit = 10,
    busqueda, // Cambiado de 'nombre' a 'busqueda'
    estado,
    idCategoria,
    tipo_uso, 
  } = filtros;

  const offset = (page - 1) * limit;
  const whereCondition = {};

  // Filtro por estado (ya existente y correcto)
  if (estado !== undefined) {
    if (typeof estado === 'string') {
      whereCondition.estado = estado.toLowerCase() === 'true';
    } else {
      whereCondition.estado = Boolean(estado);
    }
  }

  // Filtro por categoría (ya existente y correcto)
  if (idCategoria) {
    whereCondition.categoriaProductoId = idCategoria;
  }

  // Filtro por tipo_uso (ya existente y correcto)
  // Este filtro es aplicado en la tabla CategoriaProducto, por lo que necesitamos un 'where' en el include
  let includeCategoriaWhere = {};
  if (tipo_uso) {
    includeCategoriaWhere.tipoUso = tipo_uso; // Asumiendo que el campo en el modelo CategoriaProducto es tipoUso
  }

  // Lógica de búsqueda global
  if (busqueda) {
    const searchPattern = { [Op.iLike]: `%${busqueda}%` };
    whereCondition[Op.or] = [
      { nombre: searchPattern },
      { descripcion: searchPattern },
      // Búsqueda en el nombre de la categoría relacionada
      // Esto requiere que el include de CategoriaProducto se maneje adecuadamente.
      // Si se usa '$categoria.nombre$', se necesita subQuery: false o un manejo cuidadoso.
      // Por ahora, para mantener la paginación simple, podríamos omitir la búsqueda en categoría
      // o requerir que el include de categoría esté presente y luego filtrar.
      // Una forma más segura para paginación es buscar IDs de productos que coincidan y luego usarlos.
      // Sin embargo, intentaremos la forma directa con '$...$' y observaremos.
      { '$categoria.nombre$': searchPattern }
    ];
  }

  const includeCondition = [
    {
      model: db.CategoriaProducto,
      as: "categoria",
      attributes: ["idCategoriaProducto", "nombre", "vidaUtilDias", "tipoUso"],
      where: Object.keys(includeCategoriaWhere).length > 0 ? includeCategoriaWhere : undefined,
      required: Object.keys(includeCategoriaWhere).length > 0 // Si hay filtro por tipo_uso, la categoría es requerida.
    },
  ];

  try {
    const { count, rows } = await db.Producto.findAndCountAll({
      where: whereCondition,
      include: includeCondition,
      // Si la búsqueda en '$categoria.nombre$' da problemas con `count` o paginación,
      // se podría necesitar `distinct: true` y `col: 'idProducto'` o `subQuery: false`.
      // `subQuery: false` es más simple de implementar pero puede ser menos performante en algunos casos.
      // Vamos a probar sin subQuery: false primero.
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["nombre", "ASC"]],
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      productos: rows,
    };
  } catch (error) {
    console.error("Error al obtener productos con paginación:", error);
    throw new Error("No se pudieron obtener los productos.");
  }
};


/**
 * Obtener un producto por su ID.
 */
const obtenerProductoPorId = async (idProducto) => {
  try {
    const producto = await db.Producto.findByPk(idProducto, {
      include: [
        {
          model: db.CategoriaProducto,
          as: "categoria",
          attributes: ["idCategoriaProducto", "nombre"],
        },
      ],
    });
    if (!producto) {
      throw new NotFoundError("Producto no encontrado.");
    }
    return producto;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    console.error(
      `Error al obtener el producto con ID ${idProducto} en el servicio:`,
      error.message
    );
    throw new CustomError(
      `Error al obtener el producto: ${error.message}`,
      500
    );
  }
};

/**
 * Actualizar un producto existente.
 */
const actualizarProducto = async (idProducto, datosActualizar) => {
  try {
    const producto = await db.Producto.findByPk(idProducto);
    if (!producto) {
      throw new NotFoundError("Producto no encontrado para actualizar.");
    }

    const { stockMinimo, stockMaximo, categoriaProductoId } = datosActualizar;

    const valStockMinimo =
      stockMinimo !== undefined ? Number(stockMinimo) : producto.stockMinimo;
    const valStockMaximo =
      stockMaximo !== undefined ? Number(stockMaximo) : producto.stockMaximo;

    if (valStockMaximo < valStockMinimo) {
      throw new BadRequestError(
        "El stock máximo no puede ser menor que el stock mínimo."
      );
    }

    if (
      categoriaProductoId !== undefined &&
      categoriaProductoId !== producto.categoriaProductoId
    ) {
      if (categoriaProductoId === null) {
        datosActualizar.categoriaProductoId = null;
      } else {
        const categoria = await db.CategoriaProducto.findOne({
          where: { idCategoriaProducto: categoriaProductoId, estado: true },
        });
        if (!categoria) {
          throw new BadRequestError(
            `La categoría de producto con ID ${categoriaProductoId} no existe o no está activa.`
          );
        }
      }
    }

    await producto.update(datosActualizar);
    return obtenerProductoPorId(producto.idProducto);
  } catch (error) {
    if (
      error instanceof NotFoundError ||
      error instanceof BadRequestError ||
      error instanceof ConflictError
    )
      throw error;
    console.error(
      `Error al actualizar el producto con ID ${idProducto} en el servicio:`,
      error.message,
      error.stack
    );
    throw new CustomError(
      `Error al actualizar el producto: ${error.message}`,
      500
    );
  }
};

/**
 * Anular un producto (estado = false).
 */
const anularProducto = async (idProducto) => {
  try {
    return await cambiarEstadoProducto(idProducto, false);
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    console.error(
      `Error al anular el producto con ID ${idProducto} en el servicio:`,
      error.message
    );
    throw new CustomError(`Error al anular el producto: ${error.message}`, 500);
  }
};

/**
 * Habilitar un producto (estado = true).
 */
const habilitarProducto = async (idProducto) => {
  try {
    return await cambiarEstadoProducto(idProducto, true);
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    console.error(
      `Error al habilitar el producto con ID ${idProducto} en el servicio:`,
      error.message
    );
    throw new CustomError(
      `Error al habilitar el producto: ${error.message}`,
      500
    );
  }
};

/**
 * Eliminar un producto físicamente.
 */
const eliminarProductoFisico = async (idProducto) => {
  try {
    const producto = await db.Producto.findByPk(idProducto);
    if (!producto) {
      throw new NotFoundError(
        "Producto no encontrado para eliminar físicamente."
      );
    }

    const filasEliminadas = await db.Producto.destroy({
      where: { idProducto },
    });
    return filasEliminadas;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new ConflictError(
        "No se puede eliminar el producto porque está siendo referenciado en abastecimientos, compras o ventas. Considere anularlo en su lugar."
      );
    }
    console.error(
      `Error al eliminar físicamente el producto con ID ${idProducto} en el servicio:`,
      error.message
    );
    throw new CustomError(
      `Error al eliminar físicamente el producto: ${error.message}`,
      500
    );
  }
};

module.exports = {
  crearProducto,
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  actualizarProducto,
  anularProducto,
  habilitarProducto,
  eliminarProductoFisico,
  cambiarEstadoProducto,
};