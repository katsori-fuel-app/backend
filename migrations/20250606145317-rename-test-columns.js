'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        // Сделать столбец nullable
        /*
        await queryInterface.sequelize.query(`
        ALTER TABLE "testEntity" ALTER COLUMN "joinColumnCustom" DROP NOT NULL;
      `);
      */
        // Обнулить дублирующиеся значения, оставив только по одному уникальному
        /*
        await queryInterface.sequelize.query(`
    WITH duplicates AS (
      SELECT "keyId", "joinColumnCustom",
             ROW_NUMBER() OVER (PARTITION BY "joinColumnCustom" ORDER BY "keyId") AS rn
      FROM "testEntity"
      WHERE "joinColumnCustom" IS NOT NULL
    )
    UPDATE "testEntity"
    SET "joinColumnCustom" = NULL
    FROM duplicates
    WHERE "testEntity"."keyId" = duplicates."keyId"
      AND duplicates.rn > 1;
  `);
  */

        /*
        await queryInterface.addConstraint('testEntity', {
            fields: ['joinColumnCustom'],
            type: 'unique',
            name: 'unique_joinColumnCustom_constraint',
          });
          */
        await queryInterface.addConstraint('testObj', {
            fields: ['newField'],
            type: 'foreign key',
            name: 'fk_testObj_newField_testEntity_joinColumnCustom',
            references: {
                table: 'testEntity',
                field: 'joinColumnCustom', // Ссылка на joinColumnCustom, а не на primary key
            },
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        });
    },

    async down(queryInterface) {
        await queryInterface.removeConstraint(
            'testObj',
            'fk_testObj_newField_testEntity_joinColumnCustom',
        );
        await queryInterface.removeColumn('testObj', 'newField');
    },
};
