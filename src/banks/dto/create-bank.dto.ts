import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateBankDto {
  @IsString()
  @MinLength(4)
  @ApiProperty({
    description: 'Name of the bank account',
    example: 'Example Bank',
  })
  name: string;

  @IsOptional()
  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @ApiProperty({
    description: 'Account value',
    example: 15.55,
  })
  value: number;

  isAlive: boolean;
}
