import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { handleErrorConstraintUnique } from 'src/utils/handle-error-unique.util';
import { handleTokenIsValid } from 'src/utils/handle-token-is-valid.util';
import { Bank } from './entities/bank.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class BanksService {
  private userSelect = {
    id: true,
    name: true,
    email: true,
    value: true,
    password: false,
    banks: true,
    marks: false,
    historics: false,
    createdAt: false,
    updatedAt: false,
  };
  constructor(private readonly prisma: PrismaService) {}

  async create(
    email: string,
    dto: CreateBankDto,
    headers: { authorization: string },
  ): Promise<Bank> {
    await this.verifyEmailAndReturnUser(headers, email);
    return await this.prisma.bank
      .create({
        data: {
          ...dto,
          user: {
            connect: {
              email,
            },
          },
        },
      })
      .then(async (bank) => {
        await this.prisma.historic.create({
          data: {
            operation: 'Create Bank',
            bank: {
              ...dto,
            },
            user: {
              connect: {
                email,
              },
            },
          },
        });

        if (dto.value > 0) {
          await this.prisma.user.update({
            where: {
              email,
            },
            data: {
              value: {
                increment: dto.value,
              },
            },
          });
        }
        return bank;
      })
      .catch(handleErrorConstraintUnique);
  }

  async findOne(id: string, headers: { authorization: string }): Promise<Bank> {
    const bank = await this.prisma.bank.findUnique({
      where: { id },
      select: {
        userEmail: true,
        id: true,
        name: true,
        value: true,
        currencys: true,
        credit: true,
        debts: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!bank) {
      throw new NotFoundException(`Bank id '${id}' not found`);
    }

    handleTokenIsValid(headers, bank.userEmail);

    return bank;
  }

  async findAll(
    email: string,
    headers: { authorization: string },
  ): Promise<Bank[]> {
    const user: User = await this.verifyEmailAndReturnUser(headers, email);

    return user.banks;
  }

  async update(
    id: string,
    dto: UpdateBankDto,
    headers: { authorization: string },
  ): Promise<Bank> {
    const bank = await this.prisma.bank.findUnique({
      where: { id },
      select: {
        userEmail: true,
        id: true,
        name: true,
        value: true,
        currencys: true,
        credit: true,
        debts: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!bank) {
      throw new NotFoundException(`Bank id '${id}' not found`);
    }

    handleTokenIsValid(headers, bank.userEmail);

    if (dto.value) {
      throw new NotAcceptableException(
        `You can't update the value of the bank`,
      );
    }

    dto.updatedAt = new Date();

    return this.prisma.bank
      .update({
        where: { id },
        data: {
          ...dto,
        },
      })
      .then(async (bankUpdate) => {
        const banks = await this.prisma.bank.findUnique({
          where: { id },
        });

        const userEmail = banks.userEmail;

        delete banks.id;
        delete banks.userEmail;

        await this.prisma.historic.create({
          data: {
            operation: 'Update Bank',
            bank: {
              ...banks,
            },
            user: {
              connect: {
                email: userEmail,
              },
            },
          },
        });

        return bankUpdate;
      })
      .catch(handleErrorConstraintUnique);
  }

  async remove(id: string, headers: { authorization: string }) {
    const bank = await this.prisma.bank.findUnique({
      where: { id },
      select: {
        userEmail: true,
        id: true,
        name: true,
        value: true,
        currencys: true,
        credit: true,
        debts: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!bank) {
      throw new NotFoundException(`Bank id '${id}' not found`);
    }

    handleTokenIsValid(headers, bank.userEmail);

    return this.prisma.bank.delete({
      where: { id },
    });
  }

  async verifyEmailAndReturnUser(
    headers: { authorization: string },
    email: string,
  ): Promise<User> {
    const user: User = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
      select: {
        ...this.userSelect,
        banks: true,
        marks: false,
        historics: false,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User email '${email}' not found`);
    }

    handleTokenIsValid(headers, email);

    return user;
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
          marks: false,
          historics: false,
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
