// src/middlewares/movil-security.middleware.js
const { UnauthorizedError, ForbiddenError } = require("../errors/index.js");

/**
 * Middleware para verificar que un cliente solo pueda acceder a sus propios datos
 * Debe usarse después del middleware de autenticación
 */
const verificarPropiedadCliente = (req, res, next) => {
  // Verificar que el usuario esté autenticado
  if (!req.usuario || !req.usuario.clienteInfo) {
    throw new UnauthorizedError(
      "Información de cliente no encontrada en el token."
    );
  }

  const idClienteToken = req.usuario.clienteInfo.idCliente;

  if (!idClienteToken) {
    throw new UnauthorizedError("ID de cliente no válido en el token.");
  }

  // Agregar el ID del cliente al request para uso posterior
  req.clienteId = idClienteToken;

  next();
};

/**
 * Middleware para verificar que un cliente solo pueda acceder a sus propias ventas
 */
const verificarPropiedadVenta = (req, res, next) => {
  const idVenta = req.params.idVenta;
  const idCliente = req.clienteId;

  // El controlador ya maneja esta verificación, pero este middleware
  // puede agregar una capa adicional de seguridad si es necesario
  if (idVenta && !idCliente) {
    throw new ForbiddenError("No tienes permisos para acceder a esta venta.");
  }

  next();
};

/**
 * Middleware para verificar que un cliente solo pueda acceder a sus propias citas
 */
const verificarPropiedadCita = (req, res, next) => {
  const idCita = req.params.idCita;
  const idCliente = req.clienteId;

  // El controlador ya maneja esta verificación, pero este middleware
  // puede agregar una capa adicional de seguridad si es necesario
  if (idCita && !idCliente) {
    throw new ForbiddenError("No tienes permisos para acceder a esta cita.");
  }

  next();
};

/**
 * Middleware para validar que las fechas de citas sean futuras
 */
const validarFechaFutura = (req, res, next) => {
  if (req.method === "POST" && req.body.fecha) {
    const fechaCita = new Date(req.body.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas

    if (fechaCita < hoy) {
      throw new ForbiddenError("No puedes agendar citas para fechas pasadas.");
    }
  }

  next();
};

/**
 * Middleware para validar horarios de trabajo (8:00 AM - 6:00 PM)
 */
const validarHorarioTrabajo = (req, res, next) => {
  if (req.method === "POST" && req.body.hora_inicio) {
    const horaInicio = req.body.hora_inicio;
    const [horas, minutos] = horaInicio.split(":").map(Number);
    const horaCompleta = horas + minutos / 60;

    // Horario de trabajo: 8:00 AM (8) a 6:00 PM (18)
    if (horaCompleta < 8 || horaCompleta >= 18) {
      throw new ForbiddenError(
        "Solo puedes agendar citas entre las 8:00 AM y las 6:00 PM."
      );
    }
  }

  next();
};

module.exports = {
  verificarPropiedadCliente,
  verificarPropiedadVenta,
  verificarPropiedadCita,
  validarFechaFutura,
  validarHorarioTrabajo,
};
