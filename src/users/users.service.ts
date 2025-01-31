import { Injectable } from '@nestjs/common';
import { User } from './type';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from 'src/model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserModel)
        private readonly userModel: typeof UserModel,
    ) {}

    async create(user: User) {
        console.log(
            `
          
          data123
          
          
          `,
            user,
        );
        return await this.userModel.create(user);
    }

    async findAll(): Promise<UserModel[]> {
        return await this.userModel.findAll();
    }
}
