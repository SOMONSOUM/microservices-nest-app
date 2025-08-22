import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { CreateUserDto } from './dto';
import { USER_PATTERN } from './patterns';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class UserService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}

  async register(input: CreateUserDto) {
    return await firstValueFrom(this.client.send(USER_PATTERN.CREATE, input));
  }

  async findAll() {
    return await firstValueFrom(this.client.send(USER_PATTERN.FIND_ALL, {}));
  }
}
