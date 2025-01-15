import { Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class AppService {
  constructor(private sequelize: Sequelize) {}

  async onModuleInit() {
    try {
      await this.sequelize.authenticate(); // Проверяем подключение
      console.log('Database connection established successfully.');
    } catch (error) {
      console.error(
        `
        
        Failed to connect to the database:`,
        error,
      );
      throw new Error('Database connection error');
    }
  }
}
