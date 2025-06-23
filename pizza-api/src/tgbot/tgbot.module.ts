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
import { UserModule } from '../user/user.module';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';

@Module({
  controllers: [TgbotController],
  providers: [
    TgbotService,
    TgBotUpdate,
    UserService,
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
    UserModule,
    TypeOrmModule.forFeature([User]),
  ],
})
export class TgbotModule {}
