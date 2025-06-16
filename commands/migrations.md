### инструкции по миграциям

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

    async down(queryInterface) {
        await queryInterface.addColumn('testObj', 'firstName', 'firstF');
    },
};