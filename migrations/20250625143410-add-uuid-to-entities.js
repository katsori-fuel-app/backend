'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.addColumn(
                'users',
                'uuid',
                {
                    type: Sequelize.UUID,
                    unique: true,
                    allowNull: true,
                },
                { transaction },
            );

            await queryInterface.addColumn(
                'message',
                'uuid',
                {
                    type: Sequelize.UUID,
                    unique: true,
                    allowNull: true,
                },
                { transaction },
            );

            await queryInterface.addColumn(
                'fuel_stats',
                'uuid',
                {
                    type: Sequelize.UUID,
                    unique: true,
                    allowNull: true,
                },
                { transaction },
            );
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.removeColumn('users', 'uuid', { transaction });
            await queryInterface.removeColumn('message', 'uuid', { transaction });
            await queryInterface.removeColumn('fuel_stats', 'uuid', { transaction });
        });
    },
};
