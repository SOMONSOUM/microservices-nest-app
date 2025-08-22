import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateUserDto } from './dto';
import { User } from '@prisma/client';
import { HashService } from './libs';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashService: HashService,
  ) {}

  getHello(): string {
    return 'Hello World!';
  }

  async create(input: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const hash = await new HashService().hashPassword(input.password);

    return this.prisma.user.create({ data: { ...input, password: hash } });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }
}
