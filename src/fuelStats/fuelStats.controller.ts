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

        if (typeof fuelType !== 'string') {
            throw new BadRequestException('Поле fuelType должно быть строкой.');
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
        /**
         * Получает пройденное расстояние на 1 баке бенза.
         */
        const getConsumedMileage = async (): Promise<number> => {
            const lastTotalMileage = await this.fuelStatsService.getLastTotalMileage(userId);
            if (!lastTotalMileage) return 0;

            return Math.floor(totalMileage - lastTotalMileage);
        };

        const consumedMileage = await getConsumedMileage();

        /**
         * Получает расход топлива 10л/100км.
         */
        const getFuelConsumption = (): number => {
            if (consumedMileage) {
                return Math.floor((fuelCount / consumedMileage) * 100);
            } else {
                return 0;
            }
        };

        /**
         * Получает прогнозируемое значение пробега для следующей заправки
         */
        const getForecastedValue = async (): Promise<number> => {
            const averageMileage = await this.fuelStatsService.getAverageMileage(userId);
            if (!averageMileage) return 0;

            // Прогноз = текущий пробег + средний пробег
            return Math.floor(totalMileage + averageMileage);
        };

        const obj: CalcOnServer = {
            consumedMileage,
            forecastedValue: await getForecastedValue(),
            fuelConsumption: getFuelConsumption(),
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
