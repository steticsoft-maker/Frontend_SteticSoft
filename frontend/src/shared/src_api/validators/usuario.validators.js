// src/validators/usuario.validators.js

// MODIFICADO: Importación de validadores compartidos.
const {
  correoValidator,
  contrasenaValidator,
  estadoValidator,
  idParamValidator,
} = require("./shared.validators.js");
const { body, param, query } = require("express-validator");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware.js");
const db = require("../models");


// MODIFICADO: Se utilizan validadores compartidos y se aplican reglas de seguridad y consistencia.
const crearUsuarioValidators = [
  // --- Validaciones para la entidad Usuario ---
  // MODIFICADO: Se usa validador de correo compartido + validación de unicidad.
  correoValidator().custom(async (value) => {
    const usuarioExistente = await db.Usuario.findOne({ where: { correo: value } });
    if (usuarioExistente) {
      return Promise.reject("La dirección de correo ya está registrada para una cuenta de usuario.");
    }
  }),
  // NUEVA REGLA: Se implementa la validación de contraseña segura.
  contrasenaValidator(),
  // Se mantiene la validación de idRol por su lógica de negocio específica.
  body("idRol")
    .notEmpty().withMessage("El ID del rol es obligatorio.")
    .isInt({ gt: 0 }).withMessage("El ID del rol debe ser un entero positivo.")
    .custom(async (value) => {
      const rolExistente = await db.Rol.findByPk(value);
      if (!rolExistente) return Promise.reject("El rol especificado no existe.");
      if (!rolExistente.estado) return Promise.reject("El rol especificado no está activo.");
    }),
  // MODIFICADO: Se usa el validador de estado compartido.
  estadoValidator(),

  // --- Validaciones para campos de Perfil (opcionales en este contexto) ---
  // MODIFICADO: Se aplican reglas de seguridad (escape, regex) a campos opcionales.
  body("nombre").optional().trim().escape().notEmpty().withMessage("El nombre no puede estar vacío si se proporciona.")
    .isLength({ min: 2, max: 100 }).withMessage("El nombre debe tener entre 2 y 100 caracteres.")
    .matches(/^[a-zA-Z\u00C0-\u017F\s]+$/).withMessage("El nombre solo puede contener letras y espacios."),

  body("apellido").optional().trim().escape().notEmpty().withMessage("El apellido no puede estar vacío si se proporciona.")
    .isLength({ min: 2, max: 100 }).withMessage("El apellido debe tener entre 2 y 100 caracteres.")
    .matches(/^[a-zA-Z\u00C0-\u017F\s]+$/).withMessage("El apellido solo puede contener letras y espacios."),

  body("telefono").optional().trim().escape().notEmpty().withMessage("El teléfono no puede estar vacío si se proporciona.")
    .isLength({ min: 7, max: 20 }).withMessage("El teléfono debe tener entre 7 y 20 caracteres.")
    .matches(/^[0-9\s+()-]+$/).withMessage("El teléfono solo puede contener números y los símbolos: + ( ) -"),

  body("tipoDocumento").optional().trim().notEmpty().isIn(['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de Identidad'])
    .withMessage("Tipo de documento no válido."),

  body("numeroDocumento").optional().trim().escape().notEmpty().withMessage("El número de documento no puede estar vacío.")
    .isLength({ min: 5, max: 45 }).withMessage("El número de documento debe tener entre 5 y 45 caracteres.")
    .isAlphanumeric('es-ES', { ignore: ' -' }).withMessage("El número de documento solo puede contener letras, números y guiones.")
    .custom(async (value, { req }) => {
      if (!value) return true;
      const rol = await db.Rol.findByPk(req.body.idRol);
      if (!rol || (rol.tipo_perfil !== "CLIENTE" && rol.tipo_perfil !== "EMPLEADO")) return true;

      const model = rol.tipo_perfil === "CLIENTE" ? db.Cliente : db.Empleado;
      const perfilExistente = await model.findOne({ where: { numero_documento: value } });
      if (perfilExistente) {
        return Promise.reject(`El número de documento ya está registrado para un ${rol.tipo_perfil.toLowerCase()}.`);
      }
    }),

  body("fechaNacimiento").optional().isISO8601().withMessage("La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD).").toDate(),

  handleValidationErrors,
];

