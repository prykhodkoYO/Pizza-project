import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AdminService } from '../admin/admin.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private adminService: AdminService,
  ) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    if (!body.username || !body.password) {
      throw new BadRequestException('Username and password are required');
    }

    const admin = await this.adminService.findByUsername(body.username);
    if (!admin || !(await admin.validatePassword(body.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.authService.login(admin);
  }
}
