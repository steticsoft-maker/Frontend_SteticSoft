// src/routes/movil/citas.routes.js
const express = require("express");
const router = express.Router();
const citasController = require("../../controllers/movil/citas.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const {
  checkRole,
  checkPermission,
} = require("../../middlewares/authorization.middleware.js");
const {
  validarCrearCitaMovil,
  validarObtenerMisCitas,
  validarCancelarCita,
} = require("../../validators/movil.validators.js");
const {
  verificarPropiedadCliente,
  verificarPropiedadCita,
  validarFechaFutura,
  validarHorarioTrabajo,
} = require("../../middlewares/movil-security.middleware.js");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Middleware de autorización - solo clientes pueden acceder
router.use(checkRole(["Cliente"]));

// Middleware de seguridad móvil - verificar propiedad del cliente
router.use(verificarPropiedadCliente);

// GET /api/movil/citas/mis-citas - Listar citas del cliente
router.get(
  "/citas/mis-citas",
  checkPermission("MODULO_CITAS_VER_PROPIAS"),
  validarObtenerMisCitas,
  citasController.obtenerMisCitas
);

// POST /api/movil/citas - Crear una nueva cita con asignación automática
router.post(
  "/citas",
  checkPermission("MODULO_MOVIL_CITAS_ASIGNAR_EMPLEADO"),
  validarFechaFutura,
  validarHorarioTrabajo,
  validarCrearCitaMovil,
  citasController.crearCitaMovil
);

// PATCH /api/movil/citas/:idCita/estado - Cancelar cita
router.patch(
  "/citas/:idCita/estado",
  checkPermission("MODULO_CITAS_CANCELAR_PROPIA"),
  verificarPropiedadCita,
  validarCancelarCita,
  citasController.cancelarCita
);

// GET /api/movil/servicios - Obtener servicios disponibles
router.get(
  "/servicios",
  checkPermission("MODULO_SERVICIOS_VER"),
  citasController.obtenerServiciosDisponibles
);

module.exports = router;
