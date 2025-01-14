// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';

dotenv.config({
  path: env === 'production' ? '.env.prod' : '.env.dev',
});

const creds = {
  development: {
    username: process.env.DB_USERNAME, // Имя пользователя базы данных
    password: `${process.env.DB_PASSWORD}`, // Пароль базы данных
    database: process.env.DB_NAME, // Имя базы данных
    host: process.env.DB_HOST, // Хост базы данных
    dialect: 'postgres',
    models: [__dirname + '/src/**/*.model.ts'], // Путь к моделям
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DATABASEDB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'postgres',
    models: [__dirname + '/src/**/*.model.ts'],
  },
};

module.exports = creds;
