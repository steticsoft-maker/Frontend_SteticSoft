// src/routes/movil/novedades.routes.js
const express = require("express");
const router = express.Router();
const novedadesController = require("../../controllers/movil/novedades.controller.js");
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

// GET /api/movil/novedades/disponibles - Listar novedades disponibles para citas
router.get(
  "/novedades/disponibles",
  checkPermission("MODULO_MOVIL_CITAS_VER_NOVEDADES"),
  novedadesController.obtenerNovedadesDisponibles
);

module.exports = router;
