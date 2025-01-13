import { Module } from '@nestjs/common';

import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from './users/users.module';
import { UserModel } from './model';
import { AppService } from './app.service';

@Module({
  providers: [AppService],
  imports: [
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'sixpounders1!',
      database: 'fuel-app',
      models: [UserModel],
      // autoLoadModels: true,
      dialectOptions: {
        ssl: false, // если не используете SSL, можно пропустить
      },
      logging: false, // отключить логи, если не нужно
      define: {
        timestamps: false,
        charset: 'utf8', // добавьте это, если нужно
      },
    }),
    UsersModule,
  ],
})
export class AppModule {}
