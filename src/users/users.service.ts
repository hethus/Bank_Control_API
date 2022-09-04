import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleErrorConstraintUnique } from 'src/utils/handle-error-unique.util';

@Injectable()
export class UsersService {
  private userSelect = {
    id: true,
    name: true,
    email: true,
    value: true,
    password: false,
    banks: false,
    marks: false,
    historics: false,
    createdAt: false,
    updatedAt: false,
  };
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(dto.password, 8);

    const data: CreateUserDto = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    };

    return this.prisma.user
      .create({ data, select: this.userSelect })
      .catch(handleErrorConstraintUnique);
  }

  findOne(id: string): Promise<User> {
    return this.verifyIdAndReturnUser(id);
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.verifyIdAndReturnUser(id);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 8);
    }

    dto.updatedAt = new Date();

    return this.prisma.user
      .update({ where: { id }, data: dto, select: this.userSelect })
      .catch(handleErrorConstraintUnique);
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async verifyIdAndReturnUser(id: string): Promise<User> {
    const user: User = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...this.userSelect,
        banks: true,
        marks: true,
        historics: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User id '${id}' not found`);
    }
    return user;
  }
}
