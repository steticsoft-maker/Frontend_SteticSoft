// src/shared/src_api/services/compra.service.js

const db = require("../models/index.js");
const { Op } = db.Sequelize;
const {
  NotFoundError,
  ConflictError,
  CustomError,
  BadRequestError,
} = require("../errors/index.js");
const { checkAndSendStockAlert } = require("../utils/stockAlertHelper.js");

const TASA_IVA = 0.19;

/**
 * Crear una nueva compra y sus detalles.
 */
const crearCompra = async (datosCompra) => {                                 /* (1) Inicio */
  const { fecha, proveedorId, productos, estado } = datosCompra;
  let { total, iva } = datosCompra;
  let subtotalCalculado = 0;
  const productosValidados = [];
  for (const item of productos) {                                            /* (2) Iterar productos */
    productosValidados.push({ ...item });
    subtotalCalculado += item.cantidad * item.valorUnitario;
  }
  if (total === undefined) {                                                 /* (3) Calcular total e IVA */
    if (iva === undefined) iva = subtotalCalculado * TASA_IVA;
    total = subtotalCalculado + iva;
  } else if (iva === undefined) {
    iva = (total / (1 + TASA_IVA)) * TASA_IVA;
  }
  const estadoCompra = typeof estado === "boolean" ? estado : true;
  const transaction = await db.sequelize.transaction();
  let nuevaCompra;
  try {                                                                      /* (4) Crear compra */
    nuevaCompra = await db.Compra.create({
      fecha: fecha || new Date(),
      idProveedor: proveedorId,
      total: parseFloat(total).toFixed(2),
      iva: parseFloat(iva).toFixed(2),
      estado: estadoCompra,
    }, { transaction });

    const detallesCompra = [];
    const productosAfectadosParaAlerta = [];

    for (const item of productosValidados) {                                 /* (5) Iterar productos validados */
      const detalle = await db.CompraXProducto.create({
        idCompra: nuevaCompra.idCompra,
        idProducto: item.productoId,
        cantidad: item.cantidad,
        valorUnitario: parseFloat(item.valorUnitario).toFixed(2),
      }, { transaction });
      detallesCompra.push(detalle);
      if (estadoCompra) {                                                    /* (6) Actualizar stock si compra activa */
        const productoDB = await db.Producto.findByPk(item.productoId, { transaction });
        await productoDB.increment("existencia", { by: item.cantidad, transaction });
        productosAfectadosParaAlerta.push(productoDB.idProducto);
      }
    }
    await transaction.commit();                                              /* (7) Confirmar transacción */
    for (const productoIdAfectado of productosAfectadosParaAlerta) {         /* (8) Revisar alertas */
      const productoActualizado = await db.Producto.findByPk(productoIdAfectado);
      if (productoActualizado) {
        await checkAndSendStockAlert(productoActualizado, `tras compra ID ${nuevaCompra.idCompra}`);
      }
    }
    const compraCreadaJSON = nuevaCompra.toJSON();
    compraCreadaJSON.detalles = detallesCompra.map((d) => d.toJSON());
    return compraCreadaJSON;                                                 /* (9) Retornar compra → Fin */
  } catch (error) {                                                          /* (10) Manejo de errores */
    await transaction.rollback();
    throw new CustomError(`Error al crear la compra: ${error.message}`, 500); /* (11) Error → Fin */
  }
};                                                                           /* (Fin) */



