import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { MessageModel, UserModel } from './model';
import { AppService } from './app.service';
import { AppConfigModule } from './config.module';
import { ConfigService } from '@nestjs/config';
import { MessageModule } from './message/message.module';

@Module({
    providers: [AppService],
    imports: [
        AppConfigModule,
        SequelizeModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                dialect: 'postgres',
                host: configService.get<string>('DB_HOST'),
                port: configService.get('DB_PORT'),
                username: configService.get('DB_USERNAME'),
                password: configService.get('DB_PASSWORD'),
                database: configService.get('DB_NAME'),
                models: [UserModel, MessageModel],
                synchronize: true,
                autoLoadModels: true, // авто-создание таблиц
            }),
        }),
        UsersModule,
        MessageModule,
    ],
})
export class AppModule {}
