import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from 'src/prisma.service'
import { NotificationService } from '../notification/notification.service'
import { ChangeStatusDTO } from './dto/change.status.dto'

@Injectable()
export class OrderService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly notificationService: NotificationService,
  ) {}

  async findById(id: number) {
    return await this.prismaService.order.findUnique({
      where: {
        id,
      },
      include: {
        address: true,
        user: true,
        items: {
          include: {
            productVariant: {
              include: {
                color: true,
                product: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
              },
            },
          },
        },
      },
    })
  }

  async findByOrderId(order: string) {
    return await this.prismaService.order.findUnique({
      where: {
        orderId: order,
      },
      include: {
        address: true,
        user: true,
        items: {
          include: {
            productVariant: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    })
  }

  /**
   *
   * @returns ALL ORDERS
   */
  async findAll() {
    return await this.prismaService.order.findMany({
      include: {
        address: true,
        items: {
          include: {
            productVariant: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            phoneNumber: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  /**
   *
   * @param id
   * @param dto
   * @returns CHANGED STATUS
   */
  async changeStatus(id: number, dto: ChangeStatusDTO) {
    try {
      const order = await this.prismaService.order.update({
        where: { id },
        data: {
          status: dto.status,
        },
        include: {
          user: true,
        },
      })

      await this.notificationService.create({
        message: `Статус вашего заказа был обработан. Проверьте ваш почтовый ящик для доп.информации`,
        type: 'ORDER_UPDATE',
        userId: order.userId,
      })
      return {
        messages: {
          order: `Статус ${order.orderId} успешно изменен на ${order.status}`,
          admin: `Уведомление было отправлено пользователю ${order.user.name}`,
        },
      }
    } catch (error) {
      throw new InternalServerErrorException(error)
    }
  }
}
