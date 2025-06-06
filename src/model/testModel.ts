import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'testObj' })
export class TestObjModel extends Model {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    firstF: string;

    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    secondF: number;
}
