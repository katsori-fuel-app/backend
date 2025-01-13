// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development';

dotenv.config({
  path: env === 'production' ? '.env.prod' : '.env.dev',
});

const creds = {
  development: {
    username: process.env.DATABASE_USERNAME, // Имя пользователя базы данных
    password: `${process.env.DATABASE_PASSWORD}`, // Пароль базы данных
    database: process.env.DATABASE_NAME, // Имя базы данных
    host: process.env.DATABASE_HOST, // Хост базы данных
    dialect: 'postgres',
    models: [__dirname + '/src/**/*.model.ts'], // Путь к моделям
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    models: [__dirname + '/src/**/*.model.ts'],
  },
};

module.exports = creds;
