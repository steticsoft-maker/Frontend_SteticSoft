// src/services/proveedor.service.js
const db = require("../models");
const { Op } = db.Sequelize;
const { NotFoundError, ConflictError, CustomError } = require("../errors");

/**
 * Helper interno para cambiar el estado de un proveedor.
 * @param {number} idProveedor - ID del proveedor.
 * @param {boolean} nuevoEstado - El nuevo estado (true para habilitar, false para anular).
 * @returns {Promise<object>} El proveedor con el estado cambiado.
 */
const cambiarEstadoProveedor = async (idProveedor, nuevoEstado) => {
  const proveedor = await db.Proveedor.findByPk(idProveedor);
  if (!proveedor) {
    throw new NotFoundError("Proveedor no encontrado para cambiar estado.");
  }
  if (proveedor.estado === nuevoEstado) {
    return proveedor; // Ya está en el estado deseado
  }
  await proveedor.update({ estado: nuevoEstado });
  return proveedor;
};

/**
 * Crear un nuevo proveedor.
 */
const crearProveedor = async (datosProveedor) => {                          /* (1) Inicio */
  const {
    nombre,
    tipo,
    telefono,
    correo,
    direccion,
    tipoDocumento,
    numeroDocumento,
    nitEmpresa,
    nombrePersonaEncargada,
    telefonoPersonaEncargada,
    emailPersonaEncargada,
    estado,
  } = datosProveedor;                                                      /* (2) Desestructurar datos */
  try {                                                                    /* (3) Intentar crear proveedor */
    const nuevoProveedor = await db.Proveedor.create({
      nombre,
      tipo,
      telefono,
      correo,
      direccion,
      tipoDocumento: tipoDocumento || null,
      numeroDocumento: numeroDocumento || null,
      nitEmpresa: nitEmpresa || null,
      nombrePersonaEncargada: nombrePersonaEncargada || null,
      telefonoPersonaEncargada: telefonoPersonaEncargada || null,
      emailPersonaEncargada: emailPersonaEncargada || null,
      estado: typeof estado === "boolean" ? estado : true,
    });
    return nuevoProveedor;                                                 /* (4) Retorno exitoso → Fin */
  } catch (error) {                                                        /* (5) Manejo de errores */
    if (error.name === "SequelizeUniqueConstraintError") {                 /* (6) Error de unicidad */
      let campoConflictivo = "un campo único";
      if (error.fields) {                                                  /* (7) Detectar campo conflictivo */
        if (error.fields.nit_empresa) campoConflictivo = "NIT de empresa";
        else if (error.fields.numero_documento)
          campoConflictivo = "Número de Documento";
        else if (
          error.fields.proveedor_nombre_tipo_key ||
          (error.fields.nombre && error.fields.tipo)
        )
          campoConflictivo = `la combinación de nombre ('${nombre}') y tipo ('${tipo}')`;
        else if (error.fields.correo) campoConflictivo = "correo electrónico";
      }
      throw new ConflictError(                                             /* (8) Lanzar error de conflicto → Fin */
        `Ya existe un proveedor con el mismo valor para ${campoConflictivo}.`
      );
    }
    console.error(
      "Error al crear el proveedor en el servicio:",
      error.message,
      error.stack
    );
    throw new CustomError(                                                 /* (9) Otro error → Fin */
      `Error al crear el proveedor: ${error.message}`,
      500
    );
  }
};                                                                         /* (Fin) */


/**
 * Obtener todos los proveedores.
 */
const obtenerTodosLosProveedores = async (opciones = {}) => {
  try {
    const { estado, tipo, busqueda } = opciones;
    const whereClause = {};

    if (estado !== undefined) {
      whereClause.estado = estado;
    }
    if (tipo) {
      whereClause.tipo = tipo;
    }
    
    // --- LÓGICA DE BÚSQUEDA NUEVA ---
    if (busqueda) {
      whereClause[Op.or] = [
        { nombre: { [Op.iLike]: `%${busqueda}%` } },
        { correo: { [Op.iLike]: `%${busqueda}%` } },
        { nitEmpresa: { [Op.iLike]: `%${busqueda}%` } },
        { numeroDocumento: { [Op.iLike]: `%${busqueda}%` } },
        { telefono: { [Op.iLike]: `%${busqueda}%` } },
        { direccion: { [Op.iLike]: `%${busqueda}%` } },
      ];
    }
    // --- FIN DE LÓGICA DE BÚSQUEDA ---

    return await db.Proveedor.findAll({
      where: whereClause,
      order: [["nombre", "ASC"]],
    });
  } catch (error) {
    console.error(
      "Error al obtener todos los proveedores en el servicio:",
      error.message
    );
    throw new CustomError(
      `Error al obtener proveedores: ${error.message}`,
      500
    );
  }
};

/**
 * Obtener un proveedor por su ID.
 */
const obtenerProveedorPorId = async (idProveedor) => {
  try {
    const proveedor = await db.Proveedor.findByPk(idProveedor);
    if (!proveedor) {
      throw new NotFoundError("Proveedor no encontrado.");
    }
    return proveedor;
  } catch (error) {
    if (error instanceof NotFoundError) throw error;
    console.error(
      `Error al obtener el proveedor con ID ${idProveedor} en el servicio:`,
      error.message
    );
    throw new CustomError(
      `Error al obtener el proveedor: ${error.message}`,
      500
    );
  }
};

