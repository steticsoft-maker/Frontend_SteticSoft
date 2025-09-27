// src/services/servicio.service.js
const db = require("../models");
const { Op, Sequelize } = db.Sequelize;
const {
  NotFoundError,
  ConflictError,
  CustomError,
  BadRequestError,
} = require("../errors");
const fs = require("fs");
const path = require("path");
const {
  deleteByPublicId,
  extractPublicIdFromUrl,
} = require("../utils/cloudinary.util");

const crearServicio = async (datosServicio) => {
 // 1. INICIO - NODO DE PROCESO
  const {
   nombre,
   precio,
   idCategoriaServicio,
   descripcion,
   imagen,
   imagenPublicId,
  } = datosServicio;

   // 2. NODO DE PROCESO (Búsqueda en DB)
  const servicioExistente = await db.Servicio.findOne({ where: { nombre } });

  // 3. NODO DE DECISIÓN (if/else) - Pregunta: ¿El servicio existe?
  if (servicioExistente) {
   // 3A. NODO DE PROCESO/SALIDA (Lanzar error) - CAMINO 1
   throw new ConflictError(`El servicio con el nombre '${nombre}' ya existe.`);
  }

  // 4. NODO DE PROCESO (Búsqueda en DB) - CONTINUACIÓN DEL CAMINO
  const categoriaServicio =
   await db.CategoriaServicio.findByPk(idCategoriaServicio);

   // 5. NODO DE DECISIÓN (if/else) - Pregunta: ¿La categoría no existe o está inactiva?
  if (!categoriaServicio || !categoriaServicio.estado) {
   // 5A. NODO DE PROCESO/SALIDA (Lanzar error) - CAMINO 2
   throw new BadRequestError(
     "La categoría de servicio no existe o no está activa."
    );
  }

   // 6. NODO DE PROCESO (Inicio del bloque de excepción) - CONTINUACIÓN DEL CAMINO
  try {
    // 7. NODO DE PROCESO (Preparación de datos)
    const servicioParaCrear = {
   nombre: nombre.trim(),
   descripcion: descripcion || null,
   precio: parseFloat(precio).toFixed(2),
   idCategoriaServicio: parseInt(idCategoriaServicio),
   imagen: imagen || null,
   imagenPublicId: imagenPublicId || null,
   estado: true,
  };

   // 8. NODO DE PROCESO/SALIDA (Creación exitosa) - CAMINO 3
  return await db.Servicio.create(servicioParaCrear);
  } catch (error) {
     // 9. NODO DE PROCESO (Manejo del error) - CAMINO 4 (Se ejecuta solo si falla NODO 8)
    console.error("Error al crear el servicio:", error);
 
    // 10. NODO DE PROCESO/SALIDA (Lanzar error de servidor)
   throw new CustomError(
     `Error en el servidor al crear el servicio: ${error.message}`,
     500  
     );
  }
  // 11. NODO FINAL/SALIDA - Se llega aquí si la ejecución no lanza una excepción.
};

const obtenerTodosLosServicios = async (opcionesDeFiltro = {}) => {
  const { busqueda, estado, idCategoriaServicio } = opcionesDeFiltro;
  const whereClause = {};

  if (estado === "true" || estado === "false") {
    whereClause.estado = estado === "true";
  } else if (estado === "Activo") {
    whereClause.estado = true;
  } else if (estado === "Inactivo") {
    whereClause.estado = false;
  }

  if (idCategoriaServicio) {
    whereClause.id_categoria_servicio = idCategoriaServicio;
  }

  if (busqueda) {
    whereClause[Op.or] = [
      { nombre: { [Op.iLike]: `%${busqueda}%` } },
      Sequelize.where(Sequelize.cast(Sequelize.col("precio"), "text"), {
        [Op.iLike]: `%${busqueda}%`,
      }),
    ];
  }

  try {
    return await db.Servicio.findAll({
      where: whereClause,
      include: [
        {
          model: db.CategoriaServicio,
          as: "categoria",
          attributes: ["id_categoria_servicio", "nombre", "estado"],
        },
      ],
      order: [["nombre", "ASC"]],
    });
  } catch (error) {
    console.error("Error al obtener todos los servicios:", error);
    throw new CustomError(`Error al obtener servicios: ${error.message}`, 500);
  }
};

