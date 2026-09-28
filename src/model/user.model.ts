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

    @Column({ type: DataType.STRING, allowNull: false, field: 'password' })
    passwordHash: string;

    @Column({ type: DataType.STRING, allowNull: false, unique: true })
    email: string;

    @HasMany(() => MessageModel)
    messageList: MessageModel[];

    @HasMany(() => FuelStatsModel)
    fuelStat: FuelStatsModel[];
}
