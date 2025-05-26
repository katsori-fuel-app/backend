import { BadRequestException, Body, Controller, Get, Global, Post, Query } from '@nestjs/common';
import { FuelStatsService } from './fuelStats.service';
import { FuelStatsDto } from './dto';

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
    async create(@Body() newRecording: FuelStatsDto) {
        const { comment, date, fuelCount, fuelType, refuelCost, totalMileage, userId } =
            newRecording;
        if (!fuelCount || !fuelType || !refuelCost || !totalMileage || !userId) {
            throw new BadRequestException(
                'Следующие поля должны быть обязательными: fuelCount, fuelType, refuelCost, totalMileage, userId.',
            );
        }

        const isCheckNumberValue =
            typeof fuelCount === 'string' ||
            typeof refuelCost === 'string' ||
            typeof totalMileage === 'string';
        if (isCheckNumberValue) {
            throw new BadRequestException(
                'Поля: fuelCount, refuelCost, totalMileage должны быть типом number',
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
        if (!userId) {
            throw new BadRequestException('userId обязателен.');
        }

        return this.fuelStatsService.getAll(userId);
    }
}
