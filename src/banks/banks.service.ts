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
import { Bank, Credit } from './entities/bank.entity';
import { User } from 'src/users/entities/user.entity';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { CreateCreditDto } from './dto/create-credit.dto';

@Injectable()
export class BanksService {
  private userSelect = {
    id: true,
    name: true,
    email: true,
    userValue: true,
    userCredit: true,
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
            operation: 'Create',
            model: 'Bank',
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
              userValue: {
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
        id: true,
        name: true,
        value: true,
        userEmail: true,
        credit: true,
        debts: true,
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
    await this.verifyEmailAndReturnUser(headers, email);

    const bank = await this.prisma.bank.findMany({
      where: { userEmail: email },
      select: {
        id: true,
        name: true,
        value: true,
        userEmail: true,
        isAlive: true,
        credit: true,
        debts: true,
      },
    });

    if (!bank) {
      throw new NotFoundException(`0 banks found`);
    }

    return bank;
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
        isAlive: true,
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
            operation: 'Update',
            model: 'Bank',
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

  async remove(id: string, headers: { authorization: string }): Promise<Bank> {
    const bank = await this.prisma.bank.findUnique({
      where: { id },
    });

    if (!bank) {
      throw new NotFoundException(`Bank id '${id}' not found`);
    }

    if (bank.isAlive === false) {
      throw new NotAcceptableException(`Bank id '${id}' is already deleted`);
    }

    const user = await this.verifyEmailAndReturnUser(headers, bank.userEmail);

    return this.prisma.bank
      .update({
        where: { id },
        data: {
          isAlive: false,
        },
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
            operation: 'Delete',
            model: 'Bank',
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

        if (bankUpdate.credit) {
          await this.prisma.user.update({
            where: {
              email: user.email,
            },
            data: {
              userValue: {
                decrement: bankUpdate.value,
              },
              userCredit: {
                decrement: bankUpdate.credit.value,
              },
            },
          });
        } else {
          await this.prisma.user.update({
            where: {
              email: user.email,
            },
            data: {
              userValue: {
                decrement: bankUpdate.value,
              },
            },
          });
        }

        return bankUpdate;
      })
      .catch(handleErrorConstraintUnique);
  }

  async bankToAlive(bankId: string, headers: { authorization: string }) {
    const bank = await this.prisma.bank.findUnique({
      where: { id: bankId },
    });

    if (!bank) {
      throw new NotFoundException(`Bank id '${bankId}' not found`);
    }

    if (bank.isAlive === true) {
      throw new NotAcceptableException(`Bank id '${bankId}' is already alive`);
    }

    const user = await this.verifyEmailAndReturnUser(headers, bank.userEmail);

    return this.prisma.bank
      .update({
        where: { id: bankId },
        data: {
          isAlive: true,
        },
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
      })
      .then(async (bankUpdate) => {
        delete bank.id;
        delete bank.userEmail;
        console.log(bank);

        await this.prisma.historic.create({
          data: {
            operation: 'Alive',
            model: 'Bank',
            bank: {
              ...bank,
            },
            user: {
              connect: {
                email: user.email,
              },
            },
          },
        });

        if (bankUpdate.credit) {
          await this.prisma.user.update({
            where: {
              email: user.email,
            },
            data: {
              userValue: {
                increment: bankUpdate.value,
              },
              userCredit: {
                increment: bankUpdate.credit.value,
              },
            },
          });
        } else {
          await this.prisma.user.update({
            where: {
              email: user.email,
            },
            data: {
              userValue: {
                increment: bankUpdate.value,
              },
            },
          });
        }

        return bankUpdate;
      })
      .catch(handleErrorConstraintUnique);
  }

  async creditPost(
    bankId: string,
    dto: CreateCreditDto,
    headers: { authorization: string },
  ): Promise<Credit> {
    const bank = await this.prisma.bank.findUnique({
      where: { id: bankId },
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
      throw new NotFoundException(`Bank id '${bankId}' not found`);
    }

    handleTokenIsValid(headers, bank.userEmail);

    dto.dueDate = new Date(dto.dueDate);

    return this.prisma.credit
      .create({
        data: {
          ...dto,
          bank: {
            connect: {
              id: bankId,
            },
          },
        },
      })
      .then(async (credit) => {
        await this.prisma.historic.create({
          data: {
            operation: 'Create',
            model: 'Credit',
            where: bank.name,
            credit: {
              ...dto,
            },
            user: {
              connect: {
                email: bank.userEmail,
              },
            },
          },
        });

        await this.prisma.user.update({
          where: {
            email: bank.userEmail,
          },
          data: {
            userCredit: {
              increment: dto.value,
            },
          },
        });

        return credit;
      })
      .catch(handleErrorConstraintUnique);
  }

  async creditUpdate(
    bankId: string,
    creditId: string,
    dto: UpdateCreditDto,
    headers: { authorization: string },
  ): Promise<Credit> {
    const bank = await this.prisma.bank.findUnique({
      where: { id: bankId },
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
      throw new NotFoundException(`Bank id '${bankId}' not found`);
    }

    const user = await this.verifyEmailAndReturnUser(headers, bank.userEmail);

    if (dto.dueDate) {
      dto.dueDate = new Date(dto.dueDate);
    }

    return this.prisma.credit
      .update({
        where: { id: creditId },
        data: {
          ...dto,
        },
      })
      .then(async (credit) => {
        const credits = await this.prisma.credit.findUnique({
          where: { id: creditId },
        });

        const userEmail = bank.userEmail;

        delete credits.id;
        delete credits.bankId;

        await this.prisma.historic.create({
          data: {
            operation: 'Update',
            model: 'Credit',
            where: bank.name,
            credit: {
              ...credits,
            },
            user: {
              connect: {
                email: userEmail,
              },
            },
          },
        });

        if (dto.value) {
          await this.prisma.user.update({
            where: {
              email: user.email,
            },
            data: {
              userCredit: {
                increment: dto.value,
              },
            },
          });
        }

        return credit;
      })
      .catch(handleErrorConstraintUnique);
  }

  async creditDelete(
    bankId: string,
    creditId: string,
    headers: { authorization: string },
  ): Promise<Credit> {
    const bank = await this.prisma.bank.findUnique({
      where: { id: bankId },
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
      throw new NotFoundException(`Bank id '${bankId}' not found`);
    }

    const user = await this.verifyEmailAndReturnUser(headers, bank.userEmail);

    return this.prisma.credit
      .update({
        where: { id: creditId },
        data: {
          isAlive: false,
        },
      })
      .then(async (credit) => {
        const credits = await this.prisma.credit.findUnique({
          where: { id: creditId },
        });

        const userEmail = bank.userEmail;

        delete credits.id;
        delete credits.bankId;

        await this.prisma.historic.create({
          data: {
            operation: 'Remove',
            model: 'Credit',
            where: bank.name,
            credit: {
              ...credits,
            },
            user: {
              connect: {
                email: userEmail,
              },
            },
          },
        });

        await this.prisma.user.update({
          where: { email: user.email },
          data: {
            userCredit: {
              decrement: credit.value,
            },
          },
        });

        return credit;
      })
      .catch(handleErrorConstraintUnique);
  }

  async creditToAlive(
    bankId: string,
    creditId: string,
    headers: { authorization: string },
  ): Promise<Credit> {
    const bank = await this.prisma.bank.findUnique({
      where: { id: bankId },
    });

    if (!bank) {
      throw new NotFoundException(`Bank id '${bankId}' not found`);
    }

    const user = await this.verifyEmailAndReturnUser(headers, bank.userEmail);

    return this.prisma.credit
      .update({
        where: { id: creditId },
        data: {
          isAlive: true,
        },
      })
      .then(async (credit) => {
        const credits = await this.prisma.credit.findUnique({
          where: { id: creditId },
        });

        const userEmail = bank.userEmail;

        delete credits.id;
        delete credits.bankId;

        await this.prisma.historic.create({
          data: {
            operation: 'Alive',
            model: 'Credit',
            where: bank.name,
            credit: {
              ...credits,
            },
            user: {
              connect: {
                email: userEmail,
              },
            },
          },
        });

        await this.prisma.user.update({
          where: { email: user.email },
          data: {
            userCredit: {
              increment: credit.value,
            },
          },
        });

        return credit;
      })
      .catch(handleErrorConstraintUnique);
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
      throw new NotFoundException(`User emaila '${email}' not found`);
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
