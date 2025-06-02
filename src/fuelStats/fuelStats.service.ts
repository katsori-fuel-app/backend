import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FuelStatsModel } from 'src/model';
import { FuelStatsDto } from './dto';
import { FuelStats, GetAverageMileage } from './type';

const PROTECTED_FIELDS = ['consumedMileage', 'fuelConsumption', 'forecastedValue'];
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

    async update(
        id: number,
        userId: number,
        updateFields: Partial<FuelStatsDto>,
    ): Promise<FuelStatsDto> {
        const record = await this.fuelStatsModel.findOne({ where: { id, userId } });

        if (!record) {
            throw new Error(`Запись с id=${id} и userId=${userId} не найдена`);
        }

        const sanitizedFields = Object.fromEntries(
            Object.entries(updateFields).filter(([key]) => !PROTECTED_FIELDS.includes(key)),
        );

        await this.fuelStatsModel.update(sanitizedFields, {
            where: { id, userId },
        });

        return record;
    }

    async delete(id: number, userId: number): Promise<string> {
        const deletedCount = await this.fuelStatsModel.destroy({ where: { id, userId } });

        if (deletedCount === 0) {
            throw new NotFoundException(
                `Запись с id=${id} не найдена или не принадлежит userId=${userId}`,
            );
        }

        return `Запись с id=${id} успешно удалена.`;
    }

    /**
     * Получает пройденное расстояние на 1 баке бенза.
     */
    async getConsumedMileage({ userId, totalMileage }: GetAverageMileage): Promise<number> {
        const lastRecord = await this.fuelStatsModel.findOne({
            where: { userId },
            order: [['date', 'DESC']],
            attributes: ['totalMileage'],
        });

        if (!lastRecord?.totalMileage) return 0;

        return Math.floor(totalMileage - lastRecord.totalMileage);
    }

    async getForecastedValue({ userId, totalMileage }: GetAverageMileage): Promise<number> {
        const lastRecords = await this.fuelStatsModel.findAll({
            where: { userId },
            order: [['date', 'DESC']],
            limit: 5,
            attributes: ['totalMileage', 'consumedMileage'],
        });

        if (lastRecords.length < 2) {
            return 0;
        }

        // Вычисляем среднее значение consumedMileage
        const totalConsumedMileage = lastRecords.reduce((acc, record) => {
            return acc + (record.consumedMileage || 0);
        }, 0);

        const averageMileage = Math.floor(totalConsumedMileage / lastRecords.length);

        if (!averageMileage) return 0;

        // Прогноз = текущий пробег + средний пробег
        return Math.floor(totalMileage + averageMileage);
    }
}
