import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FuelStatsModel } from 'src/model';
import { FuelStatsDto } from './dto';
import { FuelStats } from './type';

@Injectable()
export class FuelStatsService {
    constructor(
        @InjectModel(FuelStatsModel)
        private readonly fuelStatsModel: typeof FuelStatsModel,
    ) {}

    async create(fuelStatsDto: FuelStats) {
        return await this.fuelStatsModel.create(fuelStatsDto);
    }

    async getAll(userId: number): Promise<FuelStatsDto[]> {
        const messages = await this.fuelStatsModel.findAll({
            where: { userId },
        });

        return messages;
    }

    async getLastTotalMileage(userId: number): Promise<number | null> {
        const lastRecord = await this.fuelStatsModel.findOne({
            where: { userId },
            order: [['date', 'DESC']],
            attributes: ['totalMileage'],
        });

        return lastRecord ? lastRecord.totalMileage : null;
    }

    async getAverageMileage(userId: number): Promise<number> {
        // Получаем последние 30 записей
        const lastRecords = await this.fuelStatsModel.findAll({
            where: { userId },
            order: [['date', 'DESC']],
            limit: 5,
            attributes: ['totalMileage', 'consumedMileage'],
        });

        console.log('lastRecords: ', lastRecords);
        if (lastRecords.length < 2) {
            return 0;
        }

        // Вычисляем среднее значение consumedMileage
        const totalConsumedMileage = lastRecords.reduce((acc, record) => {
            return acc + (record.consumedMileage || 0);
        }, 0);

        return Math.floor(totalConsumedMileage / lastRecords.length);
    }
}
