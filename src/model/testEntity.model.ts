import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'testEntity' })
export class TestEntityModel extends Model {
    @Column({
        type: DataType.INTEGER,
        unique: true,
        autoIncrement: true,
        primaryKey: true,
    })
    keyId: number;

    @Column({
        allowNull: true,
        type: DataType.STRING,
    })
    fieldOne: string;

    @Column({
        unique: true,
        allowNull: false,
        type: DataType.INTEGER,
    })
    joinColumnCustom: number;
}
