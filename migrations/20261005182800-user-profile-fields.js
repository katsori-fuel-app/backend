'use strict';

const PROFILE_FIELDS = ['login', 'lastName', 'firstName', 'middleName', 'birthDate', 'phone'];

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            const tables = await queryInterface.showAllTables({ transaction });
            if (!tables.includes('users')) {
                return;
            }

            const columns = await queryInterface.describeTable('users', { transaction });
            for (const field of PROFILE_FIELDS) {
                if (!columns[field]) {
                    await queryInterface.addColumn(
                        'users',
                        field,
                        {
                            type: field === 'birthDate' ? Sequelize.DATEONLY : Sequelize.STRING,
                            allowNull: true,
                        },
                        { transaction },
                    );
                }
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            const tables = await queryInterface.showAllTables({ transaction });
            if (!tables.includes('users')) {
                return;
            }

            const columns = await queryInterface.describeTable('users', { transaction });
            for (const field of PROFILE_FIELDS) {
                if (columns[field]) {
                    await queryInterface.removeColumn('users', field, { transaction });
                }
            }
        });
    },
};
