import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModel } from 'src/model';

@Module({
    imports: [SequelizeModule.forFeature([UserModel])],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
