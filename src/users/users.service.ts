import { Injectable } from '@nestjs/common';
import type { User, UserProfile } from './type';
import { InjectModel } from '@nestjs/sequelize';
import { UserModel } from '../model';
import { UserDto } from './dto';

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

    async findById(uuid: string): Promise<UserModel | null> {
        return this.userModel.findByPk(uuid, { attributes: ['uuid', 'role'] });
    }

    async findProfileById(uuid: string): Promise<UserDto | null> {
        const user = await this.userModel.findByPk(uuid, {
            attributes: [
                'uuid',
                'email',
                'role',
                'login',
                'lastName',
                'firstName',
                'middleName',
                'birthDate',
                'phone',
            ],
        });

        return user
            ? {
                  uuid: user.uuid,
                  email: user.email,
                  role: user.role,
                  login: user.login ?? undefined,
                  lastName: user.lastName ?? undefined,
                  firstName: user.firstName ?? undefined,
                  middleName: user.middleName ?? undefined,
                  birthDate: user.birthDate ?? undefined,
                  phone: user.phone ?? undefined,
              }
            : null;
    }
}
