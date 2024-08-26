import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class TimerService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTimer(timer: Date) {
    return this.prismaService.timer.create({
      data: { timer },
    })
  }

  async getTimer() {
    const timer = await this.prismaService.timer.findFirst({
      orderBy: { createdAt: 'desc' },
    })
    return timer
  }
}
