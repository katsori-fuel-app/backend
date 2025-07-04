import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { User } from 'src/users/type';

@Table({ tableName: 'message' })
export class MessageModel extends Model {
    @Column({
        type: DataType.UUID,
        unique: true,
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
    })
    uuid: number;

    @ForeignKey(() => UserModel)
    @Column
    userId: number;

    @BelongsTo(() => UserModel)
    user: User;

    @Column
    message: string;
}
