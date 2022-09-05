import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/prisma/prisma.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { HistoricsService } from './historics.service';
import { HistoricsController } from './historics.controller';

@Module({
  imports: [PrismaModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [HistoricsController],
  providers: [HistoricsService, JwtStrategy],
})
export class HistoricsModule {}
