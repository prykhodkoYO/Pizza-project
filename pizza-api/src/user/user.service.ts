import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async createUser(phoneNumber: string): Promise<any> {
    const existingUser = await this.usersRepository.findOne({
      where: { phoneNumber },
    });

    if (!existingUser) {
      const newUser = this.usersRepository.create({ phoneNumber });
      return this.usersRepository.save(newUser);
    }
  }

  findOneByPhone(phoneNumber: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ phoneNumber });
  }

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async getAllOrders(
    page: number,
    limit: number,
  ): Promise<{ data: User[]; total: number }> {
    const [users, total] = await this.usersRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });
    return { data: users, total };
  }

  async deleteUserByPhone(phoneNumber: string): Promise<void> {
    const user = await this.usersRepository.findOne({ where: { phoneNumber } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.usersRepository.remove(user);
  }
}
