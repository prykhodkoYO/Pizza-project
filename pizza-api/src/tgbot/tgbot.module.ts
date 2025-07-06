import { Module } from '@nestjs/common';
import { TgbotService } from './tgbot.service';
import { TgbotController } from './tgbot.controller';
import { TgBotUpdate } from './tgbot.update';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../order/order.entity';
import { OrderModule } from '../order/order.module';
import { OrderService } from '../order/order.service';
import { GreetingScene } from './scenes/greeting.scene';
import { PizzaScene } from './scenes/pizzaMenu.scene';
import { BurgerScene } from './scenes/burgerMenu.scene';
import { DrinkScene } from './scenes/drinkMenu.scene';
import { CartScene } from './scenes/cart.scene';
import { CustomerModule } from '../customer/customer.module';
import { Customer } from '../customer/customer.entity';
import { CustomerService } from '../customer/customer.service';

@Module({
  controllers: [TgbotController],
  providers: [
    TgbotService,
    TgBotUpdate,
    CustomerService,
    OrderService,
    GreetingScene,
    PizzaScene,
    BurgerScene,
    DrinkScene,
    CartScene,
  ],
  imports: [
    OrderModule,
    TypeOrmModule.forFeature([Order]),
    CustomerModule,
    TypeOrmModule.forFeature([Customer]),
  ],
})
export class TgbotModule {}
