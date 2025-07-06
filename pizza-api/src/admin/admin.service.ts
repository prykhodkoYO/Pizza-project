import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Admin } from './admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private readonly adminRepository: Repository<Admin>,
  ) {}

  async findByUsername(username: string): Promise<Admin | null> {
    if (!username) return null;
    return this.adminRepository.findOne({ where: { username } });
  }

  async findAll(): Promise<Admin[]> {
    return this.adminRepository.find();
  }

  async createSuperadmin(username: string, password: string): Promise<Admin> {
    const existingAdmins = await this.adminRepository.find();
    const hasSuperadmin = existingAdmins.some((admin) => admin.isSuperAdmin);

    if (hasSuperadmin) {
      throw new Error('Superadmin already exists');
    }

    const admin = this.adminRepository.create({
      username,
      password,
      isSuperAdmin: true,
    });
    return this.adminRepository.save(admin);
  }

  async createAdmin(
    creator: Admin,
    username: string,
    password: string,
  ): Promise<Admin> {
    if (!creator.isSuperAdmin) {
      console.log(creator);
      throw new UnauthorizedException('Only superadmin can add new admins');
    }

    const newAdmin = this.adminRepository.create({ username, password });
    return this.adminRepository.save(newAdmin);
  }

  async removeAdmin(creator: Admin, adminId: number): Promise<void> {
    if (!creator.isSuperAdmin) {
      throw new UnauthorizedException('Only superadmin can remove admins');
    }

    const admin = await this.adminRepository.findOne({
      where: { id: adminId },
    });

    if (!admin) {
      throw new NotFoundException(`Admin with ID ${adminId} does not exist`);
    }

    if (admin.isSuperAdmin) {
      throw new BadRequestException('Cannot delete superadmin');
    }

    await this.adminRepository.delete(adminId);
  }
}
