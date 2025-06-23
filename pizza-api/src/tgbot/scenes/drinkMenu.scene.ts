import { Scene, SceneEnter } from 'nestjs-telegraf';
import { DRINK_MENU_ID } from './tgbot.constants';
import { SceneContext } from '../interfaces/sceneContext.interface';
import { Ctx, On, Message, Action } from 'nestjs-telegraf';
import { drinkMenu } from '../tgbot.buttons.js';
import { menuButtons } from '../tgbot.buttons.js';
import { menu } from '../tgbot.utils.js';

@Scene(DRINK_MENU_ID)
export class DrinkScene {
  readonly DRINK_TYPE = 'drinkType';
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.session[this.DRINK_TYPE] = '';
    await ctx.reply('Choose a drink:', drinkMenu());
  }

  @Action(['cocacola'])
  async getAmountCocacola(@Ctx() ctx: SceneContext) {
    ctx.session[this.DRINK_TYPE] = 'cocacola';
    await ctx.reply(
      'Enter the number of drinks ' + menu['drink']['cocacola'].name + ':',
    );
  }

  @Action(['fanta'])
  async getAmountFanta(@Ctx() ctx: SceneContext) {
    ctx.session[this.DRINK_TYPE] = 'fanta';
    await ctx.reply(
      'Enter the number of drinks ' + menu['drink']['fanta'].name + ':',
    );
  }

  @Action(['sprite'])
  async getAmountSprite(@Ctx() ctx: SceneContext) {
    ctx.session[this.DRINK_TYPE] = 'sprite';
    await ctx.reply(
      'Enter the number of drinks ' + menu['drink']['sprite'].name + ':',
    );
  }

  @Action(['beer'])
  async getAmountBeer(@Ctx() ctx: SceneContext) {
    ctx.session[this.DRINK_TYPE] = 'beer';
    await ctx.reply(
      'Enter the number of drinks ' + menu['drink']['beer'].name + ':',
    );
  }

  @Action(['water'])
  async getAmountWater(@Ctx() ctx: SceneContext) {
    ctx.session[this.DRINK_TYPE] = 'water';
    await ctx.reply(
      'Enter the number of drinks ' + menu['drink']['water'].name + ':',
    );
  }

  @On('text')
  async getMessage(@Message('text') message: number, @Ctx() ctx: SceneContext) {
    if (!ctx.session[this.DRINK_TYPE]) {
      return;
    }
    message = Number(message);
    if (isNaN(message)) {
      ctx.reply('Incorrect data format, please enter a number.');
      return;
    }
    const drinkType = ctx.session[this.DRINK_TYPE];
    const drinks = ctx.session['state']['menu']['drink'];
    switch (drinkType) {
      case 'cocacola':
        drinks['cocacola'].amount = message;
        break;
      case 'fanta':
        drinks['fanta'].amount = message;
        break;
      case 'sprite':
        drinks['sprite'].amount = message;
        break;
      case 'beer':
        drinks['beer'].amount = message;
        break;
      case 'water':
        drinks['water'].amount = message;
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
