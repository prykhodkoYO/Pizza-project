import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from './customer.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}
  async createCustomer(phoneNumber: string): Promise<any> {
    const existingCustomer = await this.customerRepository.findOne({
      where: { phoneNumber },
    });

    if (!existingCustomer) {
      const newCustomer = this.customerRepository.create({ phoneNumber });
      return this.customerRepository.save(newCustomer);
    }
  }

  findOneByPhone(phoneNumber: string): Promise<Customer | null> {
    return this.customerRepository.findOneBy({ phoneNumber });
  }

  findAll(): Promise<Customer[]> {
    return this.customerRepository.find();
  }

  async getAllOrders(
    page: number,
    limit: number,
  ): Promise<{ data: Customer[]; total: number }> {
    const [customers, total] = await this.customerRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
    return { data: customers, total };
  }

  async deleteCustomerById(customerId: number): Promise<void> {
    const customer = await this.customerRepository.findOne({
      where: { id: customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    await this.customerRepository.delete(customerId);
  }
}
