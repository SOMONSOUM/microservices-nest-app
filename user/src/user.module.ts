import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaModule } from './prisma/prisma.module';
import { HashService } from './libs';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, HashService],
})
export class UserModule {}
