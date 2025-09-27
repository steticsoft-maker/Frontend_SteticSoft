"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Agregar el permiso MODULO_CITAS_CLIENTE al rol Cliente
      await queryInterface.sequelize.query(
        `
        INSERT INTO permisos_x_rol (id_rol, id_permiso) 
        SELECT r.id_rol, p.id_permiso 
        FROM rol r, permisos p 
        WHERE r.nombre = 'Cliente' 
        AND p.nombre = 'MODULO_CITAS_CLIENTE'
        AND p.estado = TRUE
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
      // Eliminar el permiso MODULO_CITAS_CLIENTE del rol Cliente
      await queryInterface.sequelize.query(
        `
        DELETE FROM permisos_x_rol 
        WHERE id_rol = (SELECT id_rol FROM rol WHERE nombre = 'Cliente')
        AND id_permiso = (SELECT id_permiso FROM permisos WHERE nombre = 'MODULO_CITAS_CLIENTE');
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
