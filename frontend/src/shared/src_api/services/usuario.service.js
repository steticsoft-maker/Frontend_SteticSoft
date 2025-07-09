// src/services/usuario.service.js

const bcrypt = require("bcrypt");
const db = require("../models"); // Correcto: Todos los modelos están en el objeto 'db'
const { Op } = db.Sequelize;
const {
  NotFoundError,
  ConflictError,
  CustomError,
  BadRequestError,
} = require("../errors");

const saltRounds = 10;

/**
 * Internal helper to change a user's status.
 */
const cambiarEstadoUsuario = async (idUsuario, nuevoEstado) => {
  const usuario = await db.Usuario.findByPk(idUsuario);
  if (!usuario) {
    throw new NotFoundError("User not found to change status.");
  }
  if (usuario.estado === nuevoEstado) {
    const { contrasena: _, ...usuarioSinCambio } = usuario.toJSON();
    return usuarioSinCambio;
  }
  await usuario.update({ estado: nuevoEstado });
  const { contrasena: _, ...usuarioActualizado } = usuario.toJSON();
  return usuarioActualizado;
};

// --- INICIO DE CORRECCIÓN ---

/**
 * @function crearUsuario
 * @description Crea un nuevo usuario, su perfil asociado (Cliente o Empleado) según el tipo de rol,
 * y devuelve el objeto completo del usuario con sus asociaciones.
 * @param {object} usuarioData - Datos del usuario y su perfil.
 * @returns {Promise<object>} El objeto del usuario recién creado con todas sus relaciones.
 */
const crearUsuario = async (usuarioData) => {
  const {
    email,
    password,
    rolId,
    nombres,
    apellidos,
    telefono,
    tipoDocumento,
    numeroDocumento,
    fechaNacimiento,
  } = usuarioData;

  // PASO 1: Verificar la existencia del rol ANTES de la transacción.
  const rol = await db.Rol.findByPk(rolId);
  if (!rol) {
    throw new NotFoundError("El rol especificado no existe o no está activo.");
  }

  // PASO 2: Iniciar la transacción SOLO para las operaciones de escritura.
  const t = await db.sequelize.transaction();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const nuevoUsuario = await db.Usuario.create(
      {
        email,
        contrasena: hashedPassword, // Corregido para usar el nombre de campo correcto del modelo
        idRol: rolId,
      },
      { transaction: t }
    );

    // La creación del perfil permanece igual, ya era correcta.
    if (rol.tipoPerfil === "CLIENTE") {
      await db.Cliente.create(
        {
          nombres,
          apellidos,
          telefono,
          correo: email,
          tipoDocumento,
          numeroDocumento,
          fechaNacimiento,
          idUsuario: nuevoUsuario.idUsuario, // Usamos la PK correcta del usuario creado
        },
        { transaction: t }
      );
    } else if (rol.tipoPerfil === "EMPLEADO") {
      await db.Empleado.create(
        {
          nombres,
          apellidos,
          telefono,
          correo: email,
          tipoDocumento,
          numeroDocumento,
          fechaNacimiento,
          idUsuario: nuevoUsuario.idUsuario, // Usamos la PK correcta del usuario creado
        },
        { transaction: t }
      );
    }

    await t.commit();

    // Devolvemos el usuario completo después de la creación exitosa.
    const usuarioCompleto = await db.Usuario.findByPk(nuevoUsuario.idUsuario, {
      include: [
        { model: db.Rol, as: "rol" },
        { model: db.Cliente, as: "clienteInfo" },
        { model: db.Empleado, as: "empleadoInfo" },
      ],
      attributes: { exclude: ["contrasena"] },
    });

    return usuarioCompleto;
  } catch (error) {
    await t.rollback();
    console.error("Error al crear el usuario:", error);
    throw new Error(`Error en el servicio al crear usuario: ${error.message}`);
  }
};


/**
 * Get all users with their role and associated Client/Employee profile.
 */
const obtenerTodosLosUsuarios = async (opcionesDeFiltro = {}) => {
  try {
    const usuarios = await db.Usuario.findAll({
      where: opcionesDeFiltro,
      attributes: ["idUsuario", "correo", "estado", "idRol"],
      include: [
        {
          model: db.Rol,
          as: "rol",
          attributes: ["idRol", "nombre"],
        },
        {
          model: db.Cliente,
          as: "clienteInfo",
          attributes: [
            "idCliente",
            "nombre",
            "apellido",
            "correo",
            "telefono",
            "tipoDocumento",
            "numeroDocumento",
            "fechaNacimiento",
          ],
          required: false,
        },
        {
          model: db.Empleado,
          as: "empleadoInfo",
          attributes: [
            "idEmpleado",
            "nombre",
            "apellido",
            "correo",
            "telefono",
            "tipoDocumento",
            "numeroDocumento",
            "fechaNacimiento",
          ],
          required: false,
        },
      ],
      order: [["idUsuario", "ASC"]],
    });
    return usuarios;
  } catch (error) {
    throw new CustomError(`Error al get users: ${error.message}`, 500);
  }
};

/**
 * Get a user by their ID, including their role and Client/Employee profile.
 */
