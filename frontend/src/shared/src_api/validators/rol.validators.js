// src/validators/rol.validators.js

// MODIFICADO: Importación de validadores compartidos.
const {
  nombreRolValidator,
  descripcionValidator,
  estadoValidator,
  idParamValidator,
} = require('./shared.validators.js');
const { body, param } = require("express-validator");
const {
  handleValidationErrors,
} = require("../middlewares/validation.middleware.js");

const tipoPerfilValues = ["CLIENTE", "EMPLEADO", "NINGUNO"];

// MODIFICADO: Se utilizan los validadores compartidos para 'nombre', 'descripcion' y 'estado'.
const crearRolValidators = [
  nombreRolValidator(),
  descripcionValidator(),
  estadoValidator(),
  body("tipoPerfil")
    .optional()
    .isString()
    .withMessage("El tipo de perfil debe ser un string.")
    .isIn(tipoPerfilValues)
    .withMessage(
      `El tipo de perfil debe ser uno de los siguientes valores: ${tipoPerfilValues.join(", ")}`
    ),
  handleValidationErrors,
];

// MODIFICADO: Se utiliza el validador de ID compartido y se aplican las mismas reglas de seguridad a los campos opcionales.
const actualizarRolValidators = [
  idParamValidator('idRol'),

  // MODIFICADO: Se aplica sanitización y validación estricta al nombre, pero se mantiene como opcional.
  body("nombre")
    .optional()
    .trim()
    .escape() // NUEVA REGLA: Sanitización
    .notEmpty().withMessage("El nombre del rol no puede estar vacío si se proporciona.")
    .isLength({ min: 3, max: 50 }).withMessage("El nombre del rol debe tener entre 3 y 50 caracteres.")
    .matches(/^[a-zA-Z\u00C0-\u017F\s]+$/).withMessage('El nombre del rol solo puede contener letras y espacios.'),

  // MODIFICADO: Se usa el validador de descripción compartido, que ya es opcional.
  descripcionValidator(),

  // MODIFICADO: Se usa el validador de estado compartido.
  estadoValidator(),

  body("tipoPerfil")
    .optional()
    .isString()
    .withMessage("El tipo de perfil debe ser un string.")
    .isIn(tipoPerfilValues)
    .withMessage(
      `El tipo de perfil debe ser uno de los siguientes valores: ${tipoPerfilValues.join(", ")}`
    ),
  handleValidationErrors,
];

// MODIFICADO: Se utiliza el validador de ID compartido.
const idRolValidator = [
  idParamValidator('idRol'),
  handleValidationErrors,
];

// MODIFICADO: Se utiliza el validador de ID compartido.
const gestionarPermisosRolValidators = [
  idParamValidator('idRol'),
  body('idPermisos')
    .isArray({ min: 1 }).withMessage('Se requiere un array de idPermisos con al menos un elemento.')
    .custom((idPermisos) => {
      if (!idPermisos.every(id => Number.isInteger(id) && id > 0)) {
        throw new Error('Cada idPermiso en el array debe ser un entero positivo.');
      }
      return true;
    }),
  handleValidationErrors
];

// MODIFICADO: Se utiliza el validador de ID compartido para ambos parámetros.
const gestionarUnPermisoRolValidators = [
  idParamValidator('idRol'),
  idParamValidator('idPermiso'),
  handleValidationErrors
];

// MODIFICADO: Se utiliza el validador de ID compartido.
const cambiarEstadoRolValidators = [
  idParamValidator('idRol'),
  body("estado")
    .exists({ checkFalsy: false })
    .withMessage(
      "El campo 'estado' es obligatorio en el cuerpo de la solicitud."
    )
    .isBoolean()
    .withMessage("El valor de 'estado' debe ser un booleano (true o false)."),
  handleValidationErrors,
];

module.exports = {
  crearRolValidators,
  actualizarRolValidators,
  idRolValidator,
  gestionarPermisosRolValidators,
  gestionarUnPermisoRolValidators,
  cambiarEstadoRolValidators,
};
