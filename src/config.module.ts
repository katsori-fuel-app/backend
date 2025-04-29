import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
// http://localhost:4000/
@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: process.env.NODE_ENV === 'production' ? '.env.prod' : '.env.dev',
            isGlobal: true,
        }),
    ],
    exports: [ConfigModule],
    controllers: [AppController],
})
export class AppConfigModule {}
