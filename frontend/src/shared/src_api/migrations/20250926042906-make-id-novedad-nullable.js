"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Hacer que el campo id_novedad sea nullable en la tabla cita
    await queryInterface.changeColumn("cita", "id_novedad", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: { model: "novedades", key: "id_novedad" },
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir el cambio: hacer que el campo id_novedad sea NOT NULL nuevamente
    await queryInterface.changeColumn("cita", "id_novedad", {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: { model: "novedades", key: "id_novedad" },
    });
  },
};
