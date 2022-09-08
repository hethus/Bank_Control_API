import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Headers } from '@nestjs/common';
import { BanksService } from './banks.service';
import { CreateBankDto } from './dto/create-bank.dto';
import { UpdateBankDto } from './dto/update-bank.dto';
import { Bank, Credit } from './entities/bank.entity';
import { UpdateCreditDto } from './dto/update-credit.dto';
import { CreateCreditDto } from './dto/create-credit.dto';

@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

  @ApiTags('banks')
  @Post(':email')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Register new bank account',
  })
  @ApiBearerAuth()
  create(
    @Headers() headers: { authorization: string },
    @Body() dto: CreateBankDto,
    @Param('email') email: string,
  ): Promise<Bank | void> {
    return this.banksService.create(email, dto, headers);
  }

  @ApiTags('banks')
  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Get certain user bank by id',
  })
  @ApiBearerAuth()
  findOne(
    @Headers() headers: { authorization: string },
    @Param('id') id: string,
  ): Promise<Bank | void> {
    return this.banksService.findOne(id, headers);
  }

  @ApiTags('banks')
  @Get('all/:email')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Get all banks by user',
  })
  @ApiBearerAuth()
  findAll(
    @Headers() headers: { authorization: string },
    @Param('email') email: string,
  ): Promise<Bank[] | void> {
    return this.banksService.findAll(email, headers);
  }

  @ApiTags('banks')
  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Update bank account',
  })
  @ApiBearerAuth()
  update(
    @Headers() headers: { authorization: string },
    @Param('id') id: string,
    @Body() dto: UpdateBankDto,
  ): Promise<Bank | void> {
    return this.banksService.update(id, dto, headers);
  }

  @ApiTags('banks')
  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Delete bank account',
  })
  @ApiBearerAuth()
  remove(
    @Headers() headers: { authorization: string },
    @Param('id') id: string,
  ): Promise<Bank | void> {
    return this.banksService.remove(id, headers);
  }

  @ApiTags('banks')
  @Patch(':bankId/alive')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Update bank account status to alive',
  })
  @ApiBearerAuth()
  bankToAlive(
    @Headers() headers: { authorization: string },
    @Param('bankId') bankId: string,
  ): Promise<Bank | void> {
    return this.banksService.bankToAlive(bankId, headers);
  }

  @ApiTags('credits')
  @Post(':bankId/credit')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Credit registration at the bank',
  })
  @ApiBearerAuth()
  creditPost(
    @Headers() headers: { authorization: string },
    @Param('bankId') bankId: string,
    @Body() dto: CreateCreditDto,
  ): Promise<Credit | void> {
    return this.banksService.creditPost(bankId, dto, headers);
  }

  @ApiTags('credits')
  @Patch(':bankId/credit/:creditId')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Update credit at the bank',
  })
  @ApiBearerAuth()
  creditUpdate(
    @Headers() headers: { authorization: string },
    @Param('bankId') bankId: string,
    @Param('creditId') creditId: string,
    @Body() dto: UpdateCreditDto,
  ): Promise<Credit | void> {
    return this.banksService.creditUpdate(bankId, creditId, dto, headers);
  }

  @ApiTags('credits')
  @Delete(':bankId/credit/:creditId') //testar
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Delete credit at the bank',
  })
  @ApiBearerAuth()
  creditDelete(
    @Headers() headers: { authorization: string },
    @Param('bankId') bankId: string,
    @Param('creditId') creditId: string,
  ): Promise<Credit | void> {
    return this.banksService.creditDelete(bankId, creditId, headers);
  }

  @ApiTags('credits')
  @Patch(':bankId/credit/:creditId/alive') //testar
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Update credit status at the bank to alive',
  })
  @ApiBearerAuth()
  creditToAlive(
    @Headers() headers: { authorization: string },
    @Param('bankId') bankId: string,
    @Param('creditId') creditId: string,
  ): Promise<Credit | void> {
    return this.banksService.creditToAlive(bankId, creditId, headers);
  }
}
