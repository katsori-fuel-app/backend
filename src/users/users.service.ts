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
        return await this.userModel.create(user);
    }

    async findAll(): Promise<UserModel[]> {
        return await this.userModel.findAll();
    }

    async findOne(login: string): Promise<UserModel | null> {
        return await this.userModel.findOne({ where: { login } });
    }
}
