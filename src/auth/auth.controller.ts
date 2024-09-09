import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: { username: string; password: string }) {
    return this.authService.login(loginDto);
  }
  @Post('register')
  async register(@Body() registerDto: { username: string; prenom: string; role: string; email: string; phone: string; password: string }) {
    return this.authService.register(
      registerDto.username,
      registerDto.prenom,
      registerDto.role,
      registerDto.email,
      registerDto.phone,
      registerDto.password
    );
  }
}
