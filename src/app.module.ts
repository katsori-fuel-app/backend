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
    }),
    UsersModule,
  ],
})
export class AppModule {}
