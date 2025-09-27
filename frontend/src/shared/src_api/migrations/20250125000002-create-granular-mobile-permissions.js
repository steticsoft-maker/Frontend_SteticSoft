"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Insertar nuevos permisos granulares para móviles
      await queryInterface.bulkInsert(
        "permisos",
        [
          {
            nombre: "MODULO_MOVIL_CITAS_VER_EMPLEADOS",
            descripcion:
              "Solo permite ver empleados disponibles para citas desde móvil.",
            estado: true,
          },
          {
            nombre: "MODULO_MOVIL_CITAS_VER_NOVEDADES",
            descripcion:
              "Solo permite ver novedades/horarios disponibles desde móvil.",
            estado: true,
          },
          {
            nombre: "MODULO_MOVIL_CITAS_ASIGNAR_EMPLEADO",
            descripcion:
              "Solo permite asignar empleado a cita propia desde móvil.",
            estado: true,
          },
        ],
        { transaction }
      );

      // Asignar todos los permisos móviles al rol Administrador
      await queryInterface.sequelize.query(
        `
        INSERT INTO permisos_x_rol (id_rol, id_permiso) 
        SELECT (SELECT id_rol FROM rol WHERE nombre = 'Administrador'), p.id_permiso 
        FROM permisos p 
        WHERE p.estado = TRUE 
        AND p.nombre LIKE 'MODULO_MOVIL_%'
        ON CONFLICT (id_rol, id_permiso) DO NOTHING;
      `,
        { transaction }
      );

      // Asignar permisos móviles específicos al rol Cliente
      await queryInterface.sequelize.query(
        `
        INSERT INTO permisos_x_rol (id_rol, id_permiso) 
        SELECT r.id_rol, p.id_permiso 
        FROM rol r, permisos p 
        WHERE r.nombre = 'Cliente' 
        AND p.estado = TRUE 
        AND p.nombre IN (
            'MODULO_MOVIL_CITAS_VER_EMPLEADOS',
            'MODULO_MOVIL_CITAS_VER_NOVEDADES',
            'MODULO_MOVIL_CITAS_ASIGNAR_EMPLEADO'
        )
        ON CONFLICT (id_rol, id_permiso) DO NOTHING;
      `,
        { transaction }
      );

      // Asignar permisos móviles específicos al rol Empleado
      await queryInterface.sequelize.query(
        `
        INSERT INTO permisos_x_rol (id_rol, id_permiso) 
        SELECT r.id_rol, p.id_permiso 
        FROM rol r, permisos p 
        WHERE r.nombre = 'Empleado' 
        AND p.estado = TRUE 
        AND p.nombre IN (
            'MODULO_MOVIL_CITAS_VER_EMPLEADOS',
            'MODULO_MOVIL_CITAS_VER_NOVEDADES',
            'MODULO_MOVIL_CITAS_ASIGNAR_EMPLEADO'
        )
        ON CONFLICT (id_rol, id_permiso) DO NOTHING;
      `,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Eliminar permisos móviles de los roles
      await queryInterface.sequelize.query(
        `
        DELETE FROM permisos_x_rol 
        WHERE id_permiso IN (
          SELECT id_permiso FROM permisos 
          WHERE nombre LIKE 'MODULO_MOVIL_%'
        );
      `,
        { transaction }
      );

      // Eliminar los permisos móviles granulares
      await queryInterface.sequelize.query(
        `
        DELETE FROM permisos 
        WHERE nombre LIKE 'MODULO_MOVIL_%';
      `,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
