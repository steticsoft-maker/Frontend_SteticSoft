// src/services/novedades.service.js
const db = require("../models");
const { Op } = db.Sequelize;
const { NotFoundError, BadRequestError, CustomError } = require("../errors");

/**
 * Helper para obtener la estructura de inclusión de empleados de forma consistente.
 * @returns {object} Objeto de configuración para `include` de Sequelize.
 */
const getIncludeEmpleado = () => ({
  model: db.Usuario,
  as: "empleados",
  attributes: ["idUsuario", "correo"],
  through: { attributes: [] },
  include: [
    {
      model: db.Empleado,
      as: "empleado",
      attributes: ["nombre", "apellido", "telefono"],
      required: true,
    },
  ],
});

/**
 * Transforma la estructura de la novedad para aplanar los datos del empleado.
 * @param {object} novedad - Objeto de Sequelize de la novedad.
 * @returns {object} Un objeto plano de la novedad listo para ser enviado como JSON.
 */
const aplanarDatosNovedad = (novedad) => {
  if (!novedad) return null;
  const plainNovedad = novedad.get({ plain: true });
  if (plainNovedad.empleados) {
    plainNovedad.empleados = plainNovedad.empleados.map((usuario) => ({
      idUsuario: usuario.idUsuario,
      correo: usuario.correo,
      nombre: usuario.empleado?.nombre,
      apellido: usuario.empleado?.apellido,
      telefono: usuario.empleado?.telefono,
    }));
  }
  return plainNovedad;
};

const crearNovedad = async (datosNovedad, empleadosIds) => {
   // 1. NODO DE PROCESO: Inicio de la función e inicialización de la transacción.
   const t = await db.sequelize.transaction();
  
   // 2. NODO DE DECISIÓN: Inicio del bloque try (ruta de éxito).
  try {
   // 3. NODO DE DECISIÓN: Primer chequeo de validación (empleadosIds vacío o nulo).
   if (!empleadosIds || empleadosIds.length === 0) {
     // 3A. NODO DE PROCESO/SALIDA: Lanza BadRequestError. (Camino 1)
     throw new BadRequestError(
        "Se debe asignar al menos un empleado a la novedad."
       );
    }

     // 4. NODO DE PROCESO: Búsqueda del rol "Empleado" (depende de DB).
    const rolEmpleado = await db.Rol.findOne({
      where: { nombre: "Empleado" },
      transaction: t,
    });

   // 5. NODO DE DECISIÓN: Chequeo de configuración (Rol "Empleado" no existe).
   if (!rolEmpleado) {
   // 5A. NODO DE PROCESO/SALIDA: Lanza CustomError 500. (Camino 2)
     throw new CustomError(
       "El rol 'Empleado' no está configurado en el sistema.",
       500
    );
  }

   // 6. NODO DE PROCESO: Conteo de usuarios válidos y activos con el rol correcto.
   const usuariosValidos = await db.Usuario.count({
     where: {
       idUsuario: empleadosIds,
       estado: true,
       idRol: rolEmpleado.idRol,
       },
     transaction: t,
     });

     // 7. NODO DE DECISIÓN: Chequeo de empleados (¿Coinciden los IDs enviados con los IDs válidos?).
    if (usuariosValidos !== empleadosIds.length) {
      // 7A. NODO DE PROCESO/SALIDA: Lanza BadRequestError. (Camino 3)
      throw new BadRequestError(
      "Uno o más de los IDs proporcionados no corresponden a empleados válidos y activos."
    );
  }

     // 8. NODO DE PROCESO: Creación de la Novedad.
  const nuevaNovedad = await db.Novedad.create(datosNovedad, {
    transaction: t,
  });

   // 9. NODO DE PROCESO: Asignación de empleados a la novedad (relación muchos a muchos).
  await nuevaNovedad.setEmpleados(empleadosIds, { transaction: t });

   // 10. NODO DE PROCESO: Confirmación de la transacción (commit).
  await t.commit();

   // 11. NODO DE PROCESO: Búsqueda final de la novedad con datos de empleados.
  const novedadCreada = await db.Novedad.findByPk(nuevaNovedad.idNovedad, {
     include: [getIncludeEmpleado()],
  });
 
   // 12. NODO DE PROCESO/SALIDA: Retorna la novedad aplanada. (Camino 4 - Éxito total)
  return aplanarDatosNovedad(novedadCreada);

   } catch (error) {
    // 13. NODO DE PROCESO: Inicio del bloque catch (rutas de error no manejado). (Camino 5 - Falla genérica)
    await t.rollback(); // 13A. NODO DE PROCESO: Deshacer la transacción.
    console.error("Error al crear la novedad en el servicio:", error);
 
   // 14. NODO DE PROCESO/SALIDA: Relanza el error capturado (incluyendo los errores controlados de los nodos 3A, 5A y 7A).
   throw error;
  }
   // 15. NODO FINAL/SALIDA
};

