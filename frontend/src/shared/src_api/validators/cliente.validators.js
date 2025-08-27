// src/shared/src_api/validators/cliente.validators.js  

// MODIFICADO: Importación de validadores compartidos para consistencia y seguridad.
const {
  nombreValidator,
  correoValidator,
  contrasenaValidator,
  telefonoValidator,
  numeroDocumentoValidator,
  tipoDocumentoValidator,
  idParamValidator,
  estadoValidator,
} = require("./shared.validators.js");
const { body, param } = require("express-validator");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware.js");
const db = require("../models");

// MODIFICADO: Se utilizan validadores compartidos para estandarizar y robustecer la creación de clientes.
const crearClienteValidators = [
  // --- Campos para el Perfil del Cliente ---
  nombreValidator('nombre'),
  nombreValidator('apellido'),
  telefonoValidator(),
  tipoDocumentoValidator(),
  numeroDocumentoValidator().custom(async (value) => {
    const clienteExistente = await db.Cliente.findOne({ where: { numeroDocumento: value } });
    if (clienteExistente) {
      return Promise.reject("El número de documento ya está registrado para otro cliente.");
    }
  }),
  body("fechaNacimiento").notEmpty().withMessage("La fecha de nacimiento es obligatoria.")
    .isISO8601().withMessage("La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD).").toDate(),
  // NUEVA REGLA: Se añade sanitización a la dirección.
  body("direccion").trim().escape().notEmpty().withMessage("La dirección es obligatoria."),
  estadoValidator('estadoCliente'),
  
  // --- Campos para la Cuenta de Usuario asociada ---
  correoValidator().custom(async (value) => {
    const usuarioExistente = await db.Usuario.findOne({ where: { correo: value } });
    if (usuarioExistente) return Promise.reject("El correo electrónico ya está registrado para una cuenta de usuario.");
    const clienteExistente = await db.Cliente.findOne({ where: { correo: value } });
    if (clienteExistente) return Promise.reject("El correo electrónico ya está registrado para un perfil de cliente.");
  }),
  contrasenaValidator(),
  estadoValidator('estadoUsuario'),
  
  handleValidationErrors,
];

// MODIFICADO: Se aplican reglas de seguridad y consistencia a la actualización de clientes.
const actualizarClienteValidators = [
  idParamValidator('idCliente'),
  
  // MODIFICADO: Se aplican reglas de seguridad (escape, regex) a campos opcionales.
  body("nombre").optional().trim().escape().notEmpty().isLength({ min: 2, max: 100 }).matches(/^[a-zA-Z\u00C0-\u017F\s]+$/),
  body("apellido").optional().trim().escape().notEmpty().isLength({ min: 2, max: 100 }).matches(/^[a-zA-Z\u00C0-\u017F\s]+$/),
  body("telefono").optional().trim().escape().notEmpty().isLength({ min: 7, max: 20 }).matches(/^[0-9\s+()-]+$/),
  body("tipoDocumento").optional().trim().isIn(['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de Identidad']),
  body("numeroDocumento").optional().trim().escape().notEmpty().isLength({ min: 5, max: 45 }).isAlphanumeric('es-ES', { ignore: ' -' })
    .custom(async (value, { req }) => {
      if (value) {
        const clienteExistente = await db.Cliente.findOne({
          where: { numeroDocumento: value, id_cliente: { [db.Sequelize.Op.ne]: req.params.idCliente } },
        });
        if (clienteExistente) return Promise.reject("El número de documento ya está registrado para otro cliente.");
      }
    }),
  body("fechaNacimiento").optional().isISO8601().toDate(),
  body("direccion").optional().trim().escape().isLength({ max: 255 }),
  estadoValidator('estadoCliente'),
  body("correo").optional({ checkFalsy: true }).trim().isEmail().normalizeEmail()
    .custom(async (value, { req }) => {
      if (value) { 
        const idCliente = Number(req.params.idCliente);
        const otroClienteConCorreo = await db.Cliente.findOne({ where: { correo: value, id_cliente: { [db.Sequelize.Op.ne]: idCliente } } });
        if (otroClienteConCorreo) return Promise.reject("El correo ya está registrado para otro cliente.");

        const clienteActual = await db.Cliente.findByPk(idCliente);
        if (clienteActual && clienteActual.id_usuario) {
          const otroUsuarioConCorreo = await db.Usuario.findOne({ where: { correo: value, id_usuario: { [db.Sequelize.Op.ne]: clienteActual.id_usuario } } });
          if (otroUsuarioConCorreo) return Promise.reject("El correo ya está en uso por otra cuenta.");
        }
      }
    }),
  estadoValidator('estadoUsuario'),
  body("idUsuario").optional({ nullable: true }).isInt({ gt: 0 }).withMessage("El ID de usuario debe ser un entero positivo o null.")
    .custom(async (value, { req }) => {
      if (value) {
        const usuario = await db.Usuario.findByPk(value);
        if (!usuario) return Promise.reject("El usuario para asociar no existe.");
        const otroCliente = await db.Cliente.findOne({ where: { id_usuario: value, id_cliente: { [db.Sequelize.Op.ne]: req.params.idCliente } } });
        if (otroCliente) return Promise.reject("El usuario ya está asociado a otro cliente.");
      }
    }),
  handleValidationErrors,
];

// MODIFICADO: Se utiliza el validador de ID compartido.
const idClienteValidator = [
  idParamValidator('idCliente'),
  handleValidationErrors,
];

// MODIFICADO: Se utiliza el validador de ID compartido.
const cambiarEstadoClienteValidators = [
  idParamValidator('idCliente'),
  body("estado")
    .exists({ checkFalsy: false }).withMessage("El campo 'estado' es obligatorio.")
    .isBoolean().withMessage("El valor de 'estado' debe ser un booleano (true o false)."),
  handleValidationErrors,
];

module.exports = {
  crearClienteValidators,
  actualizarClienteValidators,
  idClienteValidator,
  cambiarEstadoClienteValidators,
};
