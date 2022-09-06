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
import { Bank } from './entities/bank.entity';

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

  @Get(':email')
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
  ) {
    return this.banksService.remove(id, headers);
  }
}
