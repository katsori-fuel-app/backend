import {
    Controller,
    Get,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    Req,
    UnauthorizedException,
    UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { UserDto } from './dto';
import { UsersService } from './users.service';
import { AdminGuard } from './utils';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('all')
    @UseGuards(AdminGuard)
    getAll() {
        return this.usersService.findAll();
    }

    @Get('me')
    async getMe(@Req() request: Request): Promise<UserDto> {
        const userId = request.session?.userId;
        if (!userId) {
            throw new UnauthorizedException();
        }

        const user = await this.usersService.findProfileById(userId);
        if (!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

    @Get(':uuid')
    async getById(@Param('uuid', ParseUUIDPipe) uuid: string): Promise<UserDto> {
        const user = await this.usersService.findProfileById(uuid);
        if (!user) {
            throw new NotFoundException(`Пользователь '${uuid}' не найден`);
        }

        return user;
    }
}
