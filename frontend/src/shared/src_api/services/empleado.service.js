// src/services/empleado.service.js
const bcrypt = require("bcrypt");
const db = require("../models");
const { Op } = db.Sequelize;
const {
  NotFoundError,
  ConflictError,
  CustomError,
  BadRequestError,
} = require("../errors");

const saltRounds = 10;

/**
 * Helper interno para cambiar el estado de un empleado (perfil).
 */
const cambiarEstadoEmpleado = async (idEmpleado, nuevoEstado) => {
  const empleado = await db.Empleado.findByPk(idEmpleado);
  if (!empleado) {
    throw new NotFoundError("Empleado no encontrado para cambiar estado.");
  }
  if (empleado.estado === nuevoEstado) {
    return empleado;
  }
  await empleado.update({ estado: nuevoEstado });
  return empleado;
};

/**
 * Crea un nuevo perfil de Empleado y su cuenta de Usuario asociada.
 */
const crearEmpleado = async (datosCompletosEmpleado) => {
  console.log("DEBUG (empleado.service): Iniciando crearEmpleado con:", datosCompletosEmpleado);
  const {
    correo, contrasena, nombre, apellido, telefono,
    tipoDocumento, numeroDocumento, fechaNacimiento, estadoEmpleado
  } = datosCompletosEmpleado;

  if (!correo || !contrasena || !nombre || !apellido || !telefono || !tipoDocumento || !numeroDocumento || !fechaNacimiento) {
    throw new BadRequestError("Faltan campos obligatorios para crear el empleado y su cuenta de usuario.");
  }

  let usuarioExistente = await db.Usuario.findOne({ where: { correo } });
  if (usuarioExistente) {
    throw new ConflictError(`El correo electrónico '${correo}' ya está registrado para una cuenta de Usuario.`);
  }

  let empleadoExistenteCorreo = await db.Empleado.findOne({ where: { correo } });
  if (empleadoExistenteCorreo) {
    throw new ConflictError(`El correo electrónico '${correo}' ya está registrado para otro perfil de empleado.`);
  }

  let empleadoExistenteNumeroDoc = await db.Empleado.findOne({ where: { numeroDocumento } });
  if (empleadoExistenteNumeroDoc) {
    throw new ConflictError(`El número de documento '${numeroDocumento}' ya está registrado para otro empleado.`);
  }
  
  const rolEmpleado = await db.Rol.findOne({ where: { nombre: "Empleado" } });
  if (!rolEmpleado) {
    throw new CustomError("El rol 'Empleado' no está configurado en el sistema.", 500);
  }

  const transaction = await db.sequelize.transaction();
  try {
    const contrasenaHasheada = await bcrypt.hash(contrasena, saltRounds);
    const datosUsuario = {
      correo,
      contrasena: contrasenaHasheada,
      idRol: rolEmpleado.idRol,
      estado: datosCompletosEmpleado.estadoUsuario !== undefined ? datosCompletosEmpleado.estadoUsuario : true,
    };
    console.log("DEBUG (empleado.service): Datos para crear el usuario:", datosUsuario);
    const nuevoUsuario = await db.Usuario.create(datosUsuario, { transaction });
    console.log("DEBUG (empleado.service): Resultado de la creación del usuario:", nuevoUsuario ? nuevoUsuario.toJSON() : "Falló la creación del usuario");

    const datosEmpleado = {
      idUsuario: nuevoUsuario.idUsuario,
      nombre,
      apellido,
      correo,
      telefono,
      tipoDocumento,
      numeroDocumento,
      fechaNacimiento,
      estado: datosCompletosEmpleado.estadoEmpleado !== undefined ? datosCompletosEmpleado.estadoEmpleado : true,
    };
    console.log("DEBUG (empleado.service): Datos para crear el empleado:", datosEmpleado);
    const nuevoEmpleado = await db.Empleado.create(datosEmpleado, { transaction });
    console.log("DEBUG (empleado.service): Resultado de la creación del empleado:", nuevoEmpleado ? nuevoEmpleado.toJSON() : "Falló la creación del empleado");

    await transaction.commit();
    
    return db.Empleado.findByPk(nuevoEmpleado.idEmpleado, {
        include: [{ 
            // --- INICIO DE LA CORRECCIÓN ---
            model: db.Usuario, 
            as: "usuario", // Alias corregido de 'cuentaUsuario' a 'usuario'
            // --- FIN DE LA CORRECCIÓN ---
            attributes: ["idUsuario", "correo", "estado", "idRol"],
            include: [{ model: db.Rol, as: "rol", attributes: ["nombre"]}]
        }]
    });

  } catch (error) {
    await transaction.rollback();
    if (error instanceof ConflictError || error instanceof BadRequestError || error instanceof CustomError) {
      throw error;
    }
    if (error.name === "SequelizeUniqueConstraintError") {
      let mensajeConflicto =
        "Uno de los datos proporcionados ya está en uso (correo o número de documento).";
      if (error.fields) {
        if (error.fields.correo && error.fields.correo === correo)
          mensajeConflicto = `El correo electrónico '${correo}' ya está registrado.`;
        if (
          error.fields.numerodocumento &&
          error.fields.numerodocumento === numeroDocumento
        )
          mensajeConflicto = `El número de documento '${numeroDocumento}' ya está registrado.`;
      }
      throw new ConflictError(mensajeConflicto);
    }
    throw new CustomError(`Error al crear el empleado: ${error.message}`, 500);
  }
};