const obtenerUsuarioPorId = async (idUsuario) => {
  try {
    const usuario = await db.Usuario.findByPk(idUsuario, {
      attributes: ["idUsuario", "correo", "estado", "idRol"],
      include: [
        { model: db.Rol, as: "rol", attributes: ["idRol", "nombre"] },
        { model: db.Cliente, as: "clienteInfo", required: false },
        { model: db.Empleado, as: "empleadoInfo", required: false },
      ],
    });
    if (!usuario) {
      throw new NotFoundError("User not found.");
    }
    return usuario;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new CustomError(`Error al get user: ${error.message}`, 500);
  }
};

/**
 * Update an existing user and their associated profile.
 */
const actualizarUsuario = async (idUsuario, datosActualizar) => {
  const transaction = await db.sequelize.transaction();
  try {
    const usuario = await db.Usuario.findByPk(idUsuario, { transaction });
    if (!usuario) {
      await transaction.rollback();
      throw new NotFoundError("User not found to update.");
    }

    const datosParaUsuario = {};
    const datosParaPerfil = {};

    // Separar datos para Usuario y Perfil
    for (const key in datosActualizar) {
      if (["correo", "idRol", "estado", "contrasena"].includes(key)) {
        datosParaUsuario[key] = datosActualizar[key];
      } else {
        datosParaPerfil[key] = datosActualizar[key];
      }
    }

    if (datosParaUsuario.correo && datosParaUsuario.correo !== usuario.correo) {
      const existe = await db.Usuario.findOne({
        where: {
          correo: datosParaUsuario.correo,
          idUsuario: { [Op.ne]: idUsuario },
        },
        transaction,
      });
      if (existe) {
        await transaction.rollback();
        throw new ConflictError(
          `The email address '${datosParaUsuario.correo}' is already registered.`
        );
      }
    }

    if (datosParaUsuario.contrasena) {
      datosParaUsuario.contrasena = await bcrypt.hash(
        datosParaUsuario.contrasena,
        saltRounds
      );
    }

    if (Object.keys(datosParaUsuario).length > 0) {
      await usuario.update(datosParaUsuario, { transaction });
    }

    const rolActual = await db.Rol.findByPk(usuario.idRol, { transaction });

    if (Object.keys(datosParaPerfil).length > 0) {
      if (rolActual.tipoPerfil === "CLIENTE") {
        const cliente = await db.Cliente.findOne({
          where: { usuarioId: idUsuario },
          transaction,
        });
        if (cliente) await cliente.update(datosParaPerfil, { transaction });
      } else if (rolActual.tipoPerfil === "EMPLEADO") {
        const empleado = await db.Empleado.findOne({
          where: { usuarioId: idUsuario },
          transaction,
        });
        if (empleado) await empleado.update(datosParaPerfil, { transaction });
      }
    }

    await transaction.commit();
    return obtenerUsuarioPorId(idUsuario);
  } catch (error) {
    await transaction.rollback();
    if (
      error instanceof NotFoundError ||
      error instanceof ConflictError ||
      error instanceof BadRequestError
    )
      throw error;
    throw new CustomError(`Error al update user: ${error.message}`, 500);
  }
};

/**
 * Disable a user (logical deletion, sets status = false).
 */
const anularUsuario = async (idUsuario) => {
  try {
    return await cambiarEstadoUsuario(idUsuario, false);
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new CustomError(`Error al disable user: ${error.message}`, 500);
  }
};

/**
 * Enable a user (changes status = true).
 */
const habilitarUsuario = async (idUsuario) => {
  try {
    return await cambiarEstadoUsuario(idUsuario, true);
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    throw new CustomError(`Error al enable user: ${error.message}`, 500);
  }
};

/**
 * Physically delete a user from the database.
 */
const eliminarUsuarioFisico = async (idUsuario) => {
  const transaction = await db.sequelize.transaction();
  try {
    const usuario = await db.Usuario.findByPk(idUsuario, { transaction });
    if (!usuario) {
      await transaction.rollback();
      throw new NotFoundError("User not found to physically delete.");
    }

    // Antes de borrar el usuario, borramos su perfil asociado para evitar errores de FK.
    const rol = await db.Rol.findByPk(usuario.idRol, { transaction });
    if (rol.tipoPerfil === "CLIENTE") {
      await db.Cliente.destroy({
        where: { usuarioId: idUsuario },
        transaction,
      });
    } else if (rol.tipoPerfil === "EMPLEADO") {
      await db.Empleado.destroy({
        where: { usuarioId: idUsuario },
        transaction,
      });
    }

    const filasEliminadas = await db.Usuario.destroy({
      where: { idUsuario },
      transaction,
    });

    await transaction.commit();
    return filasEliminadas > 0;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof NotFoundError || error instanceof ConflictError) {
      throw error;
    }
    throw new CustomError(
      `Error al physically delete user: ${error.message}`,
      500
    );
  }
};

module.exports = {
  crearUsuario,
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  anularUsuario,
  habilitarUsuario,
  eliminarUsuarioFisico,
  cambiarEstadoUsuario,
};
