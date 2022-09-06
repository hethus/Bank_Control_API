import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { handleErrorConstraintUnique } from 'src/utils/handle-error-unique.util';
import { handleTokenIsValid } from 'src/utils/handle-token-is-valid.util';

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

    const data = {
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
      historics: {
        create: {
          operation: 'Create User',
        },
      },
    };
    return await this.prisma.user
      .create({ data, select: this.userSelect })
      .catch(handleErrorConstraintUnique);
  }

  findOne(id: string, headers: { authorization: string }): Promise<User> {
    return this.verifyIdAndReturnUser(id, headers);
  }

  async update(
    id: string,
    dto: UpdateUserDto,
    headers: { authorization: string },
  ): Promise<User> {
    await this.verifyIdAndReturnUser(id, headers);

    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, 8);
    }

    dto.updatedAt = new Date();

    if (dto.email) {
      throw new NotAcceptableException('Email cannot be updated');
    }

    return this.prisma.user
      .update({
        where: { id },
        data: {
          ...dto,
          historics: {
            create: {
              operation: 'Update User',
            },
          },
        },
        select: this.userSelect,
      })
      .catch(handleErrorConstraintUnique);
  }

  async remove(id: string, headers: { authorization: string }) {
    const user = await this.verifyIdAndReturnUser(id, headers);
    await this.prisma.user.delete({ where: { id } });
    return this.prisma.historic.deleteMany({
      where: { userEmail: user.email },
    });
  }

  async verifyIdAndReturnUser(
    id: string,
    headers: { authorization: string },
  ): Promise<User> {
    const user: User = await this.prisma.user
      .findUnique({
        where: { id },
        select: {
          ...this.userSelect,
          banks: true,
          marks: true,
          historics: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch((err) => {
        if (err.code === 'P2023') {
          throw new NotAcceptableException(`'${id}' is not a valid ID`);
        }
        throw new NotFoundException(`User id '${id}' not found`);
      });

    if (!user) {
      throw new NotFoundException(`User id '${id}' not found`);
    }

    handleTokenIsValid(headers, user.email);

    return user;
  }
}
