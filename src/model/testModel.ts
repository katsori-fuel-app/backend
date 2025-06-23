import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';
import { TestEntityModel } from './testEntity.model';

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
    secondF: string;

    @ForeignKey(() => TestEntityModel)
    @Column({
        allowNull: false,
        type: DataType.INTEGER,
    })
    newField: number;

    @BelongsTo(() => TestEntityModel, 'newField')
    testEntity: TestEntityModel;
}
