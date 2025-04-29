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
}
