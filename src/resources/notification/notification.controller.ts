import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { NotificationService } from './notification.service'

@Controller('notify')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * @param id
   */
  @Post('expire/:id')
  @HttpCode(HttpStatus.OK)
  @Auth()
  changeExpire(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.changeExpire(id)
  }
}
