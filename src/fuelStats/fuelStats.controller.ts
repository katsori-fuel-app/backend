import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Global,
    Post,
    Put,
    Query,
} from '@nestjs/common';
import { FuelStatsService } from './fuelStats.service';
import { DeleteFuelStat, FuelStatsDto, UpdateFuelStats } from './dto';
import { getFuelConsumption } from './utils/fuelStatsCalc';

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
        const { date, fuelCount, fuelType, refuelCost, totalMileage, userId } = newRecording;

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

        const consumedMileage = await this.fuelStatsService.getConsumedMileage({
            userId,
            totalMileage,
        });

        const forecastedValue = await this.fuelStatsService.getForecastedValue({
            userId,
            totalMileage,
        });

        const obj: CalcOnServer = {
            consumedMileage,
            forecastedValue,
            fuelConsumption: getFuelConsumption({ consumedMileage, fuelCount }),
        };

        // для корректной даты нужно передавать yyyy-mm-dd, т.к. стандарт ISO
        // можно передать mm.dd.yyyy, но тогда день будет на 1 меньше, нестандарт.
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
    async getRecordingsByUser(@Query('userId') userId: string) {
        if (!userId) {
            throw new BadRequestException('userId обязателен.');
        }

        return this.fuelStatsService.getAll(userId);
    }

    @Put()
    async update(@Body() updateData: UpdateFuelStats) {
        const { userId, uuid, ...fieldsToUpdate } = updateData;

        if (!Object.keys(fieldsToUpdate).length) {
            throw new BadRequestException('Укажите хотя бы одно поле для обновления.');
        }

        try {
            return await this.fuelStatsService.update(uuid, userId, fieldsToUpdate);
        } catch (error) {
            throw new BadRequestException(`Ошибка при обновлении записи: ${error}`);
        }
    }

    @Delete()
    async delete(@Body() deleteFuelStat: DeleteFuelStat) {
        if (!deleteFuelStat.uuid || !deleteFuelStat.userId) {
            throw new BadRequestException('Укажите id');
        }

        return await this.fuelStatsService.delete(deleteFuelStat.uuid, deleteFuelStat.userId);
    }
}
