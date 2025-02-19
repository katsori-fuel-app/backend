'use strict';

module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn('users', 'createdAt');
    await queryInterface.removeColumn('users', 'updatedAt');
    await queryInterface.removeColumn('users', 'age');
    await queryInterface.removeColumn('users', 'firstName');
  },
};