/**
 * Get all employees, including their User account information.
 */
const obtenerTodosLosEmpleados = async (opcionesDeFiltro = {}) => {
  try {
    const empleados = await db.Empleado.findAll({
      where: opcionesDeFiltro,
      include: [
        {
          // --- INICIO DE LA CORRECCIÓN ---
          model: db.Usuario,
          as: "usuario", // Alias corregido de 'cuentaUsuario' a 'usuario'
          // --- FIN DE LA CORRECCIÓN ---
          attributes: ["idUsuario", "correo", "estado", "idRol"],
          include: [{
            model: db.Rol,
            as: "rol",
            attributes: ["nombre"]
          }]
        },
      ],
      order: [["apellido", "ASC"], ["nombre", "ASC"]],
    });
    return empleados;
  } catch (error) {
    throw new CustomError(`Error al obtener empleados: ${error.message}`, 500);
  }
};

/**
 * Get an employee by their ID, including their User account information.
 */
const obtenerEmpleadoPorId = async (idEmpleado) => {
  try {
    const empleado = await db.Empleado.findByPk(idEmpleado, {
      include: [
        {
          // --- INICIO DE LA CORRECCIÓN ---
          model: db.Usuario,
          as: "usuario", // Alias corregido de 'cuentaUsuario' a 'usuario'
          // --- FIN DE LA CORRECCIÓN ---
          attributes: ["idUsuario", "correo", "estado", "idRol"],
            include: [{
            model: db.Rol,
            as: "rol",
            attributes: ["nombre"]
          }]
        },
      ],
    });
    if (!empleado) {
      throw new NotFoundError("Empleado no encontrado.");
    }
    return empleado;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new CustomError(`Error al obtener el empleado: ${error.message}`, 500);
  }
};

/**
 * Update an existing employee and, optionally, their associated User account.
 */
