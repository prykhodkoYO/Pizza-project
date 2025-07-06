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
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  createOrder(@Body() body: any) {
    return this.orderService.createOrder(
      body.description,
      body.amount,
      body.customer,
    );
  }

  @Get('get-all')
  findAll() {
    return this.orderService.findAll();
  }

  @Get('customer/:customerId')
  async getOrdersByCustomer(
    @Param('customerId') customerId: number,
  ): Promise<string> {
    return this.orderService.getOrdersByCustomer(customerId);
  }

  @Get('get-pages')
  async getAllOrders(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.orderService.getAllOrders(page, limit);
  }
}
