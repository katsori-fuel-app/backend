import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as dotenv from 'dotenv';
import * as process from 'node:process';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
    const configService = app.get<ConfigService>(ConfigService);

    dotenv.config();

    app.enableCors({
        // origin: 'http://localhost:3000',
        origin: '*',
    });
    const port = configService.get<string | number | undefined>('PORT') ?? 4000;

    await app.listen(port);

    if (process?.env?.NODE_ENV) {
        console.log(`Используется ${process.env['NODE_ENV'].toUpperCase()} mode`);
        console.log(`Сервер запущен на: ${await app.getUrl()}`);
    }
}

bootstrap()
    .then(() => {
        console.log('Status: OK');
    })
    .catch((err) => {
        console.log(`ОШИБКАА`, err);
    });
