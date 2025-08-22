import { NestFactory } from '@nestjs/core';
import { UserModule } from './user.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Logger } from '@nestjs/common';
import { AllRpcExceptionsFilter } from './common/filters';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    UserModule,
    {
      transport: Transport.TCP,
      options: {
        host: '127.0.0.1',
        port: 3001,
      },
    },
  );

  app.useGlobalFilters(new AllRpcExceptionsFilter());
  await app.listen();
  Logger.log(
    `🎉 User service is running on: http://localhost:${process.env.PORT ?? 3001}`,
  );
}
bootstrap();
