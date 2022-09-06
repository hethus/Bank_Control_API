import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { handleTokenIsValid } from 'src/utils/handle-token-is-valid.util';
import { Historic } from './entities/historic.entity';

@Injectable()
export class HistoricsService {
  constructor(private readonly prisma: PrismaService) {}

  findOne(
    email: string,
    headers: { authorization: string },
  ): Promise<Historic[]> {
    return this.verifyEmailAndReturnHistoric(headers, email);
  }

  async verifyEmailAndReturnHistoric(
    headers: { authorization: string },
    email: string,
  ): Promise<Historic[]> {
    const historic: Historic[] = await this.prisma.historic.findMany({
      where: {
        userEmail: email,
      },
      select: {
        operation: true,
        where: true,
        debt: true,
        credit: true,
        mark: true,
        bank: true,
        currency: true,
        commit: true,
      },
    });

    if (!historic) {
      throw new NotFoundException(`User email '${email}' not found`);
    }

    handleTokenIsValid(headers, email);

    return historic;
  }
}
