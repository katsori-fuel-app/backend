import { Body, Controller, Get, Global, Post, Query } from '@nestjs/common';
import { TestObjDto } from './testObjDtoAndType.dto';
import { TestObjService } from './testObj.service';

@Global()
@Controller('testObj')
export class TestObjController {
    constructor(private readonly testObjService: TestObjService) {}

    @Post()
    async create(@Body() createUserDto: TestObjDto) {
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
