import { Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from 'src/customer/customer.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.orderRepository.find();
  }

  findOne(id: number): Promise<Order | null> {
    return this.orderRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.orderRepository.delete(id);
  }

  async createOrder(
    description: string,
    amount: number,
    customer: Customer,
  ): Promise<any> {
    await this.orderRepository.insert({
      description,
      amount,
      customer,
    });
  }

  async createAmount(amount: number): Promise<any> {
    await this.orderRepository.insert({ amount: amount });
  }

  async getOrdersByCustomer(customerId: number): Promise<string> {
    const orders = await this.orderRepository.find({
      where: { customer: { id: customerId } },
    });

    if (orders.length === 0) {
      return 'You have no orders.';
    }

    const orderCount = orders.length;

    const orderDescriptions = orders
      .map(
        (order) =>
          `Order ${order.id}:\n${order.description} (Order amount: ${order.amount} hryvnias)`,
      )
      .join('\n\n');

    return `Number of orders: ${orderCount}.\n${orderDescriptions}`;
  }

  async getAllOrders(
    page: number,
    limit: number,
  ): Promise<{ data: Order[]; total: number }> {
    const [orders, total] = await this.orderRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
      relations: ['customer'],
    });

    return { data: orders, total };
  }
}
