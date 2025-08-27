// src/validators/auth.validators.js

// MODIFICADO: Importación de validadores compartidos para reutilización y consistencia.
const {
  nombreValidator,
  correoValidator,
  contrasenaValidator,
  telefonoValidator,
  numeroDocumentoValidator,
  tipoDocumentoValidator,
} = require('./shared.validators.js');
const { body } = require("express-validator");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware.js");
const db = require("../models");

// MODIFICADO: Se utilizan los validadores compartidos para robustecer y estandarizar las reglas.
const registrarUsuarioValidators = [
  // --- Campos de Usuario ---
  // MODIFICADO: Se usa el validador de correo compartido y se mantiene la validación de unicidad.
  correoValidator().custom(async (value) => {
    const usuarioExistente = await db.Usuario.findOne({
      where: { correo: value },
    });
    if (usuarioExistente) {
      return Promise.reject(
        "El correo electrónico ya está registrado para una cuenta."
      );
    }
  }),
  // NUEVA REGLA: Se implementa la validación de contraseña segura.
  contrasenaValidator(),

  // --- Campos de Cliente (obligatorios para el registro) ---
  // MODIFICADO: Se reemplazan validaciones manuales por los validadores compartidos.
  nombreValidator('nombre'),
  nombreValidator('apellido'),
  telefonoValidator(),
  tipoDocumentoValidator(),

  // MODIFICADO: Se usa el validador de documento compartido y se mantiene la validación de unicidad.
  numeroDocumentoValidator().custom(async (value) => {
    const clienteExistente = await db.Cliente.findOne({
      where: { numeroDocumento: value },
    });
    if (clienteExistente) {
      return Promise.reject(
        "El número de documento ya está registrado para otro cliente."
      );
    }
  }),

  // Se mantiene la validación original para fecha de nacimiento, que es específica.
  body("fechaNacimiento")
    .notEmpty()
    .withMessage("La fecha de nacimiento es obligatoria.")
    .isISO8601()
    .withMessage(
      "La fecha de nacimiento debe ser una fecha válida (YYYY-MM-DD)."
    )
    .toDate(),

  handleValidationErrors,
];

// MODIFICADO: Se utiliza el validador de correo compartido.
const loginValidators = [
  correoValidator(),
  // Para el login, solo se requiere que la contraseña no esté vacía.
  body("contrasena").notEmpty().withMessage("La contraseña es obligatoria."),
  handleValidationErrors,
];

// MODIFICADO: Se utiliza el validador de correo compartido.
const solicitarRecuperacionValidators = [
  correoValidator(),
  handleValidationErrors,
];

// MODIFICADO: Se mejora la seguridad y la robustez de la validación de reseteo de contraseña.
const resetearContrasenaValidators = [
  body("token")
    .trim()
    .escape() // NUEVA REGLA: Sanitización del token para prevenir XSS.
    .notEmpty()
    .withMessage("El token de recuperación es obligatorio."),

  // NUEVA REGLA: Se usa el validador de contraseña segura para la nueva contraseña.
  contrasenaValidator('nuevaContrasena'),

  // Se mantiene la lógica de confirmación de contraseña.
  body("confirmarNuevaContrasena")
    .notEmpty()
    .withMessage("La confirmación de la nueva contraseña es obligatoria.")
    .custom((value, { req }) => {
      if (value !== req.body.nuevaContrasena) {
        throw new Error(
          "La confirmación de la contraseña no coincide con la nueva contraseña."
        );
      }
      return true;
    }),
  handleValidationErrors,
];

module.exports = {
  registrarUsuarioValidators,
  loginValidators,
  solicitarRecuperacionValidators,
  resetearContrasenaValidators,
};
