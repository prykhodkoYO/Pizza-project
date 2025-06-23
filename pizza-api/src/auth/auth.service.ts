import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Admin } from '../admin/admin.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(admin: Admin) {
    const payload = {
      username: admin.username,
      sub: admin.id,
      isSuperAdmin: admin.isSuperAdmin,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
