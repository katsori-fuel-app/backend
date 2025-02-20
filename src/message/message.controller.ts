import {
    Body,
    Controller,
    Get,
    Global,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageDTO } from './model/message.model';

@Global()
@Controller('message')
export class MessageController {
    constructor(private readonly messageService: MessageService) {}

    @Post()
    async create(@Body() createUserDto: MessageDTO) {
        return this.messageService.create(createUserDto);
    }

    @Get()
    async getAll() {
        return this.messageService.getAll();
    }
}
