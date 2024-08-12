import { Injectable } from '@nestjs/common'
import { IStat } from 'src/interfaces/stat.interface'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class StatService {
  private today = new Date()
  constructor(private readonly prismaService: PrismaService) {
    this.today.setHours(0, 0, 0, 0)
  }

  /**
   * @returns USERS REGISTERED ON 1 DAY
   */
  async getDailyStats(): Promise<IStat> {
    let stats: IStat = {}

    stats.users = await this.prismaService.users.count({
      where: {
        createdAt: {
          gte: this.today,
        },
      },
    })

    stats.sales

    return stats
  }

  async getWeeklyStats() {
    const weekAgo = new Date(this.today)
    weekAgo.setDate(this.today.getDate() - 7)

    return await this.prismaService.users.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: {
          gte: weekAgo,
        },
      },
      _count: {
        _all: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    })
  }
}
