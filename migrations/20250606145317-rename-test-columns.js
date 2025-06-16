'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // await queryInterface.changeColumn('testObj', 'newField', {
        //     type: Sequelize.INTEGER,
        //     allowNull: true,
        //   });

        await queryInterface.sequelize.query(`
  ALTER TABLE "testObj"
  ALTER COLUMN "newField" TYPE INTEGER USING "newField"::integer;
`);
    },

    async down(queryInterface) {
        // await queryInterface.renameColumn('testObj', 'firstF');
    },
};
