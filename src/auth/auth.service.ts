import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const { email, password } = dto;

    const user: User = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException('Invalid email or password');
    }

    const passwordMatch: boolean = await bcrypt.compare(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new NotFoundException('Invalid email or password');
    }

    delete user.password;

    const token = this.jwtService.sign({ email });

    return { token, user };
  }
}
