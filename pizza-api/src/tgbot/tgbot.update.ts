import { Update, Ctx, Start, Hears, Action } from 'nestjs-telegraf';
import { OrderService } from '../order/order.service';
import {
  GREETING_SCENE_ID,
  BURGER_MENU_ID,
  PIZZA_MENU_ID,
  DRINK_MENU_ID,
  CART_ID,
} from './scenes/tgbot.constants';
import { SceneContext } from 'telegraf/typings/scenes';
@Update()
export class TgBotUpdate {
  constructor(private orderService: OrderService) {}
  @Start()
  async start(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(GREETING_SCENE_ID);
  }

  @Hears('/start')
  async getStart(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(GREETING_SCENE_ID);
  }

  @Action('cart')
  async makeOrder(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(CART_ID);
  }

  @Action('pizza')
  async orderPizza(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(PIZZA_MENU_ID);
  }

  @Action('burger')
  async orderSandwich(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(BURGER_MENU_ID);
  }

  @Action('drink')
  async orderDrink(@Ctx() ctx: SceneContext) {
    await ctx.scene.enter(DRINK_MENU_ID);
  }
}
