import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export class UserModel extends Model {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: string;

    @Column
    login: string;

    @Column
    password: string;

    @Column
    email: string;
}
