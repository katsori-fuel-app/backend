import { Body, Controller, Get, Global, Post, Query } from '@nestjs/common';
import { FuelStatsService } from './fuelStats.service';
import { FuelStatsDTO } from './model';

@Global()
@Controller('fuel-stats')
export class FuelStatsController {
    constructor(private readonly fuelStatsService: FuelStatsService) {}

    @Post()
    async create(@Body() newRecording: FuelStatsDTO) {
        // const { message, userId } = createUserDto;
        // if (!message || !userId) {
        //     throw new BadRequestException('userId и textOfMessage обязательны.');
        // }
        // try {
        //     const createdMessage = await this.messageService.create(createUserDto);
        //     return createdMessage;
        // } catch (error) {
        //     throw new BadRequestException(`Ошибка при создании сообщения: ${error}`);
        // }
    }

    @Get('/recordings')
    async getRecordingsByUser(@Query('userId') userId: number) {
        // if (!userId) {
        //     throw new BadRequestException('userId обязателен.');
        // }
        // return this.messageService.getAll(userId);
    }
}
