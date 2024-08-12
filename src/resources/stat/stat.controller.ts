import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { Auth } from '../auth/decorators/auth.decorator'
import { StatService } from './stat.service'

@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get('daily')
  @Auth(['ADMIN', 'OWNER'])
  @HttpCode(HttpStatus.OK)
  getDailyStats() {
    return this.statService.getDailyStats()
  }

  @Get('weekly')
  @Auth(['ADMIN', 'OWNER'])
  @HttpCode(HttpStatus.OK)
  getWeeklyStats() {
    return this.statService.getWeeklyStats()
  }
}