/**
 * ✅ NUEVA FUNCIÓN: Obtiene solo los servicios activos (estado=true).
 * Versión simplificada para evitar problemas de consultas complejas.
 */
const obtenerServiciosDisponibles = async () => {
  try {
    return await db.Servicio.findAll({
      where: { estado: true },
      include: [
        {
          model: db.CategoriaServicio,
          as: "categoria",
        },
      ],
    });
  } catch (error) {
    console.error("Error en obtenerServiciosDisponibles:", error);
    throw error;
  }
};

const obtenerServicioPorId = async (idServicio) => {
  const servicio = await db.Servicio.findByPk(idServicio, {
    include: [{ model: db.CategoriaServicio, as: "categoria" }],
  });
  if (!servicio) {
    throw new NotFoundError("Servicio no encontrado.");
  }
  return servicio;
};
const actualizarServicio = async (idServicio, datosActualizar) => {
  const servicio = await db.Servicio.findByPk(idServicio);
  if (!servicio) {
    throw new NotFoundError("Servicio no encontrado para actualizar.");
  }

  // Si hay nueva imagen y publicId anterior, elimina la imagen anterior de Cloudinary
  if (
    datosActualizar.imagenPublicId &&
    servicio.imagenPublicId &&
    servicio.imagenPublicId !== datosActualizar.imagenPublicId
  ) {
    await deleteByPublicId(servicio.imagenPublicId);
  }

  if (datosActualizar.nombre) {
    const existeNombre = await db.Servicio.findOne({
      where: {
        nombre: datosActualizar.nombre,
        idServicio: { [Op.ne]: idServicio },
      },
    });
    if (existeNombre) {
      throw new ConflictError(
        `Ya existe un servicio con el nombre '${datosActualizar.nombre}'.`
      );
    }
  }

  if (datosActualizar.precio !== undefined) {
    datosActualizar.precio = parseFloat(datosActualizar.precio);
  }

  try {
    await servicio.update({
      ...datosActualizar,
      imagen: datosActualizar.imagen || servicio.imagen,
      imagenPublicId: datosActualizar.imagenPublicId || servicio.imagenPublicId,
    });
    return servicio;
  } catch (error) {
    console.error("Error al actualizar el servicio:", error);
    throw new CustomError(
      `Error al actualizar el servicio: ${error.message}`,
      500
    );
  }
};

const cambiarEstadoServicio = async (idServicio, estado) => {
  const servicio = await db.Servicio.findByPk(idServicio);
  if (!servicio) {
    throw new NotFoundError("Servicio no encontrado.");
  }
  await servicio.update({ estado });
  return servicio;
};

const eliminarServicioFisico = async (idServicio) => {
  const servicio = await db.Servicio.findByPk(idServicio);
  if (!servicio) {
    throw new NotFoundError("Servicio no encontrado.");
  }
  const citasAsociadas = await servicio.countCitas();
  if (citasAsociadas > 0) {
    throw new BadRequestError(
      "No se puede eliminar porque está asociado a citas."
    );
  }
  // Elimina imagen de Cloudinary si existe
  const publicId =
    servicio.imagenPublicId || extractPublicIdFromUrl(servicio.imagen);
  if (publicId) {
    await deleteByPublicId(publicId);
  }
  await servicio.destroy();
  return { mensaje: "Servicio eliminado correctamente." };
};

/**
 * Obtiene servicios activos para uso público.
 */
const listarActivosPublicos = async () => {
  try {
    return await db.Servicio.findAll({
      where: { estado: true },
      include: [
        {
          model: db.CategoriaServicio,
          as: "categoria",
          attributes: ["idCategoriaServicio", "nombre"],
        },
      ],
      order: [["nombre", "ASC"]],
    });
  } catch (error) {
    console.error("Error al obtener servicios públicos:", error);
    throw new CustomError(
      `Error al obtener servicios públicos: ${error.message}`,
      500
    );
  }
};

/**
 * Obtiene servicios públicos para móvil (alias para obtenerServiciosDisponibles).
 */
const obtenerServiciosPublicos = async () => {
  return obtenerServiciosDisponibles();
};

module.exports = {
  crearServicio,
  obtenerTodosLosServicios,
  obtenerServicioPorId,
  actualizarServicio,
  cambiarEstadoServicio,
  eliminarServicioFisico,
  obtenerServiciosDisponibles,
  listarActivosPublicos,
  obtenerServiciosPublicos,
};
