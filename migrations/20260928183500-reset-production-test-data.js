'use strict';

const APPLICATION_TABLES = ['message', 'fuel_stats', 'users', 'user_sessions'];

module.exports = {
    async up(queryInterface) {
        if (process.env.NODE_ENV !== 'production') {
            return;
        }

        await queryInterface.sequelize.transaction(async (transaction) => {
            const tables = await queryInterface.showAllTables({ transaction });
            const tablesToTruncate = APPLICATION_TABLES.filter((table) => tables.includes(table));

            if (tablesToTruncate.length > 0) {
                const quotedTables = tablesToTruncate.map((table) => `"${table}"`).join(', ');
                await queryInterface.sequelize.query(
                    `TRUNCATE TABLE ${quotedTables} RESTART IDENTITY`,
                    { transaction },
                );
            }
        });
    },

    async down() {
        throw new Error('The production test-data reset is irreversible');
    },
};
