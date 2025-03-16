import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MessageModel } from 'src/model';
import { MessageDTO } from './model/message.model';

@Injectable()
export class MessageService {
    constructor(
        @InjectModel(MessageModel)
        private readonly messageModel: typeof MessageModel,
    ) {}

    async create(message: MessageDTO) {
        return await this.messageModel.create(message);
    }

    async getAll(userId: number): Promise<MessageDTO[]> {
        const messages = await this.messageModel.findAll({
            where: { userId },
        });

        return messages;
    }
}
