import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { UserModel } from './model';
import { AppService } from './app.service';
import { AppConfigModule } from './config.module';
import { ConfigService } from '@nestjs/config';

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
        database: configService.get('DB_DATABASE'),
        models: [UserModel],
      }),
    }),
    UsersModule,
  ],
})
export class AppModule {}

// dialect: 'postgres',
// host: 'localhost',
// port: 5432,
// username: 'postgres',
//   password: 'sixpounders1!',
// password: '123qwe',
// database: 'fuel-app',
// models: [UserModel],
// autoLoadModels: true,
// }),
