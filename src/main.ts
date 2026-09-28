import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';
import session from 'express-session';
import { AuthSessionStore } from './auth/auth-session.store';
import { AUTH_SESSION_COOKIE, AUTH_SESSION_MAX_AGE_MS } from './auth/auth.constants';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: ['error', 'warn', 'log'] });
    const configService = app.get<ConfigService>(ConfigService);
    const isProduction = configService.get<string>('NODE_ENV') === 'production';
    // TODO: Provision SESSION_SECRET via environment; never commit it or pass it through the repository.
    const sessionSecret =
        configService.get<string>('SESSION_SECRET') ?? 'mock-secret-for-local-development-only-32bytes';

    if (Buffer.byteLength(sessionSecret) < 32) {
        throw new Error('SESSION_SECRET must be at least 32 bytes');
    }

    app.enableCors({
        origin: 'http://localhost:3000',
        credentials: true,
    });

    if (isProduction) {
        app.getHttpAdapter().getInstance().set('trust proxy', 1);
    }

    app.use(
        session({
            name: AUTH_SESSION_COOKIE,
            secret: sessionSecret,
            store: app.get(AuthSessionStore).store,
            resave: false,
            saveUninitialized: false,
            rolling: true,
            cookie: {
                httpOnly: true,
                secure: isProduction,
                sameSite: 'lax',
                maxAge: AUTH_SESSION_MAX_AGE_MS,
                path: '/',
            },
        }),
    );

    app.enableShutdownHooks();

    const port = configService.get<string | number | undefined>('PORT') ?? 3000;

    await app.listen(port);

    if (process?.env?.NODE_ENV) console.log(`The server is running on port ${port}`);
}

bootstrap()
    .then(() => {
        console.log('Status: OK');
    })
    .catch((err) => {
        console.log(`ОШИБКАА`, err);
    });
