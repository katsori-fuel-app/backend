import {
    Controller,
    Get,
    NotFoundException,
    Param,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    getAll() {
        return this.usersService.findAll();
    }

    @Get(':email')
    async getUser(@Param('email') email: string) {
        const currentUser = await this.usersService.findPublicByEmail(email);

        if (!currentUser) {
            throw new NotFoundException(`Пользователь '${email}' не найден`);
        }

        return currentUser;
    }
}
