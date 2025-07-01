### инструкции по миграциям

## Создать миграцию: npx sequelize-cli migration:generate --name имя_миграции

# 1. Ренейм полей: queryInterface.renameColumn:

```ts
module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.renameColumn('testObj', 'firstF', 'firstName');
    },

    async down(queryInterface) {
        await queryInterface.renameColumn('testObj', 'firstName', 'firstF');
    },
};
```

# 2. Удаление/добавление полей: queryInterface.removeColumn:

```ts
module.exports = {
    async up(queryInterface: QueryInterface) {
        await queryInterface.removeColumn('testObj', 'firstF', 'firstName');
    },

    // для добавление третий параметр - это объект с описание поля
    async down(queryInterface) {
        await queryInterface.addColumn('testObj', 'firstName', {...});
    },
};
```

# 3. Удаление/добавление полей: queryInterface.removeColumn:

```ts
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.renameTable('testObj', 'renamedObj');
    },
};
```
