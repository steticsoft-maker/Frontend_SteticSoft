// src/routes/movil/index.js
const express = require("express");
const router = express.Router();

// Importar las rutas móviles
const ventasRoutes = require("./ventas.routes.js");
const citasRoutes = require("./citas.routes.js");
const clientesRoutes = require("./clientes.routes.js");

// Montar las rutas móviles
router.use("/", ventasRoutes);
router.use("/", citasRoutes);
router.use("/", clientesRoutes);

module.exports = router;
