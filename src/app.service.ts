import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {
    constructor(private sequelize: Sequelize) {}

    async onModuleInit() {
        try {
            await this.sequelize.authenticate();
            console.log('Подключение к БД established successfully.');
        } catch (error) {
            throw new Error('Ошибка: Database connection error');
        }
    }
}
