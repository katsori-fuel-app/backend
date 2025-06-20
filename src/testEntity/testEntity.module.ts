import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TestEntityModel } from 'src/model/testEntity.model';
import { TestEntityController } from './testEntity.controller';
import { TestEntityService } from './testEntity.service';

@Module({
    imports: [SequelizeModule.forFeature([TestEntityModel])],
    controllers: [TestEntityController],
    providers: [TestEntityService],
})
export class TestEntityModule {}
