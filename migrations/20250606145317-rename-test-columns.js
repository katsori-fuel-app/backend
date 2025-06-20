'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.renameColumn('testEntity', 'fieldTwo', 'joinColumnCustom');
    },

    async down(queryInterface) {
        // await queryInterface.renameColumn('testObj', 'firstF');
    },
};
