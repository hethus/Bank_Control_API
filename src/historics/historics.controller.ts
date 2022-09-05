import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { HistoricsService } from './historics.service';
import { Historic } from './entities/historic.entity';
import { Headers } from '@nestjs/common';

@ApiTags('historic')
@Controller('historic')
export class HistoricsController {
  constructor(private readonly historicsService: HistoricsService) {}

  @Get(':email')
  @UseGuards(AuthGuard())
  @ApiOperation({
    summary: 'Get user by id',
  })
  @ApiBearerAuth()
  findOne(
    @Headers() headers: { authorization: string },
    @Param('email') email: string,
  ): Promise<Historic[] | void> {
    return this.historicsService.findOne(email, headers);
  }
}
