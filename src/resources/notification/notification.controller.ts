import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { CreateNotifyDto } from './dto/create.notify.dto'
import { NotificationService } from './notification.service'

@Controller('notify')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  /**
   * @param id
   */
  @Post('expire/:id')
  @HttpCode(HttpStatus.OK)
  @Auth(['ADMIN', 'OWNER'])
  changeExpire(@Param('id', ParseIntPipe) id: number) {
    return this.notificationService.changeExpire(id)
  }

  /**
   *
   * @param dto
   * @returns
   */
  @Post()
  @HttpCode(HttpStatus.OK)
  @Auth(['ADMIN', 'OWNER'])
  createNotify(@Body() dto: CreateNotifyDto) {
    return this.notificationService.create(dto)
  }
}
