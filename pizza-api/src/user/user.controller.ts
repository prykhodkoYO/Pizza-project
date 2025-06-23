import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() body: any) {
    return this.userService.createUser(body.phoneNumber);
  }

  @Get()
  findOneByNumber(@Param('phoneNumber') phoneNumber: string) {
    return this.userService.findOneByPhone(phoneNumber);
  }

  @Get('get-all')
  findAll() {
    return this.userService.findAll();
  }

  @Get('get-pages')
  async getAllOrders(@Query('page') page = 1, @Query('limit') limit = 5) {
    return this.userService.getAllOrders(page, limit);
  }

  @Delete('delete/:phone')
  @UseGuards(JwtAuthGuard)
  async deleteUserByPhone(
    @Param('phone') phone: string,
  ): Promise<{ message: string }> {
    await this.userService.deleteUserByPhone(phone);
    return { message: 'User deleted' };
  }
}
