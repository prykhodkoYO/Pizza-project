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
import { CustomerService } from './customer.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  create(@Body() body: any) {
    return this.customerService.createCustomer(body.phoneNumber);
  }

  @Get()
  findOneByNumber(@Param('phoneNumber') phoneNumber: string) {
    return this.customerService.findOneByPhone(phoneNumber);
  }

  @Get('get-all')
  findAll() {
    return this.customerService.findAll();
  }

  @Get('get-pages')
  async getAllOrders(@Query('page') page = 1, @Query('limit') limit = 5) {
    return this.customerService.getAllOrders(page, limit);
  }

  @Delete('delete/:phone')
  @UseGuards(JwtAuthGuard)
  async deleteCustomerByPhone(
    @Param('phone') phone: string,
  ): Promise<{ message: string }> {
    await this.customerService.deleteCustomerByPhone(phone);
    return { message: 'Customer deleted' };
  }
}
