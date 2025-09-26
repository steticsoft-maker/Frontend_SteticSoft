// src/validators/movil.validators.js
const { body, param, query, validationResult } = require("express-validator");
const { BadRequestError } = require("../errors/index.js");

/**
 * Middleware para manejar errores de validación
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    throw new BadRequestError(
      `Errores de validación: ${errorMessages.join(", ")}`
    );
  }
  next();
};

/**
 * Validadores para ventas móviles
 */
const validarCrearVentaMovil = [
  body("productos")
    .optional()
    .isArray()
    .withMessage("Los productos deben ser un array"),
  body("productos.*.idProducto")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID del producto debe ser un número entero positivo"),
  body("productos.*.cantidad")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La cantidad debe ser un número entero positivo"),
  body("servicios")
    .optional()
    .isArray()
    .withMessage("Los servicios deben ser un array"),
  body("servicios.*.idServicio")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID del servicio debe ser un número entero positivo"),
  body("servicios.*.idCita")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de la cita debe ser un número entero positivo"),
  body().custom((value, { req }) => {
    const { productos = [], servicios = [] } = value;
    if (productos.length === 0 && servicios.length === 0) {
      throw new Error("Debes incluir al menos un producto o un servicio");
    }
    return true;
  }),
  handleValidationErrors,
];

const validarObtenerProductosPorCategoria = [
  param("idCategoria")
    .isInt({ min: 1 })
    .withMessage("El ID de la categoría debe ser un número entero positivo"),
  query("pagina")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero positivo"),
  query("limite")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("El límite debe ser un número entre 1 y 50"),
  handleValidationErrors,
];

const validarObtenerMisVentas = [
  query("pagina")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero positivo"),
  query("limite")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("El límite debe ser un número entre 1 y 50"),
  handleValidationErrors,
];

const validarObtenerDetalleVenta = [
  param("idVenta")
    .isInt({ min: 1 })
    .withMessage("El ID de la venta debe ser un número entero positivo"),
  handleValidationErrors,
];

const validarCancelarVenta = [
  param("idVenta")
    .isInt({ min: 1 })
    .withMessage("El ID de la venta debe ser un número entero positivo"),
  handleValidationErrors,
];

/**
 * Validadores para citas móviles
 */
const validarCrearCitaMovil = [
  body("fecha")
    .isISO8601()
    .withMessage("La fecha debe estar en formato ISO 8601 (YYYY-MM-DD)"),
  body("hora_inicio")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("La hora debe estar en formato HH:MM (24 horas)"),
  body("usuarioId")
    .isInt({ min: 1 })
    .withMessage("El ID del empleado debe ser un número entero positivo"),
  body("servicios")
    .isArray({ min: 1 })
    .withMessage("Debes seleccionar al menos un servicio"),
  body("servicios.*")
    .isInt({ min: 1 })
    .withMessage("Cada servicio debe ser un ID válido"),
  handleValidationErrors,
];

const validarObtenerMisCitas = [
  query("pagina")
    .optional()
    .isInt({ min: 1 })
    .withMessage("La página debe ser un número entero positivo"),
  query("limite")
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage("El límite debe ser un número entre 1 y 50"),
  query("estado")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El estado debe ser un ID válido"),
  handleValidationErrors,
];

const validarCancelarCita = [
  param("idCita")
    .isInt({ min: 1 })
    .withMessage("El ID de la cita debe ser un número entero positivo"),
  handleValidationErrors,
];

/**
 * Validadores para perfil de cliente
 */
const validarActualizarMiPerfil = [
  body("nombre")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El nombre debe tener entre 2 y 50 caracteres"),
  body("apellido")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("El apellido debe tener entre 2 y 50 caracteres"),
  body("telefono")
    .optional()
    .trim()
    .isLength({ min: 7, max: 15 })
    .withMessage("El teléfono debe tener entre 7 y 15 caracteres"),
  body("direccion")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("La dirección no puede exceder 200 caracteres"),
  body("correo")
    .optional()
    .isEmail()
    .withMessage("El correo debe tener un formato válido"),
  handleValidationErrors,
];

module.exports = {
  // Validadores de ventas
  validarCrearVentaMovil,
  validarObtenerProductosPorCategoria,
  validarObtenerMisVentas,
  validarObtenerDetalleVenta,
  validarCancelarVenta,

  // Validadores de citas
  validarCrearCitaMovil,
  validarObtenerMisCitas,
  validarCancelarCita,

  // Validadores de perfil
  validarActualizarMiPerfil,
};
