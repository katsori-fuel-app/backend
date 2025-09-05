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
        origin: 'http://localhost:3000',
        // origin: 'https://hoppscotch.io',
    });

    const port = configService.get<string | number | undefined>('PORT') ?? 4000;

    await app.listen(port);

    if (process?.env?.NODE_ENV) {
        console.log(
            `The server is running on port ${process.env['PORT']} with ${process.env['NODE_ENV'].toUpperCase()} mode`,
        );
    }
}

bootstrap()
    .then(() => {
        console.log('Status: OK');
    })
    .catch((err) => {
        console.log(`ОШИБКАА`, err);
    });
