'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.renameTable('testObj', 'renamedObj');
    },

    async down(queryInterface) {
        await queryInterface.renameTable('renamedObj', 'testObj');
    },
};
