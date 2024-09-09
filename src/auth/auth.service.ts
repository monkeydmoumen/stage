import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}


  
  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findOne(username);
    if (user) {
      const isPasswordMatching = await bcrypt.compare(password, user.password); // Compare hashed password
      if (isPasswordMatching) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
  

  async register(username: string, firstName: string, role: string, email: string, phone: string, password: string, profilePhoto: string, cinNumber: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.userService.create(username, firstName, role, email, phone, hashedPassword, profilePhoto, '', cinNumber);
  }
  
}
