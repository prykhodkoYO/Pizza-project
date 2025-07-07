import { NestFactory } from '@nestjs/core';
import { AdminSeedModule } from './admin-seed.module';
import { AdminService } from '../admin/admin.service';
import { ConfigService } from '@nestjs/config';

async function seed() {
  const app = await NestFactory.createApplicationContext(AdminSeedModule);
  const adminService = app.get(AdminService);
  const configService = app.get(ConfigService);

  const username = configService.get('SEED_ADMIN_USERNAME');
  const password = configService.get('SEED_ADMIN_PASSWORD');

  try {
    await adminService.createSuperadmin(username, password);
    console.debug(
      `✅ Superadmin created successfully: ${username} / ${password}`,
    );
  } catch (error) {
    console.error(`❌ ${error.message}`);
  } finally {
    await app.close();
  }
}

seed();
