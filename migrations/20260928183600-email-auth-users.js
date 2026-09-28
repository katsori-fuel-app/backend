'use strict';

const EMAIL_UNIQUE_CONSTRAINT = 'users_email_unique_auth';

function hasUniqueEmailIndex(indexes) {
    return indexes.some((index) => {
        if (!index.unique || index.fields.length !== 1) {
            return false;
        }

        const field = index.fields[0].attribute ?? index.fields[0].name;
        return field === 'email';
    });
}

module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            const tables = await queryInterface.showAllTables({ transaction });
            if (!tables.includes('users')) {
                // Fresh DB: the app's sync() creates the table from the current model.
                return;
            }

            const columns = await queryInterface.describeTable('users', { transaction });

            if (!columns.email) {
                throw new Error('Cannot migrate users: email column does not exist');
            }

            const [invalidEmails] = await queryInterface.sequelize.query(
                `SELECT 1 FROM "users"
                 WHERE "email" IS NULL OR BTRIM("email") = ''
                 LIMIT 1`,
                { transaction },
            );

            if (invalidEmails.length > 0) {
                throw new Error('Cannot migrate users: every user must have an email');
            }

            const [duplicateEmails] = await queryInterface.sequelize.query(
                `SELECT LOWER(BTRIM("email"))
                 FROM "users"
                 GROUP BY LOWER(BTRIM("email"))
                 HAVING COUNT(*) > 1
                 LIMIT 1`,
                { transaction },
            );

            if (duplicateEmails.length > 0) {
                throw new Error('Cannot migrate users: duplicate emails exist after normalization');
            }

            await queryInterface.sequelize.query(
                `UPDATE "users" SET "email" = LOWER(BTRIM("email"))`,
                { transaction },
            );

            await queryInterface.changeColumn(
                'users',
                'email',
                {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                { transaction },
            );

            const indexes = await queryInterface.showIndex('users', { transaction });
            if (!hasUniqueEmailIndex(indexes)) {
                await queryInterface.addConstraint('users', {
                    fields: ['email'],
                    type: 'unique',
                    name: EMAIL_UNIQUE_CONSTRAINT,
                    transaction,
                });
            }

            if (columns.login) {
                await queryInterface.removeColumn('users', 'login', { transaction });
            }
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.sequelize.transaction(async (transaction) => {
            const columns = await queryInterface.describeTable('users', { transaction });

            if (!columns.login) {
                await queryInterface.addColumn(
                    'users',
                    'login',
                    {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    { transaction },
                );
            }

            const indexes = await queryInterface.showIndex('users', { transaction });
            if (indexes.some((index) => index.name === EMAIL_UNIQUE_CONSTRAINT)) {
                await queryInterface.removeConstraint('users', EMAIL_UNIQUE_CONSTRAINT, {
                    transaction,
                });
            }

            await queryInterface.changeColumn(
                'users',
                'email',
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                },
                { transaction },
            );
        });
    },
};
