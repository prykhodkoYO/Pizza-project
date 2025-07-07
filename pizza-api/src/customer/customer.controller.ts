import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  UseGuards,
  ParseIntPipe,
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteCustomerByPhone(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    await this.customerService.deleteCustomerById(id);
    return { message: 'Customer deleted' };
  }
}
