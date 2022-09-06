import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HistoricsModule } from './historics/historics.module';
import { BanksModule } from './banks/banks.module';

@Module({
  imports: [UsersModule, AuthModule, HistoricsModule, BanksModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
