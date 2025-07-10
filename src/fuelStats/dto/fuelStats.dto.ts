import { IsOptional, IsNumber, IsString } from 'class-validator';

export class FuelStatsDto {
    date: Date;
    userId: string;
    fuelCount: number;
    fuelType: string;
    refuelCost: number;
    comment: string;
    totalMileage: number;
}

export class UpdateFuelStats {
    uuid: string;
    userId: string;

    @IsOptional()
    date: Date;

    @IsOptional()
    @IsNumber()
    fuelCount: number;

    @IsOptional()
    @IsString()
    fuelType: string;

    @IsOptional()
    @IsNumber()
    refuelCost: number;

    @IsOptional()
    @IsString()
    comment: string;

    @IsOptional()
    @IsNumber()
    totalMileage: number;
}

export class DeleteFuelStat {
    userId: string;
    uuid: string;
}
