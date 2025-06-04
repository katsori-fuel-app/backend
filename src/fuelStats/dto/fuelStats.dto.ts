import { IsOptional, IsNumber, IsString } from 'class-validator';

export class FuelStatsDto {
    date: Date;
    userId: number;
    fuelCount: number;
    fuelType: string;
    refuelCost: number;
    comment: string;
    totalMileage: number;
}

export class UpdateFuelStats {
    id: number;
    userId: number;

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
    userId: number;
    id: number;
}
