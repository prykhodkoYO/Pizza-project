import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { OrderModule } from './order/order.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order/order.entity';
import { TelegrafModule } from 'nestjs-telegraf';
import { TgbotModule } from './tgbot/tgbot.module';
import { UserModule } from './user/user.module';
import * as LocalSession from 'telegraf-session-local';
import { User } from './user/user.entity';
import { Admin } from './admin/admin.entity';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';

const sessions = new LocalSession({ database: 'session_db.json' });
@Module({
  imports: [
    OrderModule,
    UserModule,
    AdminModule,
    AuthModule,

    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: [Order, User, Admin],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    TgbotModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        token: configService.get('TG_BOT_TOKEN'),
        middlewares: [sessions.middleware()],
        include: [TgbotModule],
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
