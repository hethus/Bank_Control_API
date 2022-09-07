import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, MinLength } from 'class-validator';

export class CreateCreditDto {
  @IsString()
  @MinLength(4)
  @ApiProperty({
    description: 'Name of the credit',
    example: 'Example Credit',
  })
  name: string;

  @IsNumber({ allowInfinity: false, allowNaN: false, maxDecimalPlaces: 2 })
  @ApiProperty({
    description: 'Account value',
    example: 15.55,
  })
  value: number;

  @IsDateString()
  @ApiProperty({
    description: 'Due date of the credit',
    example: '2021-01-01',
  })
  dueDate: Date;

  isAlive: boolean;
}
