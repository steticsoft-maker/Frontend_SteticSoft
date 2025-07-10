// src/routes/usuario.routes.js
const express = require("express");
const router = express.Router();
const usuarioController = require("../controllers/usuario.controller.js");
const usuarioValidators = require("../validators/usuario.validators.js");

const authMiddleware = require("../middlewares/auth.middleware.js");
const {
  checkPermission,
  checkRole, // Import checkRole
} = require("../middlewares/authorization.middleware.js");

const PERMISO_MODULO_USUARIOS = "MODULO_USUARIOS_GESTIONAR"; // Used for general user management actions
const PERMISO_USUARIOS_ADMIN_OPERATIONS = "MODULO_USUARIOS_ADMIN_OPERATIONS"; // Potentially for more sensitive operations like soft delete

// Nota: Asumimos que el validador de ID es el mismo para todos los params :idUsuario
const { idUsuarioValidator } = usuarioValidators;

router.post(
  "/",
  authMiddleware,
  checkPermission(PERMISO_MODULO_USUARIOS),
  usuarioValidators.crearUsuarioValidators,
  usuarioController.crearUsuario
);

router.get(
  "/",
  authMiddleware,
  checkPermission(PERMISO_MODULO_USUARIOS),
  usuarioController.listarUsuarios
);

// Ruta para verificar correo (PÚBLICA)
router.get(
  "/verificar-correo",
  usuarioValidators.verificarCorreoValidators,
  usuarioController.verificarCorreo
);

router.get(
  "/:idUsuario",
  authMiddleware,
  checkPermission(PERMISO_MODULO_USUARIOS),
  idUsuarioValidator,
  usuarioController.obtenerUsuarioPorId
);

router.put(
  "/:idUsuario",
  authMiddleware,
  checkPermission(PERMISO_MODULO_USUARIOS),
  usuarioValidators.actualizarUsuarioValidators,
  usuarioController.actualizarUsuario
);

// Ruta para cambiar el estado de un usuario (Activo <-> Inactivo)
// El controlador usuarioController.toggleUsuarioEstado se creará/ajustará en el siguiente paso.
router.patch(
  "/:idUsuario/toggle-estado", // Renamed for clarity
  authMiddleware,
  checkPermission(PERMISO_MODULO_USUARIOS), // General permission to manage users
  idUsuarioValidator, // Ensure idUsuario is valid
  // usuarioValidators.cambiarEstadoUsuarioValidators, // This might be too specific if it validates 'estado' in body. toggle doesn't need body.
  usuarioController.toggleUsuarioEstado // This controller will use the new service
);

// Ruta para el borrado lógico (desactivar y bloquear cuenta)
router.patch(
  "/:idUsuario/desactivar",
  authMiddleware,
  // Using PERMISO_MODULO_USUARIOS, assuming it's sufficient.
  // Or, a more specific permission like PERMISO_USUARIOS_ADMIN_OPERATIONS could be used if defined.
  checkPermission(PERMISO_MODULO_USUARIOS),
  idUsuarioValidator,
  usuarioController.desactivarUsuario // Este controlador se creará en el siguiente paso
);

// Ruta para el borrado físico (ahora controlado por permiso)
router.delete(
  "/:idUsuario",
  authMiddleware,
  checkPermission(PERMISO_MODULO_USUARIOS), // Cambiado de checkRole a checkPermission
  idUsuarioValidator,
  usuarioController.eliminarUsuarioFisico // Este controlador ya existe y usa el servicio actualizado
);

module.exports = router;
