'use strict';

const ROLE_CONSTRAINT = 'users_role_valid';
const SINGLE_ADMIN_INDEX = 'users_single_admin';

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            const tables = await queryInterface.showAllTables({ transaction });
            if (!tables.includes('users')) {
                return;
            }

            const columns = await queryInterface.describeTable('users', { transaction });
            if (!columns.role) {
                await queryInterface.addColumn(
                    'users',
                    'role',
                    {
                        type: Sequelize.STRING,
                        allowNull: false,
                        defaultValue: 'regular',
                    },
                    { transaction },
                );
            }

            const constraints = await queryInterface.showConstraint('users', { transaction });
            if (!constraints.some((constraint) => constraint.constraintName === ROLE_CONSTRAINT)) {
                await queryInterface.addConstraint('users', {
                    fields: ['role'],
                    type: 'check',
                    where: { role: ['admin', 'regular'] },
                    name: ROLE_CONSTRAINT,
                    transaction,
                });
            }

            const indexes = await queryInterface.showIndex('users', { transaction });
            if (indexes.some((index) => index.name === SINGLE_ADMIN_INDEX)) {
                await queryInterface.removeIndex('users', SINGLE_ADMIN_INDEX, { transaction });
            }
        });
    },

    async down(queryInterface) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            const tables = await queryInterface.showAllTables({ transaction });
            if (!tables.includes('users')) {
                return;
            }

            const indexes = await queryInterface.showIndex('users', { transaction });
            if (indexes.some((index) => index.name === SINGLE_ADMIN_INDEX)) {
                await queryInterface.removeIndex('users', SINGLE_ADMIN_INDEX, { transaction });
            }

            const constraints = await queryInterface.showConstraint('users', { transaction });
            if (constraints.some((constraint) => constraint.constraintName === ROLE_CONSTRAINT)) {
                await queryInterface.removeConstraint('users', ROLE_CONSTRAINT, { transaction });
            }

            const columns = await queryInterface.describeTable('users', { transaction });
            if (columns.role) {
                await queryInterface.removeColumn('users', 'role', { transaction });
            }
        });
    },
};