const obtenerTodasLasCompras = async (opcionesDeFiltro = {}) => {
  try {
    const compras = await db.Compra.findAll({
      where: opcionesDeFiltro,
      include: [
        {
          model: db.Proveedor,
          as: "proveedor",
          attributes: ["idProveedor", "nombre"],
        },
        {
          model: db.Producto,
          // CORRECCIÓN: Usar el alias correcto definido en el modelo Compra
          as: "productos", // Antes: 'productosComprados'
          attributes: [
            "idProducto",
            "nombre",
            "precio",
            "stockMinimo",
            "existencia",
          ],
          through: {
            // El alias de la tabla de unión se define en el modelo de la tabla de unión,
            // por lo que no es necesario aquí si no se necesita un alias específico en la consulta.
            model: db.CompraXProducto,
            as: "detalleCompra",
            attributes: ["cantidad", "valorUnitario"],
          },
        },
      ],
      order: [
        ["fecha", "DESC"],
        ["idCompra", "DESC"],
      ],
    });
    return compras;
  } catch (error) {
    console.error(
      "Error al obtener todas las compras:",
      error.message,
      error.stack
    );
    throw new CustomError(`Error al obtener compras: ${error.message}`, 500);
  }
};

const obtenerCompraPorId = async (idCompra) => {
  try {
    const compra = await db.Compra.findByPk(idCompra, {
      include: [
        { model: db.Proveedor, as: "proveedor" },
        {
          model: db.Producto,
          as: "productos", // CORRECCIÓN: Usar el alias correcto
          attributes: [
            "idProducto",
            "nombre",
            "precio",
            "stockMinimo",
            "existencia",
          ],
          through: {
            model: db.CompraXProducto,
            as: "detalleCompra", // Este alias se puede definir para la tabla de unión en la consulta
            attributes: ["cantidad", "valorUnitario"],
          },
        },
      ],
    });
    if (!compra) {
      throw new NotFoundError("Compra no encontrada.");
    }
    return compra;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    console.error(
      `Error al obtener la compra con ID ${idCompra}:`,
      error.message
    );
    throw new CustomError(`Error al obtener la compra: ${error.message}`, 500);
  }
};



const anularCompra = async (idCompra) => {
  const transaction = await db.sequelize.transaction();
  try {
    const compra = await db.Compra.findByPk(idCompra, {
      include: [
        {
          model: db.Producto,
          as: "productos", // CORRECCIÓN: Usar el alias correcto
          through: {
            model: db.CompraXProducto,
            as: "detalleCompra",
            attributes: ["cantidad"],
          },
        },
      ],
      transaction,
    });

    if (!compra) {
      throw new NotFoundError(
        "La compra que intentas anular no fue encontrada."
      );
    }

    if (compra.estado === false) {
      throw new ConflictError("Esta compra ya ha sido anulada previamente.");
    }

    const productosAfectadosParaAlerta = new Set();

    for (const productoComprado of compra.productos) {
      // Usar el alias correcto
      const cantidadRevertir = productoComprado.detalleCompra.cantidad;
      const productoEnStock = await db.Producto.findByPk(
        productoComprado.idProducto,
        {
          transaction,
          lock: transaction.LOCK.UPDATE,
        }
      );

      if (productoEnStock) {
        await productoEnStock.decrement("existencia", {
          by: cantidadRevertir,
          transaction,
        });
        productosAfectadosParaAlerta.add(productoEnStock.idProducto);
      } else {
        throw new Error(
          `El producto con ID ${productoComprado.idProducto} no fue encontrado durante la anulación.`
        );
      }
    }

    compra.estado = false;
    await compra.save({ transaction });

    await transaction.commit();

    for (const productoId of productosAfectadosParaAlerta) {
      const productoActualizado = await db.Producto.findByPk(productoId);
      if (productoActualizado) {
        await checkAndSendStockAlert(
          productoActualizado,
          `tras anulación de compra ID ${idCompra}`
        );
      }
    }

    return compra;
  } catch (error) {
    await transaction.rollback();
    if (error instanceof NotFoundError || error instanceof ConflictError) {
      throw error;
    }
    console.error(
      `Error al anular la compra con ID ${idCompra}:`,
      error.message
    );
    throw new CustomError(`Error al anular la compra: ${error.message}`, 500);
  }
};


module.exports = {
  crearCompra,
  obtenerTodasLasCompras,
  obtenerCompraPorId,
  anularCompra,
};
