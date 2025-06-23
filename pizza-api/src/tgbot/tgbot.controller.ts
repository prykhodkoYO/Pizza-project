import { Controller } from '@nestjs/common';
import { TgbotService } from './tgbot.service';

@Controller('tgbot')
export class TgbotController {
  constructor(private readonly tgbotService: TgbotService) {}
}
