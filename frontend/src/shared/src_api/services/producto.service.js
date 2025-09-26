// RUTA: src/shared/src_api/services/producto.service.js
const db = require("../models");
const { Op } = db.Sequelize;
const {
  NotFoundError,
  ConflictError,
  CustomError,
  BadRequestError,
} = require("../errors");
const {
  deleteByPublicId,
  extractPublicIdFromUrl,
} = require("../utils/cloudinary.util");

/**
 * Helper interno para cambiar el estado de un producto.
 */
const cambiarEstadoProducto = async (idProducto, nuevoEstado) => {
  const producto = await db.Producto.findByPk(idProducto);
  if (!producto) {
    throw new NotFoundError("Producto no encontrado para cambiar estado.");
  }
  if (producto.estado === nuevoEstado) {
    return producto;
  }
  await producto.update({ estado: nuevoEstado });
  return producto;
};

/**
 * Crear un nuevo producto.
 */
// RUTA: src/shared/src_api/services/producto.service.js

/**
 * Crear un nuevo producto.
 */
const crearProducto = async (datosProducto) => {                  /* (1) Inicio */
  const {
    nombre,
    descripcion,
    existencia,
    precio,
    stockMinimo,
    stockMaximo,
    imagen,
    imagenPublicId,
    estado,
    categoriaProductoId,
    tipoUso,
    vidaUtilDias,
  } = datosProducto;                                              /* (2) Desestructurar datos */

  try {                                                           /* (3) Intentar crear producto */
    const nuevoProducto = await db.Producto.create({              
      nombre,
      descripcion: descripcion || null,
      existencia: existencia !== undefined ? Number(existencia) : 0,
      precio: precio !== undefined ? Number(precio) : 0.0,
      stockMinimo: stockMinimo !== undefined ? Number(stockMinimo) : 0,
      stockMaximo: stockMaximo !== undefined ? Number(stockMaximo) : 0,
      imagen: imagen || null,
      imagenPublicId: imagenPublicId || null,
      estado: typeof estado === "boolean" ? estado : true,
      categoriaProductoId: categoriaProductoId || null,
      tipoUso: ["Interno", "Externo"].includes(tipoUso) ? tipoUso : "Externo",
      vidaUtilDias: vidaUtilDias || null,
    });                                                           
    return nuevoProducto;                                         /* (4) Retornar producto → Fin */
  } catch (error) {                                               /* (5) Error inesperado → Fin */
    console.error("Error al crear el producto:", error);               
    throw new CustomError(`Error al crear el producto: ${error.message}`, 500); 
  }
};                                                                /* (Fin) */

const obtenerTodosLosProductos = async (filtros) => {
  const {
    page = 1,
    limit = 10,
    search,
    estado,
    idCategoria,
    tipoUso,
  } = filtros;

  const offset = (page - 1) * limit;

  let whereCondition = {};

  if (search) {
    whereCondition[Op.or] = [
      { nombre: { [Op.iLike]: `%${search}%` } },
      { descripcion: { [Op.iLike]: `%${search}%` } },
      // ✅ --- INICIO DE LA CORRECCIÓN ---
      // Se agregan las columnas adicionales a la búsqueda.
      // Para buscar en campos numéricos (como precio y existencia),
      // los convertimos a texto dentro de la consulta.
      db.sequelize.literal(`"Producto"."precio"::text ILIKE '%${search}%'`),
      db.sequelize.literal(`"Producto"."existencia"::text ILIKE '%${search}%'`),
      // --- FIN DE LA CORRECIÓN ---
    ];
  }

  if (estado !== undefined) {
    if (estado === "true" || estado === "false") {
      whereCondition.estado = estado === "true";
    } else if (estado === "Activo") {
      whereCondition.estado = true;
    } else if (estado === "Inactivo") {
      whereCondition.estado = false;
    }
  }

  if (idCategoria) {
    whereCondition.categoriaProductoId = idCategoria;
  }
  if (tipoUso) {
    whereCondition.tipoUso = tipoUso;
  }

  let includeCondition = [
    {
      model: db.CategoriaProducto,
      as: "categoria",
      required: false,
    },
  ];

  try {
    const { count, rows } = await db.Producto.findAndCountAll({
      where: whereCondition,
      include: includeCondition,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [["nombre", "ASC"]],
      distinct: true,
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      productos: rows,
    };
  } catch (error) {
    console.error("Error inesperado al obtener productos:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    throw new CustomError(
      `Ocurrió un error inesperado al obtener productos: ${error.message}`,
      500
    );
  }
};

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
    console.error("Error inesperado al obtener producto por ID:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    if (error instanceof NotFoundError) throw error;
    throw new CustomError(
      "Ocurrió un error inesperado al obtener el producto.",
      500
    );
  }
};

