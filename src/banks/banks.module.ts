import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { BanksController } from './banks.controller';
import { BanksService } from './banks.service';

@Module({
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [BanksController],
  providers: [BanksService, JwtStrategy],
})
export class BanksModule {}
