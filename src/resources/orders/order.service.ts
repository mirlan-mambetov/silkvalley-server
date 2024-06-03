import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'

@Injectable()
export class OrderService {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: number) {
    return await this.prismaService.order.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
        user: true,
        items: true,
      },
    })
  }

  async findAll() {
    return await this.prismaService.order.findMany({
      include: {
        address: true,
        items: true,
        user: true,
      },
    })
  }
}
