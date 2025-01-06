import { Body, Controller, Get, Global, Post } from '@nestjs/common';
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
}