const actualizarUsuarioValidators = [
  idParamValidator('idUsuario'),
  body("correo").optional().trim().isEmail().withMessage("Debe proporcionar un correo electrónico válido.").normalizeEmail()
    .custom(async (value, { req }) => {
      const idUsuario = Number(req.params.idUsuario);
      const usuarioExistente = await db.Usuario.findOne({
        where: { correo: value, id_usuario: { [db.Sequelize.Op.ne]: idUsuario } },
      });
      if (usuarioExistente) return Promise.reject("La dirección de correo ya está registrada por otro usuario.");
    }),
  body("contrasena").optional({ checkFalsy: true }).isStrongPassword({
      minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1,
    }).withMessage("La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo."),
  body("idRol").optional().isInt({ gt: 0 }).withMessage("El ID del rol debe ser un entero positivo.")
    .custom(async (value) => {
      if (value) {
        const rolExistente = await db.Rol.findOne({ where: { id_rol: value, estado: true } });
        if (!rolExistente) return Promise.reject("El rol especificado para la actualización no existe o no está activo.");
      }
    }),
  estadoValidator(),
  // Se aplican las mismas reglas de seguridad a los campos de perfil opcionales.
  body("nombre").optional().trim().escape().notEmpty().isLength({ min: 2, max: 100 }).matches(/^[a-zA-Z\u00C0-\u017F\s]+$/),
  body("apellido").optional().trim().escape().notEmpty().isLength({ min: 2, max: 100 }).matches(/^[a-zA-Z\u00C0-\u017F\s]+$/),
  body("telefono").optional().trim().escape().notEmpty().isLength({ min: 7, max: 20 }).matches(/^[0-9\s+()-]+$/),
  body("tipoDocumento").optional().trim().isIn(['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de Identidad']),
  body("numeroDocumento").optional().trim().escape().notEmpty().isLength({ min: 5, max: 45 }).isAlphanumeric('es-ES', { ignore: ' -' })
    .custom(async (value, { req }) => {
        if (!value) return true;
        const usuario = await db.Usuario.findByPk(req.params.idUsuario, { include: [{ model: db.Rol, as: 'rol' }] });
        if (!usuario || !usuario.rol || (usuario.rol.tipo_perfil !== "CLIENTE" && usuario.rol.tipo_perfil !== "EMPLEADO")) return true;

        const model = usuario.rol.tipo_perfil === "CLIENTE" ? db.Cliente : db.Empleado;
        const profileFk = usuario.rol.tipo_perfil === "CLIENTE" ? 'id_cliente' : 'id_empleado';
        const perfilAsociado = await model.findOne({ where: { id_usuario: usuario.id_usuario } });
        if (perfilAsociado && perfilAsociado.numero_documento === value) return true;

        const otroPerfilConDocumento = await model.findOne({ where: { numero_documento: value } });
        if (otroPerfilConDocumento) return Promise.reject(`El número de documento ya está en uso por otro ${usuario.rol.tipo_perfil.toLowerCase()}.`);
    }),
  body("fechaNacimiento").optional().isISO8601().toDate(),

  handleValidationErrors,
];

// MODIFICADO: Se utiliza el validador de ID compartido.
const idUsuarioValidator = [
  idParamValidator('idUsuario'),
  handleValidationErrors,
];

// MODIFICADO: Se utiliza el validador de ID compartido.
const cambiarEstadoUsuarioValidators = [
  idParamValidator('idUsuario'),
  body("estado")
    .exists({ checkFalsy: false }).withMessage("El campo 'estado' es obligatorio.")
    .isBoolean().withMessage("El valor de 'estado' debe ser un booleano (true o false)."),
  handleValidationErrors,
];

// MODIFICADO: Se aplica la misma lógica de validación de correo, pero desde 'query'.
const verificarCorreoValidators = [
  query("correo")
    .trim()
    .notEmpty().withMessage("El correo es requerido.")
    .isEmail().withMessage("Debe proporcionar un correo electrónico válido.")
    .normalizeEmail(),
  handleValidationErrors,
];

module.exports = {
  crearUsuarioValidators,
  actualizarUsuarioValidators,
  idUsuarioValidator,
  cambiarEstadoUsuarioValidators,
  verificarCorreoValidators,
};