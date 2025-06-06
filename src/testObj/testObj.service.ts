import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TestObjModel } from 'src/model/testModel';
import { TestObjDto } from './testObjDtoAndType.dto';

@Injectable()
export class TestObjService {
    constructor(
        @InjectModel(TestObjModel)
        private readonly testModel: typeof TestObjModel,
    ) {}

    async create(testObj: TestObjDto) {
        return await this.testModel.create(testObj);
    }

    async getAll(): Promise<TestObjDto[]> {
        return await this.testModel.findAll();
    }

    async getById(id: number): Promise<TestObjDto[]> {
        return await this.testModel.findAll({
            where: { id },
        });
    }
}
