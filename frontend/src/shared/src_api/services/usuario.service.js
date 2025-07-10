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
 * Internal helper to change a user's status and its associated profile.
 * This function does NOT modify the password.
 */
const cambiarEstadoUsuarioInternal = async (idUsuario, nuevoEstado, transactionExt = null) => {
  const usuarioIdNumerico = Number(idUsuario);
  if (isNaN(usuarioIdNumerico)) {
    throw new BadRequestError(
      "El ID de usuario proporcionado no es un número válido para cambiar estado."
    );
  }

  const t = transactionExt || (await db.sequelize.transaction());
  try {
    const usuario = await db.Usuario.findByPk(usuarioIdNumerico, { transaction: t });
    if (!usuario) {
      if (!transactionExt) await t.rollback();
      throw new NotFoundError(
        `Usuario con ID ${usuarioIdNumerico} no encontrado para cambiar estado.`
      );
    }

    // Protección para el rol de Administrador si se intenta desactivar
    if (nuevoEstado === false) {
        const rolUsuario = await db.Rol.findByPk(usuario.idRol, { transaction: t });
        if (rolUsuario && rolUsuario.nombre === "Administrador") {
            if (!transactionExt) await t.rollback();
            throw new CustomError(
                "El estado del usuario Administrador no puede ser cambiado a inactivo.",
                403
            );
        }
    }

    if (usuario.estado === nuevoEstado) {
      if (!transactionExt) await t.commit(); // Commit if transaction is local
      const { contrasena: _, ...usuarioSinCambio } = usuario.toJSON();
      return usuarioSinCambio;
    }

    await usuario.update({ estado: nuevoEstado }, { transaction: t });

    // Actualizar estado del perfil asociado si existe
    const rol = await db.Rol.findByPk(usuario.idRol, { transaction: t });
    if (rol && (rol.tipoPerfil === "CLIENTE" || rol.tipoPerfil === "EMPLEADO")) {
      const perfilData = { estado: nuevoEstado };
      const commonWhere = { idUsuario: usuarioIdNumerico };

      if (rol.tipoPerfil === "CLIENTE") {
        const cliente = await db.Cliente.findOne({
          where: commonWhere,
          transaction: t,
        });
        if (cliente) await cliente.update(perfilData, { transaction: t });
      } else if (rol.tipoPerfil === "EMPLEADO") {
        const empleado = await db.Empleado.findOne({
          where: commonWhere,
          transaction: t,
        });
        if (empleado) await empleado.update(perfilData, { transaction: t });
      }
    }
    if (!transactionExt) await t.commit();
    const { contrasena: _, ...usuarioActualizado } = usuario.toJSON();
    return usuarioActualizado;
  } catch (error) {
    if (!transactionExt) await t.rollback();
    console.error(
      `[usuario.service.js] Error al cambiar estado del usuario ${usuarioIdNumerico}:`,
      error
    );
    // Preserve specific error types if they are already CustomError or NotFoundError
    if (error instanceof CustomError || error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
    }
    throw new CustomError(
      `Error al cambiar el estado del usuario: ${error.message}`,
      error.statusCode || 500
    );
  }
};


/**
 * Toggles a user's state (active <-> inactive) without altering the password.
 * Also updates the associated profile's state.
 */
const toggleUsuarioEstado = async (idUsuario) => {
  const usuarioIdNumerico = Number(idUsuario);
  if (isNaN(usuarioIdNumerico)) {
    throw new BadRequestError("El ID de usuario proporcionado no es un número válido.");
  }
  const usuario = await db.Usuario.findByPk(usuarioIdNumerico);
  if (!usuario) {
    throw new NotFoundError(`Usuario con ID ${usuarioIdNumerico} no encontrado.`);
  }
  // Determine the new state by inverting the current state
  const nuevoEstado = !usuario.estado;
  return await cambiarEstadoUsuarioInternal(idUsuario, nuevoEstado);
};


/**
 * @function crearUsuario
 * @description Crea un nuevo usuario, su perfil asociado (Cliente o Empleado) según el tipo de rol,
 * y devuelve el objeto completo del usuario con sus asociaciones.
 * @param {object} usuarioData - Datos del usuario y su perfil.
 * @returns {Promise<object>} El objeto del usuario recién creado con todas sus relaciones.
 */
