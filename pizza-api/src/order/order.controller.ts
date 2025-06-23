import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() body: any) {
    return this.orderService.createOrder(
      body.description,
      body.amount,
      body.user,
    );
  }

  @Get('get-all')
  findAll() {
    return this.orderService.findAll();
  }

  @Get('user/:userId')
  async getOrdersByUser(@Param('userId') userId: number): Promise<string> {
    return this.orderService.getOrdersByUser(userId);
  }

  @Get('get-pages')
  async getAllOrders(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.orderService.getAllOrders(page, limit);
  }
}