/**
 * Actualiza un proveedor existente usando los datos validados previamente.
 * @param {number} idProveedor - El ID del proveedor a actualizar.
 * @param {object} datosActualizar - El objeto con los datos a actualizar, proveniente del req.body.
 * @returns {Promise<object>} - Un objeto con el resultado de la operación.
 */
const actualizarProveedor = async (idProveedor, datosActualizar) => {
  try {
    // 1. Buscamos el proveedor por su ID para asegurarnos de que existe.
    const proveedor = await db.Proveedor.findByPk(idProveedor);

    if (!proveedor) {
      // Si no se encuentra, devolvemos una respuesta de error clara.
      return {
        success: false,
        message: 'Proveedor no encontrado.',
        status: 404, // Not Found
      };
    }

    // 2. Actualizamos el proveedor.
    // El método `update` de Sequelize es ideal porque solo modifica los campos
    // que vienen en el objeto `datosActualizar`.
    await proveedor.update(datosActualizar); // <-- ¡ERROR CORREGIDO! Se usa 'datosActualizar'.

    // 3. Devolvemos una respuesta de éxito con los datos actualizados.
    return {
      success: true,
      message: 'Proveedor actualizado correctamente.',
      data: proveedor,
    };

  } catch (error) {
    // Capturamos cualquier otro error inesperado durante la operación de base de datos.
    console.error(`❌ Error en el servicio al actualizar el proveedor con ID ${idProveedor}:`, error);
    return {
      success: false,
      message: 'Ocurrió un error en el servicio al actualizar el proveedor.',
      error: error.message,
      status: 500, // Internal Server Error
    };
  }
};




// src/shared/src_api/services/proveedor.service.js

// src/shared/src_api/services/proveedor.service.js

const eliminarProveedorFisico = async (idProveedor) => {
  try {
    const proveedor = await db.Proveedor.findByPk(idProveedor);
    if (!proveedor) {
      throw new NotFoundError(
        "Proveedor no encontrado para eliminar físicamente."
      );
    }

    const comprasAsociadas = await db.Compra.count({
      where: { idProveedor: idProveedor },
    });

    if (comprasAsociadas > 0) {
      // --- LÍNEA MODIFICADA ---
      // Cambiamos el mensaje para que sea más específico según tu solicitud.
      throw new ConflictError(
        `El proveedor '${proveedor.nombre}' está asociado con compras y por ello no puede ser eliminado.`
      );
      // --- FIN DE LA MODIFICACIÓN ---
    }

    const filasEliminadas = await db.Proveedor.destroy({
      where: { idProveedor },
    });
    return filasEliminadas;
  } catch (error) {
    if (error instanceof NotFoundError || error instanceof ConflictError) {
      throw error;
    }
    if (error.name === "SequelizeForeignKeyConstraintError") {
      // Este error de respaldo también se puede ajustar si lo deseas.
      throw new ConflictError(
        "No se puede eliminar el proveedor porque está asociado con compras."
      );
    }
    console.error(
      `Error al eliminar físicamente el proveedor con ID ${idProveedor} en el servicio:`,
      error.message
    );
    throw new CustomError(
      `Error al eliminar físicamente el proveedor: ${error.message}`,
      500
    );
  }
};

// --- FUNCIÓN NUEVA AÑADIDA ---
/**
 * Verifica si los campos únicos ya existen, para validación en tiempo real desde el frontend.
 * @param {object} campos - Objeto con los campos a verificar. Ej: { correo: 'test@test.com' }
 * @param {number|null} idExcluir - El ID del proveedor a excluir de la búsqueda (para modo edición).
 * @returns {Promise<object>} Un objeto con los mensajes de error.
 */
const verificarDatosUnicos = async (campos, idExcluir = null) => {
    const errores = {};
    const whereClause = { estado: true };
    if (idExcluir) {
        whereClause.idProveedor = { [Op.ne]: idExcluir };
    }

    const camposAValidar = {
        correo: "Este correo ya está registrado.",
        numeroDocumento: "Este documento ya está registrado.",
        nitEmpresa: "Este NIT ya está registrado.",
        telefono: "Este teléfono ya está registrado.",
        telefonoPersonaEncargada: "Este teléfono del encargado ya está registrado.",
        emailPersonaEncargada: "Este email del encargado ya está registrado.",
        nombre: "Este nombre ya está registrado.",
        nombrePersonaEncargada: "Este nombre del encargado ya está registrado."
    };

    for (const campo in campos) {
        if (camposAValidar[campo] && campos[campo]) {
            const query = {
                ...whereClause,
                [campo]: campos[campo],
            };
            
            const existe = await db.Proveedor.findOne({
                where: query,
            });
            
            if (existe) {
                errores[campo] = camposAValidar[campo];
            }
        }
    }
    return errores;
};


module.exports = {
  crearProveedor,
  obtenerTodosLosProveedores,
  obtenerProveedorPorId,
  actualizarProveedor,
  eliminarProveedorFisico,
  cambiarEstadoProveedor,
  verificarDatosUnicos,
};