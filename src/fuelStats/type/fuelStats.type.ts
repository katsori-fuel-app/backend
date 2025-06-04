export type FuelStats = {
    date: Date;
    fuelCount: number;
    fuelType: string;
    refuelCost: number;
    comment: string;
    totalMileage: number;
};

export type GetFuelConsumption = {
    consumedMileage: number;
    fuelCount: number;
};

export type GetAverageMileage = {
    userId: number;
    totalMileage: number;
};
