import { BadRequestException, Body, Controller, Get, Global, Post, Query } from '@nestjs/common';
import { FuelStatsService } from './fuelStats.service';
import { FuelStatsDTO } from './model';

type CalcOnServer = {
    consumedMileage: number; // высчитывается на серваке, убрать из DTO.
    fuelConsumption: number; // высчитывается на серваке, убрать из DTO.
    forecastedValue: number; // высчитывается на серваке, убрать из DTO.
    date?: Date;
};
@Global()
@Controller('fuel-stats')
export class FuelStatsController {
    constructor(private readonly fuelStatsService: FuelStatsService) {}

    @Post()
    async create(@Body() newRecording: FuelStatsDTO) {
        const { comment, date, fuelCount, fuelType, refuelCost, totalMileage } = newRecording;
        if (!fuelCount || !fuelType || !refuelCost || !totalMileage) {
            throw new BadRequestException(
                'Следующие поля должны быть обязательными: fuelCount, fuelType, refuelCost, totalMileag.',
            );
        }

        const obj: CalcOnServer = {
            consumedMileage: 50,
            forecastedValue: 50,
            fuelConsumption: 50,
        };

        if (!date) {
            obj.date = new Date();
        }

        try {
            const createdMessage = await this.fuelStatsService.create({ ...newRecording, ...obj });

            return createdMessage;
        } catch (error) {
            throw new BadRequestException(`Ошибка при создании записи: ${error}`);
        }
    }

    @Get('/recordings')
    async getRecordingsByUser(@Query('userId') userId: number) {
        // if (!userId) {
        //     throw new BadRequestException('userId обязателен.');
        // }
        // return this.messageService.getAll(userId);
    }
}
