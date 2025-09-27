// src/services/cita.service.js
"use strict";

const db = require("../models/index.js");
const { Op } = db.Sequelize;
const {
  NotFoundError,
  ConflictError,
  CustomError,
  BadRequestError,
} = require("../errors/index.js");
const moment = require("moment-timezone");
const { enviarCorreoCita } = require("../utils/CitaEmailTemplate.js");
const { formatDateTime } = require("../utils/dateHelpers.js");

/**
 * Función interna unificada para obtener los detalles completos de una cita.
 */
const obtenerCitaCompletaPorIdInterno = async (idCita, transaction = null) => {
  return db.Cita.findByPk(idCita, {
    include: [
      {
        model: db.Cliente,
        as: "cliente",
        attributes: ["idCliente", "nombre", "apellido", "correo", "estado", "numeroDocumento"],
      },
      {
        model: db.Usuario,
        as: "empleado",
        attributes: ["idUsuario", "correo"],
        include: [
          {
            model: db.Empleado,
            as: "empleado",
            attributes: ["nombre", "apellido", "numeroDocumento"],
          },
        ],
      },
      {
        model: db.Estado,
        as: "estadoDetalle",
        attributes: ["idEstado", "nombreEstado"],
      },
      {
        model: db.Servicio,
        as: "serviciosProgramados",
        attributes: ["idServicio", "nombre", "precio"],
        through: { attributes: [] },
      },
    ],
    transaction,
  });
};

/**
 * Crea una nueva cita, validando que todos los recursos estén activos.
 */
const crearCita = async (datosCita) => {
  const {
    fecha,
    hora_inicio,
    clienteId,
    usuarioId,
    idEstado,
    novedadId,
    servicios = [],
    precio_total,
  } = datosCita;

  if (!usuarioId) throw new BadRequestError("Debes seleccionar un empleado.");
  if (!clienteId) throw new BadRequestError("Debes seleccionar un cliente.");
  if (!servicios || servicios.length === 0)
    throw new BadRequestError("Debes seleccionar al menos un servicio.");
  if (!fecha || !hora_inicio)
    throw new BadRequestError("La fecha y hora de inicio son requeridas.");

  const transaction = await db.sequelize.transaction();
  try {
    const citaExistente = await db.Cita.findOne({
      where: {
        idUsuario: usuarioId,
        fecha: fecha,
        hora_inicio: hora_inicio,
        idEstado: { [Op.ne]: 4 }, // Excluir citas canceladas
      },
      transaction,
    });

    if (citaExistente) {
      throw new ConflictError(
        "El empleado ya tiene otra cita programada exactamente a esa misma hora."
      );
    }

    const serviciosConsultados = await db.Servicio.findAll({
      where: { idServicio: servicios, estado: true },
      transaction,
    });
    if (serviciosConsultados.length !== servicios.length) {
      throw new BadRequestError(
        "Uno o más de los servicios seleccionados no son válidos o están inactivos."
      );
    }
    const precio_total = serviciosConsultados.reduce((total, servicio) => {
      return total + parseFloat(servicio.precio || 0);
    }, 0);

    const nuevaCita = await db.Cita.create(
      {
        fecha,
        hora_inicio,
        precio_total,
        idCliente: clienteId,
        idUsuario: usuarioId,
        idEstado,
        idNovedad: novedadId,
      },
      { transaction }
    );

    await nuevaCita.addServiciosProgramados(serviciosConsultados, {
      transaction,
    });
    await transaction.commit();

    const citaCreadaConDetalles = await obtenerCitaCompletaPorIdInterno(
      nuevaCita.idCita
    );
    if (citaCreadaConDetalles && citaCreadaConDetalles.cliente?.correo) {
      try {
        const fechaHoraParaCorreo = moment(
          `${citaCreadaConDetalles.fecha} ${citaCreadaConDetalles.hora_inicio}`
        ).toDate();
        await enviarCorreoCita({
          correo: citaCreadaConDetalles.cliente.correo,
          nombreCliente: citaCreadaConDetalles.cliente.nombre,
          citaInfo: {
            accion: "agendada",
            fechaHora: formatDateTime(fechaHoraParaCorreo),
            empleado:
              citaCreadaConDetalles.empleado?.empleado?.nombre || "No asignado",
            estado:
              citaCreadaConDetalles.estadoDetalle?.nombreEstado || "Pendiente",
            servicios: citaCreadaConDetalles.serviciosProgramados,
            total: citaCreadaConDetalles.precio_total,
          },
        });
      } catch (emailError) {
        console.error(
          `Cita ${nuevaCita.idCita} creada, pero falló el envío de correo:`,
          emailError
        );
      }
    }

    return citaCreadaConDetalles;
  } catch (error) {
    await transaction.rollback();
    console.error("Error al crear la cita en el servicio:", error);
    if (error instanceof BadRequestError || error instanceof ConflictError)
      throw error;
    throw new CustomError(`Error al crear la cita: ${error.message}`, 500);
  }
};

