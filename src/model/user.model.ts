import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { MessageModel } from './message.model';
import { FuelStatsModel } from './fuelStats.model';

@Table({ tableName: 'users' })
export class UserModel extends Model {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    uuid: string;

    @Column
    login: string;

    @Column
    password: string;

    @Column
    email: string;

    @HasMany(() => MessageModel)
    messageList: MessageModel[];

    @HasMany(() => FuelStatsModel)
    fuelStat: FuelStatsModel[];
}
