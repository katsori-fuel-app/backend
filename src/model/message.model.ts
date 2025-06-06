import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { UserModel } from './user.model';
import { User } from 'src/users/type';

@Table({ tableName: 'message' })
export class MessageModel extends Model {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @ForeignKey(() => UserModel)
    @Column
    userId: number;

    @BelongsTo(() => UserModel)
    user: User;

    @Column
    message: string;
}
