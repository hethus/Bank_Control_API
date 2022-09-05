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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new user',
  })
  create(@Body() dto: CreateUserDto): Promise<User | void> {
    return this.usersService.create(dto);
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Get user by id',
  })
  @ApiBearerAuth()
  findOne(@Param('id') id: string): Promise<User | void> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Update user',
  })
  @ApiBearerAuth()
  update(
    @Param('id') id: string,
    @Body() dto: UpdateUserDto,
  ): Promise<User | void> {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Delete user',
  })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
