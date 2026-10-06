import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { MessageModel } from './message.model';
import { FuelStatsModel } from './fuelStats.model';
import { USER_ROLE, type UserRole } from '../users';

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

    @Column({
        type: DataType.STRING,
        allowNull: false,
        defaultValue: USER_ROLE.REGULAR,
        validate: { isIn: [Object.values(USER_ROLE)] },
    })
    role: UserRole;

    @Column({ type: DataType.STRING, allowNull: true })
    login: string | null;

    @Column({ type: DataType.STRING, allowNull: true })
    lastName: string | null;

    @Column({ type: DataType.STRING, allowNull: true })
    firstName: string | null;

    @Column({ type: DataType.STRING, allowNull: true })
    middleName: string | null;

    @Column({ type: DataType.DATEONLY, allowNull: true })
    birthDate: string | null;

    @Column({ type: DataType.STRING, allowNull: true })
    phone: string | null;

    @HasMany(() => MessageModel)
    messageList: MessageModel[];

    @HasMany(() => FuelStatsModel)
    fuelStat: FuelStatsModel[];
}