const obtenerTodasLasNovedades = async (opcionesDeFiltro = {}) => {
  const { estado, busqueda } = opcionesDeFiltro;
  const whereClause = {};
  const includeOptions = getIncludeEmpleado();

  if (estado === "true" || estado === "false") {
    whereClause.estado = estado === "true";
  }

  if (busqueda) {
    const searchTerm = `%${busqueda}%`;
    whereClause[Op.or] = [
      { "$empleados.empleado.nombre$": { [Op.iLike]: searchTerm } },
      { "$empleados.empleado.apellido$": { [Op.iLike]: searchTerm } },
      db.sequelize.where(db.sequelize.cast(db.sequelize.col("dias"), "text"), {
        [Op.iLike]: searchTerm,
      }),
      db.sequelize.where(
        db.sequelize.cast(db.sequelize.col("hora_inicio"), "text"),
        {
          [Op.iLike]: searchTerm,
        }
      ),
      db.sequelize.where(
        db.sequelize.cast(db.sequelize.col("hora_fin"), "text"),
        {
          [Op.iLike]: searchTerm,
        }
      ),
    ];
    includeOptions.required = true;
  }

  try {
    const novedades = await db.Novedad.findAll({
      where: whereClause,
      include: [includeOptions],
      order: [["fechaInicio", "DESC"]],
      distinct: true,
    });
    return novedades.map(aplanarDatosNovedad);
  } catch (error) {
    console.error("Error al obtener todas las novedades:", error);
    throw new CustomError(`Error al obtener novedades: ${error.message}`, 500);
  }
};

const obtenerNovedadPorId = async (idNovedad) => {
  const novedad = await db.Novedad.findByPk(idNovedad, {
    include: [getIncludeEmpleado()],
  });
  if (!novedad) {
    throw new NotFoundError("Novedad no encontrada.");
  }
  return aplanarDatosNovedad(novedad);
};

const actualizarNovedad = async (idNovedad, datosActualizar, empleadosIds) => {
  const t = await db.sequelize.transaction();
  try {
    const novedad = await db.Novedad.findByPk(idNovedad, { transaction: t });
    if (!novedad) {
      throw new NotFoundError("Novedad no encontrada para actualizar.");
    }
    if (empleadosIds) {
      if (empleadosIds.length === 0) {
        throw new BadRequestError(
          "Se debe asignar al menos un empleado a la novedad."
        );
      }
      const rolEmpleado = await db.Rol.findOne({
        where: { nombre: "Empleado" },
        transaction: t,
      });
      if (!rolEmpleado)
        throw new CustomError("El rol 'Empleado' no está configurado.", 500);
      const usuariosValidos = await db.Usuario.count({
        where: {
          idUsuario: empleadosIds,
          estado: true,
          idRol: rolEmpleado.idRol,
        },
        transaction: t,
      });
      if (usuariosValidos !== empleadosIds.length) {
        throw new BadRequestError(
          "Uno o más IDs no corresponden a empleados válidos y activos."
        );
      }
      await novedad.setEmpleados(empleadosIds, { transaction: t });
    }
    await novedad.update(datosActualizar, { transaction: t });
    await t.commit();
    return await obtenerNovedadPorId(idNovedad);
  } catch (error) {
    await t.rollback();
    console.error("Error al actualizar la novedad:", error);
    throw error;
  }
};

const cambiarEstadoNovedad = async (idNovedad, estado) => {
  const novedad = await db.Novedad.findByPk(idNovedad);
  if (!novedad) throw new NotFoundError("Novedad no encontrada.");
  await novedad.update({ estado });
  return novedad;
};

