import {
    Body,
    Controller,
    Get,
    Global,
    NotFoundException,
    Param,
    Post,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UserDto } from './dto';

@Global()
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    create(@Body() createUserDto: UserDto) {
        return this.usersService.create(createUserDto);
    }

    @Get()
    getAll() {
        return this.usersService.findAll();
    }

    @Get(':login')
    async getUser(@Param('login') login: string) {
        const currentUser = await this.usersService.findOne(login);

        if (!currentUser) {
            throw new NotFoundException(`Пользователь '${login}' не найден`);
        }

        return currentUser;
    }
}
