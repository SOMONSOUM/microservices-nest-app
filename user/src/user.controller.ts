import { Controller } from '@nestjs/common';
import { UserService } from './user.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { USER_PATTERN } from './patterns';
import { CreateUserDto } from './dto';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @MessagePattern('app.getHello')
  getHello(): string {
    return this.userService.getHello();
  }

  @MessagePattern(USER_PATTERN.CREATE)
  async register(@Payload() input: CreateUserDto) {
    return this.userService.create(input);
  }

  @MessagePattern(USER_PATTERN.FIND_ALL)
  async findAll() {
    return this.userService.findAll();
  }
}
