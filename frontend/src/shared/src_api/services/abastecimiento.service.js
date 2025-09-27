// src/services/abastecimiento.service.js
const db = require("../models/index.js");
const { Op } = db.Sequelize;
const { Abastecimiento, Producto, Usuario, Rol, Empleado, sequelize } = db;
const {
  NotFoundError,
  ConflictError,
  CustomError,
  BadRequestError,
} = require("../errors/index.js");
const { checkAndSendStockAlert } = require("../utils/stockAlertHelper.js");

// --- CREAR ABASTECIMIENTO ---
const crearAbastecimiento = async (datosAbastecimiento) => {                     /* (1) Inicio */
  const { idProducto, cantidad, fechaIngreso, estado, idUsuario } =
    datosAbastecimiento;

  const producto = await Producto.findByPk(idProducto);                          /* (2) Buscar producto */

  /* (3) Verificar si el producto existe */
  if (!producto)
    throw new BadRequestError(`Producto con ID ${idProducto} no encontrado.`);

  /* (4) Verificar si el producto está activo */
  if (!producto.estado)
    throw new BadRequestError(`Producto '${producto.nombre}' no está activo.`);

  /* (5) Verificar si el tipo de uso es 'Interno' */
  if (producto.tipoUso?.toLowerCase() !== "interno") {
    throw new BadRequestError(
      `El producto '${producto.nombre}' (ID: ${idProducto}) no es de tipo 'Interno' y no puede ser asignado mediante este módulo de abastecimiento.`
    );
  }

  /* (6) Verificar si hay stock suficiente */
  if (producto.existencia < cantidad) {
    throw new ConflictError(
      `No hay suficiente stock para '${producto.nombre}'. Solicitado: ${cantidad}, Disponible: ${producto.existencia}.`
    );
  }

  const transaction = await sequelize.transaction();                             /* (7) Iniciar transacción */

  /* (8) Manejo de éxito o error en la transacción */
  try {
    const nuevoAbastecimiento = await Abastecimiento.create(
      {
        idProducto: idProducto,
        cantidad: Number(cantidad),
        fechaIngreso: fechaIngreso || new Date(),
        estaAgotado: false,
        estado: typeof estado === "boolean" ? estado : true,
        idUsuario: idUsuario,
      },
      { transaction }
    );

    await producto.decrement("existencia", {
      by: Number(cantidad),
      transaction,
    });

    await transaction.commit();                                                  /* (9) Confirmar transacción */

    const productoActualizado = await Producto.findByPk(idProducto);            /* (10) Verificar producto actualizado */
    if (productoActualizado) {
      await checkAndSendStockAlert(                                              /* (11) Enviar alerta si aplica */
        productoActualizado,
        `tras abastecimiento ID ${nuevoAbastecimiento.idAbastecimiento}`
      );
    }

    return nuevoAbastecimiento;                                                  /* (12) Retorno exitoso → Fin */
  } catch (error) {
    await transaction.rollback();
    console.error("Error detallado al crear abastecimiento:", error);
    throw new CustomError(                                                       /* (13) Lanzar error → Fin */
      `Error al crear el abastecimiento: ${error.message}`,
      500
    );
  }
}; /* (Fin) */


// --- OBTENER TODOS LOS ABASTECIMIENTOS ---
const obtenerTodosLosAbastecimientos = async (opcionesDeFiltro = {}) => {
  const { page = 1, limit = 10, search, estado } = opcionesDeFiltro;
  const offset = (page - 1) * limit;

  let whereClause = {};
  if (estado !== undefined && estado !== "todos") {
    whereClause.estado = estado === "activos";
  }

  if (search) {
    whereClause[Op.or] = [
      { "$producto.nombre$": { [Op.iLike]: `%${search}%` } },
      { "$empleado.correo$": { [Op.iLike]: `%${search}%` } },
      { "$empleado.empleado.nombre$": { [Op.iLike]: `%${search}%` } },
      { "$empleado.empleado.apellido$": { [Op.iLike]: `%${search}%` } },
    ];
  }

  try {
    const { count, rows } = await Abastecimiento.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: Producto,
          as: "producto",
        },
        {
          model: Usuario,
          as: "empleado",
          attributes: ["id_usuario", "correo"],
          include: [
            { model: Rol, as: "rol", attributes: ["nombre"] },
            {
              model: Empleado,
              as: "empleado",
              attributes: ["nombre", "apellido"],
              required: true,
            },
          ],
        },
      ],
      order: [["fechaIngreso", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      distinct: true,
      subQuery: false,
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: rows,
    };
  } catch (error) {
    console.error("Error al obtener todos los abastecimientos:", error);
    throw new CustomError(
      `Error al obtener abastecimientos: ${error.message}`,
      500
    );
  }
};

// --- OBTENER ABASTECIMIENTO POR ID ---
const obtenerAbastecimientoPorId = async (idAbastecimiento) => {
  try {
    const abastecimiento = await Abastecimiento.findByPk(idAbastecimiento, {
      include: [
        {
          model: Producto,
          as: "producto",
          attributes: ["idProducto", "nombre", "stockMinimo", "existencia"],
        },
        {
          model: Usuario,
          as: "empleado",
          include: [
            { model: Rol, as: "rol" },
            { model: Empleado, as: "empleado" },
          ],
        },
      ],
    });
    if (!abastecimiento)
      throw new NotFoundError("Registro de abastecimiento no encontrado.");
    return abastecimiento;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    console.error(
      `Error al obtener el abastecimiento con ID ${idAbastecimiento}:`,
      error.message
    );
    throw new CustomError(
      `Error al obtener el abastecimiento: ${error.message}`,
      500
    );
  }
};

