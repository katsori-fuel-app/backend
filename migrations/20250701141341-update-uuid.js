'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.changeColumn(
                'users',
                'uuid',
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
                { transaction },
            );
            await queryInterface.changeColumn(
                'fuel_stats',
                'uuid',
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
                { transaction },
            );
            await queryInterface.changeColumn(
                'message',
                'uuid',
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                },
                { transaction },
            );

            await queryInterface.addIndex('users', ['uuid'], {
                unique: true,
                name: 'users_uuid_unique_idx',
                transaction,
            });
            await queryInterface.addIndex('fuel_stats', ['uuid'], {
                unique: true,
                name: 'fuel_stats_uuid_unique_idx',
                transaction,
            });
            await queryInterface.addIndex('message', ['uuid'], {
                unique: true,
                name: 'message_uuid_unique_idx',
                transaction,
            });
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.removeIndex('users', 'users_uuid_unique_idx', { transaction });
            await queryInterface.removeIndex('fuel_stats', 'fuel_stats_uuid_unique_idx', { transaction });
            await queryInterface.removeIndex('message', 'message_uuid_unique_idx', { transaction });

            await queryInterface.changeColumn(
                'users',
                'uuid',
                {
                    type: Sequelize.UUID,
                    allowNull: true,
                },
                { transaction },
            );
            await queryInterface.changeColumn(
                'fuel_stats',
                'uuid',
                {
                    type: Sequelize.UUID,
                    allowNull: true,
                },
                { transaction },
            );
            await queryInterface.changeColumn(
                'message',
                'uuid',
                {
                    type: Sequelize.UUID,
                    allowNull: true,
                },
                { transaction },
            );
        });
    },
};
