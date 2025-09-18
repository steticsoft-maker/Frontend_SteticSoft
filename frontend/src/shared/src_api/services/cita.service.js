// src/services/cita.service.js
"use strict";

const db = require("../models");
const { Op } = db.Sequelize;
const {
  NotFoundError,
  ConflictError,
  CustomError,
  BadRequestError,
} = require("../errors");
const moment = require("moment-timezone");
const { enviarCorreoCita } = require('../utils/CitaEmailTemplate.js');
const { formatDateTime } = require('../utils/dateHelpers.js');

/**
 * Función interna unificada para obtener los detalles completos de una cita.
 * Corregida para usar los alias y atributos correctos de los modelos.
 */
const obtenerCitaCompletaPorIdInterno = async (idCita, transaction = null) => {
  return db.Cita.findByPk(idCita, {
    include: [
      {
        model: db.Cliente,
        as: "cliente",
        attributes: ["idCliente", "nombre", "apellido", "correo", "estado"],
      },
      {
        model: db.Usuario,
        as: "empleado", // Alias de la relación Cita -> Usuario
        attributes: ['idUsuario', 'correo'],
        include: [{
            model: db.Empleado,
            as: 'empleadoInfo', // Alias de la relación Usuario -> Empleado
            attributes: ['nombre', 'apellido']
        }]
      },
      {
        model: db.Estado,
        as: "estadoDetalle",
        attributes: ["idEstado", "nombreEstado"],
      },
      {
        model: db.Servicio,
        as: "serviciosProgramados",
        attributes: ["idServicio", "nombre", "precio", "descripcion"],
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
    const { fechaHora, clienteId, usuarioId, idEstado, novedadId, servicios = [] } = datosCita;

    if (!novedadId) throw new BadRequestError("Debes seleccionar una novedad de horario.");
    if (!usuarioId) throw new BadRequestError("Debes seleccionar un empleado.");
    if (!clienteId) throw new BadRequestError("Debes seleccionar un cliente.");
    if (!servicios || servicios.length === 0) throw new BadRequestError("Debes seleccionar al menos un servicio.");

      const transaction = await db.sequelize.transaction();
        try {
        // --- VALIDACIÓN DE DISPONIBILIDAD DEL EMPLEADO ---
        const estadoFinalizada = await db.Estado.findOne({ where: { nombreEstado: 'Finalizada' }, transaction });
        if (!estadoFinalizada) {
            throw new CustomError("El estado 'Finalizada' no está configurado en el sistema.", 500);
        }

        const citasActivasDelEmpleado = await db.Cita.count({
            where: {
                idUsuario: usuarioId,
                idEstado: { [Op.ne]: estadoFinalizada.idEstado }
            },
            transaction
        });

        if (citasActivasDelEmpleado > 0) {
            throw new ConflictError("El empleado seleccionado ya no está disponible. Por favor, actualice la página y seleccione otro.");
        }

        const nuevaCita = await db.Cita.create({
            fechaHora,
            idCliente: clienteId,
            idUsuario: usuarioId,
            idEstado,
            idNovedad,
            estado: true
        }, { transaction });

        await nuevaCita.addServiciosProgramados(serviciosConsultados, { transaction });
        await transaction.commit();
        
        const citaCreadaConDetalles = await obtenerCitaCompletaPorIdInterno(nuevaCita.idCita);

        if (citaCreadaConDetalles && citaCreadaConDetalles.cliente?.correo) {
            try {
                const fechaHoraParaCorreo = moment(`${citaCreadaConDetalles.fecha} ${citaCreadaConDetalles.hora_inicio}`).toDate();

                await enviarCorreoCita({
                    correo: citaCreadaConDetalles.cliente.correo,
                    nombreCliente: citaCreadaConDetalles.cliente.nombre,
                    citaInfo: {
                        accion: 'agendada',
                        fechaHora: formatDateTime(fechaHoraParaCorreo),
                        empleado: citaCreadaConDetalles.empleado?.empleado?.nombre || 'No asignado',
                        estado: citaCreadaConDetalles.estadoDetalle?.nombreEstado || 'Pendiente',
                        servicios: citaCreadaConDetalles.serviciosProgramados,
                        total: citaCreadaConDetalles.precio_total,
                    }
                });
            } catch (emailError) {
                console.error(`Cita ${nuevaCita.idCita} creada, pero falló el envío de correo:`, emailError);
            }
        }

        return citaCreadaConDetalles;

    } catch (error) {
        await transaction.rollback();
        console.error("Error al crear la cita en el servicio:", error);
        if (error instanceof BadRequestError) throw error;
        throw new CustomError(`Error al crear la cita: ${error.message}`, 500);
    }
};

/**
 * Obtiene una lista de todas las citas.
 */
const obtenerTodasLasCitas = async (opcionesDeFiltro = {}) => {
  try {
    const { idEstado, search, estado } = opcionesDeFiltro;
    const whereClause = {};
    
    // Filtro por estado del proceso (Pendiente, Confirmada, etc.)
    if (idEstado) whereClause.idEstado = idEstado;

    // Filtro por estado de la cita (activa/inactiva-cancelada)
    if (estado === 'true' || estado === 'false') {
        whereClause.estado = estado === 'true';
    } else if (estado === 'activa') { // Añadido para manejar el estado "activa"
        whereClause.estado = true;
    }

    // Lógica de búsqueda por texto en múltiples campos
    if (search) {
        whereClause[Op.or] = [
            db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('cliente.nombre')), { [Op.like]: `%${search.toLowerCase()}%` }),
            db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('cliente.apellido')), { [Op.like]: `%${search.toLowerCase()}%` }),
            db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('empleado->empleadoInfo.nombre')), { [Op.like]: `%${search.toLowerCase()}%` }),
            db.sequelize.where(db.sequelize.fn('LOWER', db.sequelize.col('empleado->empleadoInfo.apellido')), { [Op.like]: `%${search.toLowerCase()}%` }),
            db.sequelize.where(db.sequelize.cast(db.col('Cita.fechaHora'), 'text'), { [Op.iLike]: `%${search}%` })
        ];
    }

    return await db.Cita.findAll({
      where: whereClause,
      include: [
        { model: db.Cliente, as: "cliente", attributes: ["nombre", "apellido"] },
        {
          model: db.Usuario,
          as: "empleado",
          attributes: ['idUsuario'],
          include: [{ model: db.Empleado, as: 'empleadoInfo', attributes: ['nombre', 'apellido'] }]
        },
        { model: db.Estado, as: "estadoDetalle", attributes: ["nombreEstado"] },
      ],
      order: [["fechaHora", "DESC"]],
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

        // Si se actualizan los servicios, hay que recalcular el precio total
        if (datosActualizar.servicios) {
            let nuevoPrecioTotal = 0;
            const serviciosConsultados = await db.Servicio.findAll({
                where: { idServicio: datosActualizar.servicios, estado: true }, transaction
            });
            if (serviciosConsultados.length !== datosActualizar.servicios.length) {
                throw new BadRequestError("Uno o más servicios para actualizar no son válidos.");
            }
            serviciosConsultados.forEach(s => {
                nuevoPrecioTotal += parseFloat(s.precio);
            });
            datosActualizar.precio_total = nuevoPrecioTotal;

            // Actualiza la tabla de unión
            await cita.setServiciosProgramados(serviciosConsultados, { transaction });
        }

        await cita.update(datosActualizar, { transaction });
        await transaction.commit();

        return await obtenerCitaCompletaPorIdInterno(cita.idCita);

    } catch (error) {
        await transaction.rollback();
        console.error(`Error al actualizar la cita con ID ${idCita}:`, error);
        if (error instanceof NotFoundError || error instanceof BadRequestError) throw error;
        throw new CustomError(`Error al actualizar la cita: ${error.message}`, 500);
    }
};

/**
 * Elimina una cita de la base de datos.
 */
const eliminarCitaFisica = async (idCita) => {
    const cita = await db.Cita.findByPk(idCita);
    if (!cita) {
        throw new NotFoundError("Cita no encontrada para eliminar.");
    }
    const unaSemanaDespues = moment(cita.fecha).add(7, 'days');
    if (moment().isBefore(unaSemanaDespues)) {
        throw new BadRequestError("Una cita solo puede ser eliminada una semana después de su fecha de realización.");
    }
    await cita.destroy();
};

module.exports = {
  crearCita,
  obtenerTodasLasCitas,
  obtenerCitaPorId,
  actualizarCita,
  eliminarCitaFisica,
};