/**
 * Actualizar un producto existente.
 */
const actualizarProducto = async (idProducto, datosActualizar) => {
  const producto = await db.Producto.findByPk(idProducto);
  if (!producto) {
    throw new NotFoundError("Producto no encontrado para actualizar.");
  }

  // Si hay nueva imagen y publicId anterior, elimina la imagen anterior de Cloudinary
  if (
    datosActualizar.imagenPublicId &&
    producto.imagenPublicId &&
    producto.imagenPublicId !== datosActualizar.imagenPublicId
  ) {
    try {
      await deleteByPublicId(producto.imagenPublicId);
    } catch (error) {
      console.error("Error al eliminar imagen anterior de Cloudinary:", error);
      // No lanzar el error para evitar que falle la actualización del producto
    }
  }

  if (datosActualizar.nombre) {
    const existeNombre = await db.Producto.findOne({
      where: {
        nombre: datosActualizar.nombre,
        idProducto: { [Op.ne]: idProducto },
      },
    });
    if (existeNombre) {
      throw new ConflictError(
        `Ya existe un producto con el nombre '${datosActualizar.nombre}'.`
      );
    }
  }

  try {
    await producto.update({
      ...datosActualizar,
      imagen: datosActualizar.imagen || producto.imagen,
      imagenPublicId: datosActualizar.imagenPublicId || producto.imagenPublicId,
    });
    return producto;
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    throw new CustomError(
      `Error al actualizar el producto: ${error.message}`,
      500
    );
  }
};

/**
 * Eliminar un producto físicamente.
 */
const eliminarProductoFisico = async (idProducto) => {
  const producto = await db.Producto.findByPk(idProducto);
  if (!producto) {
    throw new NotFoundError(
      "Producto no encontrado para eliminar físicamente."
    );
  }
  const publicId =
    producto.imagenPublicId || extractPublicIdFromUrl(producto.imagen);
  if (publicId) {
    try {
      await deleteByPublicId(publicId);
    } catch (error) {
      console.error("Error al eliminar imagen de Cloudinary:", error);
      // No lanzar el error para evitar que falle la eliminación del producto
    }
  }

  try {
    const filasEliminadas = await db.Producto.destroy({
      where: { idProducto },
    });
    return filasEliminadas;
  } catch (error) {
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new ConflictError(
        "No se puede eliminar el producto porque está siendo referenciado. Considere anularlo."
      );
    }
    throw new CustomError(
      "Ocurrió un error inesperado al eliminar el producto.",
      500
    );
  }
};

/**
 * Obtener todos los productos activos para uso interno.
 */
const obtenerProductosInternos = async () => {
  try {
    const productos = await db.Producto.findAll({
      where: {
        tipoUso: "Interno",
        estado: true,
      },
      include: [
        {
          model: db.CategoriaProducto,
          as: "categoria",
          required: false,
        },
      ],
      order: [["nombre", "ASC"]],
    });
    return productos;
  } catch (error) {
    console.error("Error inesperado al obtener productos internos:", {
      message: error.message,
      stack: error.stack,
    });
    throw new CustomError(
      "Ocurrió un error inesperado al obtener los productos para abastecimiento.",
      500
    );
  }
};

/**
 * Obtener todos los productos públicos (activos y de uso externo).
 */
const obtenerProductosPublicos = async (filtros) => {
  const { idCategoria, ...restFiltros } = filtros;

  const query = {
    ...restFiltros,
    estado: "true",
    tipoUso: "Externo",
  };

  if (idCategoria) {
    query.idCategoria = idCategoria;
  }

  return obtenerTodosLosProductos(query);
};

/**
 * Obtiene productos públicos por categoría específica (para móvil).
 */
const obtenerProductosPublicosPorCategoria = async (
  idCategoria,
  opciones = {}
) => {
  const { pagina = 1, limite = 20 } = opciones;

  const filtros = {
    page: pagina,
    limit: limite,
    estado: "true",
    tipoUso: "Externo",
    idCategoria: idCategoria,
  };

  return obtenerTodosLosProductos(filtros);
};

module.exports = {
  crearProducto,
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProductoFisico,
  cambiarEstadoProducto,
  obtenerProductosInternos,
  obtenerProductosPublicos,
  obtenerProductosPublicosPorCategoria,
};
