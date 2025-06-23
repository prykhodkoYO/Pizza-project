import { Injectable } from '@nestjs/common';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private usersRepository: Repository<Order>,
  ) {}

  findAll(): Promise<Order[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<Order | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async createOrder(
    description: string,
    amount: number,
    user: User,
  ): Promise<any> {
    await this.usersRepository.insert({
      description,
      amount,
      user,
    });
  }

  async createAmount(amount: number): Promise<any> {
    await this.usersRepository.insert({ amount: amount });
  }

  async getOrdersByUser(userId: number): Promise<string> {
    const orders = await this.usersRepository.find({
      where: { user: { id: userId }, isFinished: true },
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
    const [orders, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
      relations: ['user'],
    });

    return { data: orders, total };
  }
}
