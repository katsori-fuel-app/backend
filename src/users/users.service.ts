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
    const asd = await this.userModel.create(user);
    return asd;
  }

  async findAll(): Promise<UserModel[]> {
    return this.userModel.findAll();
  }
}
