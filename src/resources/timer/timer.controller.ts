import { Body, Controller, Get, Post } from '@nestjs/common'
import { TimerService } from './timer.service'

@Controller('timer')
export class TimerController {
  constructor(private readonly timerService: TimerService) {}

  @Get()
  async getTimer() {
    return this.timerService.getTimer()
  }

  @Post()
  async createTimer(@Body() body: { timer: Date }) {
    return this.timerService.createTimer(body.timer)
  }
}
