"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Verificar si ya existe una novedad con ID 1
      const existingNovedad = await queryInterface.sequelize.query(
        `SELECT id_novedad FROM novedades WHERE id_novedad = 1`,
        { transaction }
      );

      // Si no existe, crear una novedad por defecto
      if (existingNovedad[0].length === 0) {
        await queryInterface.bulkInsert(
          "novedades",
          [
            {
              id_novedad: 1,
              fecha_inicio: new Date(),
              fecha_fin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 año desde ahora
              hora_inicio: "08:00:00",
              hora_fin: "18:00:00",
              dias: JSON.stringify([
                "Lunes",
                "Martes",
                "Miércoles",
                "Jueves",
                "Viernes",
                "Sábado",
              ]),
              estado: true,
            },
          ],
          { transaction }
        );
      }

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      // Eliminar la novedad por defecto
      await queryInterface.sequelize.query(
        `DELETE FROM novedades WHERE id_novedad = 1`,
        { transaction }
      );

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};
