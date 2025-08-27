// frontend/src/shared/src_api/validators/shared.validators.js
const { body, param } = require('express-validator');

// --- Reusable Validation Chains ---

/**
 * Valida un nombre propio (nombre, apellido).
 * Reglas:
 * - No vacío
 * - Solo letras, espacios y acentos.
 * - Longitud entre 2 y 100 caracteres.
 * - Sanitiza con trim() y escape().
 */
const nombreValidator = (fieldName = 'nombre') =>
  body(fieldName)
    .trim()
    .escape()
    .notEmpty().withMessage(`El ${fieldName} es obligatorio.`)
    .isString().withMessage(`El ${fieldName} debe ser una cadena de texto.`)
    .isLength({ min: 2, max: 100 }).withMessage(`El ${fieldName} debe tener entre 2 y 100 caracteres.`)
    .matches(/^[a-zA-Z\u00C0-\u017F\s]+$/).withMessage(`El ${fieldName} solo puede contener letras y espacios.`);

/**
 * Valida un nombre de rol.
 * Reglas:
 * - No vacío
 * - Solo letras, espacios y acentos.
 * - Longitud entre 3 y 50 caracteres.
 */
const nombreRolValidator = () =>
  body('nombre')
    .trim()
    .escape()
    .notEmpty().withMessage('El nombre del rol es obligatorio.')
    .isString().withMessage('El nombre del rol debe ser una cadena de texto.')
    .isLength({ min: 3, max: 50 }).withMessage('El nombre del rol debe tener entre 3 y 50 caracteres.')
    .matches(/^[a-zA-Z\u00C0-\u017F\s]+$/).withMessage('El nombre del rol solo puede contener letras y espacios.');


/**
 * Valida un correo electrónico.
 * Reglas:
 * - No vacío.
 * - Formato de email válido.
 * - Sanitiza con trim() y normalizeEmail().
 */
const correoValidator = () =>
  body('correo')
    .trim()
    .notEmpty().withMessage('El correo electrónico es obligatorio.')
    .isEmail().withMessage('Debe proporcionar un correo electrónico válido.')
    .normalizeEmail();

/**
 * Valida una contraseña con política de seguridad.
 * Reglas:
 * - Mínimo 8 caracteres.
 * - Al menos 1 mayúscula, 1 minúscula, 1 número y 1 símbolo.
 */
const contrasenaValidator = (fieldName = 'contrasena') =>
  body(fieldName)
    .notEmpty().withMessage('La contraseña es obligatoria.')
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 1,
    }).withMessage('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.');

/**
 * Valida un número de teléfono.
 * Reglas:
 * - No vacío.
 * - Longitud entre 7 y 20 caracteres.
 * - Solo permite números, espacios y los símbolos + ( ) -.
 */
const telefonoValidator = () =>
  body('telefono')
    .trim()
    .escape()
    .notEmpty().withMessage('El teléfono es obligatorio.')
    .isLength({ min: 7, max: 20 }).withMessage('El teléfono debe tener entre 7 y 20 caracteres.')
    .matches(/^[0-9\s+()-]+$/).withMessage('El teléfono solo puede contener números y los símbolos: + ( ) -');

/**
 * Valida un número de documento.
 * Reglas:
 * - No vacío.
 * - Alfanumérico (permitiendo guiones).
 * - Longitud entre 5 y 45 caracteres.
 */
const numeroDocumentoValidator = () =>
  body('numeroDocumento')
    .trim()
    .escape()
    .notEmpty().withMessage('El número de documento es obligatorio.')
    .isLength({ min: 5, max: 45 }).withMessage('El número de documento debe tener entre 5 y 45 caracteres.')
    .isAlphanumeric('es-ES', { ignore: ' -' }).withMessage('El número de documento solo puede contener letras, números y guiones.');

/**
 * Valida el tipo de documento.
 */
const tipoDocumentoValidator = () =>
    body('tipoDocumento')
        .trim()
        .notEmpty().withMessage('El tipo de documento es obligatorio.')
        .isIn(['Cédula de Ciudadanía', 'Cédula de Extranjería', 'Pasaporte', 'Tarjeta de Identidad'])
        .withMessage('Tipo de documento no válido.');

/**
 * Valida una descripción genérica o texto largo.
 * Reglas:
 * - Opcional.
 * - Máximo 255 caracteres.
 * - Sanitiza con trim() y escape().
 */
const descripcionValidator = (fieldName = 'descripcion') =>
  body(fieldName)
    .optional({ nullable: true })
    .trim()
    .escape()
    .isLength({ max: 255 }).withMessage(`La ${fieldName} no debe exceder los 255 caracteres.`);

/**
 * Valida un ID numérico en los parámetros de la ruta.
 */
const idParamValidator = (paramName = 'id') =>
  param(paramName)
    .isInt({ gt: 0 }).withMessage(`El ID '${paramName}' debe ser un entero positivo.`);


/**
 * Valida un campo de estado booleano.
 */
const estadoValidator = (fieldName = 'estado') =>
    body(fieldName)
        .optional()
        .isBoolean().withMessage(`El campo '${fieldName}' debe ser un valor booleano (true o false).`);


module.exports = {
  nombreValidator,
  nombreRolValidator,
  correoValidator,
  contrasenaValidator,
  telefonoValidator,
  numeroDocumentoValidator,
  tipoDocumentoValidator,
  descripcionValidator,
  idParamValidator,
  estadoValidator
};
