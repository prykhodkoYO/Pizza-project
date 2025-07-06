import {
  Controller,
  Post,
  Delete,
  Body,
  Req,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('create-admin')
  async createAdmin(
    @Req() req,
    @Body() body: { username: string; password: string },
  ) {
    const creator = req.user;
    return this.adminService.createAdmin(creator, body.username, body.password);
  }

  @Delete(':id')
  async removeAdmin(@Req() req, @Param('id', ParseIntPipe) id: number) {
    const creator = req.user;
    return this.adminService.removeAdmin(creator, id);
  }

  @Get('get-all')
  async findAll() {
    return this.adminService.findAll();
  }
}
