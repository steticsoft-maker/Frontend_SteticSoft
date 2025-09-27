// src/controllers/movil/ventas.controller.js
const ventaService = require("../../services/venta.service.js");
const categoriaProductoService = require("../../services/categoriaProducto.service.js");
const productoService = require("../../services/producto.service.js");

/**
 * Obtiene las categorías de productos públicas para clientes móviles
 */
const obtenerCategoriasProducto = async (req, res, next) => {
  try {
    const categorias =
      await categoriaProductoService.obtenerCategoriasPublicas();
    res.status(200).json({
      success: true,
      message: "Categorías de productos obtenidas exitosamente.",
      data: categorias,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene los productos públicos de una categoría específica
 */
const obtenerProductosPorCategoria = async (req, res, next) => {
  try {
    const { idCategoria } = req.params;
    const { pagina = 1, limite = 20 } = req.query;

    const productos =
      await productoService.obtenerProductosPublicosPorCategoria(idCategoria, {
        pagina: parseInt(pagina),
        limite: parseInt(limite),
      });

    res.status(200).json({
      success: true,
      message: "Productos obtenidos exitosamente.",
      data: productos,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Crea una nueva venta desde la aplicación móvil
 */
const crearVentaMovil = async (req, res, next) => {
  try {
    const { productos = [], servicios = [] } = req.body;
    const idCliente = req.usuario.clienteInfo.idCliente;

    // Estado por defecto para ventas móviles (Pendiente)
    const idEstadoPendiente = 2;

    const datosVenta = {
      fecha: new Date(),
      idCliente,
      idEstado: idEstadoPendiente,
      productos,
      servicios,
    };

    const venta = await ventaService.crearVenta(datosVenta, req.usuario);

    res.status(201).json({
      success: true,
      message:
        "Pedido creado exitosamente. Recibirás una confirmación por correo.",
      data: venta,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene el historial de ventas del cliente autenticado
 */
const obtenerMisVentas = async (req, res, next) => {
  try {
    const idCliente = req.usuario.clienteInfo.idCliente;
    const { pagina = 1, limite = 10 } = req.query;

    const ventas = await ventaService.obtenerVentasPorCliente(idCliente, {
      pagina: parseInt(pagina),
      limite: parseInt(limite),
    });

    res.status(200).json({
      success: true,
      message: "Historial de pedidos obtenido exitosamente.",
      data: ventas,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene el detalle de una venta específica del cliente autenticado
 */
const obtenerDetalleVenta = async (req, res, next) => {
  try {
    const { idVenta } = req.params;
    const idCliente = req.usuario.clienteInfo.idCliente;

    const venta = await ventaService.obtenerVentaPorCliente(idVenta, idCliente);

    res.status(200).json({
      success: true,
      message: "Detalle de pedido obtenido exitosamente.",
      data: venta,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Permite al cliente cancelar su pedido (solo si está pendiente)
 */
const cancelarVenta = async (req, res, next) => {
  try {
    const { idVenta } = req.params;
    const idCliente = req.usuario.clienteInfo.idCliente;

    const venta = await ventaService.cancelarVentaPorCliente(
      idVenta,
      idCliente
    );

    res.status(200).json({
      success: true,
      message: "Pedido cancelado exitosamente.",
      data: venta,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  obtenerCategoriasProducto,
  obtenerProductosPorCategoria,
  crearVentaMovil,
  obtenerMisVentas,
  obtenerDetalleVenta,
  cancelarVenta,
};
