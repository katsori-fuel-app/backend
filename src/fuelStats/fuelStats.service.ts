import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FuelStatsModel } from 'src/model';
import { FuelStatsDTO } from './model';

@Injectable()
export class FuelStatsService {
    constructor(
        @InjectModel(FuelStatsModel)
        private readonly fuelStatsModel: typeof FuelStatsModel,
    ) {}

    async create(fuelStatsDto: FuelStatsDTO) {
        console.log('CRETE RECORDING YEAH');
        // return await this.fuelStatsModel.create(fuelStatsDto);
    }

    async getAll(userId: number): Promise<FuelStatsDTO[]> {
        // const messages = await this.fuelStatsModel.findAll({
        //     where: { userId },
        // });

        return [];
    }
}