// --- ACTUALIZAR ABASTECIMIENTO ---
const actualizarAbastecimiento = async (idAbastecimiento, datosActualizar) => {
  // ✅ CORRECCIÓN: Se espera 'idUsuario' en lugar de 'empleadoAsignado'.
  const {
    estaAgotado,
    razonAgotamiento,
    fechaAgotamiento,
    estado,
    cantidad,
    idUsuario,
  } = datosActualizar;
  const transaction = await sequelize.transaction();
  try {
    const abastecimiento = await Abastecimiento.findByPk(idAbastecimiento, {
      transaction,
    });
    if (!abastecimiento) {
      await transaction.rollback();
      throw new NotFoundError("Registro de abastecimiento no encontrado.");
    }

    const producto = await Producto.findByPk(abastecimiento.idProducto, {
      transaction,
    });
    if (!producto) {
      await transaction.rollback();
      throw new BadRequestError(
        `Producto asociado (ID: ${abastecimiento.idProducto}) no encontrado.`
      );
    }

    const estadoOriginal = abastecimiento.estado;
    const cantidadOriginal = abastecimiento.cantidad;
    const camposAActualizar = {};

    if (estaAgotado !== undefined) camposAActualizar.estaAgotado = estaAgotado;
    // ✅ CORRECCIÓN: Se usa 'idUsuario' para la actualización.
    if (idUsuario !== undefined) camposAActualizar.idUsuario = idUsuario;
    if (estaAgotado === true) {
      if (razonAgotamiento !== undefined)
        camposAActualizar.razonAgotamiento = razonAgotamiento;
      if (fechaAgotamiento !== undefined)
        camposAActualizar.fechaAgotamiento = fechaAgotamiento;
    } else if (estaAgotado === false) {
      camposAActualizar.razonAgotamiento = null;
      camposAActualizar.fechaAgotamiento = null;
    }

    const nuevoEstado = datosActualizar.hasOwnProperty("estado")
      ? estado
      : abastecimiento.estado;
    const nuevaCantidad = datosActualizar.hasOwnProperty("cantidad")
      ? Number(cantidad)
      : abastecimiento.cantidad;
    camposAActualizar.estado = nuevoEstado;
    camposAActualizar.cantidad = nuevaCantidad;

    await abastecimiento.update(camposAActualizar, { transaction });

    let diferencia = 0;
    if (estadoOriginal && nuevoEstado) {
      diferencia = cantidadOriginal - nuevaCantidad;
    } else if (!estadoOriginal && nuevoEstado) {
      diferencia = -nuevaCantidad;
    } else if (estadoOriginal && !nuevoEstado) {
      diferencia = cantidadOriginal;
    }

    if (diferencia !== 0) {
      if (diferencia > 0) {
        await producto.increment("existencia", { by: diferencia, transaction });
      } else {
        if (producto.existencia < Math.abs(diferencia)) {
          throw new ConflictError(
            `Stock insuficiente para ajustar. Requerido: ${Math.abs(
              diferencia
            )}, Disponible: ${producto.existencia}.`
          );
        }
        await producto.decrement("existencia", {
          by: Math.abs(diferencia),
          transaction,
        });
      }
    }
    await transaction.commit();
    return obtenerAbastecimientoPorId(idAbastecimiento);
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// --- ELIMINAR ABASTECIMIENTO ---
const eliminarAbastecimientoFisico = async (idAbastecimiento) => {
  const transaction = await sequelize.transaction();
  try {
    const abastecimiento = await Abastecimiento.findByPk(idAbastecimiento, {
      transaction,
    });
    if (!abastecimiento) {
      await transaction.rollback();
      throw new NotFoundError("Abastecimiento no encontrado.");
    }
    if (abastecimiento.estado) {
      await Producto.increment("existencia", {
        by: abastecimiento.cantidad,
        where: { idProducto: abastecimiento.idProducto },
        transaction,
      });
    }
    await abastecimiento.destroy({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// --- AGOTAR ABASTECIMIENTO ---
const agotarAbastecimiento = async (idAbastecimiento, razonAgotamiento) => {
  const abastecimiento = await Abastecimiento.findByPk(idAbastecimiento);
  if (!abastecimiento)
    throw new NotFoundError(
      `Abastecimiento con ID ${idAbastecimiento} no encontrado.`
    );
  if (abastecimiento.estaAgotado)
    throw new ConflictError(`El abastecimiento ya está marcado como agotado.`);
  abastecimiento.estaAgotado = true;
  abastecimiento.razonAgotamiento = razonAgotamiento || null;
  abastecimiento.fechaAgotamiento = new Date();
  await abastecimiento.save();
  return abastecimiento;
};

// --- OBTENER EMPLEADOS ---
const obtenerEmpleados = async () => {
  try {
    const usuarios = await Usuario.findAll({
      include: [
        { model: Rol, as: "rol", attributes: ["nombre"] },
        {
          model: Empleado,
          as: "empleado",
          attributes: ["nombre", "apellido"],
          required: true,
        },
      ],
      attributes: ["id_usuario", "correo"],
      raw: true,
      nest: true,
    });

    const empleadosPlano = usuarios.map((u) => ({
      id_usuario: u.id_usuario,
      correo: u.correo,
      nombre: u.empleado.nombre,
      apellido: u.empleado.apellido,
      rol: u.rol.nombre,
    }));

    return empleadosPlano;
  } catch (error) {
    console.error("Error al obtener la lista de empleados:", error);
    throw new CustomError(
      `Error al obtener la lista de empleados: ${error.message}`,
      500
    );
  }
};

module.exports = {
  crearAbastecimiento,
  obtenerTodosLosAbastecimientos,
  obtenerAbastecimientoPorId,
  actualizarAbastecimiento,
  eliminarAbastecimientoFisico,
  agotarAbastecimiento,
  obtenerEmpleados,
};
