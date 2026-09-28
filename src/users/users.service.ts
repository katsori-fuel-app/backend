import { Injectable } from '@nestjs/common';
import { User, UserProfile } from './type';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../model';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(UserModel)
        private readonly userModel: typeof UserModel,
    ) {}

    async create(user: User) {
        return await this.userModel.create(user);
    }

    async findAll(): Promise<UserProfile[]> {
        const users = await this.userModel.findAll({ attributes: ['uuid', 'email'] });
        return users.map((user) => ({
            uuid: user.uuid,
            email: user.email,
        }));
    }

    async findByEmail(email: string): Promise<UserModel | null> {
        return this.userModel.findOne({ where: { email } });
    }

    async findPublicByEmail(email: string): Promise<UserProfile | null> {
        const user = await this.userModel.findOne({
            attributes: ['uuid', 'email'],
            where: { email },
        });

        return user ? { uuid: user.uuid, email: user.email } : null;
    }
}
