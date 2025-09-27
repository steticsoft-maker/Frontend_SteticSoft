const productoService = require("../services/producto.service.js");

/**
 * Crea un nuevo producto.
 */
const crearProducto = async (req, res, next) => {
  console.log("📦 Payload recibido en crearProducto:", req.body);
  console.log("📁 Archivo recibido:", req.file);
  console.log("🔍 Headers de la petición:", req.headers);

  try {
    const datosProducto = { ...req.body };

    // ✅ Mapear idCategoriaProducto → categoriaProductoId
    if (
      datosProducto.idCategoriaProducto &&
      !datosProducto.categoriaProductoId
    ) {
      datosProducto.categoriaProductoId = Number(
        datosProducto.idCategoriaProducto
      );
    }

    // ✅ Manejar imagen de Cloudinary si existe
    if (req.file) {
      console.log("🖼️ Procesando imagen:", {
        secure_url: req.file.secure_url,
        public_id: req.file.public_id,
        originalname: req.file.originalname,
      });
      datosProducto.imagen = req.file.secure_url;
      datosProducto.imagenPublicId = req.file.public_id;
    } else {
      console.log("⚠️ No se recibió archivo de imagen");
    }

    console.log("📝 Datos finales del producto:", datosProducto);
    const nuevoProducto = await productoService.crearProducto(datosProducto);
    res.status(201).json({
      success: true,
      message: "Producto creado exitosamente.",
      data: nuevoProducto,
    });
  } catch (error) {
    console.error("❌ Error en crearProducto:", error);
    next(error);
  }
};

/**
 * Obtiene una lista de todos los productos.
 */
const listarProductos = async (req, res, next) => {
  try {
    const productos = await productoService.obtenerTodosLosProductos(req.query);
    res.status(200).json({
      success: true,
      data: productos,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene un producto específico por su ID.
 */
const obtenerProductoPorId = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const producto = await productoService.obtenerProductoPorId(
      Number(idProducto)
    );
    res.status(200).json({
      success: true,
      data: producto,
    });
  } catch (error) {
    next(error);
  }
};

const actualizarProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const datosActualizar = { ...req.body };

    if (
      datosActualizar.idCategoriaProducto &&
      !datosActualizar.categoriaProductoId
    ) {
      datosActualizar.categoriaProductoId = Number(
        datosActualizar.idCategoriaProducto
      );
    }

    // ✅ Manejar imagen de Cloudinary si existe
    if (req.file) {
      datosActualizar.imagen = req.file.secure_url;
      datosActualizar.imagenPublicId = req.file.public_id;
    }

    const productoActualizado = await productoService.actualizarProducto(
      Number(idProducto),
      datosActualizar
    );
    res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente.",
      data: productoActualizado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Cambia el estado (activo/inactivo) de un producto.
 */
const cambiarEstadoProducto = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    const { estado } = req.body;

    const productoActualizado = await productoService.cambiarEstadoProducto(
      Number(idProducto),
      estado
    );
    res.status(200).json({
      success: true,
      message: `Estado del producto ID ${idProducto} cambiado a ${estado} exitosamente.`,
      data: productoActualizado,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Elimina físicamente un producto por su ID.
 */
const eliminarProductoFisico = async (req, res, next) => {
  try {
    const { idProducto } = req.params;
    await productoService.eliminarProductoFisico(Number(idProducto));
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene una lista de productos para uso interno.
 */
const listarProductosInternos = async (req, res, next) => {
  try {
    const productos = await productoService.obtenerProductosInternos();
    res.status(200).json({
      success: true,
      data: productos,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Obtiene productos públicos (versión estándar)
 */
const listarProductosPublicos = async (req, res, next) => {
  try {
    const { idCategoria } = req.params;
    const productos = await productoService.obtenerProductosPublicos({
      idCategoria,
    });

    res.status(200).json({
      success: true,
      data: productos,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  crearProducto,
  listarProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProductoFisico,
  cambiarEstadoProducto,
  listarProductosInternos,
  listarProductosPublicos,
};
