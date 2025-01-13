'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('users', 'CreatedAt');
    await queryInterface.removeColumn('users', 'UpdatedAt');
    await queryInterface.removeColumn('users', 'age');
    await queryInterface.removeColumn('users', 'firstName');
  },
};
