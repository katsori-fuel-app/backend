import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { FuelStatsModel } from 'src/model';
import { FuelStatsController } from './fuelStats.controller';
import { FuelStatsService } from './fuelStats.service';

@Module({
    imports: [SequelizeModule.forFeature([FuelStatsModel])],
    controllers: [FuelStatsController],
    providers: [FuelStatsService],
})
export class FuelStatsModule {}