const crearUsuario = async (usuarioData) => {
  const {
    correo,
    contrasena,
    idRol,
    nombre,
    apellido,
    telefono,
    tipoDocumento,
    numeroDocumento,
    fechaNacimiento,
    estado,
  } = usuarioData;

  const rolIdNumerico = Number(idRol);
  if (isNaN(rolIdNumerico)) {
    throw new BadRequestError(
      "El ID del rol proporcionado no es un número válido."
    );
  }

  const rol = await db.Rol.findOne({
    where: { idRol: rolIdNumerico, estado: true },
  });
  if (!rol) {
    console.error(
      `[usuario.service.js] Rol no encontrado o inactivo para idRol: ${rolIdNumerico}`
    );
    throw new NotFoundError(
      `El rol especificado con ID ${rolIdNumerico} no existe o no está activo.`
    );
  }

  if (rol.nombre === "Administrador") {
    const adminExistente = await db.Usuario.findOne({
      where: { idRol: rolIdNumerico },
    });
    if (adminExistente) {
      throw new ConflictError(
        "Ya existe un usuario Administrador. No se pueden crear más con este rol."
      );
    }
  }

  const t = await db.sequelize.transaction();
  try {
    const usuarioExistenteCorreo = await db.Usuario.findOne({
      where: { correo },
      transaction: t,
    });
    if (usuarioExistenteCorreo) {
      await t.rollback();
      throw new ConflictError("El correo electrónico ya está registrado.");
    }

    // Solo dependemos de tipoPerfil
    const requierePerfil = ["CLIENTE", "EMPLEADO"].includes(rol.tipoPerfil);

    if (requierePerfil && numeroDocumento) {
      if (rol.tipoPerfil === "CLIENTE") {
        const clienteExistente = await db.Cliente.findOne({
          where: { numeroDocumento },
          transaction: t,
        });
        if (clienteExistente) {
          await t.rollback();
          throw new ConflictError(
            "El número de documento ya está registrado para un cliente."
          );
        }
      } else if (rol.tipoPerfil === "EMPLEADO") {
        const empleadoExistente = await db.Empleado.findOne({
          where: { numeroDocumento },
          transaction: t,
        });
        if (empleadoExistente) {
          await t.rollback();
          throw new ConflictError(
            "El número de documento ya está registrado para un empleado."
          );
        }
      }
    }

    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(contrasena, salt);

    const nuevoUsuario = await db.Usuario.create(
      {
        correo,
        contrasena: hashedPassword,
        idRol: rolIdNumerico,
        estado: typeof estado === "boolean" ? estado : true,
      },
      { transaction: t }
    );

    if (requierePerfil) {
      const perfilData = {
        nombre,
        apellido,
        telefono,
        correo: nuevoUsuario.correo,
        tipoDocumento,
        numeroDocumento,
        fechaNacimiento,
        idUsuario: nuevoUsuario.idUsuario, // CORRECCIÓN: Usar 'idUsuario' para coincidir con el modelo Sequelize
        estado: nuevoUsuario.estado,
      };

      if (rol.tipoPerfil === "CLIENTE") {
        if (
          !nombre ||
          !apellido ||
          !telefono ||
          !tipoDocumento ||
          !numeroDocumento ||
          !fechaNacimiento
        ) {
          await t.rollback();
          throw new BadRequestError(
            "Para el perfil CLIENTE, los campos de perfil (nombre, apellido, teléfono, tipo/número de documento, fecha de nacimiento) son requeridos."
          );
        }
        await db.Cliente.create(perfilData, { transaction: t });
      } else if (rol.tipoPerfil === "EMPLEADO") {
        if (
          !nombre ||
          !apellido ||
          !telefono ||
          !tipoDocumento ||
          !numeroDocumento ||
          !fechaNacimiento
        ) {
          await t.rollback();
          throw new BadRequestError(
            "Para el perfil EMPLEADO, los campos de perfil (nombre, apellido, teléfono, tipo/número de documento, fecha de nacimiento) son requeridos."
          );
        }
        await db.Empleado.create(perfilData, { transaction: t });
      }
    }

    await t.commit();

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
    console.error(
      "[usuario.service.js] Error al crear el usuario:",
      error.message,
      error.stack
    );
    if (
      error instanceof NotFoundError ||
      error instanceof ConflictError ||
      error instanceof BadRequestError ||
      error instanceof CustomError
    ) {
      throw error;
    }
    throw new CustomError(
      `Error en el servicio al crear usuario: ${error.message}`,
      500
    );
  }
};

/**
 * Verifica si un correo electrónico ya existe.
 * @param {string} correo El correo a verificar.
 * @returns {Promise<boolean>} True si el correo existe, false en caso contrario.
 */
