import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import connectPgSimple from 'connect-pg-simple';
import session, { Store } from 'express-session';
import { Pool } from 'pg';

const PgSessionStore = connectPgSimple(session);

@Injectable()
export class AuthSessionStore implements OnApplicationShutdown {
    readonly store: Store;
    private readonly pool: Pool;

    constructor(configService: ConfigService) {
        this.pool = new Pool({
            host: configService.getOrThrow<string>('DB_HOST'),
            port: Number(configService.getOrThrow<string>('DB_PORT')),
            user: configService.getOrThrow<string>('DB_USERNAME'),
            password: configService.getOrThrow<string>('DB_PASSWORD'),
            database: configService.getOrThrow<string>('DB_NAME'),
        });

        this.store = new PgSessionStore({
            pool: this.pool,
            tableName: 'user_sessions',
            createTableIfMissing: true,
        });
    }

    async onApplicationShutdown(): Promise<void> {
        await this.pool.end();
    }
}
