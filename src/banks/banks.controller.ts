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

@ApiTags('banks')
@Controller('banks')
export class BanksController {
  constructor(private readonly banksService: BanksService) {}

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

  //bank/{bankId}/credit
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
  //bank/{bankId}/credit/{creditId}

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
}