const verificarCorreoExistente = async (correo) => {
  if (!correo) {
    throw new BadRequestError("El correo es requerido para la verificación.");
  }
  try {
    const usuario = await db.Usuario.findOne({ where: { correo } });
    return !!usuario; // Devuelve true si el usuario existe, false si no
  } catch (error) {
    console.error(
      "[usuario.service.js] Error al verificar correo existente:",
      error
    );
    throw new CustomError("Error al verificar la existencia del correo.", 500);
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

    // Solo dependemos de tipoPerfil
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
 * Desactiva un usuario y anula su contraseña para impedir el acceso (Soft Delete).
 * También desactiva el perfil asociado (Cliente/Empleado).
 */
const desactivarYBloquearUsuario = async (idUsuario) => {
  const usuarioIdNumerico = Number(idUsuario);
  if (isNaN(usuarioIdNumerico)) {
    throw new BadRequestError("El ID de usuario proporcionado no es un número válido.");
  }

  const transaction = await db.sequelize.transaction();
  try {
    const usuario = await db.Usuario.findByPk(usuarioIdNumerico, {
      include: [{ model: db.Rol, as: 'rol' }], // Incluir rol para verificar si es Administrador
      transaction
    });

    if (!usuario) {
      await transaction.rollback();
      throw new NotFoundError("Usuario no encontrado para desactivar.");
    }

    if (usuario.rol && usuario.rol.nombre === 'Administrador') {
      await transaction.rollback();
      throw new CustomError("El Administrador no puede ser desactivado ni bloqueado.", 403);
    }

    // Acción 1: Anular contraseña y poner estado en false para el Usuario
    await usuario.update({
      estado: false,
      contrasena: null // O un hash inválido conocido y no recuperable, ej: "BLOCKED_BY_ADMIN_INVALID_HASH"
    }, { transaction });

    // Acción 2: Poner estado en false para el Perfil asociado (Cliente o Empleado)
    // Reutilizamos cambiarEstadoUsuarioInternal para esto, pasándole la transacción.
    // No es necesario que cambiarEstadoUsuarioInternal anule contraseña, solo estado.
    // La protección de Admin ya está en cambiarEstadoUsuarioInternal, pero la de aquí es prioritaria.
    if (usuario.rol && (usuario.rol.tipoPerfil === "CLIENTE" || usuario.rol.tipoPerfil === "EMPLEADO")) {
        await cambiarEstadoUsuarioInternal(usuarioIdNumerico, false, transaction);
    }
    // Si no tiene perfil Cliente/Empleado, no hay perfil que desactivar más allá del propio usuario.

    await transaction.commit();
    const { contrasena: _, ...usuarioDesactivado } = usuario.toJSON();
    return usuarioDesactivado; // Devolver el usuario modificado sin la contraseña
  } catch (error) {
    await transaction.rollback();
    // Preserve specific error types
    if (error instanceof CustomError || error instanceof NotFoundError || error instanceof BadRequestError) {
        throw error;
    }
    throw new CustomError(`Error al desactivar y bloquear usuario: ${error.message}`, error.statusCode || 500);
  }
};

/**
 * Elimina físicamente un usuario y su perfil asociado (Hard Delete).
 * Esta acción es destructiva y debe usarse con precaución.
 */
const eliminarUsuarioFisico = async (idUsuario) => {
  const usuarioIdNumerico = Number(idUsuario);
  if (isNaN(usuarioIdNumerico)) {
    throw new BadRequestError("El ID de usuario proporcionado no es un número válido para eliminar.");
  }

  const transaction = await db.sequelize.transaction();
  try {
    const usuario = await db.Usuario.findByPk(usuarioIdNumerico, {
        include: [{ model: db.Rol, as: 'rol' }], // Incluir rol para obtener tipoPerfil
        transaction
    });

    if (!usuario) {
      await transaction.rollback();
      throw new NotFoundError("Usuario no encontrado para eliminar físicamente.");
    }

    // Importante: No permitir eliminar al usuario Administrador principal.
    // Esta es una salvaguarda adicional a los permisos de ruta.
    if (usuario.rol && usuario.rol.nombre === 'Administrador') {
        // Podríamos verificar si es el ÚNICO admin, pero por seguridad, mejor prohibir directamente desde aquí.
        await transaction.rollback();
        throw new CustomError("El usuario Administrador no puede ser eliminado físicamente.", 403);
    }

    const { tipoPerfil } = usuario.rol; // Obtenido del include
    const commonWhere = { idUsuario: usuarioIdNumerico }; // Correcto, FK en Cliente/Empleado es idUsuario

    if (tipoPerfil === 'CLIENTE') {
      await db.Cliente.destroy({ where: commonWhere, transaction });
    } else if (tipoPerfil === 'EMPLEADO') {
      await db.Empleado.destroy({ where: commonWhere, transaction });
    }
    // Si no es ni Cliente ni Empleado (ej. solo un rol sin perfil) no hay perfil que borrar.

    // Finalmente, eliminar el usuario
    const filasEliminadas = await db.Usuario.destroy({ where: { idUsuario: usuarioIdNumerico }, transaction });

    await transaction.commit();
    return filasEliminadas > 0; // Retorna true si se eliminó algo, false si no (aunque ya se verificó antes)
  } catch (error) {
    await transaction.rollback();
    if (error instanceof NotFoundError || error instanceof CustomError || error instanceof BadRequestError) {
      throw error;
    }
    throw new CustomError(`Error al eliminar físicamente el usuario: ${error.message}`, error.statusCode || 500);
  }
};


module.exports = {
  crearUsuario,
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  actualizarUsuario,
  toggleUsuarioEstado, // Reemplaza anularUsuario y habilitarUsuario
  desactivarYBloquearUsuario, // Nuevo para Soft Delete + Bloqueo
  eliminarUsuarioFisico, // Revisado y corregido
  // cambiarEstadoUsuarioInternal, // Es un helper interno, no se exporta usualmente
  verificarCorreoExistente,
};
