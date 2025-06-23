import { Scene, SceneEnter } from 'nestjs-telegraf';
import { BURGER_MENU_ID } from './tgbot.constants';
import { SceneContext } from '../interfaces/sceneContext.interface';
import { Ctx, On, Message, Action } from 'nestjs-telegraf';
import { burgerMenu } from '../tgbot.buttons.js';
import { menuButtons } from '../tgbot.buttons.js';
import { menu } from '../tgbot.utils.js';

@Scene(BURGER_MENU_ID)
export class BurgerScene {
  readonly BURGER_TYPE = 'burgerType';
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    ctx.session[this.BURGER_TYPE] = '';
    await ctx.reply('Choose a burger:', burgerMenu());
  }

  @Action(['hamburger'])
  async getAmountBurger(@Ctx() ctx: SceneContext) {
    ctx.session[this.BURGER_TYPE] = 'hamburger';
    await ctx.reply(
      'Enter the number of burgers ' + menu['burger']['hamburger'].name + ':',
    );
  }

  @Action(['doubleBurger'])
  async getAmountDoubleBurger(@Ctx() ctx: SceneContext) {
    ctx.session[this.BURGER_TYPE] = 'doubleBurger';
    await ctx.reply(
      'Enter the number of burgers ' +
        menu['burger']['doubleBurger'].name +
        ':',
    );
  }

  @Action(['tripleBurger'])
  async getAmountTripleBurger(@Ctx() ctx: SceneContext) {
    ctx.session[this.BURGER_TYPE] = 'tripleBurger';
    await ctx.reply(
      'Enter the number of burgers ' +
        menu['burger']['tripleBurger'].name +
        ':',
    );
  }

  @Action(['quadroBurger'])
  async getAmountQuadroBurger(@Ctx() ctx: SceneContext) {
    ctx.session[this.BURGER_TYPE] = 'quadroBurger';
    await ctx.reply(
      'Enter the number of burgers ' +
        menu['burger']['quadroBurger'].name +
        ':',
    );
  }

  @Action(['pentaBurger'])
  async getAmountPentaBurger(@Ctx() ctx: SceneContext) {
    ctx.session[this.BURGER_TYPE] = 'pentaBurger';
    await ctx.reply(
      'Enter the number of burgers ' + menu['burger']['pentaBurger'].name + ':',
    );
  }

  @On('text')
  async getMessage(@Message('text') message: number, @Ctx() ctx: SceneContext) {
    if (!ctx.session[this.BURGER_TYPE]) {
      return;
    }
    message = Number(message);
    if (isNaN(message)) {
      ctx.reply('Incorrect data format, please enter a number.');
      return;
    }
    const burgerType = ctx.session[this.BURGER_TYPE];
    const burgers = ctx.session['state']['menu']['burger'];
    switch (burgerType) {
      case 'hamburger':
        burgers['hamburger'].amount = message;
        break;
      case 'doubleBurger':
        burgers['doubleBurger'].amount = message;
        break;
      case 'tripleBurger':
        burgers['tripleBurger'].amount = message;
        break;
      case 'quadroBurger':
        burgers['quadroBurger'].amount = message;
        break;
      case 'pentaBurger':
        burgers['pentaBurger'].amount = message;
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
