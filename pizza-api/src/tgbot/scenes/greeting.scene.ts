import { Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { GREETING_SCENE_ID } from './tgbot.constants';
import { SceneContext } from '../interfaces/sceneContext.interface.js';
import { Ctx } from 'nestjs-telegraf';
import { menuButtons } from '../tgbot.buttons';
import { CartCalculator, menu } from '../tgbot.utils';
import * as _ from 'lodash';
import { CustomerService } from '../../customer/customer.service';

@Scene(GREETING_SCENE_ID)
export class GreetingScene {
  constructor(private customerService: CustomerService) {}
  @SceneEnter()
  async onSceneEnter(@Ctx() ctx: SceneContext) {
    await ctx.reply('Hi, to use the bot, enter your phone number.');
  }

  @On('text')
  async validateNumber(
    @Message('text') message: string,
    @Ctx() ctx: SceneContext,
  ) {
    const ukrPhoneRegex = /^(\+380|0)\d{9}$/;
    if (ukrPhoneRegex.test(message)) {
      await this.customerService.createCustomer(message);
      const customer = await this.customerService.findOneByPhone(message);
      const cart = new CartCalculator(
        _.cloneDeep(menu),
        customer.phoneNumber,
        customer.id,
      );
      ctx.session['state'] = cart;
      await ctx.reply(
        'Login successful',
        menuButtons(ctx.session['state'].totalQuantity),
      );
      await ctx.scene.leave();
    } else {
      ctx.reply('The phone number you entered is incorrect, please try again.');
    }
  }
}
