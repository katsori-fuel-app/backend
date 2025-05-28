import {
    BelongsTo,
    Column,
    DataType,
    ForeignKey,
    HasMany,
    Model,
    Table,
} from 'sequelize-typescript';
import { MessageModel } from './message.model';
import { User } from 'src/users/type';
import { UserModel } from './user.model';

@Table({ tableName: 'fuel_stats' })
export class FuelStatsModel extends Model {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column(DataType.DATE)
    date: Date; // дата заправки

    @Column(DataType.DECIMAL(8, 2))
    fuelCount: number; // количество топлива влитое при заправке.

    @Column
    fuelType: string; // 92, 95, 98, дизель-XX, метан-XX и т.д., на фронте будет enum, на бэке проверка этих значений.

    @Column(DataType.DECIMAL(12, 2))
    refuelCost: number; // цена заправки. В разной валюте разный размер суммы может быть.

    @Column
    comment: string; // комментарий к заправке

    @Column(DataType.INTEGER)
    consumedMileage: number; // расстояние на 1 баке топлива

    @Column(DataType.INTEGER)
    fuelConsumption: number; // расход топлива на 100км

    @Column(DataType.INTEGER)
    totalMileage: number; // общий пробег

    @Column(DataType.INTEGER)
    forecastedValue: number; // прогнозируемый пробег после которого нужна заправка.

    @ForeignKey(() => UserModel)
    @Column
    userId: number;

    @BelongsTo(() => UserModel)
    user: User;
}
