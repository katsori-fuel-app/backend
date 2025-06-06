import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TestObjModel } from 'src/model/testModel';
import { TestObjController } from './testObj.controller';
import { TestObjService } from './testObj.service';

@Module({
    imports: [SequelizeModule.forFeature([TestObjModel])],
    controllers: [TestObjController],
    providers: [TestObjService],
})
export class TestObjModule {}
