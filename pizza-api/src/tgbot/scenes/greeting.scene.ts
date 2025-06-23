import { Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { GREETING_SCENE_ID } from './tgbot.constants.js';
import { SceneContext } from '../interfaces/sceneContext.interface.js';
import { Ctx } from 'nestjs-telegraf';
import { menuButtons } from '../tgbot.buttons.js';
import { CartCalculator, menu } from '../tgbot.utils.js';
import * as _ from 'lodash';
import { UserService } from '../../user/user.service';

@Scene(GREETING_SCENE_ID)
export class GreetingScene {
  constructor(private userService: UserService) {}
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
      await this.userService.createUser(message);
      const user = await this.userService.findOneByPhone(message);
      const cart = new CartCalculator(
        _.cloneDeep(menu),
        user.phoneNumber,
        user.id,
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
