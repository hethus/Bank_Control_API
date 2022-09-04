import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @ApiProperty({
    description: 'User name',
    example: 'John Doe',
  })
  name: string;

  @IsEmail()
  @ApiProperty({
    description: 'User email',
    example: 'email@email.com',
  })
  email: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(
    /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/,
    {
      message: 'password too weak',
    },
  )
  @ApiProperty({
    description:
      'User password (min 8 chars, max 20 chars, at least one number, one uppercase letter, one lowercase letter and one special character)',
    example: '@Password123',
  })
  password: string;
}
