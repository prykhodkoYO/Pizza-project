import { Scene, SceneEnter } from 'nestjs-telegraf';
import { CART_ID } from './tgbot.constants';
import { SceneContext } from '../interfaces/sceneContext.interface';
import { Ctx, Action } from 'nestjs-telegraf';
import { cartButtons, menuButtons } from '../tgbot.buttons.js';
import { OrderService } from 'src/order/order.service';

@Scene(CART_ID)
export class CartScene {
  constructor(private orderService: OrderService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    await ctx.reply(ctx.session['state'].getOrderSummary(), cartButtons());
  }

  @Action('backToMenu')
  async getBackToMenu(@Ctx() ctx: SceneContext) {
    await ctx.reply('Menu', menuButtons(ctx.session['state'].totalQuantity));
    await ctx.scene.leave();
  }

  @Action('deleteOrder')
  async deleteOrder(@Ctx() ctx: SceneContext) {
    await ctx.reply('Cart cleared.', ctx.session['state'].resetAmounts());
    await ctx.reply(ctx.session['state'].getOrderSummary(), cartButtons());
  }

  @Action('history')
  async showHistory(@Ctx() ctx: SceneContext) {
    await ctx.reply(
      await this.orderService.getOrdersByUser(ctx.session['state'].userId),
    );
  }

  @Action('order')
  async makeOrder(@Ctx() ctx: SceneContext) {
    if (ctx.session['state'].totalQuantity > 0) {
      await this.orderService.createOrder(
        ctx.session['state'].getDescription(),
        ctx.session['state'].totalPrice,
        ctx.session['state'].userId,
      );
      await ctx.session['state'].resetAmounts();
    } else {
      await ctx.reply('Cart is empty, add product to make order');
    }
    await ctx.reply('Menu', menuButtons(ctx.session['state'].totalQuantity));
    await ctx.scene.leave();
  }
}
