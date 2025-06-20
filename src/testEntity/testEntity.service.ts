import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { TestEntityModel } from 'src/model/testEntity.model';
import { TestEntityDto } from './testEntityDtoAndType.dto';

@Injectable()
export class TestEntityService {
    constructor(
        @InjectModel(TestEntityModel)
        private readonly testModel: typeof TestEntityModel,
    ) {}

    async create(testObj: TestEntityDto) {
        return await this.testModel.create(testObj);
    }

    async getAll(): Promise<TestEntityDto[]> {
        return await this.testModel.findAll();
    }

    async getById(id: number): Promise<TestEntityDto[]> {
        return await this.testModel.findAll({
            where: { id },
        });
    }
}