/**
 * Obtiene una lista de todas las citas. (Ya estaba correcto)
 */
const obtenerTodasLasCitas = async (opcionesDeFiltro = {}) => {
  try {
    const { idEstado, search, estado } = opcionesDeFiltro;
    const whereClause = {};

    if (idEstado) whereClause.idEstado = idEstado;

    if (estado === "true" || estado === "false") {
      whereClause.estado = estado === "true";
    } else if (estado === "activa") {
      whereClause.estado = true;
    }

    if (search) {
      whereClause[Op.or] = [
        { "$cliente.nombre$": { [Op.iLike]: `%${search}%` } },
        { "$cliente.apellido$": { [Op.iLike]: `%${search}%` } },
        { "$empleado.empleado.nombre$": { [Op.iLike]: `%${search}%` } },
        { "$empleado.empleado.apellido$": { [Op.iLike]: `%${search}%` } },
        db.sequelize.where(db.sequelize.cast(db.col("Cita.fecha"), "text"), {
          [Op.iLike]: `%${search}%`,
        }),
      ];
    }

    return await db.Cita.findAll({
      where: whereClause,
      include: [
        {
          model: db.Cliente,
          as: "cliente",
          attributes: ["nombre", "apellido", "numeroDocumento"],
        },
        {
          model: db.Usuario,
          as: "empleado",
          include: [
            {
              model: db.Empleado,
              as: "empleado",
              attributes: ["nombre", "apellido", "numeroDocumento"],
            },
          ],
        },
        { model: db.Estado, as: "estadoDetalle", attributes: ["nombreEstado"] },
        {
          model: db.Servicio,
          as: "serviciosProgramados",
          attributes: ["idServicio", "nombre", "precio"],
          through: { attributes: [] },
        },
      ],
      order: [
        ["fecha", "DESC"],
        ["hora_inicio", "DESC"],
      ],
    });
  } catch (error) {
    console.error("Error al obtener todas las citas:", error.message);
    throw new CustomError(`Error al obtener citas: ${error.message}`, 500);
  }
};

/**
 * Obtiene una cita específica por su ID.
 */
const obtenerCitaPorId = async (idCita) => {
  const cita = await obtenerCitaCompletaPorIdInterno(idCita);
  if (!cita) {
    throw new NotFoundError("Cita no encontrada.");
  }
  return cita;
};

/**
 * Actualiza una cita existente.
 */
const actualizarCita = async (idCita, datosActualizar) => {
  const transaction = await db.sequelize.transaction();
  try {
    const cita = await db.Cita.findByPk(idCita, { transaction });
    if (!cita) {
      throw new NotFoundError("Cita no encontrada para actualizar.");
    }

    if (datosActualizar.servicios) {
      let nuevoPrecioTotal = 0;
      const serviciosConsultados = await db.Servicio.findAll({
        where: { idServicio: datosActualizar.servicios, estado: true },
        transaction,
      });
      if (serviciosConsultados.length !== datosActualizar.servicios.length) {
        throw new BadRequestError(
          "Uno o más servicios para actualizar no son válidos."
        );
      }
      serviciosConsultados.forEach((s) => {
        nuevoPrecioTotal += parseFloat(s.precio);
      });
      datosActualizar.precio_total = nuevoPrecioTotal;

      await cita.setServiciosProgramados(serviciosConsultados, { transaction });
    }

    await cita.update(datosActualizar, { transaction });
    await transaction.commit();

    return await obtenerCitaCompletaPorIdInterno(cita.idCita);
  } catch (error) {
    await transaction.rollback();
    console.error(`Error al actualizar la cita con ID ${idCita}:`, error);
    if (error instanceof NotFoundError || error instanceof BadRequestError)
      throw error;
    throw new CustomError(`Error al actualizar la cita: ${error.message}`, 500);
  }
};

