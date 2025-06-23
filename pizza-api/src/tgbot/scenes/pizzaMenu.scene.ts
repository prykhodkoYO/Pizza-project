import { Scene, SceneEnter } from 'nestjs-telegraf';
import { PIZZA_MENU_ID } from './tgbot.constants';
import { SceneContext } from '../interfaces/sceneContext.interface';
import { Ctx, On, Message, Action } from 'nestjs-telegraf';
import { menuButtons, pizzaMenu } from '../tgbot.buttons.js';
import { menu } from '../tgbot.utils.js';

@Scene(PIZZA_MENU_ID)
export class PizzaScene {
  readonly PIZZA_TYPE = 'pizzaType';
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.session[this.PIZZA_TYPE] = '';
    await ctx.reply('Choose pizza:', pizzaMenu());
  }

  @Action(['carbonara'])
  async getAmountCarbonara(@Ctx() ctx: SceneContext) {
    ctx.session[this.PIZZA_TYPE] = 'carbonara';
    await ctx.reply(
      'Enter the number of pizzas ' + menu['pizza']['carbonara'].name + ':',
    );
  }

  @Action(['meat'])
  async getAmountMeat(@Ctx() ctx: SceneContext) {
    ctx.session[this.PIZZA_TYPE] = 'meat';
    await ctx.reply(
      'Enter the number of pizzas ' + menu['pizza']['meat'].name + ':',
    );
  }

  @Action(['spicy'])
  async getAmountSpicy(@Ctx() ctx: SceneContext) {
    ctx.session[this.PIZZA_TYPE] = 'spicy';
    await ctx.reply(
      'Enter the number of pizzas ' + menu['pizza']['spicy'].name + ':',
    );
  }

  @Action(['cheese'])
  async getAmountCheese(@Ctx() ctx: SceneContext) {
    ctx.session[this.PIZZA_TYPE] = 'cheese';
    await ctx.reply(
      'Enter the number of pizzas ' + menu['pizza']['cheese'].name + ':',
    );
  }

  @Action(['hunting'])
  async getAmountHunting(@Ctx() ctx: SceneContext) {
    ctx.session[this.PIZZA_TYPE] = 'hunting';
    await ctx.reply(
      'Enter the number of pizzas ' + menu['pizza']['hunting'].name + ':',
    );
  }

  @On('text')
  async getMessage(@Message('text') message: number, @Ctx() ctx: SceneContext) {
    if (!ctx.session[this.PIZZA_TYPE]) {
      return;
    }
    message = Number(message);
    if (isNaN(message)) {
      ctx.reply('Incorrect data format, please enter a number.');
      return;
    }
    const pizzaType = ctx.session[this.PIZZA_TYPE];
    const pizzas = ctx.session['state']['menu']['pizza'];
    switch (pizzaType) {
      case 'carbonara':
        pizzas['carbonara'].amount = message;
        break;
      case 'meat':
        pizzas['meat'].amount = message;
        break;
      case 'spicy':
        pizzas['spicy'].amount = message;
        break;
      case 'cheese':
        pizzas['cheese'].amount = message;
        break;
      case 'hunting':
        pizzas['hunting'].amount = message;
        break;
    }
    await ctx.scene.leave();
    ctx.session['state'].totalPrice = ctx.session['state'].calculateTotal();
    ctx.session['state'].totalQuantity =
      ctx.session['state'].calculateTotalAmount();
    await ctx.reply('Menu', menuButtons(ctx.session['state'].totalQuantity));
  }

  @Action('backToMenu')
  async getBackToMenu(@Ctx() ctx: SceneContext) {
    await ctx.reply('Menu', menuButtons(ctx.session['state'].totalQuantity));
    await ctx.scene.leave();
  }
}
