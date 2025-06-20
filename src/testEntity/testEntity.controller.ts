import { Body, Controller, Get, Global, Post, Query } from '@nestjs/common';
import { TestEntityService } from './testEntity.service';
import { TestEntityDto } from './testEntityDtoAndType.dto';

@Global()
@Controller('test-entity')
export class TestEntityController {
    constructor(private readonly testObjService: TestEntityService) {}

    @Post()
    async create(@Body() createUserDto: TestEntityDto) {
        return await this.testObjService.create(createUserDto);
    }

    @Get()
    async get(@Query('id') id: number) {
        return await this.testObjService.getById(id);
    }

    @Get('/all')
    async getAll() {
        return await this.testObjService.getAll();
    }
}
