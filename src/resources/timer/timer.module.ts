import { Module } from '@nestjs/common'
import { TimerController } from './timer.controller'
import { TimerService } from './timer.service'
import { PrismaService } from 'src/prisma.service'

@Module({
  imports: [],
  controllers: [TimerController],
  providers: [TimerService, PrismaService],
})
export class TimerModule {}
