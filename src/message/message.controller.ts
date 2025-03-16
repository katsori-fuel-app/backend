import {
    BadRequestException,
    Body,
    Controller,
    Get,
    Global,
    NotFoundException,
    Param,
    Post,
    Query,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDTO } from './model/message.model';

@Global()
@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    async create(@Body() createUserDto: MessageDTO) {
        const { message, userId } = createUserDto;

        if (!message || !userId) {
            throw new BadRequestException('userId и textOfMessage обязательны.');
        }

        try {
            const createdMessage = await this.messageService.create(createUserDto);

            return createdMessage;
        } catch (error) {
            throw new BadRequestException(`Ошибка при создании сообщения: ${error}`);
        }
    }

    @Get('/user')
    async getAllByUser(@Query('userId') userId: number) {
        if (!userId) {
            throw new BadRequestException('userId обязателен.');
        }
        return this.messageService.getAll(userId);
    }
}
