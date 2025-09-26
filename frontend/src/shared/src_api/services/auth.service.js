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

  const usuarioExistente = await db.Usuario.findOne({ where: { correo } });
  if (usuarioExistente) {
    throw new ConflictError(
      `El correo electrónico '${correo}' ya está registrado para una cuenta.`
    );
  }

  const clienteConDocumento = await db.Cliente.findOne({
    where: { numeroDocumento },
  });
  if (clienteConDocumento) {
    throw new ConflictError(
      `El número de documento '${numeroDocumento}' ya está registrado para un cliente.`
    );
  }

  const clienteConCorreo = await db.Cliente.findOne({ where: { correo } });
  if (clienteConCorreo) {
    throw new ConflictError(
      `El correo electrónico '${correo}' ya está registrado para un perfil de cliente.`
    );
  }

  const rolCliente = await db.Rol.findOne({ where: { nombre: "Cliente" } });
  if (!rolCliente) {
    console.error(
      "Error crítico: El rol 'Cliente' no se encuentra en la base de datos."
    );
    throw new CustomError(
      "No se pudo completar el registro debido a un error de configuración.",
      500
    );
  }

  const transaction = await db.sequelize.transaction();
  try {
    const contrasenaHasheada = await bcrypt.hash(contrasena, saltRounds);

    const nuevoUsuario = await db.Usuario.create(
      {
        correo,
        contrasena: contrasenaHasheada,
        idRol: rolCliente.idRol,
        estado: true,
      },
      { transaction }
    );

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

    await transaction.commit();

    const payload = {
      idUsuario: nuevoUsuario.idUsuario,
      idRol: nuevoUsuario.idRol,
      rolNombre: rolCliente.nombre,
      correo: nuevoUsuario.correo,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });

    const { contrasena: _, ...usuarioSinContrasena } = nuevoUsuario.toJSON();

    try {
      const htmlBienvenida = `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 15px;">
          <div style="background: white; padding: 40px 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2c3e50; font-size: 28px; margin: 0; font-weight: 600;">¡Bienvenido/a ${
                APP_NAME || "La fuente del peluquero"
              }!</h1>
              <div style="width: 60px; height: 4px; background: linear-gradient(135deg, #667eea, #764ba2); margin: 15px auto; border-radius: 2px;"></div>
            </div>
            
            <div style="text-align: center; margin-bottom: 25px;">
              <h2 style="color: #34495e; font-size: 22px; margin: 0; font-weight: 500;">Hola ${nombre} 👋</h2>
            </div>
            
            <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #667eea;">
              <p style="color: #495057; font-size: 16px; line-height: 1.6; margin: 0; text-align: center;">
                <strong>¡Tu cuenta ha sido creada exitosamente!</strong><br>
                Estamos emocionados de tenerte como parte de nuestra familia de belleza y cuidado personal.
              </p>
            </div>
            
            <div style="margin: 25px 0;">
              <h3 style="color: #2c3e50; font-size: 18px; margin-bottom: 15px; font-weight: 600;">✨ ¿Qué puedes hacer ahora?</h3>
              <ul style="color: #495057; font-size: 15px; line-height: 1.8; padding-left: 20px;">
                <li>📅 <strong>Agendar citas</strong> con nuestros especialistas</li>
                <li>🛍️ <strong>Explorar servicios</strong> y productos de calidad</li>
                <li>👤 <strong>Gestionar tu perfil</strong> y preferencias</li>
                <li>📱 <strong>Recibir notificaciones</strong> sobre tus citas</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  FRONTEND_URL || "https://lafuentedelpeluquero.onrender.com"
                }" style="background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; display: inline-block; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4); transition: all 0.3s ease;">
                🚀 Comenzar ahora
              </a>
            </div>
            
            <div style="border-top: 1px solid #e9ecef; padding-top: 25px; margin-top: 30px; text-align: center;">
              <p style="color: #6c757d; font-size: 14px; line-height: 1.5; margin: 0;">
                Si tienes alguna pregunta o necesitas ayuda, no dudes en contactarnos.<br>
                <strong>Estamos aquí para ti 💙</strong>
              </p>
              <p style="color: #495057; font-size: 15px; margin: 15px 0 0 0; font-weight: 500;">
                Con cariño,<br>
                <span style="color: #667eea; font-weight: 600;">El equipo de ${
                  APP_NAME || "La fuente del peluquero"
                }</span>
              </p>
            </div>
          </div>
        </div>`;
      const result = await optimizedMailerService.sendMail({
        to: nuevoUsuario.correo,
        subject: `🎉 ¡Bienvenido/a a ${
          APP_NAME || "La fuente del peluquero"
        }! Tu cuenta está lista`,
        html: htmlBienvenida,
      });

      if (result.success) {
        console.log(
          `✅ Correo de bienvenida enviado a ${nuevoUsuario.correo} en ${result.duration}ms`
        );
      }
    } catch (emailError) {
      console.error(
        `Error al enviar correo de bienvenida a ${nuevoUsuario.correo}:`,
        emailError
      );
    }

    return { usuario: usuarioSinContrasena, token };
  } catch (error) {
    await transaction.rollback();
    if (error instanceof ConflictError) throw error;
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
  const htmlCorreo = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; border-radius: 15px;">
      <div style="background: white; padding: 40px 30px; border-radius: 15px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <div style="text-align: center; margin-bottom: 30px;">
          <div style="background: linear-gradient(135deg, #ff6b6b, #ee5a24); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
            🔐
          </div>
          <h1 style="color: #2c3e50; font-size: 24px; margin: 0; font-weight: 600;">Recuperación de Contraseña</h1>
          <div style="width: 60px; height: 4px; background: linear-gradient(135deg, #667eea, #764ba2); margin: 15px auto; border-radius: 2px;"></div>
        </div>
        
        <div style="text-align: center; margin-bottom: 25px;">
          <h2 style="color: #34495e; font-size: 18px; margin: 0; font-weight: 500;">Hola ${nombreUsuario} 👋</h2>
          <p style="color: #6c757d; font-size: 14px; margin: 5px 0 0 0;">${
            usuario.correo
          }</p>
        </div>
        
        <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 20px; border-radius: 10px; margin: 25px 0; border-left: 4px solid #f39c12;">
          <p style="color: #856404; font-size: 15px; line-height: 1.6; margin: 0; text-align: center;">
            <strong>¡Hemos recibido tu solicitud!</strong><br>
            Has solicitado restablecer tu contraseña para tu cuenta en <strong>${
              APP_NAME || "La fuente del peluquero"
            }</strong>.
          </p>
        </div>
        
        <div style="margin: 30px 0;">
          <h3 style="color: #2c3e50; font-size: 16px; margin-bottom: 15px; font-weight: 600; text-align: center;">🔑 Tu Código de Verificación</h3>
          <p style="color: #495057; font-size: 14px; text-align: center; margin-bottom: 20px;">
            Usa el siguiente código de 6 dígitos para completar el proceso. Este código es confidencial y no lo compartas con nadie.
          </p>
          
          <div style="background: linear-gradient(135deg, #667eea, #764ba2); padding: 25px; border-radius: 15px; text-align: center; margin: 25px 0; box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);">
            <div style="font-size: 42px; font-weight: bold; color: white; letter-spacing: 8px; font-family: 'Courier New', monospace; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">
              ${tokenRecuperacion}
            </div>
          </div>
          
          <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #17a2b8;">
            <p style="color: #0c5460; font-size: 14px; margin: 0; text-align: center;">
              ⏰ <strong>Importante:</strong> Este código expirará en <strong>${TOKEN_RECUPERACION_EXPIRATION_MINUTES} minutos</strong> por seguridad.
            </p>
          </div>
        </div>
        
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #dc3545;">
          <p style="color: #721c24; font-size: 14px; margin: 0; text-align: center;">
            🛡️ <strong>¿No solicitaste este cambio?</strong><br>
            Si no fuiste tú quien solicitó restablecer la contraseña, por favor ignora este correo. Tu cuenta está segura.
          </p>
        </div>
        
        <div style="border-top: 1px solid #e9ecef; padding-top: 25px; margin-top: 30px; text-align: center;">
          <p style="color: #6c757d; font-size: 14px; line-height: 1.5; margin: 0;">
            Si tienes problemas con el código o necesitas ayuda, contáctanos.<br>
            <strong>Estamos aquí para ayudarte 💙</strong>
          </p>
          <p style="color: #495057; font-size: 15px; margin: 15px 0 0 0; font-weight: 500;">
            Con cariño,<br>
            <span style="color: #667eea; font-weight: 600;">El equipo de ${
              APP_NAME || "La fuente del peluquero"
            }</span>
          </p>
        </div>
      </div>
    </div>`;
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
    const htmlConfirmacion = `
    <div style="font-family: Arial, sans-serif; color: #333;">
        <p>Hola ${usuario.correo},</p>
        <p>Tu contraseña para ${
          APP_NAME || "La fuente del peluquero"
        } ha sido actualizada exitosamente.</p>
        <p>Si no realizaste este cambio, por favor contacta a soporte inmediatamente.</p>
    </div>`;
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