const eliminarNovedadFisica = async (idNovedad) => {
  const novedad = await db.Novedad.findByPk(idNovedad);
  if (!novedad) throw new NotFoundError("Novedad no encontrada para eliminar.");
  await novedad.destroy();
};

/**
 * Obtiene las novedades que tienen al menos un empleado disponible.
 * Un empleado está disponible si tiene alguna cita que NO esté en estado 'Finalizada'.
 * @returns {Promise<Array<object>>} Una lista de novedades con sus empleados disponibles.
 */
const obtenerNovedadesDisponibles = async () => {
  try {
    const estadoFinalizada = await db.Estado.findOne({
      where: { nombreEstado: "Finalizada" },
    });
    if (!estadoFinalizada) {
      throw new CustomError(
        "El estado 'Finalizada' no está configurado en el sistema.",
        500
      );
    }
    const todasLasNovedades = await db.Novedad.findAll({
      where: { estado: true },
      include: [
        {
          model: db.Usuario,
          as: "empleados",
          attributes: ["idUsuario"],
          through: { attributes: [] },
          include: [
            {
              model: db.Empleado,
              as: "empleado",
              attributes: ["nombre", "apellido"],
            },
          ],
        },
      ],
    });
    const novedadesDisponibles = [];
    for (const novedad of todasLasNovedades) {
      const empleadosDisponibles = [];
      for (const empleado of novedad.empleados) {
        const citasActivas = await db.Cita.count({
          where: {
            idUsuario: empleado.idUsuario,
            idEstado: { [Op.ne]: estadoFinalizada.idEstado },
          },
        });
        if (citasActivas === 0) {
          empleadosDisponibles.push(empleado);
        }
      }
      if (empleadosDisponibles.length > 0) {
        const novedadConDisponibles = aplanarDatosNovedad(novedad);
        novedadConDisponibles.empleados = empleadosDisponibles.map(
          (e) => aplanarDatosNovedad({ empleados: [e] }).empleados[0]
        );
        novedadesDisponibles.push(novedadConDisponibles);
      }
    }

    return novedadesDisponibles;
  } catch (error) {
    console.error("Error al obtener novedades disponibles:", error);
    if (error instanceof CustomError) throw error;
    throw new CustomError(
      `Error al obtener novedades disponibles: ${error.message}`,
      500
    );
  }
};

/**
 * Obtiene novedades disponibles para móviles (solo información pública)
 * Para uso en aplicación móvil de clientes
 */
const obtenerNovedadesDisponiblesMovil = async () => {
  try {
    const novedadesDisponibles = await obtenerNovedadesDisponibles();

    // Filtrar solo información pública para móviles
    return novedadesDisponibles.map((novedad) => ({
      idNovedad: novedad.idNovedad,
      nombre: novedad.nombre,
      descripcion: novedad.descripcion,
      fechaInicio: novedad.fechaInicio,
      fechaFin: novedad.fechaFin,
      empleados: novedad.empleados.map((empleado) => ({
        idEmpleado: empleado.idEmpleado,
        idUsuario: empleado.idUsuario,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        nombreCompleto: `${empleado.nombre} ${empleado.apellido}`,
      })),
    }));
  } catch (error) {
    throw new CustomError(
      `Error al obtener novedades disponibles para móvil: ${error.message}`,
      500
    );
  }
};

/**
 * Obtiene la novedad de un empleado para una fecha específica
 */
const obtenerNovedadEmpleado = async (idUsuario, fecha) => {
  try {
    const novedad = await db.Novedad.findOne({
      where: {
        estado: true,
        fechaInicio: { [Op.lte]: fecha },
        fechaFin: { [Op.gte]: fecha },
      },
      include: [
        {
          model: db.Usuario,
          as: "empleados",
          where: { idUsuario },
          attributes: ["idUsuario"],
          through: { attributes: [] },
        },
      ],
    });

    return novedad ? novedad.idNovedad : null;
  } catch (error) {
    throw new CustomError(
      `Error al obtener novedad del empleado: ${error.message}`,
      500
    );
  }
};

module.exports = {
  crearNovedad,
  obtenerTodasLasNovedades,
  obtenerNovedadPorId,
  actualizarNovedad,
  cambiarEstadoNovedad,
  eliminarNovedadFisica,
  obtenerNovedadesDisponibles,
  obtenerNovedadesDisponiblesMovil,
  obtenerNovedadEmpleado,
};
