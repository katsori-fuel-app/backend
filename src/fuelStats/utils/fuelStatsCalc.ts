import { GetFuelConsumption } from '../type';

/**
 * Получает расход топлива 10л/100км.
 */
export const getFuelConsumption = ({ consumedMileage, fuelCount }: GetFuelConsumption): number => {
    if (consumedMileage) {
        return Math.floor((fuelCount / consumedMileage) * 100);
    } else {
        return 0;
    }
};
