// src/routes/movil/clientes.routes.js
const express = require("express");
const router = express.Router();
const clientesController = require("../../controllers/movil/clientes.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const {
  checkRole,
  checkPermission,
} = require("../../middlewares/authorization.middleware.js");
const {
  validarActualizarMiPerfil,
} = require("../../validators/movil.validators.js");
const {
  verificarPropiedadCliente,
} = require("../../middlewares/movil-security.middleware.js");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Middleware de autorización - solo clientes pueden acceder
router.use(checkRole(["Cliente"]));

// Middleware de seguridad móvil - verificar propiedad del cliente
router.use(verificarPropiedadCliente);

// GET /api/movil/clientes/mi-perfil - Obtener perfil del cliente
router.get(
  "/clientes/mi-perfil",
  checkPermission("MODULO_CLIENTES_VER_PROPIO"),
  clientesController.obtenerMiPerfil
);

// PUT /api/movil/clientes/mi-perfil - Actualizar perfil del cliente
router.put(
  "/clientes/mi-perfil",
  checkPermission("MODULO_CLIENTES_VER_PROPIO"),
  validarActualizarMiPerfil,
  clientesController.actualizarMiPerfil
);

module.exports = router;