const actualizarEmpleado = async (idEmpleado, datosActualizar) => {
  const transaction = await db.sequelize.transaction();
  try {
    const empleado = await db.Empleado.findByPk(idEmpleado, { transaction });
    if (!empleado) {
      await transaction.rollback();
      throw new NotFoundError("Empleado no encontrado para actualizar.");
    }

    const datosParaEmpleado = {};
    const datosParaUsuario = {};

    if (datosActualizar.hasOwnProperty('nombre')) datosParaEmpleado.nombre = datosActualizar.nombre;
    if (datosActualizar.hasOwnProperty('apellido')) datosParaEmpleado.apellido = datosActualizar.apellido;
    if (datosActualizar.hasOwnProperty('telefono')) datosParaEmpleado.telefono = datosActualizar.telefono;
    if (datosActualizar.hasOwnProperty('tipoDocumento')) datosParaEmpleado.tipoDocumento = datosActualizar.tipoDocumento;
    if (datosActualizar.hasOwnProperty('numeroDocumento')) datosParaEmpleado.numeroDocumento = datosActualizar.numeroDocumento;
    if (datosActualizar.hasOwnProperty('fechaNacimiento')) datosParaEmpleado.fechaNacimiento = datosActualizar.fechaNacimiento;
    if (datosActualizar.hasOwnProperty('estadoEmpleado')) datosParaEmpleado.estado = datosActualizar.estadoEmpleado;

    if (datosActualizar.hasOwnProperty('correo')) {
      datosParaEmpleado.correo = datosActualizar.correo;
      datosParaUsuario.correo = datosActualizar.correo;
    }
    if (datosActualizar.hasOwnProperty('estadoUsuario')) datosParaUsuario.estado = datosActualizar.estadoUsuario;

    if (datosParaEmpleado.numeroDocumento && datosParaEmpleado.numeroDocumento !== empleado.numeroDocumento) {
      const otroEmpleadoConDocumento = await db.Empleado.findOne({ where: { numeroDocumento: datosParaEmpleado.numeroDocumento, idEmpleado: { [Op.ne]: idEmpleado } }, transaction });
      if (otroEmpleadoConDocumento) {
        await transaction.rollback();
        throw new ConflictError(`El número de documento '${datosParaEmpleado.numeroDocumento}' ya está registrado para otro empleado.`);
      }
    }
    if (datosParaEmpleado.correo && datosParaEmpleado.correo !== empleado.correo) {
      const otroEmpleadoConCorreo = await db.Empleado.findOne({ where: { correo: datosParaEmpleado.correo, idEmpleado: { [Op.ne]: idEmpleado } }, transaction });
      if (otroEmpleadoConCorreo) {
        await transaction.rollback();
        throw new ConflictError(`El correo electrónico '${datosParaEmpleado.correo}' ya está registrado para otro perfil de empleado.`);
      }
    }
    
    if (Object.keys(datosParaEmpleado).length > 0) {
      await empleado.update(datosParaEmpleado, { transaction });
    }

    if (empleado.idUsuario && Object.keys(datosParaUsuario).length > 0) {
      const usuario = await db.Usuario.findByPk(empleado.idUsuario, { transaction });
      if (usuario) {
        if (datosParaUsuario.correo && datosParaUsuario.correo !== usuario.correo) {
          const otroUsuarioConCorreo = await db.Usuario.findOne({
            where: { correo: datosParaUsuario.correo, idUsuario: { [Op.ne]: empleado.idUsuario } },
          });
          if (otroUsuarioConCorreo) {
            await transaction.rollback();
            throw new ConflictError(`El correo electrónico '${datosParaUsuario.correo}' ya está en uso por otra cuenta de usuario.`);
          }
        }
        await usuario.update(datosParaUsuario, { transaction });
      }
    }

    await transaction.commit();
    return obtenerEmpleadoPorId(empleado.idEmpleado);
  } catch (error) {
    await transaction.rollback();
    if (error instanceof NotFoundError || error instanceof ConflictError || error instanceof BadRequestError || error instanceof CustomError) throw error;
    if (error.name === "SequelizeUniqueConstraintError") {
      const constraintField = error.errors && error.errors[0] ? error.errors[0].path : "a unique field";
      throw new ConflictError(`Uniqueness error. A record with the same value for '${constraintField}' already exists.`);
    }
    throw new CustomError(`Error al actualizar el empleado: ${error.message}`, 500);
  }
};

/**
 * Disable an employee (logical deletion, sets status = false in Employee).
 */
const anularEmpleado = async (idEmpleado) => {
  try {
    return await cambiarEstadoEmpleado(idEmpleado, false);
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new CustomError(`Error al anular el empleado: ${error.message}`, 500);
  }
};

/**
 * Enable an employee (changes status = true in Employee).
 */
const habilitarEmpleado = async (idEmpleado) => {
  try {
    return await cambiarEstadoEmpleado(idEmpleado, true);
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new CustomError(`Error al habilitar el empleado: ${error.message}`, 500);
  }
};

/**
 * Physically delete an employee from the database.
 */
const eliminarEmpleadoFisico = async (idEmpleado) => {
  try {
    const empleado = await db.Empleado.findByPk(idEmpleado);
    if (!empleado) {
      throw new NotFoundError("Empleado no encontrado para eliminar físicamente.");
    }
    const filasEliminadas = await db.Empleado.destroy({ where: { idEmpleado } });
    return filasEliminadas > 0;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    if (error.name === "SequelizeForeignKeyConstraintError") {
      throw new ConflictError("Cannot delete employee due to existing references (e.g., Appointments, Supplies). Consider disabling them instead.");
    }
    throw new CustomError(`Error al eliminar físicamente el empleado: ${error.message}`, 500);
  }
};

/**
 * Get all ACTIVE employees, including their User account information.
 */
const obtenerEmpleadosActivos = async () => {
  try {
    const empleados = await db.Empleado.findAll({
      where: { estado: true },
      include: [
        {
          // --- INICIO DE LA CORRECCIÓN ---
          model: db.Usuario,
          as: "usuario", // Alias corregido de 'cuentaUsuario' a 'usuario'
          // --- FIN DE LA CORRECCIÓN ---
          attributes: ["idUsuario", "correo", "estado", "idRol"],
          where: { estado: true },
          include: [{
            model: db.Rol,
            as: "rol",
            attributes: ["nombre"]
          }]
        }
      ],
      order: [["apellido", "ASC"], ["nombre", "ASC"]],
    });
    return empleados;
  } catch (error) {
    throw new CustomError(`Error al obtener empleados activos: ${error.message}`, 500);
  }
};

module.exports = {
  crearEmpleado,
  obtenerTodosLosEmpleados,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  anularEmpleado,
  habilitarEmpleado,
  eliminarEmpleadoFisico,
  cambiarEstadoEmpleado,
  obtenerEmpleadosActivos,
};