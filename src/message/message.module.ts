import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MessageModel } from 'src/model';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

@Module({
    imports: [SequelizeModule.forFeature([MessageModel])],
    controllers: [MessageController],
    providers: [MessageService],
})
export class MessageModule {}