/**
 * Elimina una cita de la base de datos (lógica blanda o dura).
 */
const eliminarCitaFisica = async (idCita) => {
  const cita = await db.Cita.findByPk(idCita);
  if (!cita) {
    throw new NotFoundError("Cita no encontrada para eliminar.");
  }
  const unaSemanaDespues = moment(cita.fecha).add(7, "days");
  if (moment().isBefore(unaSemanaDespues)) {
    throw new BadRequestError(
      "Una cita solo puede ser eliminada una semana después de su fecha de realización."
    );
  }
  await cita.destroy();
};

const cambiarEstadoCita = async (idCita, idEstado) => {
  const cita = await db.Cita.findByPk(idCita);
  if (!cita) {
    throw new NotFoundError("Cita no encontrada para actualizar el estado.");
  }
  await cita.update({ idEstado });
  return await obtenerCitaCompletaPorIdInterno(idCita);
};

/**
 * Obtiene citas por cliente específico (para móvil).
 */
const obtenerCitasPorCliente = async (idCliente, opciones = {}) => {
  const { pagina = 1, limite = 10, estado } = opciones;
  const offset = (pagina - 1) * limite;

  try {
    const whereClause = { idCliente };

    if (estado) {
      whereClause.idEstado = estado;
    }

    const { count, rows } = await db.Cita.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: db.Cliente,
          as: "cliente",
          attributes: ["idCliente", "nombre", "apellido", "numeroDocumento"],
        },
        {
          model: db.Usuario,
          as: "empleado",
          attributes: ["idUsuario"],
          include: [
            {
              model: db.Empleado,
              as: "empleado",
              attributes: ["nombre", "apellido", "numeroDocumento"],
            },
          ],
        },
        {
          model: db.Estado,
          as: "estadoDetalle",
          attributes: ["idEstado", "nombreEstado"],
        },
        {
          model: db.Servicio,
          as: "serviciosProgramados",
          attributes: ["idServicio", "nombre", "precio"],
          through: { attributes: [] },
        },
      ],
      order: [
        ["fecha", "DESC"],
        ["hora_inicio", "DESC"],
      ],
      limit: parseInt(limite),
      offset: parseInt(offset),
      distinct: true,
    });

    return {
      totalItems: count,
      totalPages: Math.ceil(count / limite),
      currentPage: parseInt(pagina),
      citas: rows,
    };
  } catch (error) {
    console.error("Error al obtener citas por cliente:", error.message);
    throw new CustomError(`Error al obtener citas: ${error.message}`, 500);
  }
};

/**
 * Permite a un cliente cancelar su cita.
 */
const cancelarCitaPorCliente = async (idCita, idCliente) => {
  const transaction = await db.sequelize.transaction();

  try {
    const cita = await db.Cita.findOne({
      where: { idCita, idCliente },
      include: [{ model: db.Estado, as: "estadoDetalle" }],
      transaction,
    });

    if (!cita) {
      throw new NotFoundError(
        "Cita no encontrada o no tienes permisos para cancelarla."
      );
    }

    // Solo permitir cancelar citas pendientes, confirmadas o en proceso
    const estadosPermitidos = ["Pendiente", "Confirmada", "En proceso"];
    if (!estadosPermitidos.includes(cita.estadoDetalle.nombreEstado)) {
      throw new BadRequestError(
        "Solo puedes cancelar citas que estén pendientes, confirmadas o en proceso."
      );
    }

    // Cambiar estado a cancelada (ID 4)
    await cita.update({ idEstado: 4 }, { transaction });

    await transaction.commit();

    return await obtenerCitaCompletaPorIdInterno(idCita);
  } catch (error) {
    await transaction.rollback();
    if (error instanceof NotFoundError || error instanceof BadRequestError) {
      throw error;
    }
    console.error(
      `Error al cancelar cita ${idCita} por cliente ${idCliente}:`,
      error.message
    );
    throw new CustomError(`Error al cancelar la cita: ${error.message}`, 500);
  }
};

module.exports = {
  crearCita,
  obtenerTodasLasCitas,
  obtenerCitaPorId,
  actualizarCita,
  eliminarCitaFisica,
  cambiarEstadoCita,
  obtenerCitasPorCliente,
  cancelarCitaPorCliente,
};
