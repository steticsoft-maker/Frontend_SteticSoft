// src/shared/src_api/services/auth.service.js
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../models/index.js");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
  CustomError,
  ConflictError,
} = require("../errors/index.js");
const {
  JWT_SECRET,
  EMAIL_FROM,
  APP_NAME,
  FRONTEND_URL,
} = require("../config/env.config.js");
const optimizedMailerService = require("./optimized-mailer.service.js");
const {
  generarTemplateBienvenida,
  generarTemplateRecuperacion,
  generarTemplateConfirmacionCambio,
} = require("../utils/emailTemplates.utils.js");

const JWT_EXPIRATION = "1d";
const TOKEN_RECUPERACION_EXPIRATION_MINUTES = 60;
const saltRounds = 10;

/**
 * Registra un nuevo usuario y su perfil de cliente asociado.
 * Asume que el rol por defecto es 'Cliente'.
 * @param {object} datosRegistro - { nombre, apellido, correo, contrasena, telefono, tipoDocumento, numeroDocumento, fechaNacimiento }
 * @returns {Promise<object>} El usuario creado (sin contraseña) y el token JWT.
 */
const registrarUsuario = async (datosRegistro) => {
  // --- Nodo 1: Inicio y desestructuración de datos ---
  const {
    nombre,
    apellido,
    correo,
    contrasena,
    telefono,
    tipoDocumento,
    numeroDocumento,
    fechaNacimiento,
    direccion,
  } = datosRegistro;

  // --- Nodo 2: Buscar si el correo ya existe en la tabla Usuario ---
  const usuarioExistente = await db.Usuario.findOne({ where: { correo } });

  // --- Nodo 3: (Decisión) ¿El correo ya está registrado en Usuarios? ---
  if (usuarioExistente) {
    // --- Nodo 4: Lanzar error de conflicto por correo en Usuario ---
    throw new ConflictError(
      `El correo electrónico '${correo}' ya está registrado para una cuenta.`
    );
  }

  // --- Nodo 5: Buscar si el documento ya existe en la tabla Cliente ---
  const clienteConDocumento = await db.Cliente.findOne({
    where: { numeroDocumento },
  });

  // --- Nodo 6: (Decisión) ¿El documento ya está registrado en Clientes? ---
  if (clienteConDocumento) {
    // --- Nodo 7: Lanzar error de conflicto por documento ---
    throw new ConflictError(
      `El número de documento '${numeroDocumento}' ya está registrado para un cliente.`
    );
  }

  // --- Nodo 8: Buscar si el correo ya existe en la tabla Cliente ---
  const clienteConCorreo = await db.Cliente.findOne({ where: { correo } });

  // --- Nodo 9: (Decisión) ¿El correo ya está registrado en Clientes? ---
  if (clienteConCorreo) {
    // --- Nodo 10: Lanzar error de conflicto por correo en Cliente ---
    throw new ConflictError(
      `El correo electrónico '${correo}' ya está registrado para un perfil de cliente.`
    );
  }

  // --- Nodo 11: Buscar el rol "Cliente" ---
  const rolCliente = await db.Rol.findOne({ where: { nombre: "Cliente" } });

  // --- Nodo 12: (Decisión) ¿Existe el rol "Cliente"? ---
  if (!rolCliente) {
    // --- Nodo 13: Log de error crítico y Lanzar error de configuración ---
    console.error(
      "Error crítico: El rol 'Cliente' no se encuentra en la base de datos."
    );
    throw new CustomError(
      "No se pudo completar el registro debido a un error de configuración.",
      500
    );
  }

  // --- Nodo 14: Iniciar transacción y bloque try/catch ---
  const transaction = await db.sequelize.transaction();
  try {
    // --- Nodo 15: Crear hash de la contraseña ---
    const contrasenaHasheada = await bcrypt.hash(contrasena, saltRounds);

    // --- Nodo 16: Crear el registro del Usuario ---
    const nuevoUsuario = await db.Usuario.create(
      {
        correo,
        contrasena: contrasenaHasheada,
        idRol: rolCliente.idRol,
        estado: true,
      },
      { transaction }
    );

    // --- Nodo 17: Crear el registro del Cliente ---
    await db.Cliente.create(
      {
        idUsuario: nuevoUsuario.idUsuario,
        nombre,
        apellido,
        correo,
        telefono,
        tipoDocumento,
        numeroDocumento,
        fechaNacimiento,
        direccion,
        estado: true,
      },
      { transaction }
    );

    // --- Nodo 18: Confirmar la transacción ---
    await transaction.commit();

    // --- Nodo 19: Generar token JWT y preparar respuesta ---
    const payload = {
      idUsuario: nuevoUsuario.idUsuario,
      idRol: nuevoUsuario.idRol,
      rolNombre: rolCliente.nombre,
      correo: nuevoUsuario.correo,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    const { contrasena: _, ...usuarioSinContrasena } = nuevoUsuario.toJSON();

    // --- Nodo 20: Iniciar bloque try/catch para envío de correo ---
    try {
      const htmlBienvenida = generarTemplateBienvenida(nombre); // Asumiendo que esta función existe
      await optimizedMailerService.sendMail({
        to: nuevoUsuario.correo,
        subject: `🎉 ¡Bienvenido/a a La fuente del peluquero! Tu cuenta está lista`,
        html: htmlBienvenida,
      });
    } catch (emailError) {
      // --- Nodo 21: Log de error de envío de correo (no detiene el flujo) ---
      console.error(
        `Error al enviar correo de bienvenida a ${nuevoUsuario.correo}:`,
        emailError
      );
    }

    // --- Nodo 22: Retornar el usuario y token (Éxito Final) ---
    return { usuario: usuarioSinContrasena, token };
  } catch (error) {
    // --- Nodo 23: Revertir transacción ---
    await transaction.rollback();

    // --- Nodo 24: (Decisión) ¿Es un ConflictError conocido? ---
    if (error instanceof ConflictError) {
      // --- Nodo 25: Relanzar ConflictError ---
      throw error;
    }

    // --- Nodo 26: (Decisión) ¿Es un error de unicidad de BD? ---
    if (error.name === "SequelizeUniqueConstraintError") {
      // --- Nodo 27: Determinar mensaje de conflicto específico ---
      let mensajeConflicto =
        "Uno de los datos proporcionados ya está en uso (correo o número de documento).";

      // --- Nodo 28: (Decisión) ¿El error tiene un campo 'fields'? ---
      if (error.fields) {
        // --- Nodo 29: (Decisión) ¿El conflicto es en el campo 'correo'? ---
        if (error.fields.correo && error.fields.correo === correo)
          mensajeConflicto = `El correo electrónico '${correo}' ya está registrado.`;

        // --- Nodo 30: (Decisión) ¿El conflicto es en el campo 'numerodocumento'? ---
        if (
          error.fields.numerodocumento &&
          error.fields.numerodocumento === numeroDocumento
        )
          mensajeConflicto = `El número de documento '${numeroDocumento}' ya está registrado.`;
      }
      // --- Nodo 31: Lanzar error de conflicto formateado ---
      throw new ConflictError(mensajeConflicto);
    }

    // --- Nodo 32: Lanzar error genérico para cualquier otro fallo ---
    console.error(
      "Error al registrar el usuario en el servicio:",
      error.message,
      error.stack
    );
    throw new CustomError(`Error durante el registro: ${error.message}`, 500);
  }
};

const loginUsuario = async (correo, contrasena) => {
  const usuario = await db.Usuario.findOne({
    where: { correo, estado: true },
    include: [
      {
        model: db.Rol,
        as: "rol",
        attributes: ["idRol", "nombre", "tipoPerfil", "descripcion", "estado"],
        include: [
          {
            model: db.Permisos,
            as: "permisos",
            attributes: ["nombre"],
            through: { attributes: [] },
          },
        ],
      },
      {
        model: db.Cliente,
        as: "clienteInfo",
        required: false,
      },
      {
        model: db.Empleado,
        as: "empleado",
        required: false,
      },
    ],
  });

  if (!usuario) {
    throw new UnauthorizedError("Credenciales inválidas.");
  }

  const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena);
  if (!contrasenaValida) {
    throw new UnauthorizedError("Credenciales inválidas.");
  }

  const payload = {
    idUsuario: usuario.idUsuario,
    idRol: usuario.idRol,
    rolNombre: usuario.rol ? usuario.rol.nombre : null,
    correo: usuario.correo,
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

  // Transformar la data para el frontend
  const usuarioJSON = usuario.toJSON();

  // Log de depuración para ver qué datos tenemos
  console.log("🔍 DEBUG LOGIN - Usuario encontrado:", {
    idUsuario: usuarioJSON.idUsuario,
    correo: usuarioJSON.correo,
    idRol: usuarioJSON.idRol,
    rolNombre: usuarioJSON.rol?.nombre,
    tieneClienteInfo: !!usuarioJSON.clienteInfo,
    tieneEmpleado: !!usuarioJSON.empleado,
    clienteInfo: usuarioJSON.clienteInfo,
    empleado: usuarioJSON.empleado,
  });

  // Renombrar empleado a empleadoInfo para el frontend
  if (usuarioJSON.empleado) {
    usuarioJSON.empleadoInfo = usuarioJSON.empleado;
    delete usuarioJSON.empleado;
  }

  // Extraer solo los nombres de los permisos en un array simple
  const permisosNombres = usuarioJSON.rol?.permisos?.map((p) => p.nombre) || [];

  // Limpiar datos sensibles o redundantes antes de enviar
  delete usuarioJSON.contrasena;
  if (usuarioJSON.rol) {
    delete usuarioJSON.rol.permisos; // Quitar el array de objetos de permisos

    // Asegurar que el rol tenga todos los campos requeridos por el modelo Flutter
    if (usuarioJSON.rol) {
      usuarioJSON.rol.tipoPerfil = usuarioJSON.rol.tipoPerfil || "NINGUNO";
      usuarioJSON.rol.estado =
        usuarioJSON.rol.estado !== undefined ? usuarioJSON.rol.estado : true;
      usuarioJSON.rol.descripcion = usuarioJSON.rol.descripcion || null;
    }
  }

  // Añadir el array de nombres de permisos al objeto de usuario
  usuarioJSON.permisos = permisosNombres;

  // Log final para verificar la estructura completa
  console.log("🔍 DEBUG LOGIN - Usuario final enviado:", {
    idUsuario: usuarioJSON.idUsuario,
    correo: usuarioJSON.correo,
    idRol: usuarioJSON.idRol,
    rolNombre: usuarioJSON.rol?.nombre,
    rolTipoPerfil: usuarioJSON.rol?.tipoPerfil,
    rolEstado: usuarioJSON.rol?.estado,
    rolDescripcion: usuarioJSON.rol?.descripcion,
    tieneClienteInfo: !!usuarioJSON.clienteInfo,
    tieneEmpleadoInfo: !!usuarioJSON.empleadoInfo,
    permisos: usuarioJSON.permisos,
    rolCompleto: usuarioJSON.rol,
  });

  return { usuario: usuarioJSON, token };
};

const solicitarRecuperacionContrasena = async (correo) => {
  const usuario = await db.Usuario.findOne({
    where: { correo, estado: true },
    include: [
      {
        model: db.Cliente,
        as: "clienteInfo",
        attributes: ["nombre", "apellido"],
      },
      {
        model: db.Empleado,
        as: "empleado",
        attributes: ["nombre", "apellido"],
      },
    ],
  });
  if (!usuario) {
    console.warn(
      `Intento de recuperación para correo no existente o inactivo: ${correo}`
    );
    return; // No revelar si el correo existe o no
  }

  // Obtener el nombre del usuario (cliente o empleado)
  let nombreUsuario = "";
  if (usuario.clienteInfo) {
    nombreUsuario =
      `${usuario.clienteInfo.nombre} ${usuario.clienteInfo.apellido}`.trim();
  } else if (usuario.empleado) {
    nombreUsuario =
      `${usuario.empleado.nombre} ${usuario.empleado.apellido}`.trim();
  } else {
    // Fallback al correo si no hay información de cliente o empleado
    nombreUsuario = usuario.correo;
  }

  // --- INICIO DE MODIFICACIÓN: Generación de Código OTP ---
  // Generamos un número seguro de 6 dígitos (entre 100000 y 999999)
  const tokenRecuperacion = crypto.randomInt(100000, 999999).toString();
  // --- FIN DE MODIFICACIÓN ---

  const fechaExpiracion = new Date(
    Date.now() + TOKEN_RECUPERACION_EXPIRATION_MINUTES * 60 * 1000
  );

  // Limpiamos tokens antiguos y creamos el nuevo
  await db.TokenRecuperacion.destroy({
    where: { idUsuario: usuario.idUsuario },
  });
  await db.TokenRecuperacion.create({
    idUsuario: usuario.idUsuario,
    token: tokenRecuperacion, // Guardamos el código de 6 dígitos
    fechaExpiracion,
  });

  // --- INICIO DE MODIFICACIÓN: Template de Correo para OTP ---
  // Ya no necesitamos 'enlaceRecuperacion'
  const htmlCorreo = generarTemplateRecuperacion(
    nombreUsuario, 
    usuario.correo, 
    tokenRecuperacion, 
    TOKEN_RECUPERACION_EXPIRATION_MINUTES
  );
  // --- FIN DE MODIFICACIÓN ---

  try {
    const result = await optimizedMailerService.sendMail({
      to: usuario.correo,
      subject: `🔐 Tu código de recuperación de contraseña - ${
        APP_NAME || "La fuente del peluquero"
      }`,
      html: htmlCorreo,
    });

    if (result.success) {
      console.log(
        `✅ Correo de recuperación (OTP) enviado a ${usuario.correo} en ${result.duration}ms`
      );
    } else {
      console.error(
        `❌ Error al enviar correo de recuperación (OTP) a ${usuario.correo}: ${result.error}`
      );
    }
  } catch (error) {
    console.error(
      `❌ Error crítico al enviar correo de recuperación (OTP) a ${usuario.correo}:`,
      error
    );
    // No lanzamos error al usuario, mantenemos el silencio operativo
  }
};

/**
 * Valida un token de recuperación (código OTP).
 * @param {string} token - El código OTP de 6 dígitos
 * @returns {Promise<void>} No retorna nada si es válido, lanza error si no es válido
 */
const validarTokenRecuperacion = async (token) => {
  // Buscamos el token que no haya expirado
  const tokenData = await db.TokenRecuperacion.findOne({
    where: {
      token: token,
      fechaExpiracion: { [Op.gt]: new Date() }, // Op.gt = "Greater Than" (Mayor que ahora)
    },
    include: [
      {
        model: db.Usuario,
        as: "usuario",
        attributes: ["idUsuario", "correo", "estado"],
      },
    ],
  });

  if (!tokenData) {
    throw new BadRequestError("Código de recuperación inválido o expirado.");
  }

  if (!tokenData.usuario || !tokenData.usuario.estado) {
    throw new BadRequestError("Código de recuperación inválido o expirado.");
  }

  // El token es válido, no necesitamos retornar nada
  return;
};

/**
 * Resetea la contraseña usando el Correo, el Código OTP (token) y la nueva contraseña.
 */
const resetearContrasena = async (correo, tokenCodigo, nuevaContrasena) => {
  // --- INICIO DE MODIFICACIÓN COMPLETA DE LA FUNCIÓN ---

  // 1. Validar que el usuario exista
  const usuario = await db.Usuario.findOne({ where: { correo, estado: true } });
  if (!usuario) {
    // Es importante usar el mismo mensaje de error genérico para no revelar si un correo existe o no
    throw new BadRequestError(
      "Código de recuperación inválido, expirado o correo incorrecto."
    );
  }

  // 2. Validar el token (código OTP)
  // Buscamos el token que coincida con el código, el idUsuario Y que no haya expirado.
  const tokenDataValido = await db.TokenRecuperacion.findOne({
    where: {
      idUsuario: usuario.idUsuario,
      token: tokenCodigo,
      fechaExpiracion: { [Op.gt]: new Date() }, // Op.gt = "Greater Than" (Mayor que ahora)
    },
  });

  if (!tokenDataValido) {
    // Si no se encuentra, el código está mal o ya expiró.
    throw new BadRequestError(
      "Código de recuperación inválido, expirado o correo incorrecto."
    );
  }

  // 3. Si el código es válido, procedemos a resetear la contraseña y eliminar el token
  const contrasenaHasheada = await bcrypt.hash(nuevaContrasena, saltRounds);
  const transaction = await db.sequelize.transaction();

  try {
    // Actualizamos la contraseña del usuario
    await usuario.update({ contrasena: contrasenaHasheada }, { transaction });

    // Eliminamos el token (OTP) para que no pueda ser reutilizado
    await db.TokenRecuperacion.destroy({
      where: { idTokenRecuperacion: tokenDataValido.idTokenRecuperacion }, // Usamos el ID del token encontrado
      transaction,
    });

    await transaction.commit();
    console.log(
      `Contraseña reseteada exitosamente para usuario ID: ${usuario.idUsuario}`
    );

    // (Opcional pero recomendado) Enviar correo de confirmación de cambio
    const htmlConfirmacion = generarTemplateConfirmacionCambio(usuario.correo);
    try {
      const result = await optimizedMailerService.sendMail({
        to: usuario.correo,
        subject: `Confirmación de Cambio de Contraseña - ${
          APP_NAME || "La fuente del peluquero"
        }`,
        html: htmlConfirmacion,
      });

      if (result.success) {
        console.log(
          `✅ Correo de confirmación enviado a ${usuario.correo} en ${result.duration}ms`
        );
      }
    } catch (emailError) {
      console.error(
        `Error al enviar correo de confirmación de cambio de contraseña a ${usuario.correo}:`,
        emailError
      );
    }
  } catch (error) {
    await transaction.rollback();
    console.error(
      `Error al resetear la contraseña (transacción) para usuario ID ${usuario.idUsuario}:`,
      error.message,
      error.stack
    );
    throw new CustomError(
      `Error al procesar el reseteo de contraseña: ${error.message}`,
      500
    );
  }
  // --- FIN DE MODIFICACIÓN COMPLETA ---
};

module.exports = {
  registrarUsuario,
  loginUsuario,
  solicitarRecuperacionContrasena,
  validarTokenRecuperacion,
  resetearContrasena,
};
