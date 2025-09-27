// src/routes/movil/empleados.routes.js
const express = require("express");
const router = express.Router();
const empleadosController = require("../../controllers/movil/empleados.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const {
  checkRole,
  checkPermission,
} = require("../../middlewares/authorization.middleware.js");
const {
  verificarPropiedadCliente,
} = require("../../middlewares/movil-security.middleware.js");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Middleware de autorización - solo clientes pueden acceder
router.use(checkRole(["Cliente"]));

// Middleware de seguridad móvil - verificar propiedad del cliente
router.use(verificarPropiedadCliente);

// GET /api/movil/empleados/disponibles - Listar empleados disponibles para citas
router.get(
  "/empleados/disponibles",
  checkPermission("MODULO_MOVIL_CITAS_VER_EMPLEADOS"),
  empleadosController.obtenerEmpleadosDisponibles
);

module.exports = router;
