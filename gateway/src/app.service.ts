import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService {
  constructor(@Inject('USER_SERVICE') private readonly client: ClientProxy) {}
  async getHello() {
    return await firstValueFrom(this.client.send<string>('app.getHello', {}));
  }
}
