'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE users SET uuid = gen_random_uuid() WHERE uuid IS NULL;`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `UPDATE message SET uuid = gen_random_uuid() WHERE uuid IS NULL;`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `UPDATE fuel_stats SET uuid = gen_random_uuid() WHERE uuid IS NULL;`,
        { transaction }
      );
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `UPDATE users SET uuid = NULL;`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `UPDATE message SET uuid = NULL;`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `UPDATE fuel_stats SET uuid = NULL;`,
        { transaction }
      );
    });
  }
};
