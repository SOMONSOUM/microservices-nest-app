import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from './dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(@Body() input: CreateUserDto) {
    return this.userService.register(input);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
