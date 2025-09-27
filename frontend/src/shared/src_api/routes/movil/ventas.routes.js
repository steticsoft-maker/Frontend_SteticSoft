// src/routes/movil/ventas.routes.js
const express = require("express");
const router = express.Router();
const ventasController = require("../../controllers/movil/ventas.controller.js");
const authMiddleware = require("../../middlewares/auth.middleware.js");
const {
  checkRole,
  checkPermission,
} = require("../../middlewares/authorization.middleware.js");
const {
  validarCrearVentaMovil,
  validarObtenerProductosPorCategoria,
  validarObtenerMisVentas,
  validarObtenerDetalleVenta,
  validarCancelarVenta,
} = require("../../validators/movil.validators.js");
const {
  verificarPropiedadCliente,
  verificarPropiedadVenta,
} = require("../../middlewares/movil-security.middleware.js");

// Middleware de autenticación para todas las rutas
router.use(authMiddleware);

// Middleware de autorización - solo clientes pueden acceder
router.use(checkRole(["Cliente"]));

// Middleware de seguridad móvil - verificar propiedad del cliente
router.use(verificarPropiedadCliente);

// GET /api/movil/categorias-producto - Listar categorías públicas
router.get(
  "/categorias-producto",
  checkPermission("MODULO_CATEGORIAS_PRODUCTOS_VER"),
  ventasController.obtenerCategoriasProducto
);

// GET /api/movil/productos/:idCategoria - Listar productos de una categoría
router.get(
  "/productos/:idCategoria",
  checkPermission("MODULO_PRODUCTOS_VER"),
  validarObtenerProductosPorCategoria,
  ventasController.obtenerProductosPorCategoria
);

// POST /api/movil/ventas - Crear un nuevo pedido
router.post(
  "/ventas",
  checkPermission("MODULO_VENTAS_CREAR_PROPIA"),
  validarCrearVentaMovil,
  ventasController.crearVentaMovil
);

// GET /api/movil/ventas/mis-ventas - Obtener historial de pedidos del cliente
router.get(
  "/ventas/mis-ventas",
  checkPermission("MODULO_VENTAS_VER_PROPIAS"),
  validarObtenerMisVentas,
  ventasController.obtenerMisVentas
);

// GET /api/movil/ventas/:idVenta - Detalle de un pedido específico
router.get(
  "/ventas/:idVenta",
  checkPermission("MODULO_VENTAS_VER_PROPIAS"),
  verificarPropiedadVenta,
  validarObtenerDetalleVenta,
  ventasController.obtenerDetalleVenta
);

// PATCH /api/movil/ventas/:idVenta/anular - Cancelar pedido
router.patch(
  "/ventas/:idVenta/anular",
  checkPermission("MODULO_VENTAS_VER_PROPIAS"),
  verificarPropiedadVenta,
  validarCancelarVenta,
  ventasController.cancelarVenta
);

module.exports = router;
