'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            try {
                await queryInterface.removeColumn('message', 'userId', { transaction });
                await queryInterface.removeColumn('fuel_stats', 'userId', { transaction });

                await queryInterface.sequelize.query(
                    `
  ALTER TABLE message DROP CONSTRAINT IF EXISTS message_pkey;
  ALTER TABLE fuel_stats DROP CONSTRAINT IF EXISTS fuel_stats_pkey;
  ALTER TABLE users DROP CONSTRAINT IF EXISTS users_pkey;
`,
                    { transaction },
                );

                await queryInterface.removeColumn('message', 'id', { transaction });
                await queryInterface.removeColumn('fuel_stats', 'id', { transaction });
                await queryInterface.removeColumn('users', 'id', { transaction });

                await queryInterface.changeColumn(
                    'users',
                    'uuid',
                    {
                        type: Sequelize.UUID,
                        allowNull: false,
                        primaryKey: true,
                    },
                    { transaction },
                );

                await queryInterface.changeColumn(
                    'fuel_stats',
                    'uuid',
                    {
                        type: Sequelize.UUID,
                        allowNull: false,
                        primaryKey: true,
                    },
                    { transaction },
                );

                await queryInterface.changeColumn(
                    'message',
                    'uuid',
                    {
                        type: Sequelize.UUID,
                        allowNull: false,
                        primaryKey: true,
                    },
                    { transaction },
                );

                await queryInterface.addColumn(
                    'message',
                    'userId',
                    {
                        type: Sequelize.UUID,
                        allowNull: false,
                        references: {
                            model: 'users',
                            key: 'uuid',
                        },
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE',
                    },
                    { transaction },
                );

                await queryInterface.addColumn(
                    'fuel_stats',
                    'userId',
                    {
                        type: Sequelize.UUID,
                        allowNull: false,
                        references: {
                            model: 'users',
                            key: 'uuid',
                        },
                        onUpdate: 'CASCADE',
                        onDelete: 'CASCADE',
                    },
                    { transaction },
                );
            } catch (e) {
                console.log('your error: ', e);
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            await queryInterface.removeColumn('message', 'userId', { transaction });
            await queryInterface.removeColumn('fuel_stats', 'userId', { transaction });

            await queryInterface.addColumn(
                'users',
                'id',
                {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                { transaction },
            );

            await queryInterface.addColumn(
                'fuel_stats',
                'id',
                {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                { transaction },
            );

            await queryInterface.addColumn(
                'message',
                'id',
                {
                    type: Sequelize.INTEGER,
                    primaryKey: true,
                    autoIncrement: true,
                    allowNull: false,
                },
                { transaction },
            );

            await queryInterface.changeColumn(
                'users',
                'uuid',
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                    unique: true,
                },
                { transaction },
            );

            await queryInterface.changeColumn(
                'fuel_stats',
                'uuid',
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                    unique: true,
                },
                { transaction },
            );

            await queryInterface.changeColumn(
                'message',
                'uuid',
                {
                    type: Sequelize.UUID,
                    allowNull: false,
                    unique: true,
                },
                { transaction },
            );

            await queryInterface.addColumn(
                'message',
                'userId',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                },
                { transaction },
            );

            await queryInterface.addColumn(
                'fuel_stats',
                'userId',
                {
                    type: Sequelize.INTEGER,
                    allowNull: false,
                    references: {
                        model: 'users',
                        key: 'id',
                    },
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE',
                },
                { transaction },
            );
        });
    },
};
